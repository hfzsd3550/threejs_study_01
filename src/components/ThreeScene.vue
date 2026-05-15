<template>
  <canvas 
    ref="canvasRef" 
    class="three-canvas"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"  
    @mousemove="handleMouseMove"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  createScene,
  createCamera,
  createRenderer,
  createLights,
  animate,
  stopAnimate,
  updateCameraAspect,
  resizeRenderer,
  getScene,
  getCamera,
  setCameraTarget,
  isCameraMoving
} from '../three'
import * as THREE from 'three'

const canvasRef = ref(null)
const isMouseDown = ref(false)

// 用于区分点击和拖拽
const mouseDownPos = ref({ x: 0, y: 0 })

// 射线检测
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
// 定义可交互对象数组
const interactables = [] 

const ROOM_CONFIG = [
  { 
    name: '客厅', 
    index: 0, 
    path: './img/livingroom/', 
    pos: new THREE.Vector3(0, 0, 0), 
    rot: new THREE.Euler(0, 0, 0) 
  },
  { 
    name: '厨房', 
    index: 3, 
    path: './img/kitchen/', 
    pos: new THREE.Vector3(0, 0, 10), 
    rot: new THREE.Euler(0, -Math.PI / 2, 0) 
  },
  { 
    name: '阳台', 
    index: 8, 
    path: './img/balcony/', 
    pos: new THREE.Vector3(0, 0, -10), 
    rot: new THREE.Euler(0, 0, 0) 
  },
  { 
    name: '走廊', 
    index: 9, 
    path: './img/corridor/', 
    pos: new THREE.Vector3(10, 0, 0), 
    rot: new THREE.Euler(0, Math.PI, 0) 
  },
  { 
    name: '儿童房', 
    index: 13, 
    path: './img/childroom/', 
    pos: new THREE.Vector3(15, 0, 10), 
    rot: new THREE.Euler(0, Math.PI / 2, 0) 
  },
  { 
    name: '老人房', 
    index: 14, 
    path: './img/elderroom/', 
    pos: new THREE.Vector3(15, 0, -10), 
    rot: new THREE.Euler(0, -Math.PI / 2, 0) 
  },
  { 
    name: '卧室', 
    index: 18, 
    path: './img/bedroom/', 
    pos: new THREE.Vector3(20, 0, 0), 
    rot: new THREE.Euler(0, -Math.PI / 2, 0) 
  },
]

const CONNECTIONS = [
  // [房间名1, 房间名2, 标签世界坐标Pos1, 标签世界坐标Pos2]
  ['客厅', '厨房', new THREE.Vector3(-0.7, 0, 4.5), new THREE.Vector3(-0.7, 0, 5.5)], 
  
  ['客厅', '阳台', new THREE.Vector3(0.5, 0, -4.5), new THREE.Vector3(0.5, 0, -5.5)],

  ['客厅', '走廊', new THREE.Vector3(4.5, 0, -0.5), new THREE.Vector3(5.5, 0, -0.5)],

  ['走廊', '儿童房', new THREE.Vector3(12, 0, 4.5), new THREE.Vector3(19, 0, 5.5)],

  ['走廊', '老人房', new THREE.Vector3(13, 0, -4.5), new THREE.Vector3(12, 0, -5.5)],

  ['走廊', '卧室', new THREE.Vector3(14.5, 0, 0), new THREE.Vector3(15.5, 0, 1)],
]
function onResize() {
  updateCameraAspect(window.innerWidth, window.innerHeight)
  resizeRenderer(window.innerWidth, window.innerHeight)
}

const handleMouseDown = (event) => {
  isMouseDown.value = true
  // 记录按下时的坐标
  mouseDownPos.value = { x: event.clientX, y: event.clientY }
}

const handleMouseUp = (event) => {
  isMouseDown.value = false
  
  // 计算移动距离
  const moveDistance = Math.sqrt(
    Math.pow(event.clientX - mouseDownPos.value.x, 2) + 
    Math.pow(event.clientY - mouseDownPos.value.y, 2)
  )

  // 如果移动距离很小（例如小于 5px），则视为点击
  if (moveDistance < 5) {
    checkClick(event)
  }
}

const handleMouseMove = (event) => {
  // 如果相机正在自动移动，禁止手动旋转
  if (isCameraMoving()) return

  if (isMouseDown.value) {
    const cam = getCamera()
    if (cam) {
      cam.rotation.y -= event.movementX * 0.005
      cam.rotation.x -= event.movementY * 0.005
      cam.rotation.order = 'YXZ'
    }
  }
}

