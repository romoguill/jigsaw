import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import ButtonMainOption from "../../button-main-option";
import { gameSessionsQueryOptions } from "../../../features/games/api/queries";
import { useQuery } from "@tanstack/react-query";

interface MainMenuOptionsProps {
  setMenuStep: (step: number) => void;
}

function MainMenuOptions({ setMenuStep }: MainMenuOptionsProps) {
  const { data: sessions } = useQuery(gameSessionsQueryOptions());

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4"
    >
      {sessions && sessions.length > 0 && (
        <Link to="/games/active">
          <ButtonMainOption>Continue</ButtonMainOption>
        </Link>
      )}
      <ButtonMainOption onClick={() => setMenuStep(2)}>
        New Game
      </ButtonMainOption>
    </motion.div>
  );
}
export default MainMenuOptions;
