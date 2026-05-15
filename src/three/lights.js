import * as THREE from 'three'
import { getScene } from './scene'

let ambientLight = null
let directionalLight = null

export function createLights() {
  const scene = getScene()

  ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 10, 5)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 1024
  directionalLight.shadow.mapSize.height = 1024
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 50
  directionalLight.shadow.camera.left = -10
  directionalLight.shadow.camera.right = 10
  directionalLight.shadow.camera.top = 10
  directionalLight.shadow.camera.bottom = -10
  scene.add(directionalLight)

  return { ambientLight, directionalLight }
}

export function getAmbientLight() {
  return ambientLight
}

export function getDirectionalLight() {
  return directionalLight
}
