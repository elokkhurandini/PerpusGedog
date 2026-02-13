"use client";

import { useState } from "react";
import { kembalikanBuku } from "@/app/(admin)/data-peminjaman/actions";
import { CheckCircle, XCircle } from "lucide-react";


export default function TombolKembalikan({ id }: { id: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Tombol utama */}
      <button
        onClick={() => setOpen(true)}
        className="
          px-3 py-1 rounded-md
          bg-emerald-600 text-white text-xs font-semibold
          hover:bg-emerald-700 transition
        "
      >
        Kembalikan
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Card */}
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-slate-800">
              Konfirmasi Pengembalian
            </h2>

            <p className="text-sm text-slate-600 mt-2">
              Apakah buku ini benar-benar sudah dikembalikan?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="
                  flex items-center gap-1
                  px-4 py-2 rounded-lg
                  bg-slate-200 text-slate-700
                  hover:bg-slate-300
                  text-sm font-semibold
                "
              >
                <XCircle size={16} />
                Batal
              </button>

              <form
                action={kembalikanBuku}
                onSubmit={() => setOpen(false)}
              >
                <input type="hidden" name="id" value={id} />
                <button
                  type="submit"
                  className="
                    flex items-center gap-1
                    px-4 py-2 rounded-lg
                    bg-emerald-600 text-white
                    hover:bg-emerald-700
                    text-sm font-semibold
                  "
                >
                  <CheckCircle size={16} />
                  Ya, Kembalikan
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
