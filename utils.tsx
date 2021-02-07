import * as System from "./lib/system"

export function coerceValue(
  type: System.Type,
  value: string | number | boolean
) {
  return type === System.Type.Text
    ? String(value)
    : type === System.Type.Boolean
    ? Boolean(value)
    : Number(value)
}
