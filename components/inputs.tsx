/* eslint-disable */
import styled from "styled-components"
import { System } from "lib"
import VariablePicker from "./variable-picker"
import TypeIcon from "./type-icon"
import state from "state"
import { Edit } from "react-feather"
import { IconButton, Button, Select } from "./styled"

interface InputProps<T = any> {
  disabled?: boolean
  readOnly?: boolean
  onChange?: (value: T) => void
  property?: System.IProperty
  value: T
}

interface PropertyInputProps<T> extends InputProps<T> {
  label: string
  type?: System.Type
  variable?: System.ScopedReference
  showVariables?: boolean
  excludeVariable?: System.ScopedReference
  onVariableChange?: (variable?: System.Variable) => void
  onTransformDetach: () => void
  onVariableDetach?: () => void
  onEdit?: () => void
}

export function PropertyInput({
  label,
  type,
  value,
  variable,
  readOnly,
  disabled,
  showVariables = true,
  onEdit,
  onTransformDetach,
  onVariableChange,
  onVariableDetach,
  excludeVariable,
  property,
  ...rest
}: PropertyInputProps<string | number | boolean>) {
  return (
    <InputContainer label={label}>
      <TypeIcon type={type || (typeof value as System.Type)} />
      {label}
      {property?.transforms.length > 0 ? (
        <StyledTransformButton onClick={onEdit}>{value}</StyledTransformButton>
      ) : variable ? (
        <VariableButton variable={variable} />
      ) : typeof value === "string" ? (
        <TextInput
          {...rest}
          property={property}
          value={value}
          disabled={disabled}
          readOnly={!!variable || readOnly}
        />
      ) : typeof value === "number" ? (
        <NumberInput
          {...rest}
          property={property}
          value={value}
          disabled={disabled}
          readOnly={!!variable || readOnly}
        />
      ) : (
        <BooleanInput
          {...rest}
          property={property}
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
          onDetach={onVariableDetach}
        />
      )}
      {onEdit && (
        <IconButton onClick={onEdit}>
          <Edit size={16} />
        </IconButton>
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
      onChange={(e) => onChange?.(e.target.value ? String(e.target.value) : "")}
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
    <BooleanInputContainer>
      <input
        type="checkbox"
        disabled={disabled}
        readOnly={readOnly}
        checked={value}
        onChange={(e) => onChange?.(Boolean(e.target.checked))}
      />
    </BooleanInputContainer>
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
    <InputContainer label={label}>
      <TypeIcon type={"enum"} />
      <label>{label}</label>
      <Select
        disabled={disabled}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {options.map((option, i) => (
          <option key={i}>{option}</option>
        ))}
      </Select>
    </InputContainer>
  )
}

interface RawTextInputProps {
  label: string
  value: string
}

export function RawTextInput({ label, value }: RawTextInputProps) {
  return (
    <InputContainer label={label}>
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
      title="Select variable"
      onClick={() => state.send("SELECTED", { selection: result })}
    >
      {result.name}
    </StyledVariableButton>
  )
}

const StyledTransformButton = styled(Button)`
  color: var(--color-transformed) !important;
  height: var(--size-3);
  padding: 0;
`

const StyledVariableButton = styled(Button)`
  text-align: left;
  padding: var(--spacing-1-5) var(--spacing-2);
  height: var(--size-3);
  background-color: var(--color-surface-1);
  color: var(--color-variable) !important;
`

const BooleanInputContainer = styled.div`
  display: flex;
  height: var(--size-3);
  align-items: center;
  justify-content: flex-end;
`

const InputContainer = styled.div<{ label?: string }>`
  display: grid;
  padding: var(--spacing-3) var(--spacing-2);
  align-items: center;
  text-align: left;
  grid-template-columns: ${({ label }) =>
    !!label ? "auto 80px minmax(0, 1fr)" : "auto minmax(0, 1fr)"};
  grid-auto-columns: auto;
  grid-auto-flow: column;
  grid-gap: var(--spacing-1);

  &:nth-of-type(n + 2) {
    border-top: 1px solid var(--color-border-0);
  }
`
