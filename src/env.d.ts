/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

// window 新增属性
interface Window {
  onSkillCallback: (store: any) => void
  onAuthInitialize: (store: any, name: string, photon: string) => void
}
