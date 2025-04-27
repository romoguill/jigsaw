import { ThemeProviderContext } from "@/frontend/providers/theme-provider";
import { useContext } from "react";

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used inside a ThemeProvider");

  return context;
};
