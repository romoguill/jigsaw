import { useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useLogin } from "../../../features/auth/hooks/mutations";
import { currentUserKey } from "../../../features/auth/hooks/queries";
import { authClient } from "../../../lib/auth-client";
import ButtonMainOption from "../../button-main-option";

interface MainMenuUserProps {
  setMenuStep: (step: number) => void;
}

function MainMenuUser({ setMenuStep }: MainMenuUserProps) {
  const queryClient = useQueryClient();
  const { mutate: login } = useLogin();

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4"
    >
      <ButtonMainOption
        onClick={async () => {
          await authClient.signIn.anonymous();
          queryClient.invalidateQueries({ queryKey: currentUserKey });
          setMenuStep(1);
        }}
      >
        Play as Guest
      </ButtonMainOption>
      <ButtonMainOption
        onClick={() => login(undefined, { onSuccess: () => setMenuStep(1) })}
      >
        Login with Google
      </ButtonMainOption>
    </motion.div>
  );
}
export default MainMenuUser;
