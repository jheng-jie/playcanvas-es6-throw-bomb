import { defineStore } from "pinia"

export type Attribute = {
  hp: number
  mp: number
  speed: number
  attackSpeed: number
  bombPower: number
  bombScale: number
}

export type Store = {
  attribute: Attribute
  graduation: Attribute
  show: boolean
  max: number
}

export default defineStore("main", {
  state: () => {
    return {
      show: true,
      max: 120,
      attribute: {
        hp: 0,
        mp: 0,
        speed: 0,
        attackSpeed: 0,
        bombPower: 0,
        bombScale: 0,
      },
      graduation: {
        hp: 1,
        mp: 2,
        speed: 2,
        attackSpeed: 2,
        bombPower: 1,
        bombScale: 1,
      },
    } as Store
  },
  getters: {
    /**
     * @desc 技能總消耗
     */
    skill(): number {
      return Object.keys(this.attribute)
        .map((key: string) => Math.ceil(this.attribute[key as keyof Attribute] / this.graduation[key as keyof Attribute]))
        .reduce((res, val) => res + val, 0)
    },
  },
  actions: {
    /**
     * @desc 清除
     */
    clear() {
      Object.keys(this.attribute).map(key => {
        this.attribute[key as keyof Attribute] = 0
      })
    },
  },
})