import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import FullScreenToggle from "./full-screen-toggle";
import { ButtonLoader } from "@/frontend/components/ui/button-loader";
import { SaveIcon } from "lucide-react";

interface GameToolbarProps {
  isSaving: boolean;
  isSaved: boolean;
  onSave: () => void;
  onFullScreenToggle: () => void;
}

function GameToolbar({
  isSaving,
  isSaved,
  onSave,
  onFullScreenToggle,
}: GameToolbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-8 py-4 z-30">
      <ButtonLoader
        className="absolute top-5 left-5"
        variant={"ghost"}
        onClick={onSave}
        isPending={isSaving}
      >
        <SaveIcon size={20} />
        <AnimatePresence>
          {isSaved && (
            <motion.span
              key="game-saved"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="text-green-300 absolute left-12 top-1/2 -translate-y-1/2"
            >
              Game saved!
            </motion.span>
          )}
        </AnimatePresence>
      </ButtonLoader>
      <FullScreenToggle
        className="ml-auto"
        onFullScreenToggle={onFullScreenToggle}
      />
    </nav>
  );
}

export default GameToolbar;
