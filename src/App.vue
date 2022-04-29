<template>
  <!--skill view-->
  <transition name="popup">
    <div v-if="store.skill" @click.prevent.stop="false" class="fixed left-0 top-0 w-full h-full flex justify-center items-center">
      <div id="popup-skill" class="flex flex-col justify-center">
        <h1 class="text-xl font-bold text-center mb-2 text-yellow-500 shrink-0">點數 ( {{ store.max - store.skill }} )</h1>
        <div class="flex-1 overflow-y-auto">
          <Property @change="onChange('hp', $event)" v-model="store.attribute.hp" :graduation="store.graduation.hp" label="生命值" class="mb-1.5" />
          <Property @change="onChange('mp', $event)" v-model="store.attribute.mp" :graduation="store.graduation.mp" label="魔力恢復" class="mb-1.5" />
          <Property @change="onChange('speed', $event)" v-model="store.attribute.speed" :graduation="store.graduation.speed" label="移動速度" class="mb-1.5" />
          <Property @change="onChange('attackSpeed', $event)" v-model="store.attribute.attackSpeed" :graduation="store.graduation.attackSpeed" label="攻擊速度" class="mb-1.5" />
          <Property @change="onChange('bombPower', $event)" v-model="store.attribute.bombPower" :graduation="store.graduation.bombPower" label="炸彈速度" class="mb-1.5" />
          <Property @change="onChange('bombScale', $event)" v-model="store.attribute.bombScale" :graduation="store.graduation.bombScale" label="炸彈大小" class="mb-1.5" />
          <div class="box-border py-2 flex items-center">
            <span class="space-btn mb-2 bg-white border-yellow-600 border-2 text-yellow-700 px-3 py-1 inline-block rounded">space</span>
            <div @click="store.space = store.space === SPACE_SKILL.ROLL ? SPACE_SKILL.DEFENCE : SPACE_SKILL.ROLL" class="flex-1 justify-end flex cursor-pointer select-none">
              <div class="py-1 px-2 rounded-l border border-yellow-600" :class="store.space === SPACE_SKILL.ROLL ? 'bg-yellow-600' : 'bg-transparent'">翻滾</div>
              <div class="py-1 px-2 rounded-r border border-yellow-600" :class="store.space === SPACE_SKILL.DEFENCE ? 'bg-yellow-600' : 'bg-transparent'">盾牌</div>
            </div>
          </div>
        </div>
        <div class="shrink-0 flex pt-3">
          <div class="flex-1">
            <button @click.prevent.stop="store.clear" class="bg-yellow-600 hover:bg-yellow-700 transition-colors rounded px-3 py-1">重置</button>
          </div>
          <div class="flex-1 text-right">
            <button @click.prevent.stop="onConfirm" class="bg-red-600 hover:bg-red-700 transition-colors rounded px-3 py-1">確定</button>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!--skill floating btn-->
  <div @click.prevent.stop="store.skill = !store.skill" class="skill-icon cursor-pointer w-12 h-12 fixed bottom-2 left-2 z-40 select-none">
    <img src="./asset/skills.png" alt="https://www.flaticon.com/authors/freepik" class="hover:scale-110 transition-all" />
    <a class="fixed left-16 bottom-2 break-normal text-white bg-black px-2 hidden text-xs" href="https://www.flaticon.com/free-icons/worker" title="worker icons">
      Worker icons created by Freepik - Flaticon
    </a>
  </div>

  <!--input name and photon key-->
  <transition name="opacity">
    <div v-if="store.auth" class="z-50 fixed w-full h-full bg-black bg-opacity-75" />
  </transition>
  <transition name="popup">
    <div v-if="store.auth" class="z-50 fixed w-full h-full flex items-center justify-center">
      <div class="bg-white w-96 rounded py-4">
        <h1 class="text-xl font-bold text-center mb-4">加入遊戲</h1>
        <div class="box-border px-3 mb-2 flex items-center text-gray-600">
          <span class="w-24 text-right pr-3">名稱</span>
          <input v-focus v-model="name" class="border rounded w-full px-2 py-1 text-gray-500" type="text" placeholder="1~20字" />
        </div>
        <div class="box-border px-3 mb-5 flex items-center text-gray-600">
          <span class="w-24 text-right pr-3">Photon</span>
          <input v-model="photon" class="border rounded w-full px-2 py-1 text-gray-500" type="text" placeholder="1~10字" />
        </div>
        <div v-if="error" class="text-red-500 text-center mb-4 bg-red-100 py-3">{{ error }}</div>
        <div class="text-center">
          <button @click="login" class="bg-yellow-500 hover:bg-yellow-600 transition-colors rounded px-3 py-2 text-white">加入</button>
        </div>
      </div>
    </div>
  </transition>

  <!--full loading-->
  <transition name="opacity">
    <div v-if="store.loading" class="z-50 fixed w-full h-full bg-black bg-opacity-75" />
  </transition>
  <transition name="popup">
    <div v-if="store.loading" class="flex fixed z-50 w-full h-full items-center justify-center">
      <svg class="text-white animate-spin w-10 h-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle style="opacity: 0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path style="opacity: 0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from "vue"
