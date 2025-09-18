/* Utils */
import { cn } from "@/lib/utils"

/* Components */
import { Toast as PToast } from "primereact/toast"

export function Toast({ className, ref, ...props }) {
  return <PToast {...props} ref={ref} className={cn(className)} />
}
