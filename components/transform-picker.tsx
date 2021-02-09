/* eslint-disable */
import { System } from "lib"
import * as Transforms from "../lib/transforms"

interface TransformPickerProps {
  inputType: System.Type
  onSelect: (name: Transforms.TransformName) => void
}

export default function TransformPicker({
  inputType,
  onSelect,
}: TransformPickerProps) {
  return (
    <select
      value={"default"}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        onSelect(e.target.value as Transforms.TransformName)
      }
    >
      <option value="default" disabled>
        Add a transform
      </option>
      {Object.entries(Transforms.TransformTypes[inputType]).map(
        ([name, transforms], i) => (
          <optgroup label={name} key={i}>
            {transforms.map((transformName, i) => (
              <option key={i}>{transformName}</option>
            ))}
          </optgroup>
        )
      )}
    </select>
  )
}
