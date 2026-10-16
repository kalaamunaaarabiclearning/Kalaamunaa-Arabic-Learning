/**
 * Google Apps Script Web App Template & Sync Utility
 * 
 * Provides automated synchronization between Kalaamunaa and Google Sheets.
 * Users can paste this script directly into Google Sheets > Extensions > Apps Script
 * and deploy as a Web App to enjoy real-time cloud persistence across all devices.
 */

export const GOOGLE_APPS_SCRIPT_TEMPLATE = `/**
 * =====================================================================
 * KALAAMUNAA FOR ARABIC LEARNING - GOOGLE SHEETS DATABASE API BACKEND
 * =====================================================================
 * Petunjuk Instalasi:
 * 1. Buat Spreadsheet baru di Google Drive (Beri nama: "Database Kalaamunaa")
 * 2. Klik menu "Ekstensi" (Extensions) > "Apps Script"
 * 3. Hapus semua kode default, lalu tempel (paste) seluruh kode ini.
 * 4. Klik ikon Save (Disket).
 * 5. Klik tombol biru "Terapkan" (Deploy) > "Penerapan Baru" (New Deployment).
 * 6. Pilih jenis: "Aplikasi Web" (Web app).
 * 7. Konfigurasi:
 *    - Deskripsi: "Kalaamunaa Database API"
 *    - Jalankan sebagai: "Saya" (Me)
 *    - Siapa yang memiliki akses: "Siapa saja" (Anyone)
 * 8. Klik "Terapkan" (Deploy), berikan izin Google akun Anda.
 * 9. Salin URL Aplikasi Web yang diberikan (berakhiran /exec).
 * 10. Masukkan URL tersebut ke Dasbor Admin Kalaamunaa di tab "Google Spreadsheet".
 */

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Kalaamunaa_Data");
  
  if (!sheet) {
    sheet = ss.insertSheet("Kalaamunaa_Data");
    sheet.getRange(1, 1).setValue("DATA_STORE");
    sheet.getRange(1, 2).setValue(JSON.stringify({}));
  }
  
  var rawData = sheet.getRange(1, 2).getValue();
  var dataObj = {};
  try {
    dataObj = rawData ? JSON.parse(rawData) : {};
  } catch (err) {
    dataObj = {};
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    updatedAt: new Date().toISOString(),
    data: dataObj
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Kalaamunaa_Data");
    
    if (!sheet) {
      sheet = ss.insertSheet("Kalaamunaa_Data");
      sheet.getRange(1, 1).setValue("DATA_STORE");
    }
    
    // Save full JSON backup payload
    if (contents.action === "syncAll" || contents.action === "save") {
      sheet.getRange(1, 2).setValue(JSON.stringify(contents.payload));
      
      // Also write human-readable tabs for easy inspection by admin
      updateReadableTabs(ss, contents.payload);
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Data berhasil disimpan di Google Spreadsheet",
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Aksi tidak dikenali"
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function updateReadableTabs(ss, data) {
  try {
    // 1. Sheet Pesanan (Orders)
    if (data.orders && Array.isArray(data.orders)) {
      var ordersSheet = ss.getSheetByName("Daftar_Pesanan") || ss.insertSheet("Daftar_Pesanan");
      ordersSheet.clear();
      ordersSheet.appendRow(["ID Pesanan", "Nomor Order", "Nama Siswa", "Email Siswa", "Status", "Total (Rp)", "Tanggal Order", "Kursus"]);
      data.orders.forEach(function(o) {
        var courseNames = (o.items || []).map(function(i) { return i.courseTitle; }).join(", ");
        ordersSheet.appendRow([o.id, o.orderNumber, o.studentName, o.studentEmail, o.status, o.totalPrice, o.createdAt, courseNames]);
      });
      ordersSheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#0047AB").setFontColor("#FFFFFF");
    }

    // 2. Sheet Peserta (Students)
    if (data.users && Array.isArray(data.users)) {
      var usersSheet = ss.getSheetByName("Daftar_Peserta") || ss.insertSheet("Daftar_Peserta");
      usersSheet.clear();
      usersSheet.appendRow(["ID", "Nama Lengkap", "Email", "Role", "Tanggal Daftar"]);
      data.users.forEach(function(u) {
        usersSheet.appendRow([u.id, u.name, u.email, u.role, u.createdAt]);
      });
      usersSheet.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#0047AB").setFontColor("#FFFFFF");
    }
  } catch(e) {
    // Non-blocking error for readable tabs
  }
}
`;

export async function fetchFromGoogleSheets(url: string): Promise<any> {
  if (!url || !url.startsWith('https://script.google.com/')) {
    throw new Error('URL Google Apps Script tidak valid. Harap gunakan URL Web App dari script.google.com');
  }

  // Add cache buster to always fetch freshest records across all devices and bypass browser/proxy 302 caching
  const cacheBuster = `_cb=${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const fetchUrl = url + (url.includes('?') ? '&' : '?') + cacheBuster;

  const response = await fetch(fetchUrl, {
    method: 'GET',
    redirect: 'follow',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Gagal mengambil data dari Google Sheet (Status: ${response.status})`);
  }

  const result = await response.json();
  if (result.status === 'success' && result.data) {
    return result.data;
  }
  throw new Error(result.message || 'Format data dari Google Spreadsheet tidak sesuai.');
}

export async function sendToGoogleSheets(url: string, payload: any): Promise<boolean> {
  if (!url || !url.startsWith('https://script.google.com/')) {
    return false;
  }

  const bodyData = JSON.stringify({
    action: 'syncAll',
    payload: payload,
  });

  // Attempt 1: Standard fetch with text/plain (avoids CORS preflight)
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: bodyData,
      redirect: 'follow',
    });

    if (response.ok) {
      return true;
    }
  } catch (err) {
    console.warn('Standard POST redirect/CORS blocked in browser, using robust fallback:', err);
  }

  // Attempt 2: Fallback with mode: 'no-cors' (browser reliably delivers POST payload to Google Apps Script)
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: bodyData,
    });
    return true;
  } catch (fallbackError) {
    console.error('Google Sheets sendToGoogleSheets failed:', fallbackError);
    return false;
  }
}
