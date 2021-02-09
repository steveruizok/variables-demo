import * as React from "react"
import styled from "styled-components"
import state from "state"
import PropertyEditor from "./property-editor"
import { Panel, PanelBody, PanelHeader, IconButton } from "./styled"
import { useStateDesigner } from "@state-designer/react"
import { Trash, X } from "react-feather"

export default function PropertyPanel() {
  const {
    values: { selected },
  } = useStateDesigner(state)

  return (
    <Panel>
      <PanelHeader>
        <h2>
          Selected{" "}
          {/* {selected.__type === "variable" ? "Variable" : "Property"} */}
        </h2>
        {selected && (
          <ButtonRow>
            {selected.__type === "variable" && (
              <IconButton
                onClick={() =>
                  state.send("DELETED_VARIABLE", { property: selected })
                }
              >
                <Trash size={16} />
              </IconButton>
            )}
            <IconButton onClick={() => state.send("CLEARED_SELECTION")}>
              <X size={16} />
            </IconButton>
          </ButtonRow>
        )}
      </PanelHeader>
      {selected ? (
        <PropertyEditor key={selected.id} property={selected} />
      ) : (
        <PanelBody>Select a property or variable.</PanelBody>
      )}
    </Panel>
  )
}

const ButtonRow = styled.div`
  display: flex;
`
