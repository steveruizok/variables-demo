import styled from "styled-components"
import { System } from "lib"
import * as React from "react"
import { useSelector } from "state"

interface VariablePickerProps {
  type?: System.Type
  value?: string
  onChange?: (variable?: System.IProperty) => void
}

export default function VariablePicker({
  type,
  value,
  onChange,
}: VariablePickerProps) {
  const variables = useSelector((state) => state.data.variables)
  const variablesArray = Array.from(variables.values())

  return (
    <SelectWrapper hasVariable={!!value}>
      <select
        value={value}
        onChange={(e) => onChange?.(variables.get(e.currentTarget.value))}
      >
        <option value={undefined}>None</option>
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
  height: 40px;
  width: 40px;
  background-color: #fcfcfc;
  border: 1px solid #767676;
  border-radius: 4px;
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
