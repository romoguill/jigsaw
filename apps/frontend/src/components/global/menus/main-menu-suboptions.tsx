import { Link } from "@tanstack/react-router";
import ButtonMainOption from "../../button-main-option";
import { motion } from "motion/react";

interface MainMenuSubOptionsProps {
  setMenuStep: (step: number) => void;
}

function MainMenuSubOptions({ setMenuStep }: MainMenuSubOptionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4"
    >
      <Link to="/games">
        <ButtonMainOption>Existing Games</ButtonMainOption>
      </Link>
      <Link to="/games/customization">
        <ButtonMainOption>Custom Game</ButtonMainOption>
      </Link>
      <ButtonMainOption onClick={() => setMenuStep(1)}>Back</ButtonMainOption>
    </motion.div>
  );
}
export default MainMenuSubOptions;
