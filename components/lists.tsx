import { System } from "lib"
import * as React from "react"
import { useStateDesigner } from "@state-designer/react"
import state from "state"
import styled from "styled-components"
import { Button } from "./styled"
import TypeIcon from "./type-icon"

export function PropertiesList() {
  const { data, values } = useStateDesigner(state)

  const properties = values.properties

  return (
    <ul>
      {properties[0].members.map((property, i) => (
        <li key={property.id}>
          <PropertyButton
            property={property}
            isActive={data.selected?.id === property.id}
            type={System.Property.getType(property)}
            value={System.Property.getValue(property)}
          />
        </li>
      ))}
    </ul>
  )
}

export function VariablesList() {
  const { data, values } = useStateDesigner(state)
  const variables = values.variables

  return (
    <ul>
      {variables.map(({ name, members }, i) => (
        <li key={i}>
          <ul>
            {members.map((variable) => {
              return (
                <li key={variable.id}>
                  <PropertyButton
                    property={variable}
                    isActive={data.selected?.id === variable.id}
                    type={System.Variable.getType(variable)}
                    value={System.Variable.getValue(variable)}
                  />
                </li>
              )
            })}
          </ul>
        </li>
      ))}
    </ul>
  )
}

function PropertyButton({
  property,
  isActive,
  type,
  value,
}: {
  property: System.IProperty | System.IVariable
  isActive: boolean
  type: System.Type
  value: System.ValueTypes[System.Type]
}) {
  return (
    <StyledButton
      title="Select property"
      isActive={isActive}
      hasError={!!property.error}
      onClick={() =>
        state.send("SELECTED", {
          selection: property,
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

export const StyledButton = styled(Button)`
  grid-template-columns: auto 1fr minmax(0, auto);
  grid-gap: var(--spacing-1);
  text-align: left;
`
