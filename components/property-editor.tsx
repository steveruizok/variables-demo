/* eslint-disable */
import styled from "styled-components"
import { System } from "lib"
import state from "state"
import Transform from "./transform"
import TransformPicker from "./transform-picker"
import { PropertyInput, EnumInput } from "./inputs"
import { coerceValue } from "utils"
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
          onVariableDetatch={() =>
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
      {property.error && (
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
