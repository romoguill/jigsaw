import { useLogin } from "@/features/auth/hooks/mutations";
import { Button } from "../ui/button";

function GoogleOAuthButton() {
  const { mutate: login } = useLogin();

  return (
    <Button onPress={() => login()} className="gap-1 m-4" variant="secondary">
      <span>
        <img src="/providers-google.png" width={15} height={15} />
      </span>
      Sign in
    </Button>
  );
}

export default GoogleOAuthButton;
