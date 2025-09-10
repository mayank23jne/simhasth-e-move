import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const festivalButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground shadow-festival hover:shadow-lg hover:scale-105",
        secondary: "bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary/80",
        accent: "bg-accent text-accent-foreground shadow-festival hover:shadow-lg",
        success: "bg-success text-success-foreground shadow-soft hover:bg-success/90",
        warning: "bg-warning text-warning-foreground shadow-soft hover:bg-warning/90",
        outline: "border border-border bg-background hover:bg-muted shadow-soft",
        ghost: "hover:bg-muted hover:shadow-soft",
        link: "text-primary underline-offset-4 hover:underline",
        floating: "bg-gradient-sunset shadow-festival hover:shadow-lg hover:scale-105 text-white animate-float",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-md px-3",
        lg: "h-14 rounded-lg px-8",
        xl: "h-16 rounded-xl px-10 text-base",
        icon: "h-12 w-12",
        floating: "h-14 w-14 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface FestivalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof festivalButtonVariants> {
  asChild?: boolean;
}

const FestivalButton = React.forwardRef<HTMLButtonElement, FestivalButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(festivalButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
FestivalButton.displayName = "FestivalButton";

export { FestivalButton, festivalButtonVariants };