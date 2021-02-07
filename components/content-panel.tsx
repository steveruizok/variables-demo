/* eslint-disable */
import * as React from "react"
import { VariablesList, PropertiesList } from "./lists"
import { Panel, PanelBody, PanelHeader } from "./styled"

export default function ContentPanel() {
  return (
    <Panel>
      <PanelHeader>
        <h2>Content</h2>
      </PanelHeader>
      <PanelBody>
        <h3 style={{ marginTop: 0, borderTop: "none" }}>Properties</h3>
        <PropertiesList />
      </PanelBody>
      <PanelBody>
        <h3>Variables</h3>
        <VariablesList />
      </PanelBody>
    </Panel>
  )
}
