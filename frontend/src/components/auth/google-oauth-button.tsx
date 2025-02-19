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
    <Button onPress={handleClick} className="gap-1 m-4" variant="secondary">
      <span>
        <img src="/providers-google.png" width={15} height={15} />
      </span>
      Sign in
    </Button>
  );
}
export default GoogleOAuthButton;
