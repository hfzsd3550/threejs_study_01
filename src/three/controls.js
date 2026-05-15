import { getCamera } from './camera'
import { getRenderer } from './renderer'

let controls = null

export function createControls() {
  // 使用静态 import 以支持 tree-shaking
  // OrbitControls 从 three/examples 导入
  return import('three/examples/jsm/controls/OrbitControls.js').then(
    ({ OrbitControls }) => {
      controls = new OrbitControls(getCamera(), getRenderer().domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.minDistance = 2
      controls.maxDistance = 20
      controls.maxPolarAngle = Math.PI / 2
      return controls
    }
  )
}

export function getControls() {
  if (!controls) {
    throw new Error('控制器尚未创建，请先调用 createControls()')
  }
  return controls
}

export function updateControls() {
  if (controls) {
    controls.update()
  }
}
