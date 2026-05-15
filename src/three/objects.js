import * as THREE from 'three'
import { getScene } from './scene'

let cube = null

export function createTestCube() {
  const scene = getScene()

  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshStandardMaterial({
    color: 0x4fc3f7,
    roughness: 0.3,
    metalness: 0.1,
  })
  cube = new THREE.Mesh(geometry, material)
  cube.castShadow = true
  cube.receiveShadow = true
  scene.add(cube)

  return cube
}

export function getCube() {
  return cube
}

export function createGround() {
  const scene = getScene()

  const geometry = new THREE.PlaneGeometry(10, 10)
  const material = new THREE.MeshStandardMaterial({
    color: 0x2d2d44,
    roughness: 0.8,
    metalness: 0.2,
  })
  const ground = new THREE.Mesh(geometry, material)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -1.5
  ground.receiveShadow = true
  scene.add(ground)

  return ground
}

export function createGridHelper() {
  const scene = getScene()
  const grid = new THREE.GridHelper(10, 20, 0x444466, 0x333355)
  grid.position.y = -1.49
  scene.add(grid)
  return grid
}
