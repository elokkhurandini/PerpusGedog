"use client";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  getGrafikSemester,
  getGrafikTahunan,
  getKunjunganSemester,
  getKunjunganTahunan,
} from "./actions";

type Props = {
  mode: "semester" | "year";
  selectedTA: string;
};

type DataItem = {
  key: string;
  total: number;
};

export default function DownloadPDFButton({
  mode,
  selectedTA,
}: Props) {
  const handlePrint = async () => {
    const pdf = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: [210, 330], // F4
    });

    const pageWidth = 210;
    const pageHeight = 330;
    const margin = 20;
    const bottomMargin = 20;

    let y = 20;

    // ================= UTIL =================

    const checkPage = (space = 10) => {
      if (y + space > pageHeight - bottomMargin) {
        pdf.addPage();
        y = 20;
        drawHeader();
      }
    };

    const write = (
      text: string,
      size = 10,
      bold = false,
      align: "left" | "center" = "left"
    ) => {
      checkPage(8);
      pdf.setFont("helvetica", bold ? "bold" : "normal");
      pdf.setFontSize(size);

      if (align === "center") {
        pdf.text(text, pageWidth / 2, y, { align: "center" });
      } else {
        pdf.text(text, margin, y);
      }

      y += 6;
    };

    const line = () => {
      checkPage(4);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 6;
    };

    const loadImage = (url: string) =>
      new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
      });

    const logoSD = await loadImage("/logo-sd2-gedog.png");
    const logoSlogan = await loadImage("/logo-slogan.png");

    const drawHeader = () => {
      pdf.addImage(logoSD, "PNG", 20, 15, 20, 20);
      pdf.addImage(logoSlogan, "PNG", 170, 15, 20, 20);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("SD NEGERI 2 GEDOG", pageWidth / 2, 22, {
        align: "center",
      });

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.text("Jl. Irogati No. 11 Kota Blitar", pageWidth / 2, 28, {
        align: "center",
      });

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("LAPORAN PERPUSTAKAAN", pageWidth / 2, 36, {
        align: "center",
      });

      pdf.line(margin, 40, pageWidth - margin, 40);
      y = 50;
    };

    drawHeader();

    // ================= INFO =================
    const tanggal = new Date().toLocaleDateString("id-ID");

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    checkPage(10);

    // Baris 1 (Jenis Laporan kiri - Tanggal kanan)
    pdf.text(
      `Jenis Laporan : ${mode === "semester" ? "Semester" : "Tahunan"
      }`,
      margin,
      y
    );

    pdf.text(
      `Tanggal Cetak : ${tanggal}`,
      pageWidth - margin,
      y,
      { align: "right" }
    );

    y += 7;

    // Baris 2 (Tahun Ajaran)
    pdf.text(
      `Tahun Ajaran  : ${selectedTA}`,
      margin,
      y
    );

    y += 6;

    // Garis pemisah lebih rapat
    pdf.line(margin, y, pageWidth - margin, y);

    y += 6;

    // ================= AMBIL DATA =================
    const peminjaman: DataItem[] =
      mode === "semester"
        ? (await getGrafikSemester())[selectedTA] || []
        : await getGrafikTahunan();

    const kunjungan: DataItem[] =
      mode === "semester"
        ? (await getKunjunganSemester())[selectedTA] || []
        : await getKunjunganTahunan();

    // ================= RINGKASAN =================
    const renderSummary = (title: string, data: DataItem[]) => {
      write(title, 12, true);
      line();

      if (!data || data.length === 0) {
        write("Tidak ada data tersedia.");
        return;
      }

      const total = data.reduce((a, b) => a + b.total, 0);
      const rata = Math.round(total / data.length);
      const maxItem = data.reduce((a, b) =>
        b.total > a.total ? b : a
      );
      const minItem = data.reduce((a, b) =>
        b.total < a.total ? b : a
      );

      write(`Total        : ${total}`);
      write(`Rata-rata    : ${rata}`);
      write(
        `Tertinggi    : ${maxItem.key} (${maxItem.total})`
      );
      write(
        `Terendah     : ${minItem.key} (${minItem.total})`
      );

      y += 6;
    };

    // ================= GRAFIK =================
    const addChartToPDF = async (elementId: string) => {
      const element = document.getElementById(elementId);
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        ignoreElements: (el) => {
          return false;
        },
        onclone: (clonedDoc) => {
          // Paksa semua warna jadi aman
          clonedDoc.querySelectorAll("*").forEach((node: any) => {
            node.style.color = "#000000";
            node.style.backgroundColor = "#ffffff";
            node.style.borderColor = "#cccccc";
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");

      const imgWidth = 170;
      const imgHeight =
        (canvas.height * imgWidth) / canvas.width;

      checkPage(imgHeight + 10);

      pdf.addImage(
        imgData,
        "PNG",
        20,
        y,
        imgWidth,
        imgHeight
      );

      y += imgHeight + 10;
    };

    const renderTable = (
      data: DataItem[],
      satuan: string
    ) => {
      if (!data || data.length === 0) return;

      const tableWidth = pageWidth - margin * 2;
      const colWidthNo = 20;
      const colWidthPeriode = 60;
      const colWidthJumlah = tableWidth - colWidthNo - colWidthPeriode;

      const startX = margin;
      const startY = y;

      const rowHeight = 8;

      checkPage(20);

      // ===== HEADER BACKGROUND =====
      pdf.setFillColor(230, 230, 230);
      pdf.rect(startX, y, tableWidth, rowHeight, "F");

      pdf.setFont("helvetica", "bold");

      pdf.text("No", startX + 6, y + 6);
      pdf.text("Periode", startX + colWidthNo + 6, y + 6);
      pdf.text(
        `Jumlah (${satuan})`,
        startX + colWidthNo + colWidthPeriode + colWidthJumlah - 6,
        y + 6,
        { align: "right" }
      );

      y += rowHeight;

      pdf.setFont("helvetica", "normal");

      // ===== ISI DATA =====
      data.forEach((item, index) => {
        checkPage(rowHeight + 4);

        pdf.text(String(index + 1), startX + 6, y + 6);
        pdf.text(item.key, startX + colWidthNo + 6, y + 6);
        pdf.text(
          String(item.total),
          startX + colWidthNo + colWidthPeriode + colWidthJumlah - 6,
          y + 6,
          { align: "right" }
        );

        y += rowHeight;
      });

      // ===== TOTAL ROW =====
      const total = data.reduce((a, b) => a + b.total, 0);

      checkPage(rowHeight + 6);

      pdf.setFont("helvetica", "bold");

      pdf.text(
        "Total",
        startX + colWidthNo + 6,
        y + 6
      );

      pdf.text(
        String(total),
        startX + colWidthNo + colWidthPeriode + colWidthJumlah - 6,
        y + 6,
        { align: "right" }
      );

      y += rowHeight;

      // ===== GRID LINES =====

      const endY = y;

      // Horizontal lines
      for (let i = 0; i <= data.length + 1; i++) {
        pdf.line(
          startX,
          startY + i * rowHeight,
          startX + tableWidth,
          startY + i * rowHeight
        );
      }

      // Bottom total line
      pdf.line(startX, endY, startX + tableWidth, endY);

      // Vertical lines
      pdf.line(startX, startY, startX, endY);
      pdf.line(
        startX + colWidthNo,
        startY,
        startX + colWidthNo,
        endY
      );
      pdf.line(
        startX + colWidthNo + colWidthPeriode,
        startY,
        startX + colWidthNo + colWidthPeriode,
        endY
      );
      pdf.line(
        startX + tableWidth,
        startY,
        startX + tableWidth,
        endY
      );

      y += 6;
    };

    // === Peminjaman ===
    renderSummary("I. DATA PEMINJAMAN BUKU", peminjaman);
    await addChartToPDF("chart-peminjaman");
    renderTable(peminjaman, "Buku");
    line();

    // === Kunjungan ===
    renderSummary(
      "II. DATA KUNJUNGAN PERPUSTAKAAN",
      kunjungan
    );
    await addChartToPDF("chart-kunjungan");
    renderTable(kunjungan, "Kelas");
    line();

    // ================= ANALISIS =================

    const minimalAnalisisHeight = 50;

    if (y + minimalAnalisisHeight > pageHeight - bottomMargin) {
      pdf.addPage();
      y = 20;
      drawHeader();
    }

    write("III. ANALISIS", 12, true);
    line();

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    const analisisText =
      "Berdasarkan data yang diperoleh, aktivitas perpustakaan SD Negeri 2 Gedog menunjukkan dinamika penggunaan yang bervariasi sesuai periode berjalan. Data ini menjadi bahan evaluasi dalam meningkatkan minat baca serta kunjungan kelas di lingkungan sekolah, sehingga program literasi dapat dikembangkan secara lebih terarah dan berkelanjutan.";

    const textWidth = pageWidth - margin * 2;

    // Pecah teks
    const splitText = pdf.splitTextToSize(analisisText, textWidth - 5);

    // Paragraf dengan indent 5mm
    pdf.text(splitText, margin + 5, y, {
      maxWidth: textWidth - 5,
      align: "left",
      lineHeightFactor: 1.4,
    });

    y += splitText.length * 6.5 + 10;
    // ================= TTD =================

    // Perkiraan tinggi minimal tanda tangan
    const minimalTTDHeight = 50;

    if (y + minimalTTDHeight > pageHeight - bottomMargin) {
      pdf.addPage();
      y = 20;
      drawHeader();
    }

    y += 15;

    // Tanggal kanan
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.text(`Blitar, ${tanggal}`, pageWidth - margin, y, {
      align: "right",
    });

    y += 12;

    // Jabatan kanan
    pdf.setFont("helvetica", "bold");
    pdf.text("Kepala Sekolah SD Negeri 2 Gedog", pageWidth - margin, y, {
      align: "right",
    });

    y += 25; // ruang tanda tangan

    pdf.text("(........................................)", pageWidth - margin, y, {
      align: "right",
    });

    y += 8;

    pdf.setFont("helvetica", "normal");
    pdf.text("NIP. .................................", pageWidth - margin, y, {
      align: "right",
    });
    pdf.save(
      `Laporan_Perpustakaan_${selectedTA}.pdf`
    );
  };

  return (
    <button
      onClick={handlePrint}
      className="px-5 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
    >
      Cetak PDF
    </button>
  );
}