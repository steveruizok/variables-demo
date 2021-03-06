import startCase from "lodash/startCase"
import upperFirst from "lodash/upperFirst"
import {
  Type,
  ValueTypes,
  Property,
  Transform,
  Initial,
  Enumerated,
  IEnumerated,
  IProperty,
  ITransform,
  TransformFn,
} from "./system"

export type TransformName =
  | "Join"
  | "Change Case"
  | "Slice"
  | "Side"
  | "Reverse"
  | "Text to Number"
  | "Length"
  | "Contains"
  | "Matches"
  | "Add"
  | "Subtract"
  | "Multiply"
  | "Divide"
  | "Round"
  | "Clamp"
  | "Change Sign"
  | "Math"
  | "Compare"
  | "Number to Text"
  | "Flip"
  | "And"
  | "Or"
  | "Nor"
  | "Boolean to Text"
  | "Boolean to Number"

export const TransformTypes: {
  [K in Type]: { [K in Type]: TransformName[] }
} = {
  [Type.Text]: {
    [Type.Text]: ["Join", "Change Case", "Slice", "Side", "Reverse"],
    [Type.Number]: ["Text to Number", "Length"],
    [Type.Boolean]: ["Contains", "Matches"],
  },
  [Type.Number]: {
    [Type.Number]: [
      "Add",
      "Subtract",
      "Multiply",
      "Divide",
      "Round",
      "Clamp",
      "Change Sign",
      "Math",
    ],
    [Type.Boolean]: ["Compare"],
    [Type.Text]: ["Number to Text"],
  },
  [Type.Boolean]: {
    [Type.Boolean]: ["Flip", "And", "Or", "Nor"],
    [Type.Text]: ["Boolean to Text"],
    [Type.Number]: ["Boolean to Number"],
  },
}

// Helpers to translate between options object and args

function transform<I extends Type, O extends Type>(options: {
  name: TransformName
  inputType: I
  outputType: O
  fn: TransformFn<I, O>
  scope: string
  args?: (IProperty | IEnumerated)[]
}): ITransform<I, O> {
  return Transform.create(options)
}

interface PropertyOptions<T extends Type> {
  name: string
  type: T
  scope: string
  value: ValueTypes[T]
}

function property<T extends Type>(options: PropertyOptions<T>) {
  const { name, type, scope, value } = options
  return Property.create({
    name,
    scope,
    initial: Initial.create({ type, value }),
  })
}

function enumProperty(opts: {
  name: string
  options: string[]
  value: string
}) {
  const { name, options: options, value } = opts
  return Enumerated.create({ name, options, value })
}

/**
 * Get a transform by name.
 * @param name The name of the transform
 */
