import * as React from "react"
import styled from "styled-components"
import state from "state"
import PropertyEditor from "./property-editor"
import { Panel, PanelStack, PanelBody, PanelHeader, IconButton } from "./styled"
import { useStateDesigner } from "@state-designer/react"
import { Trash, X, ArrowLeft } from "react-feather"
import Source from "./source"

export default function PropertyPanel() {
  const {
    data: { stack },
    values: { selected },
  } = useStateDesigner(state)

  return (
    <PanelStack>
      <Panel>
        <PanelHeader>
          <h2>Selected</h2>
          {selected && (
            <ButtonRow>
              {selected.__type === "variable" && (
                <IconButton
                  title="Delete variable"
                  onClick={() =>
                    state.send("DELETED_VARIABLE", { property: selected })
                  }
                >
                  <Trash size={16} />
                </IconButton>
              )}
              <IconButton
                title="Close"
                onClick={() => state.send("CLEARED_SELECTION")}
              >
                {stack.length > 1 ? <ArrowLeft size={16} /> : <X size={16} />}
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
      {selected && <Source source={selected} />}
    </PanelStack>
  )
}

const ButtonRow = styled.div`
  display: flex;
`
