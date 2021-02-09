/* eslint-disable */
import * as React from "react"
import styled from "styled-components"
import PropertyPanel from "components/property-panel"
import PreviewPanel from "components/preview-panel"
import ContentPanel from "components/content-panel"
import { Sun } from "react-feather"
import state from "state"
import { IconButton } from "./styled"

export default function App() {
  return (
    <AppContainer>
      <Header>
        <a href="https://github.com/steveruizok/variables-demo">Github</a>
        <IconButton
          onClick={() => state.send("TOGGLED_THEME")}
          title="Toggle theme"
        >
          <Sun size={16} />
        </IconButton>
      </Header>
      <PanelsContainer>
        <PreviewPanel />
        <Panels>
          <ContentPanel />
          <PropertyPanel />
        </Panels>
      </PanelsContainer>
    </AppContainer>
  )
}

const Panels = styled.div`
  display: grid;
  width: 100%;
  grid-gap: var(--spacing-4);
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
`

const PanelsContainer = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-gap: var(--spacing-4);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-1) 0 var(--spacing-3) 0;
`

const AppContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  font-family: sans-serif;
  font-size: var(--size-2);
  line-height: 1.3;
  margin-bottom: 128px;

  h2 {
    font-size: var(--size-2);
    margin: 0;
    padding: 0;
  }

  h3 {
    font-size: var(--size-0);
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    margin: 0;
    opacity: 0.7;
    padding: 0 var(--spacing-2) 0 var(--spacing-2);

    /* ::after {
      display: block;
      content: "";
      border-bottom: 1px solid var(--color-border-0);
      position: relative;
      top: calc(-0.75 * var(--size-0));
      margin: 0 calc(-1 * var(--spacing-4));
    } */
  }

  hr {
    margin: var(--spacing-1) calc(-1 * var(--spacing-2)) var(--spacing-1)
      calc(-1 * var(--spacing-2));
    border: none;
    border-top: 1px solid var(--color-border-0);
  }

  a {
    color: var(--color-text);
  }

  // Inputs (general)

  input,
  select,
  button,
  textarea {
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    border-radius: var(--radius-2);
    &:focus {
      outline: none;
      border: 1px solid var(--color-selection);
    }
  }

  input,
  select {
    background-color: var(--color-surface-3);
    padding: 0px var(--spacing-2);
    border: 1px solid var(--color-border-1);
  }

  // Select (enum)

  select {
    cursor: pointer;
    height: var(--size-3);
    appearance: none;

    &:disabled {
      border: 1px solid var(--color-surface-1);
      background-color: transparent;
    }

    &:hover:not(:disabled) {
      border: 1px solid var(--color-border-2);
    }
  }

  // Text

  textarea {
    border: 1px solid var(--color-border-1);
    padding: var(--spacing-1-5) var(--spacing-2);
    background-color: var(--color-surface-3);
    resize: none;
    line-height: 1.3;
    height: var(--size-3);

    &:read-only,
    :disabled {
      border: 1px solid transparent;
      background-color: transparent;
    }
    :hover:enabled:not(:read-only) {
      border: 1px solid var(--color-border-2);
    }
  }

  // Number

  input[type="number"] {
    text-align: right;
    height: var(--size-3);
    :hover:enabled:not(:read-only) {
      border: 1px solid var(--color-border-2);
    }
  }

  // Checkbox (boolean)

  input[type="checkbox"] {
    display: flex;
    align-items: center;
    height: var(--spacing-4);
    width: var(--spacing-4);
    padding: 0;
    margin: 0;
    cursor: pointer;
    &:hover:not(:checked)::after {
      border: 1px solid var(--color-border-2);
    }

    &:not(:checked)::after {
      content: "";
      box-sizing: border-box;
      display: block;
      height: var(--spacing-4);
      width: var(--spacing-4);
      background-color: var(--color-surface-3);
      border: 1px solid var(--color-border-1);
      border-radius: var(--radius-0);
    }
  }

  // Lists

  ul {
    list-style-type: none;
    padding-left: 0;
    display: grid;
    margin: 0;
    padding: 0;
    gap: var(--spacing-1);
  }

  & pre {
    font-weight: 500;
    overflow: scroll;
    border-radius: var(--radius-2);
    font-size: var(--size-1);
    font-family: "Roboto Mono", monospace;
    line-height: 1.5;
  }

  & code {
    line-height: inherit;
    font-size: inherit;
    font-family: inherit;
  }
`
