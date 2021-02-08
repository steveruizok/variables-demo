import uniqueId from "lodash/uniqueId"
import { coerceValue } from "utils"
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

/* ----------------- Initial Values ----------------- */

export interface IInitial {
  __type: "initial"
  id: string
  type: Type
  values: { [key in keyof ValueTypes]: ValueTypes[key] }
  variable?: string
}

export class Initial {
  static create<T extends Type>(opts: {
    id?: string
    type: T
    value: ValueTypes[T]
    variable?: string
  }): IInitial {
    const { id = uniqueId(), type, value, variable } = opts
    return {
      __type: "initial" as const,
      id,
      type,
      values: { ...defaultValues, [type]: value },
      variable,
    }
  }

  static getType(value: IInitial) {
    return value.type
  }

  static getValue(value: IInitial) {
    if (value.variable) {
      return Property.getValue(variables.get(value.variable)!)
    }
    return value.values[value.type]
  }

  static setType<T extends Type>(value: IInitial, type: T) {
    return (value.type = type)
  }

  static setValue<T extends Type>(
    value: IInitial,
    type: T,
    next: ValueTypes[T]
  ) {
    return (value.values[type] = next)
  }

  static setVariable(value: IInitial, variable?: string) {
    value.variable = variable
  }
}

/* ------------------ Enum Property ----------------- */

export interface IEnumerated<T extends string = string> {
  __type: "enumerated"
  id: string
  name: string
  value: T
  options: T[]
}

export class Enumerated {
  static create<T extends string>(opts: {
    id?: string
    name: string
    value: T
    options: T[]
  }): IEnumerated {
    const { id = uniqueId(), name, value, options } = opts
    return {
      __type: "enumerated" as const,
      id,
      name,
      value,
      options,
    }
  }

  static getValue(enumerated: IEnumerated) {
    return enumerated.value
  }

  static getType() {
    return "enum"
  }

  static setValue<K extends string, T extends IEnumerated<K>>(
    enumerated: T,
    value: K
  ) {
    enumerated.value = value
    return enumerated
  }
}

/* -------------------- Transform ------------------- */

export type TransformFn<I extends Type, O extends Type> = (
  value: ValueTypes[I],
  ...args: any[]
) => ValueTypes[O]

export interface ITransform<I extends Type = Type, O extends Type = Type> {
  __type: "transform"
  id: string
  name: TransformName
  inputType: I
  outputType: O
  fn: TransformFn<I, O>
  args: (IProperty | IEnumerated)[]
  returnedValue?: ValueTypes[O]
}

export class Transform {
  static create<I extends Type, O extends Type>(opts: {
    id?: string
    name: TransformName
    inputType: I
    outputType: O
    fn: TransformFn<I, O>
    args?: (IProperty | IEnumerated)[]
  }): ITransform<I, O> {
    const { id = uniqueId(), args = [], ...rest } = opts
    return {
      __type: "transform" as const,
      id,
      args,
      ...rest,
    }
  }

  static transformValue<I extends Type, O extends Type>(
    transform: ITransform<I, O>,
    value: ValueTypes[I]
  ) {
    const vals = transform.args.map((arg) =>
      arg.__type === "enumerated"
        ? Enumerated.getValue(arg)
        : Property.getValue(arg)
    )
    transform.returnedValue = transform.fn(value, ...vals)
    return transform.returnedValue
  }
}

/* -------------------- Property -------------------- */

interface IError {
  message: string
  index: number
}

interface IWarning {
  message: string
  index: number
}

export interface IProperty {
  __type: "property"
  id: string
  name: string
  isVariable: boolean
  initial: IInitial
  type: Type
  transforms: ITransform<Type, Type>[]
  error?: IError
  warning?: IWarning
}

export class Property {
  static create(opts: {
    id?: string
    isVariable?: boolean
    name: string
    initial: IInitial
    transforms?: ITransform<Type, Type>[]
  }): IProperty {
    const {
      id = uniqueId(),
      name,
      transforms = [],
      isVariable = false,
      initial,
    } = opts
    const property = {
      __type: "property" as const,
      id,
      name,
      type: Initial.getType(initial),
      isVariable,
      initial,
      transforms,
      finalType: undefined as Type | undefined,
      error: undefined as IError | undefined,
      warning: undefined as IWarning | undefined,
    }

    if (isVariable) {
      variables.set(id, property)
    } else {
      properties.set(id, property)
    }

    return property
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
    index: number
  ) {
    property.transforms.splice(index, 0, transform)
    return property
  }

  static removeTransform(
    property: IProperty,
    transform: ITransform<Type, Type>
  ) {
    property.transforms.splice(property.transforms.indexOf(transform), 1)
    return property
  }

  static moveTransform(
    property: IProperty,
    transform: ITransform<Type, Type>,
    index: number
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
      : Initial.getType(property.initial)
  }

  static getValue(property: IProperty): ValueTypes[Type] {
    property.error = undefined
    property.warning = undefined

    let current = {
      type: property.type,
      value: Initial.getValue(property.initial),
      warning: undefined as IWarning | undefined,
      error: undefined as IError | undefined,
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

    // Variables can have any final type, we don't have to handle
    // the case where the final transform does not return a value
    // of the "correct" final type.
    if (!property.isVariable && property.type !== result.type) {
      // Try to coerce the value into the correct type.
      property.warning = {
        index: -1,
        message: `Transforms produced a ${result.type} instead of a ${property.type}. We've converted this into the correct type.`,
      }

      try {
        switch (property.type) {
          case Type.Text:
            result.value = String(result.value)
          case Type.Number:
            result.value = Number(result.value)
          case Type.Boolean:
            result.value = Boolean(result.value)
        }
      } catch (e) {
        property.error = {
          message: "The transformed value is invalid.",
          index: property.transforms.length - 1,
        }
        result.value = property.initial.values[property.type]
      }
    }

    return result.value
  }

  static getType(property: IProperty) {
    return property.type
  }
}
