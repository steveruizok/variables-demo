import { createState, createSelectorHook } from "@state-designer/react"
import { System } from "./lib"
import {
  Type,
  Property,
  Natural,
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
  selected?: string
  properties: Map<string, IProperty>
  variables: Map<string, IProperty>
}

const allTypes = [Type.Text, Type.Boolean, Type.Number]

export const initialData: Data = {
  version: 7,
  selected: undefined,
  properties: new Map([
    [
      "title",
      Property.createProperty({
        id: "title",
        name: "Title",
        finalTypes: [Type.Text],
        initial: Natural.create({
          type: Type.Text,
          value: "Six Headlines to Read in 2021",
        }),
      }),
    ],
    [
      "author",
      Property.createProperty({
        id: "author",
        name: "Author",
        finalTypes: [Type.Text],
        initial: Natural.create({
          type: Type.Text,
          value: "Anonymous",
        }),
      }),
    ],
    [
      "stars",
      Property.createProperty({
        id: "stars",
        name: "Stars",
        finalTypes: [Type.Number],
        initial: Natural.create({
          type: Type.Number,
          value: 0,
        }),
      }),
    ],
    [
      "starred",
      Property.createProperty({
        id: "starred",
        name: "Starred",
        finalTypes: [Type.Boolean],
        initial: Natural.create({
          type: Type.Boolean,
          value: false,
        }),
      }),
    ],
  ]),
  variables: new Map([
    [
      "firstName",
      Property.createVariable({
        id: "firstName",
        name: "First Name",
        finalTypes: allTypes,
        initial: Natural.create({
          type: Type.Text,
          value: "Miranda",
        }),
      }),
    ],
  ]),
}

// Load local saved data

if (typeof window !== "undefined") {
  const local = JSON.parse(localStorage.getItem("play_vars") || "{}")

  if (local.version === initialData.version) {
    initialData.variables.clear()
    for (let variable of local.variables) {
      variable.transforms.forEach((transform: ITransform) => {
        const source = Transforms.getTransform(transform.name)
        transform.fn = source.fn as any
      })
      initialData.variables.set(variable.id, variable)
      System.variables.set(variable.id, variable)
    }
    initialData.properties.clear()
    for (let property of local.properties) {
      property.transforms.forEach((transform: ITransform) => {
        const source = Transforms.getTransform(transform.name)
        transform.fn = source.fn as any
      })
      initialData.properties.set(property.id, property)
      System.properties.set(property.id, property)
    }
  }
}

const state = createState({
  data: initialData,
  on: {
    RESTORED_PROPERTY: "restoreProperty",
    RESTORED_VARAIBLE: "restoreVariable",
    SELECTED_PROPERTY: "selectProperty",
    CLEARED_SELECTION: "clearSelectedProperty",
    CHANGED_NAME: "changeName",
    CHANGED_INITIAL_TYPE: "changeInitialType",
    CHANGED_INITIAL_VALUE: "changeInitialValue",
    CHANGED_ENUM_VALUE: "changeEnumValue",
    ADDED_TRANSFORM: "addTransform",
    REMOVED_TRANSFORM: "removeTransform",
    MOVED_TRANSFORM: "moveTransform",
    DUPLICATED_TRANSFORM: "duplicateTransform",
    SELECTED_VARIABLE: "selectVariable",
    CREATED_VARIABLE: "createVariable",
  },
  actions: {
    selectProperty(data, payload: { property: IProperty }) {
      const { property } = payload
      data.selected = property?.id
    },
    clearSelectedProperty(data) {
      data.selected = undefined
    },
    changeName(
      _,
      payload: {
        property: IProperty
        name: string
      }
    ) {
      const { property, name } = payload
      Property.setName(property, name)
    },
    changeInitialType(
      _,
      payload: {
        property: IProperty
        type: Type
      }
    ) {
      const { property, type } = payload
      Natural.setType(property.initial, type)
    },
    changeInitialValue(
      _,
      payload: {
        property: IProperty
        value: ValueTypes[Type]
      }
    ) {
      const { property, value } = payload
      const type = Natural.getType(property.initial)
      const val = coerceValue(type, value)
      Natural.setValue(property.initial, type, val)
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
        property: IProperty
        name: Transforms.TransformName
      }
    ) {
      const { property, name } = payload
      Property.addTransform(property, Transforms.getTransform(name))
    },
    removeTransform(
      _,
      payload: {
        property: IProperty
        transform: ITransform<Type, Type>
      }
    ) {
      const { property, transform } = payload
      Property.removeTransform(property, transform)
    },
    moveTransform(
      _,
      payload: {
        property: IProperty
        transform: ITransform
        index: number
      }
    ) {
      const { property, transform, index } = payload
      Property.moveTransform(property, transform, index)
    },
    selectVariable(
      _,
      payload: {
        property: IProperty
        variable?: IProperty
      }
    ) {
      const { property, variable } = payload
      Natural.setVariable(property.initial, variable?.id)
    },
    duplicateTransform(
      _,
      payload: {
        property: IProperty
        transform: ITransform
        index: number
      }
    ) {
      const { property, transform, index } = payload
      Property.insertTransform(property, transform, index + 1)
    },
    createVariable(data) {
      const variable = Property.createVariable({
        name: "New Variable",
        finalTypes: allTypes,
        initial: Natural.create({
          type: Type.Text,
          value: "My Value",
        }),
      })
      data.variables.set(variable.id, variable)
      data.selected = variable.id
    },
    restoreProperty(data, property: IProperty) {
      data.properties.set(property.id, property)
    },
    restoreVariable(data, property: IProperty) {
      data.variables.set(property.id, property)
    },
  },
  values: {
    selected(data) {
      return (
        data.selected &&
        (data.properties.get(data.selected) ||
          data.variables.get(data.selected))
      )
    },
    properties(data) {
      return Array.from(data.properties.values())
    },
    variables(data) {
      return Array.from(data.variables.values())
    },
  },
})

state.onUpdate((update: typeof state) => {
  localStorage.setItem(
    "play_vars",
    JSON.stringify({
      version: update.data.version,
      properties: Array.from(update.data.properties.values()),
      variables: Array.from(update.data.variables.values()),
    })
  )
})

export default state

export const useSelector = createSelectorHook(state)
