import styled from "styled-components"

export const Panel = styled.div`
  border: 1px solid rgba(144, 144, 144, 0.5);
  border-radius: 4px;
  overflow: hidden;
  height: fit-content;
  padding-bottom: 16px;
`

export const PanelBody = styled.div`
  padding: 8px;
`

export const PanelHeader = styled.div`
  padding: 8px;
  border-bottom: 1px solid rgba(144, 144, 144, 0.5);
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #ffffff;
`
