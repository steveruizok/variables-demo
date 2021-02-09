/* eslint-disable */
import * as React from "react"
import { VariablesList, PropertiesList } from "./lists"
import { Panel, PanelStack, PanelBody, PanelHeader, Button } from "./styled"
import state from "state"

export default function ContentPanel() {
  return (
    <PanelStack>
      <Panel>
        <PanelHeader>
          <h2>Properties</h2>
        </PanelHeader>
        <PanelBody>
          <PropertiesList />
        </PanelBody>
      </Panel>
      <Panel>
        <PanelHeader>
          <h2>Variables</h2>
        </PanelHeader>
        <PanelBody>
          <VariablesList />
          <hr />
          <Button
            title="Create new variable"
            onClick={() => state.send("CREATED_VARIABLE")}
          >
            Create New Variable
          </Button>
        </PanelBody>
      </Panel>
    </PanelStack>
  )
}
