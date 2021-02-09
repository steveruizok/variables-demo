/* eslint-disable */
import styled from "styled-components"
import { System } from "lib"
import state from "state"
import { useStateDesigner } from "@state-designer/react"
import { Panel, PanelBody, PanelHeader } from "./styled"
import { Star } from "react-feather"

export default function PreviewPanel() {
  const { data, values } = useStateDesigner(state)

  function getProperty(id: string) {
    return data.properties["global"][id]
  }

  function isActive(property: System.IProperty | System.IVariable) {
    return values.selected?.id === property.id
  }

  const title = getProperty("title")
  const author = getProperty("author")
  const stars = getProperty("stars")
  const starred = getProperty("starred")

  return (
    <PreviewContainer onClick={() => state.send("CLEARED_SELECTION")}>
      <PanelHeader>
        <h2>Preview</h2>
      </PanelHeader>
      <InnerContainer>
        <CardContainer onClick={(e) => e.stopPropagation()}>
          <h1>
            <Selectable
              isActive={isActive(title)}
              onClick={() =>
                state.send("SELECTED", {
                  selection: title,
                })
              }
            >
              {System.Property.getValue(title)}
            </Selectable>
          </h1>
          <hr />
          <DetailsRow>
            <div>
              By{" "}
              <Selectable
                isActive={isActive(author)}
                onClick={() =>
                  state.send("SELECTED", {
                    selection: author,
                  })
                }
              >
                {System.Property.getValue(author)}
              </Selectable>
            </div>
            <span>
              Stars{" "}
              <Selectable
                isActive={isActive(stars)}
                onClick={() =>
                  state.send("SELECTED", {
                    selection: stars,
                  })
                }
              >
                {System.Property.getValue(stars)}
              </Selectable>
            </span>
            <Selectable
              isActive={isActive(starred)}
              onClick={() =>
                state.send("SELECTED", {
                  selection: starred,
                })
              }
            >
              <Star
                fill={
                  System.Property.getValue(starred)
                    ? "var(--color-text)"
                    : "transparent"
                }
              />
            </Selectable>
          </DetailsRow>
        </CardContainer>
      </InnerContainer>
    </PreviewContainer>
  )
}

const PreviewContainer = styled(Panel)`
  background-color: var(--color-surface-1);
`

const InnerContainer = styled(PanelBody)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 280px;
`

const CardContainer = styled(Panel)`
  display: grid;
  width: 50%;
  min-width: 320px;
  background-color: var(--color-background);
  padding: var(--spacing-1);
`

const DetailsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  grid-gap: var(--spacing-1);
  align-items: center;
`

const Selectable = styled.button<{ isActive: boolean }>`
  all: unset !important;
  cursor: pointer !important;
  outline: ${({ isActive }) =>
    isActive ? "1px solid var(--color-selection) !important" : "auto"};
  &:hover {
    outline: 1px solid var(--color-selection) !important;
  }
`
