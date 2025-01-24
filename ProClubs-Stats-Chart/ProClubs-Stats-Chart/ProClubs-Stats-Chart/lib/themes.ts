export type Theme = "default" | "black" | "green" | "pink"

export const themes = [
  {
    name: "Default",
    value: "default",
    description: "Classic black and white theme",
  },
  {
    name: "Black",
    value: "black",
    description: "Black primary with green and pink accents",
  },
  {
    name: "Green",
    value: "green",
    description: "Green primary with black and pink accents",
  },
  {
    name: "Pink",
    value: "pink",
    description: "Pink primary with black and green accents",
  },
] as const

