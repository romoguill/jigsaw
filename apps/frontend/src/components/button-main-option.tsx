import { cn } from "@/frontend/lib/utils";
import { useState } from "react";

const colors = [
  "rgba(50, 168, 102, 0.5)",
  "rgba(186, 186, 43, 0.5)",
  "rgba(171, 34, 34, 0.5)",
  "rgba(171, 109, 34, 0.5)",
  "rgba(62, 140, 173, 0.5)",
  "rgba(72, 21, 143, 0.5)",
  "rgba(115, 30, 78, 0.5)",
];

const svgBackground = (colors: string[]) => `
  <svg width="756" height="126" viewBox="0 0 756 126" xmlns="http://www.w3.org/2000/svg">
    <path d="M 0 0 L 126 0 C 141 16 126 38 131 52 S 102 49 101 52 S 97 79 100 79 S 126 56 127 71 S 137 112 126 126 L 0 126  Z" fill="${colors[0]}"/>
    <path d="M 126 0 L 252 0 C 235 12 262 41 256 53 S 227 43 227 47 S 222 75 225 75 S 249 63 249 75 S 260 111 252 126 L 126 126 C 137 112 128 86 127 71 S 103 79 100 79 S 100 55 101 52 S 136 66 131 52 S 141 16 126 0 Z" fill="${colors[1]}"/>
    <path d="M 252 0 L 378 0 C 391 15 381 38 383 50 S 396 57 399 54 S 406 79 402 77 S 385 57 377 70 S 392 111 378 126 L 252 126 C 260 111 249 87 249 75 S 228 75 225 75 S 227 51 227 47 S 250 65 256 53 S 235 12 252 0 Z" fill="${colors[2]}"/>
    <path d="M 378 0 L 504 0 C 516 10 506 35 501 45 S 530 56 531 53 S 532 74 530 78 S 503 61 504 76 S 517 113 504 126 L 378 126 C 392 111 369 83 377 70 S 398 75 402 77 S 402 51 399 54 S 385 62 383 50 S 391 15 378 0 Z" fill="${colors[3]}"/>
    <path d="M 504 0 L 630 0 C 634 21 633 35 631 47 S 608 55 605 52 S 597 76 601 77 S 629 66 627 78 S 623 109 630 126 L 504 126 C 517 113 505 91 504 76 S 528 82 530 78 S 532 50 531 53 S 496 55 501 45 S 516 10 504 0 Z" fill="${colors[4]}"/>
    <path d="M 630 0 L 756 0 L 756 126 L 630 126 C 623 109 625 90 627 78 S 605 78 601 77 S 602 49 605 52 S 629 59 631 47 S 634 21 630 0 Z" fill="${colors[5]}"/>
  </svg>
`;

const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgBackground(colors))}`;

interface ButtonMainOptionProps {
  children: React.ReactNode;
}

function ButtonMainOption({ children }: ButtonMainOptionProps) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      className={cn(
        "group cursor-pointer rounded-none font-playful text-2xl h-auto border-none text-white w-64 text-shadow-lg bg-contain bg-center bg-no-repeat py-4"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundImage: isHovered ? `url("${svgDataUrl}")` : "none",
      }}
    >
      {children}
    </button>
  );
}

export default ButtonMainOption;
