import * as System from "lib/system"
import * as React from "react"
import styled from "styled-components"
import { useStateDesigner } from "@state-designer/react"
import state, { useSelector } from "state"
import TypeIcon from "./type-icon"
import { Panel, PanelHeader, PanelBody } from "./styled"

export function PropertiesList() {
  const { data } = useStateDesigner(state)
  const properties = Array.from(data.properties.values())

  const propertiesByType = Object.entries(
    properties.reduce((acc, cur) => {
      const type = System.Property.getType(cur)
      if (acc[type] === undefined) {
        acc[type] = []
      }
      acc[type].push(cur)
      return acc
    }, {} as Record<System.Type, System.IProperty[]>)
  )

  return (
    <ul>
      {propertiesByType.map(([name, properties], i) => (
        <li key={i}>
          <ul>
            {properties.map((property, i) => (
              <li key={property.id}>
                <PropertyButton
                  property={property}
                  isActive={data.selected === property.id}
                />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}

function PropertyButton({
  property,
  isActive,
}: {
  property: System.IProperty
  isActive: boolean
}) {
  return (
    <StyledButton
      isActive={isActive}
      hasError={!!property.error}
      onClick={() =>
        state.send("SELECTED_PROPERTY", {
          property: property,
        })
      }
    >
      <TypeIcon type={System.Property.getType(property)} />
      <div>
        <b>{property.name}</b>
      </div>
      <div>{String(System.Property.getValue(property))}</div>
    </StyledButton>
  )
}

export function VariablesList() {
  const { data } = useStateDesigner(state)
  const variables = Array.from(data.variables.values())

  const varsByType = Object.entries(
    variables.reduce((acc, cur) => {
      const type = System.Property.getType(cur)
      if (acc[type] === undefined) {
        acc[type] = []
      }
      acc[type].push(cur)
      return acc
    }, {} as Record<System.Type, System.IProperty[]>)
  )

  return (
    <ul>
      {varsByType.map(([name, vars], i) => (
        <li key={i}>
          <ul>
            {vars.map((variable) => {
              return (
                <li key={variable.id}>
                  <VariableButton
                    variable={variable}
                    isActive={data.selected === variable.id}
                  />
                </li>
              )
            })}
          </ul>
        </li>
      ))}
      <li>
        <AddNewButton onClick={() => state.send("CREATED_VARIABLE")}>
          Create New Variable
        </AddNewButton>
      </li>
    </ul>
  )
}

function VariableButton({
  variable,
  isActive,
}: {
  variable: System.IProperty
  isActive: boolean
}) {
  return (
    <StyledButton
      isActive={isActive}
      onClick={() =>
        state.send("SELECTED_PROPERTY", {
          property: variable,
        })
      }
    >
      <TypeIcon type={System.Property.getType(variable)} />
      <div>
        <b>{variable.name}</b>
      </div>
      <div>{String(System.Property.getValue(variable))}</div>{" "}
    </StyledButton>
  )
}

const StyledButton = styled.button<{ hasError?: boolean; isActive: boolean }>`
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr minmax(0, auto);
  grid-gap: 8px;
  align-items: center;
  text-align: left;
  overflow: hidden;
  width: 100%;
  white-space: nowrap;
  border-radius: 4px;
  background-color: ${({ hasError, isActive }) =>
    hasError
      ? "rgba(200, 50, 50, .2)"
      : isActive
      ? "rgba(50,50,200,.2)"
      : "#f9f9f9"} !important;

  ::after {
    content: "";
    display: block;
    position: absolute;
    top: 1px;
    right: 1px;
    width: 12px;
    height: calc(100% - 2px);
    background-color: rgba(255, 255, 255, 0.2);
    opacity: 0.8;
  }
`

const AddNewButton = styled.button`
  width: 100%;
`
