import { Toggle } from "@/components/ui/toggle";
import { Loader2 } from "lucide-react";

interface PreviewPiecesButtonProps {
  onToggle: (toggle: boolean) => void;
  isToggled: boolean;
  isLoading: boolean;
}

function PreviewPiecesButton({
  onToggle,
  isLoading,
  isToggled,
}: PreviewPiecesButtonProps) {
  return (
    <Toggle
      isSelected={isToggled}
      onChange={onToggle}
      className="absolute z-20 top-2 left-2 py-1 px-2 h-fit bg-white/80 text-slate-950 inset-shadow-sm inset-shadow-slate-800"
    >
      Preview pieces
      {isLoading && <Loader2 className="animate-spin" />}
    </Toggle>
  );
}
export default PreviewPiecesButton;
