/* eslint-disable */
import * as React from "react"
import { VariablesList, PropertiesList } from "./lists"
import { Panel, PanelBody, PanelHeader } from "./styled"
import styled from "styled-components"
import state from "state"

export default function ContentPanel() {
  return (
    <Panel>
      <PanelHeader>
        <h2>Content</h2>
      </PanelHeader>
      <PanelBody>
        <h3>Properties</h3>
        <PropertiesList />
        <h3>Variables</h3>
        <VariablesList />
        <AddNewButton onClick={() => state.send("CREATED_VARIABLE")}>
          Create New Variable
        </AddNewButton>
      </PanelBody>
    </Panel>
  )
}

const AddNewButton = styled.button`
  width: 100%;
`
