import * as React from "react"
import state from "state"
import PropertyEditor from "./property-editor"
import { Panel, PanelHeader } from "./styled"
import { useStateDesigner } from "@state-designer/react"
import { X } from "react-feather"

export default function PropertyPanel() {
  const {
    values: { selected },
  } = useStateDesigner(state)

  return selected ? (
    <Panel>
      <PanelHeader>
        <h2>Selected {selected.isVariable ? "Variable" : "Property"}</h2>
        <button onClick={() => state.send("CLEARED_SELECTION")}>
          <X size={16} />
        </button>
      </PanelHeader>
      <PropertyEditor property={selected} />
    </Panel>
  ) : (
    <div>
      <p>Select a property or variable.</p>
    </div>
  )
}
