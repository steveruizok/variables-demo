import { uniqueId } from "lodash"
import { coerceValue } from "../utils"
import { TransformName } from "./transforms"

export enum Type {
  Text = "string",
  Number = "number",
  Boolean = "boolean",
}

export interface ValueTypes {
  [Type.Text]: string
  [Type.Number]: number
  [Type.Boolean]: boolean
}

export const defaultValues: ValueTypes = {
  [Type.Text]: "",
  [Type.Number]: 10,
  [Type.Boolean]: true,
}

const TypeToType = (type: Type) => {
  return type
}

const typeToType = (item: string | number | boolean) => {
  if (typeof item === "string") {
    return Type.Text
  }
  if (typeof item === "boolean") {
    return Type.Boolean
  }
  return Type.Number
}

export const properties = new Map<string, IProperty>([])
export const variables = new Map<string, IProperty>([])

/* ----------------- Natural Values ----------------- */

function createNatural<T extends Type>(opts: {
  id?: string
  type: T
  value: ValueTypes[T]
  variable?: string
}) {
  const { id = uniqueId(), type, value, variable } = opts
  return {
    id,
    type,
    values: { ...defaultValues, [type]: value },
    variable,
  }
}

export type INatural = ReturnType<typeof createNatural>

export class Natural {
  static create<T extends Type>(opts: {
    id?: string
    type: T
    value: ValueTypes[T]
    variable?: string
  }) {
    return createNatural(opts)
  }
  static getType(value: INatural) {
    return value.type
  }
  static getValue(value: INatural) {
    if (value.variable) {
      return Property.getValue(variables.get(value.variable)!)
    }
    return value.values[value.type]
  }
  static setType<T extends Type>(value: INatural, type: T) {
    return (value.type = type)
  }
  static setValue<T extends Type>(
    value: INatural,
    type: T,
    next: ValueTypes[T],
  ) {
    return (value.values[type] = next)
  }
  static setVariable(value: INatural, variable?: string) {
    value.variable = variable
  }
}

/* ------------------ Enum Property ----------------- */

function createEnumerated<T extends string>(opts: {
  id?: string
  name: string
  value: T
  options: T[]
}): IEnumerated<T> {
  const { id = uniqueId(), name, value, options } = opts
  return {
    id,
    name,
    type: "enum",
    value,
    options,
  }
}

export type IEnumerated<T extends string = string> = {
  id: string
  type: "enum"
  name: string
  value: T
  options: T[]
}

export class Enumerated {
  static getValue(enumerated: IEnumerated) {
    return enumerated.value
  }

  static getType() {
    return "enum"
  }

  static setValue<K extends string, T extends IEnumerated<K>>(
    enumerated: T,
    value: K,
  ) {
    enumerated.value = value
    return enumerated
  }

  static create<T extends string>(opts: {
    id?: string
    name: string
    value: T
    options: T[]
  }) {
    return createEnumerated(opts)
  }
}

/* -------------------- Transform ------------------- */

export type TransformFn<I extends Type, O extends Type> = (
  value: ValueTypes[I],
  ...args: any[]
) => ValueTypes[O]

export interface ITransform<I extends Type = Type, O extends Type = Type> {
  id: string
  name: TransformName
  inputType: I
  outputType: O
  fn: TransformFn<I, O>
  args: (IProperty | IEnumerated)[]
  returnedValue?: ValueTypes[O]
}

export type ITransformOpts<I extends Type, O extends Type> = {
  id?: string
  name: TransformName
  inputType: I
  outputType: O
  fn: TransformFn<I, O>
  args?: (IProperty | IEnumerated)[]
}

function createTransform<I extends Type, O extends Type>(
  opts: ITransformOpts<I, O>,
): ITransform<I, O> {
  const { id = uniqueId(), args = [], ...rest } = opts
  return { id, args, ...rest }
}

export class Transform {
  static create<I extends Type, O extends Type>(opts: ITransformOpts<I, O>) {
    return createTransform<I, O>(opts)
  }

  static transformValue<I extends Type, O extends Type>(
    transform: ITransform<I, O>,
    value: ValueTypes[I],
  ) {
    const vals = transform.args.map((arg) =>
      "type" in arg ? Enumerated.getValue(arg) : Property.getValue(arg),
    )
    transform.returnedValue = transform.fn(value, ...vals)
    return transform.returnedValue
  }
}

/* -------------------- Property -------------------- */

interface ValueError {
  message: string
  index: number
}

interface ValueWarning {
  message: string
  index: number
}

interface IPropertyOpts {
  id?: string
  isVariable?: boolean
  name: string
  initial: INatural
  transforms?: ITransform<Type, Type>[]
  finalTypes: Type[]
}

