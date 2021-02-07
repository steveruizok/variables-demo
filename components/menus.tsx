/* eslint-disable */
import styled from "styled-components"
import * as System from "lib/system"
import state, { useSelector } from "state"

interface TransformMenuProps {
  transform: System.ITransform
  property: System.IProperty
  index: number
}

export function TransformMenu({
  property,
  transform,
  index,
}: TransformMenuProps) {
  return (
    <SelectWrapper>
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
      <div>{"..."}</div>
    </SelectWrapper>
  )
}

const SelectWrapper = styled.div`
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
