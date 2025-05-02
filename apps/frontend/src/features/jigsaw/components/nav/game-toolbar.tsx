import FullScreenToggle from "./full-screen-toggle";

interface GameToolbarProps {
  onFullScreenToggle: () => void;
}

function GameToolbar({ onFullScreenToggle }: GameToolbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-8 py-4 z-30">
      <FullScreenToggle
        className="ml-auto"
        onFullScreenToggle={onFullScreenToggle}
      />
    </nav>
  );
}

export default GameToolbar;
