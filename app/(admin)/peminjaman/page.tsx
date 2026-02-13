"use client";

import {
  BookOpen,
  User,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState } from "react";

type ModalType = "success" | "error" | null;

export default function InputPeminjamanPage() {
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      judulBuku: formData.get("judulBuku"),
      pengarang: formData.get("pengarang"),
      penerbit: formData.get("penerbit"),
      namaSiswa: formData.get("namaSiswa"),
      kelas: formData.get("kelas"),
      tanggalPinjam: formData.get("tanggalPinjam"),
    };

    try {
      const res = await fetch("/api/peminjaman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Response tidak OK");
      }

      setModal("success");
      form.reset();
    } catch (error) {
      setModal("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-16 md:mt-0 mb-10 space-y-8 relative px-4">

      {/* MODAL */}
      {modal && (
        <Modal
          type={modal}
          onClose={() => setModal(null)}
        />
      )}

      {/* ================= HEADER ================= */}
      <div className="border-b border-gray-300 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Input Peminjaman Buku
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Isi data buku dan siswa dalam satu formulir
        </p>
      </div>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-200 rounded-2xl shadow-md p-6 md:p-8 space-y-8"
      >

        {/* DATA BUKU */}
        <SectionTitle
          icon={<BookOpen size={20} />}
          title="Data Buku"
          color="text-blue-700"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input name="judulBuku" label="Judul Buku" />
          <Input name="pengarang" label="Pengarang" />
          <Input name="penerbit" label="Penerbit" />
        </div>

        {/* DATA SISWA */}
        <SectionTitle
          icon={<User size={20} />}
          title="Data Siswa"
          color="text-emerald-700"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input name="namaSiswa" label="Nama Siswa" />
          <Input name="kelas" label="Kelas" />
        </div>

        {/* TANGGAL */}
        <SectionTitle
          icon={<Calendar size={20} />}
          title="Tanggal"
          color="text-gray-700"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            type="date"
            label="Tanggal Pinjam"
            name="tanggalPinjam"
          />

          <Input
            type="date"
            label="Tanggal Kembali"
            helper="Otomatis 7 hari dari tanggal pinjam"
            disabled
            name="tanggalKembali"
          />
        </div>

        {/* SUBMIT */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="
              px-6 py-3 rounded-lg
              bg-blue-600 text-white font-semibold
              hover:bg-blue-700
              disabled:opacity-60
              transition
            "
          >
            {loading ? "Menyimpan..." : "Simpan Peminjaman"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* =========================
   MODAL
========================= */

function Modal({
  type,
  onClose,
}: {
  type: "success" | "error";
  onClose: () => void;
}) {
  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center space-y-4 shadow-xl">

        <div className="flex justify-center">
          {isSuccess ? (
            <CheckCircle size={48} className="text-emerald-600" />
          ) : (
            <XCircle size={48} className="text-rose-600" />
          )}
        </div>

        <h2 className="text-lg font-bold text-gray-800">
          {isSuccess
            ? "Peminjaman Berhasil"
            : "Gagal Menyimpan Data"}
        </h2>

        <p className="text-sm text-gray-600">
          {isSuccess
            ? "Data peminjaman berhasil disimpan ke sistem."
            : "Terjadi kesalahan saat menyimpan data."}
        </p>

        <button
          onClick={onClose}
          className="
            mt-4
            px-5 py-2
            rounded-lg
            bg-gray-800
            text-white
            hover:bg-gray-900
            transition
          "
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

/* =========================
   KOMPONEN BANTUAN
========================= */

function SectionTitle({
  icon,
  title,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
}) {
  return (
    <div className={`flex items-center gap-2 font-semibold ${color}`}>
      {icon}
      <span>{title}</span>
    </div>
  );
}

function Input({
  label,
  name,
  placeholder,
  type = "text",
  helper,
  disabled = false,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  helper?: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        required={!disabled}
        className="
          w-full
          rounded-md
          border border-gray-300
          bg-white
          px-3 py-2
          text-sm text-gray-800
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          disabled:bg-gray-100
        "
      />

      {helper && (
        <p className="text-xs text-gray-500">
          {helper}
        </p>
      )}
    </div>
  );
}