const checkClick = (event) => {
  if (!canvasRef.value) return

  const rect = canvasRef.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, getCamera())

  // 获取所有可交互的 Sprite
  const sprites = interactables.map(item => item.sprite)
  const intersects = raycaster.intersectObjects(sprites)

  if (intersects.length > 0) {
    const clickedSprite = intersects[0].object
    const info = interactables.find(item => item.sprite === clickedSprite)
    
    if (info) {
      console.log(`前往: ${info.name}`)
      setCameraTarget(info.targetPos)
    }
  }
}

function createRoom(config) { ['客厅', '走廊', new THREE.Vector3(4.5, 0, 0), new THREE.Vector3(5.5, 0, 0)]
  const geometry = new THREE.BoxGeometry(10, 10, 10)
  geometry.scale(1, 1, -1)
  
  const arr = [
    `${config.index}_r`, `${config.index}_l`, `${config.index}_u`,
    `${config.index}_d`, `${config.index}_f`, `${config.index}_b`
  ]
  const materials = []
  const loader = new THREE.TextureLoader()

  arr.forEach((item) => {
    const texture = loader.load(config.path + item + '.jpg')
    texture.colorSpace = THREE.SRGBColorSpace
    materials.push(new THREE.MeshBasicMaterial({ map: texture }))
  })

  const cube = new THREE.Mesh(geometry, materials)
  cube.position.copy(config.pos)
  cube.rotation.copy(config.rot)
  getScene().add(cube)
  
  return config.name // 返回名字用于后续匹配
}

// --- 4. 辅助函数：创建导航标签 ---
function createNavigationLabel(text, position, targetPos) {
  const label = new SpriteText(text, position)
  if (label && label.sprite) {
    interactables.push({
      sprite: label.sprite,
      targetPos: targetPos,
      name: text
    })
  }
}

onMounted(async () => {
  createScene()
  createCamera()
  createRenderer(canvasRef.value)
  createLights()

  window.addEventListener('resize', onResize)

  // A. 批量创建房间
  const roomMap = new Map() // 名字 -> 配置对象，方便查找位置
  ROOM_CONFIG.forEach(config => {
    createRoom(config)
    roomMap.set(config.name, config)
  })

  // B. 批量创建连接标签
  CONNECTIONS.forEach(conn => {
    const [name1, name2, pos1, pos2] = conn
    const room1 = roomMap.get(name1)
    const room2 = roomMap.get(name2)

    if (room1 && room2) {
      // 在房间1附近创建去房间2的标签
      createNavigationLabel(`去${name2}`, pos1, room2.pos)
      // 在房间2附近创建去房间1的标签
      createNavigationLabel(`去${name1}`, pos2, room1.pos)
    }
  })

  animate()
})

onBeforeUnmount(() => {
  stopAnimate()
  window.removeEventListener('resize', onResize)
})

class Room {
  constructor(name, roomIndex, textureURL, position = new THREE.Vector3(0, 0, 0), euler = new THREE.Euler(0, 0, 0)) {
    const geometry = new THREE.BoxGeometry(10, 10, 10)
    geometry.scale(1, 1, -1) // 内部可见
    this.name = name
    
    const arr = [
      `${roomIndex}_r`, `${roomIndex}_l`, `${roomIndex}_u`,
      `${roomIndex}_d`, `${roomIndex}_f`, `${roomIndex}_b`
    ]
    const materials = []
    const loader = new THREE.TextureLoader()

    arr.forEach((item) => {
      const texture = loader.load(textureURL + item + '.jpg')
      texture.colorSpace = THREE.SRGBColorSpace
      materials.push(new THREE.MeshBasicMaterial({ map: texture }))
    })

    const cube = new THREE.Mesh(geometry, materials)
    cube.position.copy(position)
    cube.rotation.copy(euler)
    getScene().add(cube)
  }
}

class SpriteText {
  constructor(text, position = new THREE.Vector3(0, 0, 0)) {
    const canvas = document.createElement('canvas')
    canvas.width = 512 
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    
    // 绘制半透明背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
    ctx.fillRect(0, 0, 512, 256)
    
    // 绘制文字背景条
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.fillRect(50, 50, 412, 131)

    // 绘制文字
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = 'bold 80px Arial'
    ctx.fillStyle = 'white'
    ctx.fillText(text, 256, 128)
    
    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true })

    const sprite = new THREE.Sprite(material)
    sprite.position.copy(position)
    // 设置 Sprite 的世界空间大小
    sprite.scale.set(1, 1, 1) 
    
    // 【关键】必须将 sprite 赋值给 this.sprite，以便外部访问
    this.sprite = sprite
    
    getScene().add(sprite)
  }
}
</script>

<style scoped>
.three-canvas {
  display: block;
  width: 100%;
  height: 100%;
  outline: none;
  cursor: grab;
}
.three-canvas:active {
  cursor: grabbing;
}
</style>