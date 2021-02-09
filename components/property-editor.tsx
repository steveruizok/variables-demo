/* eslint-disable */
import state from "state"
import { System } from "lib"
import { coerceValue } from "utils"
import Transform from "./transform"
import TransformPicker from "./transform-picker"
import { PropertyInput, EnumInput } from "./inputs"
import { PanelBody, InputsContainer } from "./styled"

interface PropertyEditorProps {
  property: System.IProperty | System.IVariable
}

export default function PropertyEditor({ property }: PropertyEditorProps) {
  const isVariable = property.__type === "variable"
  const hasInitialVariable = !!property.initial.variable
  const initialType = System.Initial.getType(property.initial)
  const initialValue = System.Initial.getValue(property.initial)
  const addTransformType = System.Property.getTransformedType(property)

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
      <hr />
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
          excludeVariable={{
            __type: "variable",
            scope: property.scope,
            id: property.id,
          }}
          onVariableChange={(variable) =>
            state.send("SELECTED_VARIABLE", {
              property,
              variable,
            })
          }
          onVariableDetach={() =>
            state.send("DETACHED_VARIABLE", {
              property,
            })
          }
        />
      </InputsContainer>
      <hr />
      <h3>Transforms</h3>
      {property.transforms.length > 0 && (
        <ul>
          {property.transforms.map((transform, index) => {
            return (
              <Transform
                key={transform.id}
                transform={transform}
                property={property}
                index={index}
                excludeVariable={{
                  __type: "variable",
                  scope: property.scope,
                  id: property.id,
                }}
              />
            )
          })}
        </ul>
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
      <hr />
      <h3>Final Value</h3>
      <InputsContainer>
        <PropertyInput
          label={""}
          value={System.Property.getValue(property)}
          readOnly
          showVariables={false}
        />
      </InputsContainer>
      {property.error && property.error.index < 0 && (
        <>
          <hr />
          <h3>Error</h3>
          <p>{property.error.message}</p>
        </>
      )}
      {property.warning && (
        <>
          <hr />
          <h3>Warning</h3>
          <p>{property.warning.message}</p>
        </>
      )}
    </PanelBody>
  )
}
