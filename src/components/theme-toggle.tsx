import { useTheme } from "@/hooks/use-theme";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "./ui/button";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="secondary"
      onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="group m-4 block ml-auto"
    >
      {theme === "light" ? (
        <MoonIcon className="stroke-gray-700 group-hover:stroke-gray-800" />
      ) : (
        <SunIcon className="stroke-amber-300 group-hover:stroke-amber-400" />
      )}
    </Button>
  );
}
export default ThemeToggle;
