import { createState, createSelectorHook } from "@state-designer/react"
import { System } from "./lib"
import {
  Type,
  Initial,
  Variable,
  IVariable,
  Property,
  IProperty,
  ITransform,
  ValueTypes,
  IEnumerated,
  Enumerated,
} from "./lib/system"
import * as Transforms from "./lib/transforms"
import { coerceValue } from "./utils"

export type Data = {
  version: number
  selected?: System.ScopedReference
  properties: System.Properties
  variables: System.Variables
}

export const initialData: Data = {
  version: 32,
  selected: undefined,
  properties: new Map([
    [
      "global",
      new Map([
        [
          "title",
          Property.create({
            id: "title",
            name: "Title",
            scope: "global",
            initial: Initial.create({
              type: Type.Text,
              value: "Six Headlines to Read in 2021",
            }),
          }),
        ],
        [
          "author",
          Property.create({
            id: "author",
            name: "Author",
            scope: "global",
            initial: Initial.create({
              type: Type.Text,
              value: "Anonymous",
            }),
          }),
        ],
        [
          "stars",
          Property.create({
            id: "stars",
            name: "Stars",
            scope: "global",
            initial: Initial.create({
              type: Type.Number,
              value: 0,
            }),
          }),
        ],
        [
          "starred",
          Property.create({
            id: "starred",
            name: "Starred",
            scope: "global",
            initial: Initial.create({
              type: Type.Boolean,
              value: false,
            }),
          }),
        ],
      ]),
    ],
  ]),
  variables: new Map([
    [
      "global",
      new Map<string, IVariable>([
        // [
        //   "firstName",
        //   Variable.create({
        //     id: "firstName",
        //     scope: "global",
        //     name: "Starred",
        //     initial: Initial.create({
        //       type: Type.Boolean,
        //       value: false,
        //     }),
        //   }),
        // ],
      ]),
    ],
  ]),
}

// Load local saved data

if (typeof window !== "undefined") {
  const local = JSON.parse(localStorage.getItem("play_vars") || "{}")

  if (local.version === initialData.version) {
    const { variables, properties } = initialData

    variables.clear()
    properties.clear()

    for (let { name, members } of local.properties) {
      properties.set(
        name,
        new Map(
          members.map((member) => {
            member.transforms.forEach((transform: ITransform) => {
              const source = Transforms.getTransform(transform.name, "temp")
              transform.fn = source.fn as any
            })
            return [member.id, member]
          })
        )
      )
    }

    for (let { name, members } of local.variables) {
      variables.set(
        name,
        new Map(
          members.map((member) => {
            member.transforms.forEach((transform: ITransform) => {
              const source = Transforms.getTransform(transform.name, "temp")
              transform.fn = source.fn as any
            })
            return [member.id, member]
          })
        )
      )
    }

    System.tables.variables = variables
    System.tables.properties = properties

    initialData.selected = local.selected
  }
}

