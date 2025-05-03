import { motion, AnimatePresence } from "motion/react";
import { Trophy } from "lucide-react";
import ShapesParticles from "./shapes-particles";
import { useQuery } from "@tanstack/react-query";
import { gameSessionQueryOptions } from "../../games/api/queries";
import { Link, useParams } from "@tanstack/react-router";
import { Button } from "@/frontend/components/ui/button";
import { cn } from "@/frontend/lib/utils";
import { buttonVariants } from "@/frontend/components/ui/jolly-utils";

interface WinningCardProps {
  isVisible: boolean;
}

export default function WinningCard({ isVisible }: WinningCardProps) {
  const { sessionId } = useParams({ from: "/games/sessions/$sessionId" });
  const { data: gameSessionDetails } = useQuery(
    gameSessionQueryOptions(sessionId)
  );

  const timeParser = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString()}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center z-40 bg-black/50 backdrop-blur-sm"
        >
          <ShapesParticles />
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 z-50 shadow-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="bg-yellow-400 rounded-full p-4">
                <Trophy className="w-16 h-16 text-yellow-600" />
              </div>

              <h2 className="text-3xl font-bold text-center text-gray-800">
                Congratulations!
              </h2>
              <p className="text-center text-gray-600">
                <ul className="flex flex-col gap-2 p-4 bg-gray-100 rounded-lg text-sky-800">
                  <li className="flex items-center gap-2">
                    Pieces:
                    <span className="font-semibold">
                      {gameSessionDetails?.game.pieces.length}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    Time:
                    <span className="font-semibold">
                      {timeParser(gameSessionDetails?.timer || 0)}
                    </span>
                  </li>
                </ul>
              </p>

              <div className="flex gap-4">
                <a
                  target="_blank"
                  href={gameSessionDetails?.game.imageUrl}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "border-2 border-sky-800 text-sky-800 hover:bg-sky-800 hover:text-white"
                  )}
                >
                  View Image
                </a>
                <Link
                  to="/"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "border-2 border-red-800 text-red-800 hover:bg-red-800 hover:text-white"
                  )}
                >
                  Exit Game
                </Link>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="w-full h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
