import React from "react";

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  intensity?: number;
}

const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  className = "",
  delay = 0,
  intensity = 1,
}) => {
  // simple wrapper - visual behaviour handled by parent animations
  return <div className={className} data-delay={delay} data-intensity={intensity}>{children}</div>;
};

export default FloatingElement;
