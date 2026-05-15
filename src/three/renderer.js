import * as THREE from 'three'

let renderer = null

export function createRenderer(canvas) {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  return renderer
}

export function getRenderer() {
  if (!renderer) {
    throw new Error('渲染器尚未创建，请先调用 createRenderer()')
  }
  return renderer
}

export function resizeRenderer(width, height) {
  const r = getRenderer()
  r.setSize(width, height)
  r.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}
