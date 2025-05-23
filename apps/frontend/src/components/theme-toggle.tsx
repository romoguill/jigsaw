import { useTheme } from "@/frontend/hooks/use-theme";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="secondary"
      onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="group m-4 block ml-auto"
    >
      {theme === "light" ? (
        <MoonIcon className="stroke-gray-700 group-data-[hovered]:stroke-gray-800" />
      ) : (
        <SunIcon className="stroke-amber-300 group-data-[hovered]:stroke-amber-400" />
      )}
    </Button>
  );
}
export default ThemeToggle;
