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
  onDetatch?: () => void
  onChange?: (variable?: System.IVariable) => void
}

export default function VariablePicker({
  type,
  id,
  scope = "global",
  exclude,
  onChange,
  onDetatch,
}: VariablePickerProps) {
  const variables = useSelector((state) => state.data.variables)
  const variablesArray = Array.from(variables.get(scope).values()).filter(
    (v) => v.id !== exclude
  )

  return (
    <IconSelect>
      <select
        value={id || ""}
        onChange={({ currentTarget: { value } }) => {
          if (value === "Detatch") {
            onDetatch()
            return
          }

          const variable = value
            ? System.getVariable({ __type: "variable", scope, id: value })
            : undefined
          onChange?.(variable)
        }}
      >
        <option value={""}>{id ? "Remove" : "None"}</option>
        {id && <option>Detatch</option>}
        {(type
          ? variablesArray.filter((v) => System.Property.getType(v) === type)
          : variablesArray
        ).map((variable, i) => (
          <option key={i} value={variable.id}>
            {variable.name}
          </option>
        ))}
      </select>
      <Radio size={16} />
    </IconSelect>
  )
}
