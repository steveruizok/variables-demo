import { System } from "lib"
import * as React from "react"
import { useStateDesigner } from "@state-designer/react"
import state from "state"
import styled from "styled-components"
import { Button } from "./styled"
import TypeIcon from "./type-icon"

export function ScopedPropertiesList({
  scope,
  depth,
}: {
  scope: string
  depth: number
}) {
  const {
    values: { selected },
    data: { stack, properties },
  } = useStateDesigner(state)

  const list: System.IProperty[] = Object.values(properties[scope])

  return (
    <ul>
      {list.map((property, i) => {
        const children = Object.values(properties[property.id] || {})

        const isActive = stack.find((ref) => ref.id === property.id)
        const isSelected = selected?.id === property.id

        return (
          <li key={property.id}>
            <PropertyButton
              property={property}
              isSelected={isSelected}
              type={System.Property.getType(property)}
              value={System.Property.getValue(property)}
              onClick={() =>
                state.send("SELECTED_AT_DEPTH", {
                  selection: property,
                  depth,
                })
              }
            />
            {isActive && children && children.length > 0 && (
              <ScopedPropertiesList scope={property.id} depth={depth + 1} />
            )}
          </li>
        )
      })}
    </ul>
  )
}

export function PropertiesList() {
  return <ScopedPropertiesList scope="global" depth={0} />
}

export function VariablesList() {
  const {
    values: { selected },
    data: { variables },
  } = useStateDesigner(state)

  const list = Object.values(variables.global)

  return (
    <ul>
      {list.map((variable) => {
        return (
          <li key={variable.id}>
            <PropertyButton
              property={variable}
              isSelected={selected?.id === variable.id}
              type={System.Variable.getType(variable)}
              value={System.Variable.getValue(variable)}
              onClick={() =>
                state.send("SELECTED", {
                  selection: variable,
                })
              }
            />
          </li>
        )
      })}
    </ul>
  )
}

function PropertyButton({
  property,
  isSelected,
  type,
  value,
  onClick,
}: {
  property: System.IProperty | System.IVariable
  isSelected: boolean
  type: System.Type
  value: System.ValueTypes[System.Type]
  onClick?: () => void
}) {
  return (
    <StyledButton
      title="Select property"
      isSelected={isSelected}
      hasError={!!property.error}
      onClick={onClick}
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

export const StyledButton = styled(Button)`
  grid-template-columns: auto 1fr minmax(0, auto);
  grid-gap: var(--spacing-1);
  text-align: left;
`
