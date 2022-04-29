<template>
  <transition name="popup">
    <div v-if="store.show" @click.prevent.stop="false" class="fixed left-0 top-0 w-full h-full flex justify-center items-center">
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
            <div class="flex-1 justify-end flex cursor-pointer select-none">
              <div @click="store.space = SPACE_SKILL.ROLL" class="py-1 px-2 rounded-l border border-yellow-600" :class="store.space === SPACE_SKILL.ROLL ? 'bg-yellow-600' : 'bg-transparent'">
                翻滾
              </div>
              <div @click="store.space = SPACE_SKILL.DEFENCE" class="py-1 px-2 rounded-r border border-yellow-600" :class="store.space === SPACE_SKILL.DEFENCE ? 'bg-yellow-600' : 'bg-transparent'">
                盾牌
              </div>
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

  <!--floating btn-->
  <div @click.prevent.stop="store.show = !store.show" class="skill-icon cursor-pointer w-12 h-12 fixed bottom-2 left-2 z-50 select-none">
    <img src="./asset/skills.png" alt="https://www.flaticon.com/authors/freepik" class="hover:scale-110 transition-all" />
    <a class="fixed left-16 bottom-2 break-normal text-white bg-black px-2 hidden text-xs" href="https://www.flaticon.com/free-icons/worker" title="worker icons">
      Worker icons created by Freepik - Flaticon
    </a>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import Property from "./component/Property.vue"

// store
import useStore, { Attribute, SPACE_SKILL } from "./store"
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
  window?.onSkillCallback(store)
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
