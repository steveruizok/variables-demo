/* eslint-disable */
import startCase from "lodash/startCase"
import { System } from "lib"
import * as Transforms from "../lib/transforms"
import { Button } from "./styled"
import styled from "styled-components"

interface TransformPickerProps {
  inputType: System.Type
  onSelect: (name: Transforms.TransformName) => void
}

export default function TransformPicker({
  inputType,
  onSelect,
}: TransformPickerProps) {
  return (
    <SelectWrapper>
      <select
        title="Add a transform"
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
            <optgroup label={startCase(`${inputType} to ${name}`)} key={i}>
              {transforms.map((transformName, i) => (
                <option key={i}>{transformName}</option>
              ))}
            </optgroup>
          )
        )}
      </select>
      <Button>Add a Transform</Button>
    </SelectWrapper>
  )
}

export const SelectWrapper = styled.div`
  position: relative;

  & > select {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
  }

  & button {
    pointer-events: none;
  }
`