const state = createState({
  data: initialData,
  on: {
    RESTORED_PROPERTY: "restoreProperty",
    RESTORED_VARAIBLE: "restoreVariable",
    SELECTED: "select",
    CLEARED_SELECTION: "clearSelectedProperty",
    CHANGED_NAME: "changeName",
    CHANGED_INITIAL_TYPE: "changeInitialType",
    CHANGED_INITIAL_VALUE: "changeInitialValue",
    CHANGED_ENUM_VALUE: "changeEnumValue",
    ADDED_TRANSFORM: "addTransform",
    REMOVED_TRANSFORM: "removeTransform",
    MOVED_TRANSFORM: "moveTransform",
    DUPLICATED_TRANSFORM: "duplicateTransform",
    SELECTED_VARIABLE: "selectInitialVariable",
    DETACHED_VARIABLE: "detatchInitialVariable",
    CREATED_VARIABLE: "createVariable",
    DELETED_VARIABLE: "deleteVariable",
  },
  actions: {
    select(data, payload: { selection: IProperty | IVariable }) {
      const { selection } = payload
      data.selected = {
        __type: selection.__type,
        scope: selection.scope,
        id: selection.id,
      }
    },
    clearSelectedProperty(data) {
      data.selected = undefined
    },
    changeName(
      _,
      payload: {
        property: IVariable
        name: string
      }
    ) {
      const { property, name } = payload
      Variable.setName(property, name)
    },
    changeInitialType(
      _,
      payload: {
        property: IProperty | IVariable
        type: Type
      }
    ) {
      const { property, type } = payload
      Initial.setType(property.initial, type)
    },
    changeInitialValue(
      _,
      payload: {
        property: IProperty | IVariable
        value: ValueTypes[Type]
      }
    ) {
      const { property, value } = payload
      const type = Initial.getType(property.initial)
      const val = coerceValue(type, value)
      Initial.setValue(property.initial, type, val)
    },
    changeEnumValue(
      _,
      payload: {
        property: IEnumerated
        value: string
      }
    ) {
      const { property, value } = payload
      Enumerated.setValue(property, value)
    },
    addTransform(
      _,
      payload: {
        property: IProperty | IVariable
        name: Transforms.TransformName
      }
    ) {
      const { property, name } = payload
      Property.addTransform(
        property,
        Transforms.getTransform(name, property.id)
      )
    },
    removeTransform(
      _,
      payload: {
        property: IProperty | IVariable
        transform: ITransform<Type, Type>
      }
    ) {
      const { property, transform } = payload
      Property.removeTransform(property, transform)
    },
    moveTransform(
      _,
      payload: {
        property: IProperty | IVariable
        transform: ITransform
        index: number
      }
    ) {
      const { property, transform, index } = payload
      Property.moveTransform(property, transform, index)
    },
    selectInitialVariable(
      data,
      payload: {
        property: IProperty | IVariable
        variable?: IVariable
      }
    ) {
      const { property, variable } = payload

      if (variable) {
        Variable.addAssignment(variable, property)
      } else if (property.initial.variable) {
        Variable.removeAssignment(
          data.variables
            .get(property.initial.variable.scope)
            .get(property.initial.variable.id),
          property
        )
      }

      Initial.setVariable(
        property.initial,
        variable
          ? { __type: "variable", scope: variable.scope, id: variable.id }
          : undefined
      )
    },
    detatchInitialVariable(
      _,
      payload: {
        property: IProperty | IVariable
      }
    ) {
      const { property } = payload
      Initial.detatchVariable(property.initial)
    },
    duplicateTransform(
      _,
      payload: {
        property: IProperty | IVariable
        transform: ITransform
        index: number
      }
    ) {
      const { property, transform, index } = payload
      Property.insertTransform(property, transform, index + 1)
    },
    createVariable(data, payload = { scope: "global" }) {
      const variable = Variable.create({
        name: "New Variable",
        scope: payload.scope,
        initial: Initial.create({
          type: Type.Text,
          value: "My Value",
        }),
      })
      if (!data.variables.has(variable.scope)) {
        data.variables.set(variable.scope, new Map([]))
      }

      data.variables.get(variable.scope).set(variable.id, variable)
      data.selected = {
        __type: "variable",
        scope: variable.scope,
        id: variable.id,
      }
    },
    deleteVariable(data, payload: { property: IVariable }) {
      Variable.delete(payload.property)
    },
    restoreProperty(data, property: IProperty) {
      if (!data.properties.has(property.scope)) {
        data.variables.set(property.scope, new Map([]))
      }

      data.properties.get(property.scope).set(property.id, property)
    },
    restoreVariable(data, variable: IVariable) {
      if (!data.variables.has(variable.scope)) {
        data.variables.set(variable.scope, new Map([]))
      }

      data.variables.get(variable.scope).set(variable.id, variable)
      data.selected = {
        __type: "variable",
        scope: variable.scope,
        id: variable.id,
      }
    },
  },
  values: {
    selected(data) {
      if (!data.selected) return undefined

      return data.selected.__type === "variable"
        ? data.variables.get(data.selected.scope).get(data.selected.id)
        : data.properties.get(data.selected.scope).get(data.selected.id)
    },
    properties(data) {
      return Array.from(data.properties.entries()).reduce(
        (acc, [name, properties]) => {
          acc.push({
            name,
            members: Array.from(properties.values()),
          })
          return acc
        },
        [] as { name: string; members: IProperty[] }[]
      )
    },
    variables(data) {
      return Array.from(data.variables.entries()).reduce(
        (acc, [name, variables]) => {
          acc.push({
            name,
            members: Array.from(variables.values()),
          })
          return acc
        },
        [] as { name: string; members: IVariable[] }[]
      )
    },
  },
})

state.onUpdate((update: typeof state) => {
  localStorage.setItem(
    "play_vars",
    JSON.stringify({
      selected: update.data.selected,
      version: update.data.version,
      properties: update.values.properties,
      variables: update.values.variables,
    })
  )
})

export default state

export const useSelector = createSelectorHook(state)
