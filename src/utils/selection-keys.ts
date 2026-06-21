const SELECTION_KEYS = {
  cameras: "cameras",
  plans: "plans",
  sensors: "sensors",
  accessories: "accessories"
} as const

export type CategoryKey = typeof SELECTION_KEYS[keyof typeof SELECTION_KEYS];

export default SELECTION_KEYS