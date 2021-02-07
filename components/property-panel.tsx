import * as React from "react"
import state from "state"
import PropertyEditor from "./property-editor"
import { Panel, PanelHeader } from "./styled"
import { useStateDesigner } from "@state-designer/react"

export default function PropertyPanel() {
  const {
    values: { selected },
  } = useStateDesigner(state)

  return selected ? (
    <Panel>
      <PanelHeader>
        <h2>Selected {selected.isVariable ? "Variable" : "Property"}</h2>
      </PanelHeader>
      <PropertyEditor property={selected} />
    </Panel>
  ) : (
    <div>
      <p>Select a property or variable.</p>
    </div>
  )
}
