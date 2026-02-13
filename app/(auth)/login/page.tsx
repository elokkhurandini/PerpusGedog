import { loginAdmin } from "./actions"

export default function LoginPage() {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/bg-sd.jpeg')",
      }}
    >
      {/* Overlay gelap */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Card Login */}
      <div
        className="
          relative z-10 w-full max-w-md
          rounded-3xl border border-white/20
          bg-white/20 p-8
          shadow-2xl backdrop-blur-xl
        "
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-white">
            Sistem Informasi Perpustakaan
          </h1>

          {/* Motto */}
          <p className="mt-4 text-center text-xs italic text-white/70">
            <span className="font-semibold not-italic">
              SDADU GEDOG BERDIKARI
            </span>
            <br />
            Berakhlak, Disiplin, Kreatif, Anti Bullying, dan Rindang
          </p>
        </div>

        {/* Form Login */}
        <form action={loginAdmin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-white/90">
              email
            </label>
            <input
              type="text"
              name="email"
              required
              placeholder="Masukkan email"
              className="
                w-full rounded-xl
                border border-white/30
                bg-white/10
                px-4 py-2
                text-white placeholder-white/60
                outline-none
                focus:border-blue-400
                focus:ring-2 focus:ring-blue-400/40
              "
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/90">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="Masukkan password"
              className="
                w-full rounded-xl
                border border-white/30
                bg-white/10
                px-4 py-2
                text-white placeholder-white/60
                outline-none
                focus:border-blue-400
                focus:ring-2 focus:ring-blue-400/40
              "
            />
          </div>

          <button
            type="submit"
            className="
              mt-2 w-full rounded-xl
              bg-blue-600 py-2.5
              font-semibold text-white
              transition
              hover:bg-blue-700
              active:scale-95
            "
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-white/60">
          © {new Date().getFullYear()} UPT SD Negeri 2 Gedog Kota Blitar
        </p>
      </div>
    </div>
  )
}