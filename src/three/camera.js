import * as THREE from 'three'

let camera = null

export function createCamera() {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 0)
  camera.lookAt(0, 0, -1)
  return camera
}

export function getCamera() {
  if (!camera) {
    throw new Error('相机尚未创建，请先调用 createCamera()')
  }
  return camera
}

export function updateCameraAspect(width, height) {
  const cam = getCamera()
  cam.aspect = width / height
  cam.updateProjectionMatrix()
}