function createProperty(opts: IPropertyOpts) {
  const {
    id = uniqueId(),
    transforms = [],
    isVariable = false,
    name,
    initial,
    finalTypes,
  } = opts
  return {
    id,
    name,
    isVariable,
    initial,
    transforms,
    finalTypes,
    finalType: undefined as Type | undefined,
    error: undefined as ValueError | undefined,
    warning: undefined as ValueWarning | undefined,
  }
}

export type IProperty = ReturnType<typeof createProperty>

export class Property {
  static createProperty(opts: IPropertyOpts) {
    const property = createProperty({ ...opts, isVariable: false })
    properties.set(property.id, property)
    return property
  }

  static createVariable(opts: IPropertyOpts) {
    const variable = createProperty({ ...opts, isVariable: true })
    variables.set(variable.id, variable)
    return variable
  }

  static setName(property: IProperty, name: string) {
    property.name = name
  }

  static addTransform(property: IProperty, transform: ITransform<any, any>) {
    property.transforms.push(transform)
    return property
  }

  static insertTransform(
    property: IProperty,
    transform: ITransform<Type, Type>,
    index: number,
  ) {
    property.transforms.splice(index, 0, transform)
    return property
  }

  static removeTransform(
    property: IProperty,
    transform: ITransform<Type, Type>,
  ) {
    property.transforms.splice(property.transforms.indexOf(transform), 1)
    return property
  }

  static moveTransform(
    property: IProperty,
    transform: ITransform<Type, Type>,
    index: number,
  ) {
    property.transforms.splice(property.transforms.indexOf(transform), 1)
    property.transforms.splice(index, 0, transform)
    return property
  }

  static getTransformedType(property: IProperty): Type {
    return property.transforms.length > 0
      ? (property.transforms[property.transforms.length - 1].outputType as Type)
      : property.initial.variable
      ? Property.getTransformedType(variables.get(property.initial.variable)!)
      : Natural.getType(property.initial)
  }

  static getValue(property: IProperty): ValueTypes[Type] {
    property.error = undefined
    property.warning = undefined
    property.finalType = undefined

    let current = {
      type: Natural.getType(property.initial),
      value: Natural.getValue(property.initial),
      warning: undefined as ValueWarning | undefined,
      error: undefined as ValueError | undefined,
    }

    property.transforms.forEach((transform, index) => {
      if (current.error) return

      let val = current.value

      try {
        // If the input type is wrong, try to coerce it to the correct type.
        if (current.type !== transform.inputType) {
          val = coerceValue(transform.inputType, val)
          current.warning = {
            message: `Transform expected a ${transform.inputType} value but received a ${current.type} value instead.`,
            index,
          }
        }

        // Get the transformed value.
        const value = Transform.transformValue(transform, val)

        // Handle errors
        if (typeof value === "number") {
          if (!isFinite(value) || isNaN(value)) {
            current = {
              ...current,
              error: { message: "Invalid number type: " + value, index },
            }
          }
        } else if (value === "undefined" || value === null) {
          current = {
            ...current,
            error: { message: "No output value.", index },
          }
        }

        current = {
          type: transform.outputType,
          value,
          error: undefined,
          warning: undefined,
        }
      } catch (e) {
        // Some JavaScript error has occurred (ie Number.split is not a function).
        return {
          ...current,
          error: { message: "Found error: " + e.message, index },
        }
      }
    })

    const result = current

    property.error = result.error

    if (!property.finalTypes.includes(result.type)) {
      // Try to coerce the value into the correct type.
      property.warning = {
        index: -1,
        message: `Transforms produced a ${result.type} instead of a ${property.finalTypes}. We've converted this into the correct type.`,
      }

      for (let t of property.finalTypes) {
        if (t === Type.Text) {
          try {
            property.finalType = Type.Text
            return String(result.value)
          } catch (e) {}
        } else if (t === Type.Number) {
          try {
            property.finalType = Type.Number
            return Number(result.value)
          } catch (e) {}
        } else if (t === Type.Boolean) {
          try {
            property.finalType = Type.Boolean
            return Boolean(result.value)
          } catch (e) {}
        }
      }

      if (!property.finalType) {
        property.finalType = Natural.getType(property.initial)
        property.error = {
          message: "The transformed value is invalid.",
          index: property.transforms.length - 1,
        }
        return Natural.getValue(property.initial)
      }
    }

    property.finalType = result.type
    return result.value
  }

  static getType(property: IProperty) {
    Property.getValue(property)
    return property.finalType as Type
  }
}
