import { Button } from "../ui/button";

const svgBackground = `
  <svg width="191" height="191" viewBox="-32.5 -32.5 191 191">
   <path d="M 0 0 L 126 0 C 140 16 120 35 125 48 S 151 50 154 53 S 155 78 153 76 S 133 68 129 80 S 111 113 126 126 L 0 126  Z" fill="white"/>
 </svg>
 <svg width="191" height="191" viewBox="93.5 -32.5 191 191">
   <path d="M 126 0 L 252 0 C 268 14 248 35 251 47 S 278 46 279 50 S 280 66 280 70 S 254 68 251 79 S 241 114 252 126 L 126 126 C 111 113 125 92 129 80 S 151 74 153 76 S 157 56 154 53 S 130 61 125 48 S 140 16 126 0 Z" fill="white"/>
 </svg>
 <svg width="191" height="191" viewBox="219.5 -32.5 191 191">
   <path d="M 252 0 L 378 0 C 366 10 377 30 380 45 S 401 44 404 47 S 404 74 402 77 S 379 60 383 70 S 363 109 378 126 L 252 126 C 241 114 248 90 251 79 S 280 74 280 70 S 280 54 279 50 S 254 59 251 47 S 268 14 252 0 Z" fill="white"/>
 </svg>
 <svg width="191" height="191" viewBox="345.5 -32.5 191 191">
   <path d="M 378 0 L 504 0 C 514 14 504 40 508 52 S 522 52 525 51 S 527 74 525 72 S 503 55 508 70 S 490 117 504 126 L 378 126 C 363 109 387 80 383 70 S 400 80 402 77 S 407 50 404 47 S 383 60 380 45 S 366 10 378 0 Z" fill="white"/>
 </svg>
 <svg width="191" height="191" viewBox="471.5 -32.5 191 191">
   <path d="M 504 0 L 630 0 C 619 19 628 35 634 48 S 612 52 609 50 S 606 72 610 73 S 636 59 633 71 S 640 112 630 126 L 504 126 C 490 117 513 85 508 70 S 523 70 525 72 S 528 50 525 51 S 512 64 508 52 S 514 14 504 0 Z" fill="white"/>
 </svg>
 <svg width="191" height="191" viewBox="597.5 -32.5 191 191">
   <path d="M 630 0 L 756 0 L 756 126 L 630 126 C 640 112 630 83 633 71 S 614 74 610 73 S 606 48 609 50 S 640 61 634 48 S 619 19 630 0 Z" fill="white"/>
 </svg>
`;

const svgDataUrl = `data:image/svg+xml,${encodeURIComponent(svgBackground)}`;

function MainMenuButton() {
  return (
    <Button
      className="relative overflow-hidden bg-transparent hover:bg-transparent"
      style={{
        backgroundImage: `url("${svgDataUrl}")`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "2rem 4rem",
        color: "white",
        border: "none",
        width: "191px",
        height: "191px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Main Menu
    </Button>
  );
}

export default MainMenuButton;
