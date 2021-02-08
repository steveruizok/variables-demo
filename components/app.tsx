/* eslint-disable */
import * as React from "react"
import styled from "styled-components"
import PropertyPanel from "components/property-panel"
import PreviewPanel from "components/preview-panel"
import ContentPanel from "components/content-panel"

export default function App() {
  return (
    <AppContainer>
      <p>
        <a href="https://github.com/steveruizok/variables-demo">Github</a>
      </p>
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
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-auto-columns: 1fr;
  grid-gap: var(--spacing-4);
`

const AppContainer = styled.div`
  font-family: sans-serif;
  font-size: var(--size-2);

  h2 {
    font-size: var(--size-2);
    margin: 0;
    padding: 0;
  }

  h3 {
    font-size: var(--size-1);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0;
    padding: 0;
    padding-top: var(--spacing-1);
    opacity: 0.7;
  }

  hr {
    margin: var(--spacing-1) -var(--spacing-1) var(--spacing-3) -var(
        --spacing-1
      );
    border: none;
    border-top: 1px solid var(--color-border);
  }

  input,
  select,
  button,
  textarea {
    height: var(--height-input);
    font-family: sans-serif;
    line-height: 1.3;
    font-size: var(--size-2);
    border: 1px solid var(--color-text);
    border-radius: var(--radius-2);
    min-height: var(--height-input);
  }

  button,
  select {
    cursor: pointer;
  }

  pre {
    font-weight: 500;
    overflow: scroll;
    border-radius: var(--radius-2);
    font-size: var(--size-1);

    code {
      font-family: "Roboto Mono", monospace;
    }
  }

  input,
  button {
    padding: 0px var(--spacing-2);
  }

  textarea:read-only,
  textarea:disabled {
    border: 1px solid var(--color-input);
  }

  input,
  select,
  textarea {
    background-color: var(--color-background);
  }

  select {
    padding: 0px var(--spacing-1);
  }

  textarea {
    padding: var(--spacing-1-5);
    resize: none;
  }

  input[type="checkbox"] {
    display: flex;
    align-items: center;
    height: var(--spacing-4);
    width: var(--spacing-4);
    padding: 0;
    margin: 0;
    cursor: pointer;

    &::after {
      content: "";
      box-sizing: border-box;
      display: block;
      height: var(--spacing-4);
      width: var(--spacing-4);
      background-color: var(--color-background);
      border: 1px solid var(--color-text);
      border-radius: var(--radius-0);
    }

    &:checked {
      &::after {
        content: "";
        box-sizing: border-box;
        display: block;
        height: var(--spacing-4);
        width: var(--spacing-4);
        background-color: var(--color-shade-0);
        border: 1px solid var(--color-text);
        border-radius: var(--radius-0);
      }
    }
  }

  ul {
    list-style-type: none;
    padding-left: 0;
    display: grid;
    margin: 0;
    padding: 0;
    gap: var(--spacing-1);
  }
`
