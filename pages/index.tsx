/* eslint-disable */
import * as React from "react"
import styled from "styled-components"
import PropertyPanel from "components/property-panel"
import PreviewPanel from "components/preview-panel"
import ContentPanel from "components/content-panel"
import state from "state"

export default function App() {
  React.useEffect(() => {
    function clearSelection() {
      state.send("SELECTED_PROPERTY", { property: undefined })
    }
    document.body.addEventListener("click", clearSelection)
    return () => {
      document.body.removeEventListener("click", clearSelection)
    }
  }, [])

  return (
    <PanelsContainer onClick={(e) => e.stopPropagation()}>
      <PreviewPanel />
      <Panels>
        <ContentPanel />
        <PropertyPanel />
      </Panels>
    </PanelsContainer>
  )
}

const PanelsContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-auto-columns: 1fr;
  font-size: 1em;
  font-family: sans-serif;
  grid-gap: 24px;

  h2 {
    font-size: 1em;
    margin: 0;
    padding: 0;
  }

  h3 {
    font-size: 0.8em;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 16px 8px 16px 8px;
    margin: 16px -8px 0 -8px;
    opacity: 0.7;
    border-top: 1px solid rgba(144, 144, 144, 0.5);
    /*
    border-bottom: 1px solid rgba(144, 144, 144, .5);
    background-color: rgba(0, 0, 0, 0.025); */
  }

  hr {
    margin: 8px -8px 16px -8px;
    border: none;
    border-top: 1px solid rgba(144, 144, 144, 0.5);
  }

  input,
  select,
  button,
  textarea {
    height: 40px;
    font-family: sans-serif;
    line-height: 1.3;
    font-size: 1em;
    border: 1px solid #000;
    border-radius: 4px;
    min-height: 40px;
  }

  button,
  select {
    cursor: pointer;
  }

  input,
  button {
    padding: 0px 12px;
  }

  input,
  select,
  textarea {
    background-color: #fff;
  }

  select {
    padding: 0px 8px;
  }

  textarea {
    padding: 10px;
    resize: none;
  }

  input[type="checkbox"] {
    display: flex;
    align-items: center;
    height: 24px;
    width: 24px;
    padding: 0;
    margin: 0;
    cursor: pointer;

    &::after {
      content: "";
      box-sizing: border-box;
      display: block;
      height: 24px;
      width: 24px;
      background-color: #fff;
      border: 1px solid #000;
      border-radius: 2px;
    }

    &:checked {
      &::after {
        content: "";
        box-sizing: border-box;
        display: block;
        height: 24px;
        width: 24px;
        background-color: #767677;
        border: 1px solid #000;
        border-radius: 2px;
      }
    }
  }

  ul {
    list-style-type: none;
    padding-left: 0;
    display: grid;
    margin: 0;
    gap: 8px;
  }
`

const Panels = styled.div`
  display: grid;
  width: 100%;
  grid-gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
`