export function getTransform(name: TransformName, scope: string) {
  switch (name) {
    // Text to Text
    case "Join": {
      return transform({
        name: "Join",
        scope,
        inputType: Type.Text,
        outputType: Type.Text,
        fn: (value, a, b) => value + b + a,
        args: [
          property({ scope, name: "Text", type: Type.Text, value: "Text" }),
          property({
            scope,
            name: "Separator",
            type: Type.Text,
            value: " ",
          }),
        ],
      })
    }
    case "Change Case": {
      return transform({
        name: "Change Case",
        scope,
        inputType: Type.Text,
        outputType: Type.Text,
        fn: (v, op: "uppercase" | "lowercase" | "headline" | "sentence") =>
          ({
            uppercase: () => v.toUpperCase(),
            lowercase: () => v.toLowerCase(),
            headline: () => startCase(v),
            sentence: () => upperFirst(v),
          }[op]()),
        args: [
          enumProperty({
            name: "Case",
            value: "uppercase",
            options: ["uppercase", "lowercase", "headline", "sentence"],
          }),
        ],
      })
    }
    case "Slice": {
      return transform({
        name: "Slice",
        scope,
        inputType: Type.Text,
        outputType: Type.Text,
        fn: (value, a, b) =>
          b === ""
            ? value.slice(a)
            : value.slice(Math.min(a, b), Math.max(a, b)),
        args: [
          property({ scope, name: "Start", type: Type.Number, value: 0 }),
          property({ scope, name: "End", type: Type.Number, value: 10 }),
        ],
      })
    }
    case "Side": {
      return transform({
        name: "Side",
        scope,
        inputType: Type.Text,
        outputType: Type.Text,
        fn: (value, side: "start" | "end", count: number) =>
          ({
            start: () => value.slice(0, count),
            end: () => value.slice(-count),
          }[side]()),
        args: [
          enumProperty({
            name: "Side",
            value: "start",
            options: ["start", "end"],
          }),
          property({ scope, name: "Length", type: Type.Number, value: 3 }),
        ],
      })
    }
    case "Reverse": {
      return transform({
        scope,
        name: "Reverse",
        inputType: Type.Text,
        outputType: Type.Text,
        fn: (value) => value.split("").reverse().join(""),
        args: [],
      })
    }
    // Text to Number
    case "Text to Number": {
      return transform({
        scope,
        name: "Text to Number",
        inputType: Type.Text,
        outputType: Type.Number,
        fn: (value) => parseFloat(value),
        args: [],
      })
    }
    case "Length": {
      return transform({
        scope,
        name: "Length",
        inputType: Type.Text,
        outputType: Type.Number,
        fn: (v, op: "characters" | "words") =>
          ({
            characters: () => v.length,
            words: () => v.split(" ").length,
          }[op]()),
        args: [
          enumProperty({
            name: "Count",
            value: "characters",
            options: ["characters", "words"],
          }),
        ],
      })
    }
    // Text to Boolean
    case "Contains": {
      return transform({
        scope,
        name: "Contains",
        inputType: Type.Text,
        outputType: Type.Boolean,
        fn: (v, t: string, op: "start" | "end" | "anywhere") =>
          ({
            start: () => v.startsWith(t),
            end: () => v.endsWith(t),
            anywhere: () => v.includes(t),
          }[op]()),
        args: [
          property({ scope, name: "Text", type: Type.Text, value: "Text" }),
          enumProperty({
            name: "Place",
            value: "anywhere",
            options: ["start", "end", "anywhere"],
          }),
        ],
      })
    }
    case "Matches": {
      return transform({
        scope,
        name: "Matches",
        inputType: Type.Text,
        outputType: Type.Boolean,
        fn: (v, a) => v === a,
        args: [
          property({ scope, name: "Text", type: Type.Text, value: "Text" }),
        ],
      })
    }
    // Number to Number
    case "Add": {
      return transform({
        scope,
        name: "Add",
        inputType: Type.Number,
        outputType: Type.Number,
        fn: (v, b) => v + b,
        args: [
          property({ scope, name: "Number", type: Type.Number, value: 10 }),
        ],
      })
    }
    case "Subtract": {
      return transform({
        scope,
        name: "Subtract",
        inputType: Type.Number,
        outputType: Type.Number,
        fn: (v, b) => {
          return v - b
        },
        args: [
          property({ scope, name: "Number", type: Type.Number, value: 10 }),
        ],
      })
    }
    case "Multiply": {
      return transform({
        scope,
        name: "Multiply",
        inputType: Type.Number,
        outputType: Type.Number,
        fn: (v, b) => v * b,
        args: [
          property({ scope, name: "Number", type: Type.Number, value: 10 }),
        ],
      })
    }
    case "Divide": {
      return transform({
        scope,
        name: "Divide",
        inputType: Type.Number,
        outputType: Type.Number,
        fn: (v, b) => v / b,
        args: [
          property({ scope, name: "Number", type: Type.Number, value: 10 }),
        ],
      })
    }
    case "Round": {
      return transform({
        scope,
        name: "Round",
        inputType: Type.Number,
        outputType: Type.Number,
        fn: (v, op: "nearest" | "down" | "up" | "truncate") =>
          ({
            nearest: () => Math.round(v),
            down: () => Math.floor(v),
            up: () => Math.ceil(v),
            truncate: () => Math.trunc(v),
          }[op]()),
        args: [
          enumProperty({
            name: "Direction",
            value: "nearest",
            options: ["nearest", "down", "up", "truncate"],
          }),
        ],
      })
    }
    case "Clamp": {
      return transform({
        scope,
        name: "Clamp",
        inputType: Type.Number,
        outputType: Type.Number,
        fn: (v, min, max) =>
          max === ""
            ? Math.max(v, min)
            : min === ""
            ? Math.min(v, max)
            : Math.min(Math.max(v, min), max),
        args: [
          property({ scope, name: "Min", type: Type.Number, value: 10 }),
          property({ scope, name: "Max", type: Type.Number, value: 10 }),
        ],
      })
    }
    case "Change Sign": {
      return transform({
        scope,
        name: "Change Sign",
        inputType: Type.Number,
        outputType: Type.Number,
        fn: (v, op: "invert" | "absolute" | "negate") =>
          ({
            invert: () => -v,
            absolute: () => Math.abs(v),
            negate: () => (v > 0 ? -v : v),
          }[op]()), // TODO
        args: [
          enumProperty({
            name: "Operation",
            value: "invert",
            options: ["invert", "absolute", "negate"],
          }),
        ],
      })
    }
    case "Math": {
      return transform({
        scope,
        name: "Math",
        inputType: Type.Number,
        outputType: Type.Number,
        fn: (
          v,
          op:
            | "square"
            | "log"
            | "sin"
            | "cos"
            | "tan"
            | "asin"
            | "atan"
            | "acos"
        ) =>
          ({
            square: () => Math.sqrt(v),
            log: () => Math.log(v),
            sin: () => Math.sin(v),
            cos: () => Math.cos(v),
            abs: () => Math.abs(v),
            tan: () => Math.tan(v),
            asin: () => Math.asin(v),
            atan: () => Math.atan(v),
            acos: () => Math.acos(v),
          }[op]()),
        args: [
          enumProperty({
            name: "Operation",
            value: "square",
            options: [
              "square",
              "log",
              "sin",
              "cos",
              "tan",
              "asin",
              "atan",
              "acos",
            ],
          }),
        ],
      })
    }
    // Number to Text
    case "Number to Text": {
      return transform({
        scope,
        name: "Number to Text",
        inputType: Type.Number,
        outputType: Type.Text,
        fn: (v, a) => v.toFixed(a),
        args: [
          property({ scope, name: "Decimal", type: Type.Number, value: 0 }),
        ],
      })
    }
    // Number to Boolean
    case "Compare": {
      return transform({
        scope,
        name: "Compare",
        inputType: Type.Number,
        outputType: Type.Boolean,
        fn: (
          v,
          op: "less than" | "at most" | "equals" | "at least" | "more than",
          n: number
        ) =>
          ({
            "less than": () => v < n,
            "at most": () => v <= n,
            equals: () => v === n,
            "at least": () => v >= n,
            "more than": () => v > n,
          }[op]()),
        args: [
          enumProperty({
            name: "Operation",
            value: "equals",
            options: [
              "less than",
              "at most",
              "equals",
              "at least",
              "more than",
            ],
          }),
          property({ scope, name: "Number", type: Type.Number, value: 10 }),
        ],
      })
    }
    // Boolean to Boolean
    case "Flip": {
      return transform({
        scope,
        name: "Flip",
        inputType: Type.Boolean,
        outputType: Type.Boolean,
        fn: (v) => !v,
        args: [],
      })
    }
    case "And": {
      return transform({
        scope,
        name: "And",
        inputType: Type.Boolean,
        outputType: Type.Boolean,
        fn: (v, a) => v && a,
        args: [
          property({ scope, name: "Boolean", type: Type.Boolean, value: true }),
        ],
      })
    }
    case "Or": {
      return transform({
        scope,
        name: "Or",
        inputType: Type.Boolean,
        outputType: Type.Boolean,
        fn: (v, a) => v || a,
        args: [
          property({ scope, name: "Boolean", type: Type.Boolean, value: true }),
        ],
      })
    }
    case "Nor": {
      return transform({
        scope,
        name: "Nor",
        inputType: Type.Boolean,
        outputType: Type.Boolean,
        fn: (v, a) => !(v || a),
        args: [
          property({ scope, name: "Boolean", type: Type.Boolean, value: true }),
        ],
      })
    }
    // Boolean to Text
    case "Boolean to Text": {
      return transform({
        scope,
        name: "Boolean to Text",
        inputType: Type.Boolean,
        outputType: Type.Text,
        fn: (v) => (v ? "True" : "False"),
        args: [],
      })
    }
    case "Boolean to Number": {
      return transform({
        scope,
        name: "Boolean to Number",
        inputType: Type.Boolean,
        outputType: Type.Number,
        fn: (v) => (v ? 1 : 0),
        args: [],
      })
    }
    // Boolean to Any
    // case "If Else": {
    //   return transform({
    //     name: "If Else",
    //     inputType: Type.Boolean,
    //     outputType: Type.Boolean, // Work on this, multiple valid output types
    //     fn: (v) => v,
    //     args: [
    //       property({
    //         name: "If",
    //         type: Type.Text,
    //         value: "True"
    //       }),
    //       property({
    //         name: "Else",
    //         type: Type.Text,
    //         value: "False"
    //       })
    //     ]
    //   })
    // }
  }
}

export const transformNames = [
  "Join",
  "Change Case",
  "Slice",
  "Side",
  "Reverse",
  "Text to Number",
  "Length",
  "Contains",
  "Matches",
  "Add",
  "Subtract",
  "Multiply",
  "Divide",
  "Round",
  "Clamp",
  "Change Sign",
  "Math",
  "Compare",
  "Number to Text",
  "Flip",
  "And",
  "Or",
  "Nor",
  "Boolean to Text",
  "Boolean to Number",
]
