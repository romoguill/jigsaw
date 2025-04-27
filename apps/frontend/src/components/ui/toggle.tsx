import { type VariantProps } from "class-variance-authority";
import {
  ToggleButton as AriaToggleButton,
  ToggleButtonGroup as AriaToggleButtonGroup,
  composeRenderProps,
  type ToggleButtonGroupProps as AriaToggleButtonGroupProps,
  type ToggleButtonProps as AriaToggleButtonProps,
} from "react-aria-components";

import { cn } from "@/lib/utils";
import { toggleVariants } from "./jolly-utils";

interface ToggleProps
  extends AriaToggleButtonProps,
    VariantProps<typeof toggleVariants> {}

const Toggle = ({ className, variant, size, ...props }: ToggleProps) => (
  <AriaToggleButton
    className={composeRenderProps(className, (className) =>
      cn(
        "group-data-[orientation=vertical]/togglegroup:w-full",
        toggleVariants({
          variant,
          size,
          className,
        })
      )
    )}
    {...props}
  />
);

const ToggleButtonGroup = ({
  children,
  className,
  ...props
}: AriaToggleButtonGroupProps) => (
  <AriaToggleButtonGroup
    className={composeRenderProps(className, (className) =>
      cn(
        "group/togglegroup flex items-center justify-center gap-1 data-[orientation=vertical]:flex-col",
        className
      )
    )}
    {...props}
  >
    {children}
  </AriaToggleButtonGroup>
);

export { Toggle, ToggleButtonGroup };
export type { ToggleProps };
