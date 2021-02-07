/* eslint-disable */
import styled from "styled-components"
import * as System from "lib/system"
import state from "state"
import { useStateDesigner } from "@state-designer/react"
import { Panel, PanelBody, PanelHeader } from "./styled"
import { Star } from "react-feather"

export default function PreviewPanel() {
  const { data } = useStateDesigner(state)

  function getProperty(id: string) {
    return data.properties.get(id)!
  }

  function isActive(property: System.IProperty) {
    return data.selected === property.id
  }

  const title = getProperty("title")
  const author = getProperty("author")
  const stars = getProperty("stars")
  const starred = getProperty("starred")

  return (
    <PreviewContainer
      onClick={() =>
        state.send("SELECTED_PROPERTY", {
          property: undefined,
        })
      }
    >
      <PanelHeader>
        <h2>Preview</h2>
      </PanelHeader>
      <InnerContainer>
        <CardContainer onClick={(e) => e.stopPropagation()}>
          <h1>
            <Selectable
              isActive={isActive(title)}
              onClick={() =>
                state.send("SELECTED_PROPERTY", {
                  property: title,
                })
              }
            >
              {System.Property.getValue(title)}
            </Selectable>
          </h1>
          <hr />
          <DetailsRow>
            <Selectable
              isActive={isActive(author)}
              onClick={() =>
                state.send("SELECTED_PROPERTY", {
                  property: author,
                })
              }
            >
              By {System.Property.getValue(author)}
            </Selectable>
            <span>
              Stars{" "}
              <Selectable
                isActive={isActive(stars)}
                onClick={() =>
                  state.send("SELECTED_PROPERTY", {
                    property: stars,
                  })
                }
              >
                {System.Property.getValue(stars)}
              </Selectable>
            </span>
            <Selectable
              isActive={isActive(starred)}
              onClick={() =>
                state.send("SELECTED_PROPERTY", {
                  property: starred,
                })
              }
            >
              <Star
                fill={
                  System.Property.getValue(starred) ? "#000" : "transparent"
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
  background-color: #f9f9f9;
`

const Selectable = styled.button<{ isActive: boolean }>`
  all: unset !important;
  cursor: pointer !important;
  outline: ${({ isActive }) =>
    isActive ? "1px solid #2d5eff !important" : "auto"};
  &:hover {
    outline: 1px solid #2d5eff !important;
  }
`

const InnerContainer = styled(PanelBody)`
  display: flex;
  justify-content: center;
  padding: 24px;
`

const CardContainer = styled(Panel)`
  display: grid;
  width: 50%;
  min-width: 320px;
  background-color: #ffffff;
  padding: 8px;
`

const DetailsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  grid-gap: 8px;
  align-items: center;
`
