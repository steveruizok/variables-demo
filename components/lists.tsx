import { System } from "lib"
import * as React from "react"
import styled from "styled-components"
import { useStateDesigner } from "@state-designer/react"
import state from "state"
import TypeIcon from "./type-icon"

export function PropertiesList() {
  const {
    data,
    values: { properties },
  } = useStateDesigner(state)

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
                  type={System.Property.getType(property)}
                  value={System.Property.getValue(property)}
                />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
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
                  <PropertyButton
                    property={variable}
                    isActive={data.selected === variable.id}
                    type={System.Property.getType(variable)}
                    value={System.Property.getValue(variable)}
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

function PropertyButton({
  property,
  isActive,
  type,
  value,
}: {
  property: System.IProperty
  isActive: boolean
  type: System.Type
  value: System.ValueTypes[System.Type]
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
      <TypeIcon
        type={type}
        variant={
          property.transforms.length > 0
            ? "transformed"
            : property.initial.variable
            ? "variable"
            : undefined
        }
      />
      <div>
        <b>{property.name}</b>
      </div>
      <div>{String(value)}</div>
    </StyledButton>
  )
}

const StyledButton = styled.button<{
  hasError?: boolean
  isActive: boolean
}>`
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr minmax(0, auto);
  grid-gap: var(--spacing-1);
  align-items: center;
  text-align: left;
  overflow: hidden;
  width: 100%;
  white-space: nowrap;
  border-radius: var(--radius-2);
  background-color: ${({ hasError, isActive }) =>
    hasError
      ? "var(--color-error-0)"
      : isActive
      ? "var(--color-active-background)"
      : "var(--color-input)"} !important;
`

const AddNewButton = styled.button`
  width: 100%;
`