import Property from "./component/Property.vue"

// store
import useStore, { Attribute, SPACE_SKILL } from "./store"
const store = useStore()

/**
 * @desc 屬性更新
 */
const onChange = function (key: keyof Attribute, value: number) {
  store.attribute[key] = value
  const skillCount = store.skillCount

  // 合理範圍
  if (skillCount <= store.max) return

  // 刪除超過點數
  const adjustment: Attribute = JSON.parse(JSON.stringify(store.attribute))
  const keys = Object.keys(store.attribute).filter(k => k !== key) as Array<keyof Attribute>
  let excess = skillCount - store.max
  let index = 0
  while (excess > 0) {
    const key: keyof Attribute = keys[index++ % keys.length]
    if (adjustment[key] <= 0) continue
    adjustment[key] -= store.graduation[key]
    --excess
  }

  // set
  Object.keys(adjustment).map(key => (store.attribute[key as keyof Attribute] = adjustment[key as keyof Attribute]))
}

/**
 * @desc 確認
 */
const onConfirm = function () {
  window?.onSkillCallback(store)
}

// photon model
const photon = ref<string>(import.meta.env.VITE_PHOTON_KEY)

// name model
const name = ref<string>("")

// 錯誤訊息
const error = ref<string>("")

/**
 * @desc 登入
 */
const login = async function () {
  // check name
  if (!name.value) {
    error.value = "請輸入名稱"
    return
  }

  // check photon key
  if (!photon.value) {
    error.value = "請輸入 Photon Key"
    return
  }

  // callback
  store.auth = false
  window?.onAuthInitialize(store, name.value.substring(0, 20), photon.value)
}
</script>

<style lang="less">
@tailwind base;
@tailwind components;
@tailwind utilities;

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  @apply fixed;
}
</style>

<style lang="less" scoped>
#popup-skill {
  max-width: 420px;
  max-height: 500px;
  @apply p-3 w-4/5 h-4/5 rounded shadow-lg bg-black bg-opacity-75 backdrop-blur-sm text-white border-4 border-double border-gray-700;
}

.popup {
  &-enter-active {
    transition: opacity 0.3s, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  &-leave-active {
    transition: transform 0.3s, opacity 0.3s;
  }
  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: scale(0.8);
  }
  &-leave-from,
  &-enter-to {
    opacity: 1;
    transform: scale(1);
  }
}

.opacity {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.3s;
  }
  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
  &-leave-from,
  &-enter-to {
    opacity: 1;
  }
}

.skill-icon {
  &:hover {
    a {
      display: inline-block;
    }
  }
}

.space-btn {
  box-shadow: 0 8px theme("colors.yellow.600");
}
</style>
