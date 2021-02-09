import styled from "styled-components"

export const Panel = styled.div`
  border: 1px solid var(--color-border-0);
  border-radius: var(--radius-2);
  overflow: hidden;
  height: fit-content;
  background-color: var(--color-surface-0);
`

export const PanelStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
`

export const PanelBody = styled.div`
  padding: var(--spacing-3) var(--spacing-2);
  display: grid;
  grid-gap: var(--spacing-4);
  grid-auto-columns: minmax(0, 1fr);
  border-top: 1px solid var(--color-border-0);
`

export const PanelHeader = styled.div`
  background-color: var(--color-surface-0);
  padding: var(--spacing-1) var(--spacing-2);
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const InputsContainer = styled.div`
  border: 1px solid var(--color-border-0);
  background-color: var(--color-surface-1);
  border-radius: var(--radius-2);
`

export const Button = styled.button<{
  hasError?: boolean
  isSelected?: boolean
}>`
  cursor: pointer;
  border: 1px solid var(--color-border-0);
  padding: var(--spacing-3) var(--spacing-2);
  position: relative;
  display: grid;
  align-items: center;
  overflow: hidden;
  width: 100%;
  white-space: nowrap;
  border-radius: var(--radius-2);
  background-color: ${({ hasError = false, isSelected = false }) =>
    hasError
      ? "var(--color-error-0)"
      : isSelected
      ? "var(--color-surface-2)"
      : "var(--color-surface-1)"};

  :hover {
    border: 1px solid var(--color-border-2);
  }

  :active {
    background-color: var(--color-surface-2);
  }
`

export const IconButton = styled.button`
  cursor: pointer;
  height: var(--size-3);
  width: var(--size-3);
  border: none;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: var(--color-shadow-2);
  }
`

export const IconSelect = styled.div`
  height: var(--size-3);
  width: var(--size-3);
  background-color: transparent;
  border-radius: var(--radius-2);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px solid transparent;

  &:hover {
    background-color: var(--color-shadow-2);
  }

  & > select {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  & > div {
    pointer-events: none;
  }
`

export const Select = styled.select``
