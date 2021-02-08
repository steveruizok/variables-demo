/* eslint-disable */
import styled from "styled-components"
import { System } from "lib"
import VariablePicker from "./variable-picker"
import TypeIcon from "./type-icon"
import state from "state"

interface InputProps<T = any> {
  disabled?: boolean
  readOnly?: boolean
  onChange?: (value: T) => void
  value: T
}

interface PropertyInputProps<T> extends InputProps<T> {
  label: string
  type?: System.Type
  variable?: System.ScopedReference
  showVariables?: boolean
  excludeVariable?: System.ScopedReference
  onVariableChange?: (variable?: System.Variable) => void
}

export function PropertyInput({
  label,
  value,
  type,
  variable,
  readOnly,
  disabled,
  showVariables = true,
  onVariableChange,
  excludeVariable,
  ...rest
}: PropertyInputProps<string | number | boolean>) {
  return (
    <InputContainer>
      <TypeIcon type={type || (typeof value as System.Type)} />
      <label>{label}</label>
      {variable ? (
        <VariableButton variable={variable} />
      ) : typeof value === "string" ? (
        <TextInput
          {...rest}
          value={value}
          disabled={disabled}
          readOnly={!!variable || readOnly}
        />
      ) : typeof value === "number" ? (
        <NumberInput
          {...rest}
          value={value}
          disabled={disabled}
          readOnly={!!variable || readOnly}
        />
      ) : (
        <BooleanInput
          {...rest}
          value={value}
          disabled={disabled}
          readOnly={!!variable || readOnly}
        />
      )}
      {showVariables && (
        <VariablePicker
          type={type}
          scope={variable?.scope}
          id={variable?.id}
          exclude={excludeVariable.id}
          onChange={onVariableChange}
        />
      )}
    </InputContainer>
  )
}

function NumberInput({
  value,
  disabled,
  readOnly,
  onChange,
}: InputProps<System.ValueTypes[System.Type.Number]>) {
  return (
    <input
      type="number"
      disabled={disabled}
      readOnly={readOnly}
      value={value}
      onChange={(e) => onChange?.(Number(e.target.value))}
    />
  )
}

function TextInput({
  value,
  disabled,
  readOnly,
  onChange,
}: InputProps<System.ValueTypes[System.Type.Text]>) {
  return (
    <textarea
      disabled={disabled}
      readOnly={readOnly}
      value={value}
      onChange={(e) => onChange?.(String(e.target.value))}
    />
  )
}

function BooleanInput({
  value,
  disabled,
  readOnly,
  onChange,
}: InputProps<System.ValueTypes[System.Type.Boolean]>) {
  return (
    <input
      type="checkbox"
      disabled={disabled}
      readOnly={readOnly}
      checked={value}
      onChange={(e) => onChange?.(Boolean(e.target.checked))}
    />
  )
}

interface EnumInputProps<T = any> extends InputProps<T> {
  label: string
  options: T[]
}

export function EnumInput({
  label,
  disabled,
  onChange,
  options,
  value,
}: EnumInputProps) {
  return (
    <InputContainer>
      <TypeIcon type={"enum"} />
      <label>{label}</label>
      <select
        disabled={disabled}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {options.map((option, i) => (
          <option key={i}>{option}</option>
        ))}
      </select>
    </InputContainer>
  )
}

interface RawTextInputProps {
  label: string
  value: string
}

export function RawTextInput({ label, value }: RawTextInputProps) {
  return (
    <InputContainer>
      <label>{label}</label>
      <p style={{ gridColumn: "span 3" }}>{value}</p>
    </InputContainer>
  )
}

interface VariableButtonProps {
  variable: System.ScopedReference
}

export function VariableButton({ variable }: VariableButtonProps) {
  const result = System.getVariable(variable)
  return (
    <StyledVariableButton
      onClick={() => state.send("SELECTED", { selection: result })}
    >
      {result.name}
    </StyledVariableButton>
  )
}

const StyledVariableButton = styled.button`
  text-align: left;
`

const InputContainer = styled.div`
  display: grid;
  padding: var(--spacing-3);
  align-items: center;
  grid-template-columns: auto 80px minmax(0, 1fr);
  grid-auto-columns: auto;
  grid-auto-flow: column;
  grid-gap: var(--spacing-1);

  &:nth-of-type(n + 2) {
    border-top: 1px solid var(--color-border);
  }
`
