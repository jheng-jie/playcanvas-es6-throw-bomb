<template>
  <transition name="popup">
    <div v-if="store.show" class="fixed left-0 top-0 w-full h-full flex justify-center items-center">
      <div id="popup-skill" class="flex flex-col justify-center">
        <h1 class="text-xl font-bold text-center mb-2 text-yellow-500 shrink-0">點數 ( {{ store.max - store.skill }} )</h1>
        <div class="flex-1 overflow-y-auto">
          <Property @change="onChange('hp', $event)" v-model="store.attribute.hp" :graduation="store.graduation.hp" label="生命值" class="mb-2" />
          <Property @change="onChange('mp', $event)" v-model="store.attribute.mp" :graduation="store.graduation.mp" label="魔力恢復" class="mb-2" />
          <Property @change="onChange('speed', $event)" v-model="store.attribute.speed" :graduation="store.graduation.speed" label="移動速度" class="mb-2" />
          <Property @change="onChange('attackSpeed', $event)" v-model="store.attribute.attackSpeed" :graduation="store.graduation.attackSpeed" label="攻擊速度" class="mb-2" />
          <Property @change="onChange('bombPower', $event)" v-model="store.attribute.bombPower" :graduation="store.graduation.bombPower" label="炸彈速度" class="mb-2" />
          <Property @change="onChange('bombScale', $event)" v-model="store.attribute.bombScale" :graduation="store.graduation.bombScale" label="炸彈大小" class="mb-2" />
        </div>
        <div class="shrink-0 flex">
          <div class="flex-1">
            <button @click="store.clear" class="bg-yellow-600 hover:bg-yellow-700 transition-colors rounded px-3 py-1">重置</button>
          </div>
          <div class="flex-1 text-right">
            <button @click="onConfirm" class="bg-red-600 hover:bg-red-700 transition-colors rounded px-3 py-1">確定</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import Property from "./component/Property.vue"

// store
import useStore, { Attribute } from "./store"
const store = useStore()

/**
 * @desc 屬性更新
 */
const onChange = function (key: keyof Attribute, value: number) {
  store.attribute[key] = value
  const skill = store.skill

  // 合理範圍
  if (skill <= store.max) return

  // 刪除超過點數
  const adjustment: Attribute = JSON.parse(JSON.stringify(store.attribute))
  const keys = Object.keys(store.attribute).filter(k => k !== key) as Array<keyof Attribute>
  let excess = skill - store.max
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
  window?.onSkillCallback()
}

// init
onMounted(() => window?.onSkillInitialize(store))
</script>

<style lang="less">
@tailwind base;
@tailwind components;
@tailwind utilities;

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  @apply fixed top-0 left-0 w-full h-full;
}
</style>

<style lang="less" scoped>
#popup-skill {
  max-width: 420px;
  max-height: 560px;
  @apply p-3 w-4/5 h-3/5 rounded shadow-lg bg-black bg-opacity-75 backdrop-blur-sm text-white border-4 border-double border-gray-700;
}

.popup {
  &-enter-active {
    transition: opacity 0.3s, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s;
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
</style>
