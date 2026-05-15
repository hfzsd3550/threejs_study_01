import * as THREE from 'three'

let scene = null

export function createScene() {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a1a2e)
  return scene
}

export function getScene() {
  if (!scene) {
    throw new Error('场景尚未创建，请先调用 createScene()')
  }
  return scene
}
