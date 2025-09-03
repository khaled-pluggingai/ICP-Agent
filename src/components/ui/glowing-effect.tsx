import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface GlowingEffectProps {
  spread?: number;
  glow?: boolean;
  disabled?: boolean;
  proximity?: number;
  inactiveZone?: number;
  borderWidth?: number;
  children?: React.ReactNode;
}

export const GlowingEffect: React.FC<GlowingEffectProps> = ({
  spread = 40,
  glow = true,
  disabled = false,
  proximity = 64,
  inactiveZone = 0.01,
  borderWidth = 2,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (disabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      
      if (distance < proximity) {
        setMousePosition({ x, y });
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [disabled, proximity]);

  return (
    <div ref={containerRef} className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
      {glow && !disabled && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: spread * 2,
            height: spread * 2,
            left: mousePosition.x - spread,
            top: mousePosition.y - spread,
            background: 'radial-gradient(circle, rgba(58, 245, 133, 0.3) 0%, rgba(58, 245, 133, 0.1) 40%, transparent 70%)',
            borderRadius: '50%',
          }}
          animate={{
            opacity: isHovering ? 1 : 0,
            scale: isHovering ? 1 : 0.8,
          }}
          transition={{
            duration: 0.2,
            ease: 'easeOut',
          }}
        />
      )}
      
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          background: `linear-gradient(45deg, transparent 30%, rgba(58, 245, 133, ${isHovering ? '0.1' : '0.05'}) 50%, transparent 70%)`,
          border: `${borderWidth}px solid rgba(58, 245, 133, ${isHovering ? '0.3' : '0.1'})`,
        }}
        animate={{
          opacity: isHovering ? 1 : 0.7,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
      />
      {children}
    </div>
  );
};