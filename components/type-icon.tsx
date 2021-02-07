import * as React from "react"
import { System } from "lib"
import { Type, Hash, CheckSquare, List } from "react-feather"

interface TypeIconProps {
  type: System.Type | "enum"
}

const icons = {
  [System.Type.Text]: Type,
  [System.Type.Number]: Hash,
  [System.Type.Boolean]: CheckSquare,
  enum: List,
}

export default function TypeIcon({ type }: TypeIconProps) {
  const Icon = icons[type]
  return <Icon size={16} />
}
