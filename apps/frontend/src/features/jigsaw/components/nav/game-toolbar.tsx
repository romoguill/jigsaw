import { ButtonLoader } from "@/frontend/components/ui/button-loader";
import { useInterval } from "@/frontend/hooks/use-interval";
import useStore from "@/frontend/store/game-store";
import { ArrowLeftIcon, SaveIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { FullScreenHandle } from "react-full-screen";
import FullScreenToggle from "./full-screen-toggle";
import Timer from "./timer";
import { useQuery } from "@tanstack/react-query";
import { gameSessionQueryOptions } from "@/frontend/features/games/api/queries";
import { Link, useParams } from "@tanstack/react-router";
import { buttonVariants } from "@/frontend/components/ui/jolly-utils";

interface GameToolbarProps {
  isSaving: boolean;
  isSaved: boolean;
  onSave: () => void;
  isGameFinished: boolean;
  fullScreenHandle: FullScreenHandle;
}

function GameToolbar({
  isSaving,
  isSaved,
  onSave,
  fullScreenHandle,
  isGameFinished,
}: GameToolbarProps) {
  const toggleFullScreen = useStore((state) => state.toggleFullScreen);
  const { sessionId } = useParams({ from: "/games/sessions/$sessionId" });
  const { data: session } = useQuery(gameSessionQueryOptions(sessionId));

  useInterval({
    callback: onSave,
    delay: 60 * 1000 * 2,
    disabled: isGameFinished,
  });

  if (!session) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-8 py-4 z-30">
      <Link to="/" className={buttonVariants({ variant: "ghost" })}>
        <ArrowLeftIcon size={20} />
      </Link>
      <ButtonLoader
        className=""
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
              className="text-green-300 absolute left-32 top-1/2 -translate-y-1/2"
            >
              Game saved!
            </motion.span>
          )}
        </AnimatePresence>
      </ButtonLoader>

      <Timer savedTimer={session.timer} />

      <FullScreenToggle
        onFullScreenToggle={() => toggleFullScreen(fullScreenHandle)}
      />
    </nav>
  );
}

export default GameToolbar;
