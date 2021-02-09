/* eslint-disable */
import * as React from "react"
import { VariablesList, PropertiesList } from "./lists"
import { Panel, PanelBody, PanelHeader, Button } from "./styled"
import styled from "styled-components"
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
          <Button onClick={() => state.send("CREATED_VARIABLE")}>
            Create New Variable
          </Button>
        </PanelBody>
      </Panel>
    </PanelStack>
  )
}

const PanelStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
`
