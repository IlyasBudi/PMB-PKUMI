/* Utils */
import { cn } from "@/lib/utils"

export default function Container({ children, className, ...props }) {
  return (
    <div {...props} className={cn("container mx-auto px-6 md:px-14", className)}>
      {children}
    </div>
  )
}
