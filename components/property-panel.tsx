import * as React from "react"
import state from "state"
import PropertyEditor from "./property-editor"
import { Panel, PanelBody, PanelHeader } from "./styled"
import { useStateDesigner } from "@state-designer/react"
import { X } from "react-feather"

export default function PropertyPanel() {
  const {
    values: { selected },
  } = useStateDesigner(state)

  return selected ? (
    <Panel key={selected.id}>
      <PanelHeader>
        <h2>
          Selected {selected.__type === "variable" ? "Variable" : "Property"}
        </h2>
        <button onClick={() => state.send("CLEARED_SELECTION")}>
          <X size={16} />
        </button>
      </PanelHeader>
      <PropertyEditor key={selected.id} property={selected} />
    </Panel>
  ) : (
    <div>
      <PanelBody>Select a property or variable.</PanelBody>
    </div>
  )
}
