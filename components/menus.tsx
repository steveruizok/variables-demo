/* eslint-disable */
import { System } from "lib"
import { IconSelect } from "./styled"
import { MoreHorizontal } from "react-feather"
import state from "state"

interface TransformMenuProps {
  property: System.IProperty | System.IVariable
  transform: System.ITransform
  index: number
}

export function TransformMenu({
  property,
  transform,
  index,
}: TransformMenuProps) {
  return (
    <IconSelect>
      <select
        value={""}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          switch (e.currentTarget.value) {
            case "Move Up": {
              state.send("MOVED_TRANSFORM", {
                property,
                transform,
                index: index - 1,
              })
              break
            }
            case "Move Down": {
              state.send("MOVED_TRANSFORM", {
                property,
                transform,
                index: index + 1,
              })
              break
            }
            case "Duplicate": {
              state.send("DUPLICATED_TRANSFORM", {
                property,
                transform,
              })
              break
            }
            case "Delete": {
              state.send("REMOVED_TRANSFORM", {
                property,
                transform,
              })
              break
            }
            default: {
              break
            }
          }
        }}
      >
        <option disabled value={""}>
          {" "}
        </option>
        <option>Move Up</option>
        <option>Move Down</option>
        <option>Duplicate</option>
        <option>Delete</option>
      </select>
      <MoreHorizontal size={16} />
    </IconSelect>
  )
}
