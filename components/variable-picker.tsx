import styled from "styled-components"
import { System } from "lib"
import * as React from "react"
import { useSelector } from "state"

interface VariablePickerProps {
  type?: System.Type
  id?: string
  scope?: string
  exclude?: string
  onChange?: (variable?: System.IVariable) => void
}

export default function VariablePicker({
  type,
  id,
  scope = "global",
  exclude,
  onChange,
}: VariablePickerProps) {
  const variables = useSelector((state) => state.data.variables)
  const variablesArray = Array.from(variables.get(scope).values()).filter(
    (v) => v.id !== exclude
  )

  return (
    <SelectWrapper hasVariable={!!id}>
      <select
        value={id || ""}
        onChange={({ currentTarget: { value } }) => {
          const variable = value
            ? System.getVariable({ scope, id: value })
            : undefined
          onChange?.(variable)
        }}
      >
        <option value={""}>None</option>
        {(type
          ? variablesArray.filter((v) => System.Property.getType(v) === type)
          : variablesArray
        ).map((variable, i) => (
          <option key={i} value={variable.id}>
            {variable.name}
          </option>
        ))}
      </select>
      <div>{"{ }"}</div>
    </SelectWrapper>
  )
}

const SelectWrapper = styled.div<{ hasVariable: boolean }>`
  height: var(--height-input);
  width: var(--height-input);
  background-color: var(--color-input);
  border: 1px solid var(--color-shade-0);
  border-radius: var(--radius-2);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  & > select {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  & > div {
    pointer-events: none;
  }
`
