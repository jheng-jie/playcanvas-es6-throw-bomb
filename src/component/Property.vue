<template>
  <div>
    <div class="flex items-center mb-2 font-bold">
      <button @mousedown.prevent.stop="onClickUpdateValue(-props.graduation)" class="btn">
        <Icon icon="chevron-left" />
      </button>
      <div class="flex-1 text-center text-sm">
        {{ props.label || "" }}
        ( {{ modelValue }}% )
      </div>
      <button @mousedown.prevent.stop="onClickUpdateValue(props.graduation)" class="btn">
        <Icon icon="chevron-right" />
      </button>
    </div>
    <div @mousedown.prevent.stop="onProgressClick" class="progress">
      <div :style="`width: ${percent}`" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, toRef, watch } from "vue"

const emit = defineEmits(["update:model-value", "change"])

const props = defineProps({
  label: String,
  modelValue: {
    type: Number,
    default: 0,
  },
  graduation: {
    type: Number,
    default: 1,
  },
})

const modelValue = toRef(props, "modelValue")
watch(modelValue, () => {
  if (value.value === modelValue.value) return
  value.value = modelValue.value
})

// 數值
const value = ref<number>(modelValue.value)

// 百分比
const percent = computed(() => `${((value.value / 100) * 100).toFixed(2)}%`)

/**
 * @desc 取消按著
 */
const onMouseUp = function () {
  window.removeEventListener("mouseup", onMouseUp)
  pressToken.value = ""
}

// 點擊事件 token
const pressToken = ref<string>("")

/**
 * @desc 點擊更新數值
 */
const onClickUpdateValue = async function (variable: number) {
  window.addEventListener("mouseup", onMouseUp, false)

  // 更新數值
  value.value = Math.max(0, Math.min(100, value.value + variable))
  emit("change", value.value)

  // 產生點擊事件標記點
  const token = (Date.now() + Math.random()).toString()
  pressToken.value = token

  // 延遲
  await new Promise(resolve => setTimeout(resolve, 333))
  if (pressToken.value !== token) return

  // 自動累加
  let autoControl = setInterval(() => {
    // 結束
    if (pressToken.value !== token || value.value >= 100 || value.value <= 0) {
      clearInterval(autoControl)
      return
    }
    // 持續更新數值
    value.value = Math.max(0, Math.min(100, value.value + variable))
    emit("change", value.value)
  }, 33)
}

/**
 * @desc 進度條點擊
 */
const onProgressClick = function (event: MouseEvent) {
  const element: HTMLDivElement = event.target as HTMLDivElement
  if (!element.classList.contains("progress")) return

  // box data
  const bounding = element.getBoundingClientRect()

  // 更新數值
  const update = (variable: number) => {
    const max = 100 / props.graduation
    const percent = Math.ceil(Math.max(0, Math.min(1, variable / bounding.width)) * max)
    value.value = percent * props.graduation
    emit("change", value.value)
  }
  update(event.x - bounding.x)

  // 產生點擊事件標記點
  const token = (Date.now() + Math.random()).toString()
  pressToken.value = token

  // 拖動事件
  const onMouseMove = (event: MouseEvent) => {
    // 結束
    if (pressToken.value !== token) {
      window.removeEventListener("mousemove", onMouseMove)
      return
    }
    update(event.x - bounding.x)
  }

  // listen
  window.addEventListener("mouseup", onMouseUp, false)
  window.addEventListener("mousemove", onMouseMove, false)
}
</script>

<style lang="less" scoped>
.btn {
  @apply px-2 ~"py-0.5" bg-gray-600 rounded scale-75 bg-yellow-600 hover:bg-yellow-800 transition-colors font-bold;
}
.progress {
  @apply w-full bg-gray-200 rounded-full ~"h-2.5" cursor-pointer;
  &:hover {
    > div {
      @apply bg-yellow-800;
    }
  }
  > div {
    transition: width 0.1s, background-color 0.3s;
    @apply bg-yellow-600 ~"h-2.5" rounded-full shadow-md pointer-events-none;
  }
}
</style>
