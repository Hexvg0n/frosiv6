"use client"

import { motion } from "framer-motion"

export const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    {/* Glowing Blotches */}
    <motion.div
      className="absolute top-[-10%] left-[-10%] h-[400px] w-[400px] bg-purple-600/30 rounded-full blur-[150px]"
      animate={{
        x: [0, 100, 0],
        y: [0, 50, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 20,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "mirror",
      }}
    />
    <motion.div
      className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] bg-blue-600/30 rounded-full blur-[150px]"
      animate={{
        x: [0, -100, 0],
        y: [0, -50, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 25,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "mirror",
        delay: 5,
      }}
    />
    {/* Falling Stars */}
    {Array.from({ length: 50 }).map((_, i) => {
      const size = Math.random() * 2 + 1
      const duration = Math.random() * 10 + 10
      const delay = Math.random() * 20
      const left = Math.random() * 100
      return (
        <div
          key={i}
          className="star"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        />
      )
    })}
  </div>
)
