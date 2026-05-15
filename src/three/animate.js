import { getRenderer } from './renderer'
import { getScene } from './scene'
import { getCamera } from './camera'
import { updateControls } from './controls'
import { getCube } from './objects'
import * as THREE from 'three'

let animationId = null

const cameraState = {
  isMoving: false,
  startPosition: new THREE.Vector3(),
  targetPosition: new THREE.Vector3(),
  progress: 0,
  speed: 0.08 // 移动速度系数
}

export function setCameraTarget(targetPos) {
  const camera = getCamera()
  if (!camera) return

  cameraState.isMoving = true
  cameraState.startPosition.copy(camera.position)
  cameraState.targetPosition.copy(targetPos)
  cameraState.progress = 0
}

/**
 * 停止相机自动移动（例如用户开始手动拖拽时调用）
 */
export function stopCameraMove() {
  cameraState.isMoving = false
}

/**
 * 检查相机是否正在自动移动
 */
export function isCameraMoving() {
  return cameraState.isMoving
}
export function animate() {
  animationId = requestAnimationFrame(animate)

    // --- 新增：处理相机移动逻辑 ---
  if (cameraState.isMoving) {
    const camera = getCamera()
    cameraState.progress += cameraState.speed

    if (cameraState.progress >= 1) {
      // 移动结束
      cameraState.progress = 1
      cameraState.isMoving = false
      camera.position.copy(cameraState.targetPosition)
    } else {
      // 使用线性插值平滑移动
      camera.position.lerpVectors(cameraState.startPosition, cameraState.targetPosition, cameraState.progress)
    }
  }

  updateControls()

  const renderer = getRenderer()
  const scene = getScene()
  const camera = getCamera()
  renderer.render(scene, camera)
}

export function stopAnimate() {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}
