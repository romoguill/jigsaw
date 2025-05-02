import { Button } from "@/frontend/components/ui/button";
import { cn } from "@/frontend/lib/utils";
import { ExpandIcon } from "lucide-react";

interface FullScreenToggleProps {
  className?: string;
  onFullScreenToggle: () => void;
}

function FullScreenToggle({
  className,
  onFullScreenToggle,
}: FullScreenToggleProps) {
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={onFullScreenToggle}
        className={cn(className)}
      >
        <ExpandIcon />
      </Button>
    </>
  );
}

export default FullScreenToggle;
