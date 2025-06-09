import * as XLSX from "xlsx";

export function generateExcelBlob(fatura) {
  const wsData = [
    ["Belge No", fatura.belgeNo],
    ["Ad Soyad", `${fatura.ad || ""} ${fatura.soyad || ""}`],
    ["VKN/TCKN", fatura.vknTckn],
    ["Tarih", fatura.tarih],
    ["Mal/Hizmet", fatura.malHizmet],
    ["Miktar", fatura.miktar],
    ["Birim", fatura.birim],
    ["Birim Fiyat", fatura.birimFiyat],
    ["Matrah", fatura.matrah],
    ["KDV", fatura.kdv],
    ["Toplam", fatura.toplam],
    ["Para Birimi", fatura.paraBirimi],
    ["Not", fatura.not],
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Fatura");

  const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });

  return blob;
}
