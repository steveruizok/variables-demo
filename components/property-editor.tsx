/* eslint-disable */
import styled from "styled-components"
import { System } from "lib"
import state from "state"
import Transform from "./transform"
import TransformPicker from "./transform-picker"
import { RawTextInput, PropertyInput, EnumInput } from "./inputs"
import { coerceValue } from "utils"
import { PanelBody } from "./styled"

interface PropertyEditorProps {
  property: System.IProperty
}

export default function PropertyEditor({ property }: PropertyEditorProps) {
  const isVariable = System.variables.has(property.id)
  const hasInitialVariable = !!property.initial.variable
  const addTransformType = System.Property.getTransformedType(property)
  const initialType = System.Natural.getType(property.initial)
  const initialValue = System.Natural.getValue(property.initial)

  return (
    <PanelBody>
      <InputsContainer>
        <PropertyInput
          label="Name"
          disabled={!isVariable}
          value={property.name}
          showVariables={false}
          onChange={(name) => state.send("CHANGED_NAME", { property, name })}
        />
      </InputsContainer>
      <h3>Initial Value</h3>
      <InputsContainer>
        <EnumInput
          label="Type"
          disabled={!!property.initial.variable}
          options={Object.values(System.Type)}
          value={
            property.initial.variable
              ? System.Property.getType(
                  System.variables.get(property.initial.variable)!
                )
              : initialType
          }
          onChange={(type) =>
            state.send("CHANGED_INITIAL_TYPE", {
              property,
              type,
            })
          }
        />
        <PropertyInput
          label="Value"
          disabled={hasInitialVariable}
          value={coerceValue(initialType, initialValue)}
          onChange={(value) =>
            state.send("CHANGED_INITIAL_VALUE", {
              property,
              value,
            })
          }
          variable={property.initial.variable}
          onVariableChange={(variable) =>
            state.send("SELECTED_VARIABLE", {
              property,
              variable,
            })
          }
        />
      </InputsContainer>
      <h3>Transforms</h3>
      {property.transforms.length > 0 && (
        <TransformsList>
          <ul>
            {property.transforms.map((transform, index) => {
              const status = property.error
                ? property.error.index === index
                  ? "error"
                  : property.error.index < index
                  ? "warn"
                  : "ok"
                : "ok"

              return (
                <Transform
                  key={transform.id}
                  transform={transform}
                  property={property}
                  status={status}
                  index={index}
                />
              )
            })}
          </ul>
        </TransformsList>
      )}
      <TransformPicker
        inputType={addTransformType}
        onSelect={(name) =>
          state.send("ADDED_TRANSFORM", {
            property,
            name,
          })
        }
      />
      <h3>Final Value</h3>
      <InputsContainer>
        <PropertyInput
          label={System.Property.getType(property)}
          value={String(System.Property.getValue(property))}
          readOnly
        />
        {property.warning && (
          <RawTextInput label="Warning" value={property.warning.message} />
        )}
      </InputsContainer>
      <pre>
        <code>{JSON.stringify(property, null, 2)}</code>
      </pre>
    </PanelBody>
  )
}

const TransformsList = styled.div`
  padding-bottom: 16px;
`

const InputsContainer = styled.div`
  border: 1px solid rgba(144, 144, 144, 0.5);
  background-color: #f9fafa;
  border-radius: 4px;
  grid-auto-columns: 1fr;
`
