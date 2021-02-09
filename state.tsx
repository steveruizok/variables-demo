import { createState, createSelectorHook } from "@state-designer/react"
import { update } from "lodash"
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
  theme: "dark" | "light"
  showSource: boolean
  stack: System.ScopedReference[]
  properties: System.Properties
  variables: System.Variables
}

export const initialData: Data = {
  version: 16,
  theme: "dark",
  showSource: false,
  stack: [],
  properties: {
    global: {
      title: Property.create({
        id: "title",
        name: "Title",
        scope: "global",
        initial: Initial.create({
          type: Type.Text,
          value: "Six Headlines to Read in 2021",
        }),
      }),
      author: Property.create({
        id: "author",
        name: "Author",
        scope: "global",
        initial: Initial.create({
          type: Type.Text,
          value: "Anonymous",
        }),
      }),
      stars: Property.create({
        id: "stars",
        name: "Stars",
        scope: "global",
        initial: Initial.create({
          type: Type.Number,
          value: 0,
        }),
      }),
      starred: Property.create({
        id: "starred",
        name: "Starred",
        scope: "global",
        initial: Initial.create({
          type: Type.Boolean,
          value: false,
        }),
      }),
    },
  },
  variables: {
    global: {
      firstName: Variable.create({
        id: "firstName",
        scope: "global",
        name: "First Name",
        initial: Initial.create({
          type: Type.Text,
          value: "Miranda",
        }),
      }),
    },
  },
}

// Load local saved data

if (typeof window !== "undefined") {
  const local = JSON.parse(localStorage.getItem("play_vars") || "{}")

  if (local.version === initialData.version) {
    for (let key in local.properties) {
      for (let id in local.properties[key]) {
        const target = local.properties[key][id]

        target.transforms = target.transforms.map((transform: ITransform) => {
          const source = Transforms.getTransform(
            transform.name,
            transform.scope
          )
          return { ...transform, fn: source.fn }
        })
      }
    }

    for (let key in local.variables) {
      for (let id in local.variables[key]) {
        const target = local.variables[key][id]

        target.transforms = target.transforms.map((transform: ITransform) => {
          const source = Transforms.getTransform(
            transform.name,
            transform.scope
          )
          return { ...transform, fn: source.fn }
        })
      }
    }

    Object.assign(initialData, local)
  }
}

System.tables.variables = initialData.variables
System.tables.properties = initialData.properties

const state = createState({
  data: initialData,
  onEnter: "setTheme",
  on: {
    TOGGLED_SHOW_SOURCE: "toggleShowSource",
    TOGGLED_THEME: ["toggleTheme", "setTheme"],
    RESTORED_PROPERTY: "restoreProperty",
    RESTORED_VARAIBLE: "restoreVariable",
    SELECTED: "select",
    SELECTED_AT_DEPTH: "selectAtDepth",
    CLEARED_SELECTION: "clearSelectedProperty",
    CLEARED_STACK: "clearStack",
    CHANGED_NAME: "changeName",
    CHANGED_INITIAL_TYPE: "changeInitialType",
    CHANGED_INITIAL_VALUE: "changeInitialValue",
    CHANGED_ENUM_VALUE: "changeEnumValue",
    ADDED_TRANSFORM: "addTransform",
    REMOVED_TRANSFORM: "removeTransform",
    MOVED_TRANSFORM: "moveTransform",
    DUPLICATED_TRANSFORM: "duplicateTransform",
    SELECTED_VARIABLE: "selectInitialVariable",
    DETACHED_VARIABLE: "detachInitialVariable",
    CREATED_VARIABLE: "createVariable",
    DELETED_VARIABLE: "deleteVariable",
  },
  actions: {
    toggleShowSource(data) {
      data.showSource = !data.showSource
    },
    setTheme(data) {
      if (typeof document !== "undefined") {
        if (data.theme === "dark") {
          document.body.classList.toggle("dark", true)
        } else {
          document.body.classList.toggle("dark", false)
        }
      }
    },
    toggleTheme(data) {
      data.theme = data.theme === "dark" ? "light" : "dark"
    },
    selectAtDepth(
      data,
      payload: { selection: IProperty | IVariable; depth: number }
    ) {
      const { selection, depth } = payload
      data.stack = data.stack.slice(0, depth)
      data.stack[depth] = selection
    },
    select(
      data,
      payload: { selection: IProperty | IVariable; stack: boolean }
    ) {
      const { selection, stack } = payload
      const ref = {
        __type: selection.__type,
        scope: selection.scope,
        id: selection.id,
      }

      data.stack = stack ? [...data.stack, ref] : [ref]
    },
    clearSelectedProperty(data) {
      data.stack.pop()
    },
    clearStack(data) {
      data.stack = []
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
      data,
      payload: {
        property: IProperty | IVariable
        transform: ITransform<Type, Type>
      }
    ) {
      const { property, transform } = payload
      for (let arg of transform.args) {
        delete data.properties[property.id][arg.id]
      }
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
        const { scope, id } = property.initial.variable
        Variable.removeAssignment(data.variables[scope][id], property)
      }

      Initial.setVariable(
        property.initial,
        variable
          ? { __type: "variable", scope: variable.scope, id: variable.id }
          : undefined
      )
    },
    detachInitialVariable(
      _,
      payload: {
        property: IProperty | IVariable
      }
    ) {
      const { property } = payload
      Initial.detachVariable(property.initial)
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
      Property.insertTransform(
        property,
        System.Transform.create({ ...transform }),
        index + 1
      )
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

      if (!data.variables[variable.scope]) {
        data.variables[variable.scope] = {}
      }

      data.variables[variable.scope][variable.id] = variable

      data.stack = [
        {
          __type: "variable",
          scope: variable.scope,
          id: variable.id,
        },
      ]
    },
    deleteVariable(data, payload: { property: IVariable }) {
      const { property } = payload

      Object.values(property.assignments).forEach(({ __type, scope, id }) => {
        const assignment =
          __type === "variable"
            ? data.variables.variables[scope][id]
            : data.variables.properties[scope][id]

        Initial.detachVariable(assignment.initial)
      })

      // Remove from tables
      delete data.variables[property.scope][property.id]

      Variable.delete(property)
    },
    restoreProperty(data, property: IProperty) {
      if (!data.variables[property.scope]) {
        data.properties[property.scope] = {}
      }
      data.properties[property.scope][property.id] = property
    },
    restoreVariable(data, variable: IVariable) {
      if (!data.variables[variable.scope]) {
        data.variables[variable.scope] = {}
      }
      data.variables[variable.scope][variable.id] = variable

      data.stack = [
        {
          __type: "variable",
          scope: variable.scope,
          id: variable.id,
        },
      ]
    },
  },
  values: {
    selected(data) {
      const selection = data.stack[data.stack.length - 1]
      if (!selection) return

      return selection.__type === "variable"
        ? data.variables[selection.scope]?.[selection.id]
        : data.properties[selection.scope]?.[selection.id]
    },
  },
})

state.onUpdate((update: typeof state) => {
  // Lame, but whatever. Alternative is moving everything into the state machine.
  System.tables.properties = update.data.properties
  System.tables.variables = update.data.variables

  localStorage.setItem(
    "play_vars",
    JSON.stringify({
      theme: update.data.theme,
      showSource: update.data.showSource,
      stack: update.data.stack,
      version: update.data.version,
      properties: update.data.properties,
      variables: update.data.variables,
    })
  )
})

export default state

export const useSelector = createSelectorHook(state)
