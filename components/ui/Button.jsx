"use client"
/* Components */
import { Button as PButton } from "primereact/button"

/* Utils */
import { cn } from "@/lib/utils"

/* Module Styles */
import style from "@/styles/module/button.module.css"

export function Button({ className, ...props }) {
  return <PButton {...props} className={cn(style["fx-button"], className)} />
}

export const buttonStyles = cn(style["fx-button"])
export const buttonStylesSecondary = cn(style["fx-button"], style["secondary"])
