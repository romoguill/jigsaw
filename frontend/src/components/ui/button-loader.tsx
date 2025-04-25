import { Button, ButtonProps } from "./button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonLoaderProps extends Omit<ButtonProps, "children"> {
  children: React.ReactNode;
}

export function ButtonLoader({
  children,
  className,
  ...props
}: ButtonLoaderProps) {
  return (
    <Button {...props} className={className}>
      {({ isPending }) => (
        <div className="grid [grid-template-areas:'stack'] items-center justify-center">
          <span
            className={cn(
              "[grid-area:stack]",
              isPending ? "invisible" : "visible"
            )}
          >
            {children}
          </span>
          <Loader2
            size={24}
            className={cn(
              "mx-auto animate-spin [grid-area:stack]",
              isPending ? "visible" : "invisible"
            )}
          />
        </div>
      )}
    </Button>
  );
}
