import { motion, AnimatePresence } from "motion/react";
import { Trophy } from "lucide-react";
import ShapesParticles from "./shapes-particles";

interface WinningCardProps {
  isVisible: boolean;
}

export default function WinningCard({ isVisible }: WinningCardProps) {
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
                You've successfully completed the puzzle! Well done!
              </p>
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
