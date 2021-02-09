import styled from "styled-components"
import { System } from "lib"
import * as React from "react"
import { IconSelect } from "./styled"
import { useSelector } from "state"
import { Radio } from "react-feather"

interface VariablePickerProps {
  type?: System.Type
  id?: string
  scope?: string
  exclude?: string
  onDetach?: () => void
  onChange?: (variable?: System.IVariable) => void
}

export default function VariablePicker({
  type,
  id,
  scope = "global",
  exclude,
  onChange,
  onDetach,
}: VariablePickerProps) {
  const variables = useSelector((state) => state.data.variables)
  const variablesArray = Object.values(variables[scope]).filter(
    (v) => v.id !== exclude
  )

  return (
    <IconSelect>
      <select
        value={id || ""}
        onChange={({ currentTarget: { value } }) => {
          if (value === "Detach") {
            onDetach && onDetach()
            return
          }

          const variable = value
            ? System.getVariable({ __type: "variable", scope, id: value })
            : undefined
          onChange?.(variable)
        }}
      >
        <optgroup label="Options">
          {onDetach && <option>Detach</option>}
          <option value={""}>{id ? "Remove" : "None"}</option>
        </optgroup>
        <optgroup label="Variables">
          {(type
            ? variablesArray.filter((v) => System.Property.getType(v) === type)
            : variablesArray
          ).map((variable, i) => (
            <option key={i} value={variable.id}>
              {variable.name}
            </option>
          ))}
        </optgroup>
      </select>
      <Radio size={16} />
    </IconSelect>
  )
}
