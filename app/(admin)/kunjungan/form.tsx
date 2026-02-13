"use client";

import { useRef } from "react";
import { tambahKunjungan } from "./actions";

export default function FormKunjungan() {
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex justify-center px-1">
      <form
        action={tambahKunjungan}
        className="
          w-full
          max-w-md md:max-w-xl
          bg-white/40 backdrop-blur
          p-4 md:p-6
          rounded-xl md:rounded-2xl
          shadow
          space-y-5
          text-gray-900
        "
      >
        {/* KELAS */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold">
            Kelas
          </label>
          <input
            name="kelas"
            required
            className="
              w-full
              border border-gray-300
              rounded-md
              px-3 py-2
              text-sm
              bg-white
              focus:ring-2 focus:ring-emerald-500
              transition
            "
          />
        </div>

        {/* TANGGAL */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold">
            Tanggal Kunjungan
          </label>
          <div className="relative">
            <input
              ref={dateRef}
              type="date"
              name="tanggal"
              required
              className="
                w-full
                border border-gray-300
                rounded-md
                px-3 py-2
                pr-10
                text-sm
                bg-white
                focus:ring-2 focus:ring-emerald-500
                cursor-pointer
                transition
              "
            />
            <button
              type="button"
              onClick={() => dateRef.current?.showPicker()}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
            >
              📅
            </button>
          </div>
        </div>

        {/* JAM */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold">
            Jam Kunjungan
          </label>
          <div className="relative">
            <input
              ref={timeRef}
              type="time"
              name="jam"
              required
              className="
                w-full
                border border-gray-300
                rounded-md
                px-3 py-2
                pr-10
                text-sm
                bg-white
                focus:ring-2 focus:ring-emerald-500
                cursor-pointer
                transition
              "
            />
            <button
              type="button"
              onClick={() => timeRef.current?.showPicker()}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
            >
              ⏰
            </button>
          </div>
        </div>

        {/* GURU */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold">
            Guru Pendamping
          </label>
          <input
            name="guru"
            required
            className="
              w-full
              border border-gray-300
              rounded-md
              px-3 py-2
              text-sm
              bg-white
              focus:ring-2 focus:ring-emerald-500
              transition
            "
          />
        </div>

        {/* BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            className="
              w-full md:w-auto
              bg-emerald-600
              text-white
              px-6 py-2.5
              rounded-md
              font-semibold
              hover:bg-emerald-700
              transition
            "
          >
            Simpan Kunjungan
          </button>
        </div>
      </form>
    </div>
  );
}