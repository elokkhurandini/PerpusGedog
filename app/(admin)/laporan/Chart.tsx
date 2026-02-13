"use client";

import { ReferenceLine } from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type DataItem = {
  key: string;
  total: number;
};

type Props = {
  id: string;
  title: string;
  color: string;
  semesterData: { [tahunAjaran: string]: DataItem[] };
  yearlyData: DataItem[];
  daftarTahunAjaran: string[];

  mode: "semester" | "year";
  setMode: React.Dispatch<React.SetStateAction<"semester" | "year">>;

  selectedTA: string;
  setSelectedTA: React.Dispatch<React.SetStateAction<string>>;
};

export default function ChartSection({
  id,
  title,
  color,
  semesterData,
  yearlyData,
  daftarTahunAjaran,
  mode,
  setMode,
  selectedTA,
  setSelectedTA,
}: Props) {

  const data =
    mode === "semester"
      ? semesterData[selectedTA] ?? []
      : yearlyData ?? [];

  return (
    <div
      id={id}
      className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow mb-8 transition-colors"
    >
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          {title}{" "}
          {mode === "semester"
            ? "(Per Semester)"
            : "(5 Tahun Terakhir)"}
        </h2>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Dropdown Tahun Ajaran */}
          {mode === "semester" && (
            <select
              value={selectedTA}
              onChange={(e) => setSelectedTA(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600
              bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm"
            >
              {daftarTahunAjaran.map((ta) => (
                <option key={ta} value={ta}>
                  {ta}
                </option>
              ))}
            </select>
          )}

          {/* Toggle Mode */}
          <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setMode("semester")}
              className={`px-4 py-1 rounded-md text-sm transition-all ${
                mode === "semester"
                  ? "bg-emerald-500 text-white shadow"
                  : "text-slate-700 dark:text-slate-200"
              }`}
            >
              Semester
            </button>

            <button
              onClick={() => setMode("year")}
              className={`px-4 py-1 rounded-md text-sm transition-all ${
                mode === "year"
                  ? "bg-emerald-500 text-white shadow"
                  : "text-slate-700 dark:text-slate-200"
              }`}
            >
              Tahunan
            </button>
          </div>
        </div>
      </div>

      {/* ================= CHART ================= */}
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />

          {mode === "semester" && (
            <>
              <ReferenceLine
                x={data[5]?.key}
                stroke="#94a3b8"
                strokeDasharray="4 4"
              />

              <text
                x="25%"
                y="20"
                fill="#94a3b8"
                textAnchor="middle"
                fontSize="12"
              >
                Semester 1
              </text>

              <text
                x="75%"
                y="20"
                fill="#94a3b8"
                textAnchor="middle"
                fontSize="12"
              >
                Semester 2
              </text>
            </>
          )}

          <XAxis
            dataKey="key"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={{ stroke: "#94a3b8" }}
          />

          <YAxis
            allowDecimals={false}
          />

          <Tooltip
            cursor={{ fill: "rgba(16, 185, 129, 0.1)" }}
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              fontSize: "13px",
            }}
          />

          <Bar
            dataKey="total"
            fill={color}
            barSize={40}
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {data.length === 0 && (
        <p className="text-center text-slate-500 mt-4">
          Belum ada data
        </p>
      )}
    </div>
  );
}