import { useState, useEffect, useCallback } from "react";
import { shapes } from "@/frontend/lib/utils";

interface Particle {
  id: number;
  x: number;
  y: number;
  direction: "left" | "right";
  shapeIndex: number;
  speed: number;
  color: string;
}

const estimatedStartOffset = 500; // Eyeball it

export default function ShapesParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [nextId, setNextId] = useState(0);

  const createParticle = useCallback(() => {
    const direction = Math.random() > 0.5 ? "right" : "left";
    const x =
      direction === "right"
        ? -estimatedStartOffset
        : window.innerWidth + estimatedStartOffset;
    const y = -200 + Math.random() * window.innerHeight;
    const shapeIndex = Math.floor(Math.random() * shapes.length);
    const speed = 1 + 1.6 * Math.random(); // Random speed between 2 and 5
    const colorMap = [
      "rgb(50, 168, 102)",
      "rgb(186, 186, 43)",
      "rgb(171, 34, 34)",
      "rgb(171, 109, 34)",
      "rgb(62, 140, 173)",
      "rgb(72, 21, 143)",
      "rgb(115, 30, 78)",
    ];

    setParticles((prev) => [
      ...prev,
      {
        id: nextId,
        x,
        y,
        direction,
        shapeIndex,
        speed,
        color: colorMap[Math.floor(Math.random() * colorMap.length)],
      },
    ]);
    setNextId((prev) => (prev + 1) % 1000); // Not sure aboute this, my logic if that the win screen gets left long enough could be problematic. Just reset at 1000
  }, [nextId]);

  useEffect(() => {
    const interval = setInterval(() => {
      createParticle();
    }, 300); // Create a new particle every second

    return () => clearInterval(interval);
  }, [createParticle]);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setParticles((prev) => {
        return prev
          .map((particle) => {
            const newX =
              particle.direction === "right"
                ? particle.x + particle.speed
                : particle.x - particle.speed;

            return {
              ...particle,
              x: newX,
            };
          })
          .filter((particle) => {
            // Remove particles that are off-screen
            return (
              particle.x > -estimatedStartOffset &&
              particle.x < window.innerWidth + estimatedStartOffset
            );
          });
      });
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [particles]);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: "absolute",
            display: "block",
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            transform: `scale(0.6)`,
            opacity: 0.7,
            fill: particle.color,
            zIndex: "10",
            pointerEvents: "none",
          }}
        >
          {shapes[particle.shapeIndex]}
        </div>
      ))}
    </div>
  );
}
