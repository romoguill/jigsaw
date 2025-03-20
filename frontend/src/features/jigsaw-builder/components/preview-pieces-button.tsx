import { Toggle } from "@/components/ui/toggle";
import { useQueryClient } from "@tanstack/react-query";

function PreviewPiecesButton() {
  const queryClient = useQueryClient();

  const onToggle = () => {
    queryClient.fetchQuery({
      queryKey: [""],
    });
  };

  return (
    <Toggle className="absolute top-2 left-2 py-1 px-2 h-fit bg-white/80 text-slate-950 inset-shadow-sm inset-shadow-slate-800">
      Preview pieces
    </Toggle>
  );
}
export default PreviewPiecesButton;
