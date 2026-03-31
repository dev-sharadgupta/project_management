import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
      size: {
        xs: "h-5 rounded-md",
        sm: "h-8 rounded-md",
        md: "h-9 rounded-md px-3",
        lg: "h-10 rounded-md px-3",
        xl: "h-12 rounded-md px-4",
        icon: "size-9",
      },
      shape: {
        rounded: 'rounded-full',
        sharp: 'rounded-none',
        default: 'rounded-md',
      },
      color: {
        none: "",
        gray: "bg-gray-100 text-gray-800",
        blue: "bg-blue-500 text-white",
        green: "bg-green-100 text-green-500",
        red: "bg-red-100 text-red-500"
      },
      fontSize: {
        xs: "text-[11px]",
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      shape: "default",
      color: 'none',
      fontSize: 'md'
    },
  }
)

function Badge({
  className,
  variant,
  size,
  shape,
  color,
  fontSize,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size, shape, color, fontSize, }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
