import { System } from "lib"
import styled from "styled-components"
import state from "state"
import { ArrowRight, AlertOctagon } from "react-feather"
import { EnumInput, PropertyInput } from "./inputs"
import { TransformMenu } from "./menus"
import { PanelHeader, Panel } from "./styled"
import TypeIcon from "./type-icon"

interface TransformProps {
  property: System.IProperty | System.IVariable
  transform: System.ITransform
  index: number
  excludeVariable?: System.ScopedReference
}

export default function Transform({
  property,
  transform,
  excludeVariable,
  index,
}: TransformProps) {
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
    <TransformContainer key={transform.id} status={status}>
      <TransformHeader>
        <h2>{transform.name}</h2>
        <TransformMenu
          property={property}
          transform={transform}
          index={index}
        />
      </TransformHeader>
      {transform.args.length > 0 && (
        <ul>
          {transform.args.map((arg) => {
            if (arg.__type === "enumerated") {
              return (
                <li key={arg.id}>
                  <EnumInput
                    key={arg.id}
                    label={arg.name}
                    options={arg.options}
                    value={System.Enumerated.getValue(arg)}
                    onChange={(value) =>
                      state.send("CHANGED_ENUM_VALUE", {
                        property: arg as System.IEnumerated,
                        value,
                      })
                    }
                  />
                </li>
              )
            } else {
              const property = System.getProperty(arg)

              return (
                <li key={property.id}>
                  <PropertyInput
                    label={property.name}
                    value={System.Property.getValue(property)}
                    disabled={!!property.initial.variable}
                    property={property}
                    variable={property.initial.variable}
                    excludeVariable={excludeVariable}
                    onChange={(value) =>
                      state.send("CHANGED_INITIAL_VALUE", {
                        property,
                        value,
                      })
                    }
                    onEdit={() =>
                      state.send("SELECTED", {
                        selection: property,
                        stack: true,
                      })
                    }
                    onTransformDetach={() => {
                      state.send("DETACHED_TRANSFORM", { property })
                    }}
                    onVariableChange={(variable) =>
                      state.send("SELECTED_VARIABLE", {
                        property: arg,
                        variable,
                      })
                    }
                  />
                </li>
              )
            }
          })}
        </ul>
      )}
      <ReturnedValue>
        <TypeIcons>
          <TypeIcon type={transform.inputType} />
          <ArrowRight size={16} />
          <TypeIcon type={transform.outputType} />
        </TypeIcons>
        {String(transform.returnedValue)}
      </ReturnedValue>
      {status === "error" && (
        <ErrorMessage>
          <AlertOctagon size={16} />
          {property.error?.message}
        </ErrorMessage>
      )}
    </TransformContainer>
  )
}

const TransformContainer = styled(Panel)<{ status: "ok" | "error" | "warn" }>`
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  background-color: ${({ status }) =>
    status === "error"
      ? "var(--color-error-0)"
      : status === "warn"
      ? "var(--color-error-1)"
      : "var(--color-surface-1)"};

  li {
    border-bottom: 1px solid var(--color-border-0);
  }

  li > div {
    border-bottom: none;
  }
`

const TransformHeader = styled(PanelHeader)`
  background-color: transparent !important;
  display: grid;
  align-items: center;
  grid-auto-flow: column;
  grid-template-columns: 1fr;
  grid-auto-columns: auto;
  border-bottom: 1px solid var(--color-border-0);
  padding: var(--spacing-1) var(--spacing-2);
  gap: var(--spacing-1);

  * {
    margin: 0;
  }
`

const ReturnedValue = styled.div`
  display: grid;
  grid-gap: var(--spacing-1);
  grid-template-columns: auto 1fr;
  padding: var(--spacing-2) var(--spacing-3);
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  background-color: var(--color-shadow-0);
  text-align: right;
`

const ErrorMessage = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--spacing-2);
  padding: var(--spacing-2);
  margin: 0;
  text-align: left;
  border-top: 1px solid var(--color-border-0);
`

const TypeIcons = styled.div`
  display: flex;
`
