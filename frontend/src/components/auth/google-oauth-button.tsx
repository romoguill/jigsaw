import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";

function GoogleOAuthButton() {
  const handleClick = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <Button onPress={handleClick}>
      <span>
        <img src="/providers-google.png" width={20} height={20} />
      </span>
      Sign in with Google
    </Button>
  );
}
export default GoogleOAuthButton;
