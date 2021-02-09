import styled from "styled-components"

export const Panel = styled.div`
  border: 1px solid var(--color-border-0);
  border-radius: var(--radius-2);
  overflow: hidden;
  height: fit-content;
  background-color: var(--color-surface-0);
`

export const PanelBody = styled.div`
  padding: var(--spacing-3) var(--spacing-2);
  display: grid;
  grid-gap: var(--spacing-4);
  grid-auto-columns: minmax(0, 1fr);
`

export const PanelHeader = styled.div`
  background-color: var(--color-surface-0);
  padding: var(--spacing-1);
  border-bottom: 1px solid var(--color-border-0);
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const InputContainer = styled.div`
  display: grid;
  padding: var(--spacing-3) var(--spacing-2);
  align-items: center;
  grid-template-columns: auto 80px minmax(0, 1fr);
  grid-auto-columns: auto;
  grid-auto-flow: column;
  grid-gap: var(--spacing-1);

  &:nth-of-type(n + 2) {
    border-top: 1px solid var(--color-border-0);
  }
`

export const InputsContainer = styled.div`
  border: 1px solid var(--color-border-0);
  background-color: var(--color-surface-1);
  border-radius: var(--radius-2);
`

export const Button = styled.button<{
  hasError?: boolean
  isActive?: boolean
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
  background-color: ${({ hasError = false, isActive = false }) =>
    hasError
      ? "var(--color-error-0)"
      : isActive
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
