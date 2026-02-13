"use client"

import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        {/* Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "linear",
          }}
        >
          <BookOpen size={48} className="text-blue-600" />
        </motion.div>

        {/* Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
          }}
          className="text-sm text-gray-600"
        >
          Memuat sistem perpustakaan...
        </motion.p>
      </div>
    </div>
  )
}