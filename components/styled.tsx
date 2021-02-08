import styled from "styled-components"

export const Panel = styled.div`
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2);
  overflow: hidden;
  height: fit-content;
  padding-bottom: var(--spacing-3);
`

export const PanelBody = styled.div`
  padding: var(--spacing-3) var(--spacing-1);
  display: grid;
  grid-gap: var(--spacing-4);
`

export const PanelHeader = styled.div`
  padding: var(--spacing-1);
  border-bottom: 1px solid var(--color-border);
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-background);

  & button {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`
