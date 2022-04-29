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
  skill: boolean
  auth: boolean
  loading: boolean
  max: number
  space: number
}

export enum SPACE_SKILL {
  ROLL = 0x00,
  DEFENCE = 0x01,
}

export default defineStore("main", {
  state: () => {
    return {
      skill: false,
      auth: true,
      max: 150,
      loading: false,
      space: SPACE_SKILL.ROLL,
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
    skillCount(): number {
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
