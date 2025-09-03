import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-emerald-500 text-black hover:bg-emerald-600 shadow-sm shadow-emerald-500/20",
        secondary:
          "border-border bg-muted text-muted-foreground hover:bg-muted/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-500/30",
        "tier-a": "bg-tier-a-bg text-tier-a-text border-tier-a-border",
        "tier-b": "bg-tier-b-bg text-tier-b-text border-tier-b-border", 
        "tier-c": "bg-tier-c-bg text-tier-c-text border-tier-c-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
