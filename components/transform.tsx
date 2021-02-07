import { System } from "lib"
import styled from "styled-components"
import state from "state"
import { ArrowRight } from "react-feather"
import { EnumInput, PropertyInput } from "./inputs"
import { TransformMenu } from "./menus"
import { PanelHeader, Panel } from "./styled"
import TypeIcon from "./type-icon"

interface TransformProps {
  property: System.IProperty
  transform: System.ITransform
  index: number
  status: "error" | "warn" | "ok"
}

export default function Transform({
  property,
  transform,
  status,
  index,
}: TransformProps) {
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
            if ("type" in arg) {
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
              arg = arg as System.IProperty
              return (
                <li key={arg.id}>
                  <PropertyInput
                    label={arg.name}
                    value={System.Property.getValue(arg)}
                    disabled={!!arg.initial.variable}
                    onChange={(value) =>
                      state.send("CHANGED_INITIAL_VALUE", {
                        property: arg,
                        value,
                      })
                    }
                    variable={arg.initial.variable}
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
        <ErrorMessage>{property.error?.message}</ErrorMessage>
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
      ? "rgba(255,100,100,.5)"
      : status === "warn"
      ? "rgba(255,100,100,.25)"
      : "#fafafa"};

  li {
    border-bottom: 1px solid rgba(144, 144, 144, 0.5);
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
  padding: 8px 16px;
  gap: 8px;

  * {
    margin: 0;
  }
`

const ReturnedValue = styled.p`
  display: grid;
  grid-gap: 8px;
  grid-template-columns: auto 1fr;
  padding: 12px 16px;
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  background-color: rgba(0, 0, 0, 0.05);
  text-align: right;
`

const ErrorMessage = styled.p`
  padding: 8px 12px 12px 12px;
  margin: 0;
  text-align: center;
  border-top: 1px solid rgba(144, 144, 144, 0.5);
`

const TypeIcons = styled.div`
  display: flex;
`
