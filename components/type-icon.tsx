import * as React from "react"
import { System } from "lib"
import { Type, Hash, CheckSquare, List } from "react-feather"

const icons = {
  [System.Type.Text]: Type,
  [System.Type.Number]: Hash,
  [System.Type.Boolean]: CheckSquare,
  enum: List,
}

interface TypeIconProps {
  type: System.Type | "enum"
  variant?: "variable" | "transformed"
}

export default function TypeIcon({ type, variant }: TypeIconProps) {
  const Icon = icons[type]
  return (
    <Icon
      size={16}
      stroke={
        variant === "variable"
          ? "var(--color-variable)"
          : variant === "transformed"
          ? "var(--color-transformed)"
          : "var(--color-text)"
      }
    />
  )
}
