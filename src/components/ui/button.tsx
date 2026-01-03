import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { button, type ButtonVariantProps } from "../../../styled-system/recipes"
import { cn } from "@/lib/utils"

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  ButtonVariantProps & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(button({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button }