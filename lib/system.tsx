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

export type Properties = Map<string, Map<string, IProperty>>
export type Variables = Map<string, Map<string, IVariable>>

export const tables = {
  properties: new Map([
    ["global", new Map<string, IProperty>([])],
  ]) as Properties,
  variables: new Map([["global", new Map<string, IVariable>([])]]) as Variables,
}

export interface ScopedReference {
  scope: string
  id: string
}

export function getVariable(ref: ScopedReference) {
  return tables.variables.get(ref.scope).get(ref.id)
}

export function getProperty(ref: ScopedReference) {
  return tables.properties.get(ref.scope).get(ref.id)
}

/* ----------------- Initial Values ----------------- */

export interface IInitial {
  __type: "initial"
  id: string
  type: Type
  values: { [key in keyof ValueTypes]: ValueTypes[key] }
  variable?: ScopedReference
}

export class Initial {
  static create<T extends Type>(opts: {
    id?: string
    type: T
    value: ValueTypes[T]
    variable?: ScopedReference
  }): IInitial {
    const { id = uniqueId(String(Date.now())), type, value, variable } = opts
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

  static getValue(value: IInitial, visited: string[] = []) {
    if (value.variable) {
      if (visited.includes(value.variable.id)) {
        throw Error("Found a reference loop!")
      }
      return Variable.getValue(getVariable(value.variable), visited)
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

  static setVariable(value: IInitial, variable?: ScopedReference) {
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
    const { id = uniqueId(String(Date.now())), name, value, options } = opts
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
  scope: string
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
    scope: string
    fn: TransformFn<I, O>
    args?: (IProperty | IEnumerated)[]
  }): ITransform<I, O> {
    const { id = uniqueId(String(Date.now())), args = [], ...rest } = opts
    return {
      __type: "transform" as const,
      id,
      args,
      ...rest,
    }
  }

  static transformValue<I extends Type, O extends Type>(
    transform: ITransform<I, O>,
    value: ValueTypes[I],
    visited: string[]
  ) {
    const vals = transform.args.map((arg) => {
      if (arg.__type === "enumerated") {
        return Enumerated.getValue(arg)
      }
      const value = Property.getValue(arg, visited)
      if (arg.error) {
        throw arg.error.message
      }
      return value
    })
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

export interface IPropertyBase {
  id: string
  name: string
  scope: string
  initial: IInitial
  transforms: ITransform<Type, Type>[]
  error?: IError
  warning?: IWarning
}

export interface IProperty extends IPropertyBase {
  __type: "property"
  type: Type
}

export interface IVariable extends IPropertyBase {
  __type: "variable"
}

export class PropertyBase {
  static setName(property: IProperty | IVariable, name: string) {
    property.name = name
  }

  static addTransform(
    property: IProperty | IVariable,
    transform: ITransform<any, any>
  ) {
    property.transforms.push(transform)
    return property
  }

  static insertTransform(
    property: IProperty | IVariable,
    transform: ITransform<Type, Type>,
    index: number
  ) {
    property.transforms.splice(index, 0, transform)
    return property
  }

  static removeTransform(
    property: IProperty | IVariable,
    transform: ITransform<Type, Type>
  ) {
    property.transforms.splice(property.transforms.indexOf(transform), 1)
    return property
  }

  static moveTransform(
    property: IProperty | IVariable,
    transform: ITransform<Type, Type>,
    index: number
  ) {
    property.transforms.splice(property.transforms.indexOf(transform), 1)
    property.transforms.splice(index, 0, transform)
    return property
  }

  static getTransformedType(property: IProperty | IVariable): Type {
    return property.transforms.length > 0
      ? (property.transforms[property.transforms.length - 1].outputType as Type)
      : property.initial.variable
      ? Property.getTransformedType(getVariable(property.initial.variable))
      : Initial.getType(property.initial)
  }

  static getType(property: IProperty | IVariable) {
    return Initial.getType(property.initial)
  }

  static getValue(
    property: IProperty | IVariable,
    visited: string[] = []
  ): ValueTypes[Type] {
    property.error = undefined
    property.warning = undefined

    let current = {
      type: Initial.getType(property.initial),
      value: undefined as any,
      warning: undefined as IWarning | undefined,
      error: undefined as IError | undefined,
    }

    const path = [...visited, property.id]

    try {
      current.value = Initial.getValue(property.initial, path)
    } catch (e) {
      property.error = {
        index: -1,
        message: `This property includes a variable reference loop! Double check that variables aren't referencing eachother.`,
      }
      return property.initial.values[property.initial.type]
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
        let value: any

        value = Transform.transformValue(transform, val, visited)

        // Handle errors
        if (typeof value === "number") {
          if (!isFinite(value) || isNaN(value)) {
            throw Error("Invalid number type: " + value)
          }
        } else if (value === undefined || value === null) {
          throw Error("No output value.")
        }

        current.type = transform.outputType
        current.value = value
      } catch (e) {
        // Some JavaScript error has occurred (ie Number.split is not a function).
        property.error = { message: e, index }
      }
    })

    // Variables can have any final type, we don't have to handle
    // the case where the final transform does not return a value
    // of the "correct" final type.
    if (property.__type === "property" && property.type !== current.type) {
      // Try to coerce the value into the correct type.
      property.warning = {
        index: -1,
        message: `Transforms produced a ${current.type} instead of a ${property.type}. We've converted this into the correct type.`,
      }

      try {
        switch (property.type) {
          case Type.Text:
            current.value = String(current.value)
            break
          case Type.Number:
            current.value = Number(current.value)
            break
          case Type.Boolean:
            current.value = Boolean(current.value)
            break
        }
      } catch (e) {
        property.error = {
          message: "The transformed value is invalid: " + e.message,
          index: property.transforms.length - 1,
        }
        current.value = property.initial.values[property.type]
      }
    }

    return current.value
  }
}

export class Property extends PropertyBase {
  static create(opts: {
    id?: string
    scope?: string
    name: string
    initial: IInitial
    transforms?: ITransform<Type, Type>[]
  }): IProperty {
    const {
      id = uniqueId(String(Date.now())),
      name,
      scope = "global",
      transforms = [],
      initial,
    } = opts

    const property = {
      __type: "property" as const,
      id,
      scope,
      name,
      type: Initial.getType(initial),
      initial,
      transforms,
    }
    if (!tables.properties.has(scope)) {
      tables.properties.set(scope, new Map([]))
    }

    tables.properties.get(scope).set(id, property)
    return property
  }
}

export class Variable extends PropertyBase {
  static create(opts: {
    id?: string
    scope: string
    name: string
    initial: IInitial
    transforms?: ITransform<Type, Type>[]
  }): IVariable {
    const {
      id = uniqueId(String(Date.now())),
      name,
      scope,
      transforms = [],
      initial,
    } = opts

    const variable = {
      __type: "variable" as const,
      id,
      scope,
      name,
      initial,
      transforms,
    }

    if (!tables.variables.has(scope)) {
      tables.variables.set(scope, new Map([]))
    }

    tables.variables.get(scope).set(id, variable)
    return variable
  }
}
