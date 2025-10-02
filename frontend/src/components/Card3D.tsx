import React, { useState } from "react";
import { motion } from "framer-motion";

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glowColor?: string;
  variant?: "default" | "nebula" | "galaxy" | "cosmic";
}

const Card3D: React.FC<Card3DProps> = ({
  children,
  className = "",
  glowColor = "rgba(79, 70, 229, 0.6)",
  variant = "default",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseLeave = () => setIsHovered(false);
  const handleMouseEnter = () => setIsHovered(true);

  const getVariantStyles = () => {
    switch (variant) {
      case "nebula":
        return "bg-gradient-to-br from-purple-900/30 via-pink-800/20 to-blue-900/30 border-purple-400/40";
      case "galaxy":
        return "bg-gradient-to-br from-indigo-900/30 via-purple-800/20 to-cyan-900/30 border-indigo-400/40";
      case "cosmic":
        return "bg-gradient-to-br from-slate-900/30 via-blue-800/20 to-purple-900/30 border-cyan-400/40";
      default:
        return "bg-gradient-to-br from-slate-900/40 via-blue-900/30 to-indigo-900/40 border-blue-400/50";
    }
  };

  return (
    <motion.div
      className={`relative transform-gpu ${className}`}
      style={{ perspective: "1000px" }}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`
          relative w-full h-full backdrop-blur-xl
          ${getVariantStyles()}
          rounded-3xl shadow-2xl shadow-black/40
          overflow-hidden border-2
          ${isHovered ? "shadow-3xl" : ""}
        `}
        style={{
          boxShadow: isHovered
            ? `0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 60px ${glowColor}, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
            : "0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Cosmic shimmer effect */}
        <motion.div
          className="absolute inset-0 opacity-0"
          animate={{
            opacity: isHovered ? [0, 0.4, 0] : 0,
            background: [
              "linear-gradient(45deg, transparent 30%, rgba(96, 165, 250, 0.4) 50%, transparent 70%)",
              "linear-gradient(45deg, transparent 30%, rgba(168, 85, 247, 0.4) 50%, transparent 70%)",
              "linear-gradient(45deg, transparent 30%, rgba(6, 182, 212, 0.4) 50%, transparent 70%)",
            ],
            backgroundPosition: ["-200% -200%", "200% 200%"],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
          }}
        />

        {/* Starfield overlay */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 w-full h-full">{children}</div>

        {/* Cosmic border glow */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: `linear-gradient(45deg, ${glowColor}, transparent, ${glowColor})`,
            padding: "2px",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "xor",
            opacity: isHovered ? 0.8 : 0.4,
          }}
        />
      </div>
    </motion.div>
  );
};

export default Card3D;
