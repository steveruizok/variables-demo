/* eslint-disable */
import styled from "styled-components"
import { System } from "lib"
import state from "state"
import Transform from "./transform"
import TransformPicker from "./transform-picker"
import { RawTextInput, PropertyInput, EnumInput } from "./inputs"
import { coerceValue } from "utils"
import { PanelBody } from "./styled"
import Pre from "./pre"

interface PropertyEditorProps {
  property: System.IProperty | System.IVariable
}

export default function PropertyEditor({ property }: PropertyEditorProps) {
  const isVariable = property.__type === "variable"
  const hasTransforms = property.transforms.length > 0

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
      <TransformedValueEditor property={property} />
      <Pre source={property} />
    </PanelBody>
  )
}

const TransformsList = styled.div``

const InputsContainer = styled.div`
  border: 1px solid var(--color-border);
  background-color: var(--color-input);
  border-radius: var(--radius-2);
  grid-auto-columns: 1fr;
`

// function NaturalValueEditor({ property }: { property: System.IProperty }) {
//   const hasInitialVariable = !!property.initial.variable
//   const initialType = System.Initial.getType(property.initial)
//   const initialValue = System.Initial.getValue(property.initial)
//   const addTransformType = System.Property.getTransformedType(property)

//   return (
//     <>
//       <InputsContainer>
//         <EnumInput
//           label="Type"
//           disabled={!!property.initial.variable}
//           options={Object.values(System.Type)}
//           value={
//             property.initial.variable
//               ? System.Property.getType(
//                   System.variables.get(property.initial.variable)!
//                 )
//               : initialType
//           }
//           onChange={(type) =>
//             state.send("CHANGED_INITIAL_TYPE", {
//               property,
//               type,
//             })
//           }
//         />
//         <PropertyInput
//           label="Value"
//           disabled={hasInitialVariable}
//           value={coerceValue(initialType, initialValue)}
//           onChange={(value) =>
//             state.send("CHANGED_INITIAL_VALUE", {
//               property,
//               value,
//             })
//           }
//           variable={property.initial.variable}
//           onVariableChange={(variable) =>
//             state.send("SELECTED_VARIABLE", {
//               property,
//               variable,
//             })
//           }
//         />
//       </InputsContainer>
//       <TransformPicker
//         inputType={addTransformType}
//         onSelect={(name) =>
//           state.send("ADDED_TRANSFORM", {
//             property,
//             name,
//           })
//         }
//       />
//     </>
//   )
// }

function TransformedValueEditor({
  property,
}: {
  property: System.IProperty | System.IVariable
}) {
  const hasInitialVariable = !!property.initial.variable
  const initialType = System.Initial.getType(property.initial)
  const initialValue = System.Initial.getValue(property.initial)
  const addTransformType = System.Property.getTransformedType(property)

  return (
    <>
      <h3>Initial Value</h3>
      <InputsContainer>
        <EnumInput
          label="Type"
          disabled={!!property.initial.variable}
          options={Object.values(System.Type)}
          value={
            property.initial.variable
              ? System.Property.getType(
                  System.getVariable(property.initial.variable)!
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
          excludeVariable={{ scope: property.scope, id: property.id }}
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
                ? property.error.index >= 0
                  ? property.error.index === index
                    ? "error"
                    : property.error.index < index
                    ? "warn"
                    : "ok"
                  : "ok"
                : "ok"

              return (
                <Transform
                  key={transform.id}
                  transform={transform}
                  property={property}
                  status={status}
                  index={index}
                  excludeVariable={{ scope: property.scope, id: property.id }}
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
      {property.error && <p>Error: {property.error.message}</p>}
      {property.warning && <p>Warning: {property.warning.message}</p>}
      <h3>Final Value</h3>
      <InputsContainer>
        <PropertyInput
          label={System.Property.getType(property)}
          value={String(System.Property.getValue(property))}
          readOnly
          showVariables={false}
        />
      </InputsContainer>
    </>
  )
}
