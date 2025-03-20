import { Toggle } from "@/components/ui/toggle";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface PreviewPiecesButtonProps {
  // pieceQuantity: number;
  // imageSize: {
  //   width: number;
  //   heigth: number;
  // }
  onPreview: () => void;
  isLoading: boolean;
}

function PreviewPiecesButton({
  onPreview,
  isLoading,
}: PreviewPiecesButtonProps) {
  const [isToggled, setIsToggled] = useState(false);

  const onToggle = (isSelected: boolean) => {
    setIsToggled(isSelected);
    onPreview();
  };

  return (
    <Toggle
      isSelected={isToggled}
      onChange={onToggle}
      className="absolute top-2 left-2 py-1 px-2 h-fit bg-white/80 text-slate-950 inset-shadow-sm inset-shadow-slate-800"
    >
      Preview pieces
      {isLoading && <Loader2 className="animate-spin" />}
    </Toggle>
  );
}
export default PreviewPiecesButton;
