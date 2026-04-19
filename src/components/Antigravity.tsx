import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

interface AntigravityProps {
  count?: number
  magnetRadius?: number
  ringRadius?: number
  waveSpeed?: number
  waveAmplitude?: number
  particleSize?: number
  lerpSpeed?: number
  color?: string
  autoAnimate?: boolean
  particleVariance?: number
  rotationSpeed?: number
  depthFactor?: number
  pulseSpeed?: number
  particleShape?: 'capsule' | 'sphere' | 'box' | 'tetrahedron'
  fieldStrength?: number
  opacity?: number
  additiveBlend?: boolean
}

type Particle = {
  t: number
  speed: number
  mx: number
  my: number
  mz: number
  cx: number
  cy: number
  cz: number
  randomRadiusOffset: number
}

const AntigravityInner = ({
  count = 300,
  magnetRadius = 6,
  ringRadius = 7,
  waveSpeed = 0.4,
  waveAmplitude = 1,
  particleSize = 1.5,
  lerpSpeed = 0.05,
  color = '#5227FF',
  autoAnimate = true,
  particleVariance = 1,
  rotationSpeed = 0,
  depthFactor = 1,
  pulseSpeed = 3,
  particleShape = 'capsule',
  fieldStrength = 10,
  opacity = 0.9,
  additiveBlend = true,
}: AntigravityProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const { viewport } = useThree()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const lastMousePos = useRef({ x: 0, y: 0 })
  const lastMouseMoveTime = useRef(0)
  const virtualMouse = useRef({ x: 0, y: 0 })

  const particles = useMemo<Particle[]>(() => {
    const temp: Particle[] = []
    const spreadX = viewport.width * 1.3
    const spreadY = viewport.height * 1.3
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const mx = (Math.random() - 0.5) * spreadX
      const my = (Math.random() - 0.5) * spreadY
      const mz = (Math.random() - 0.5) * 25
      temp.push({
        t,
        speed,
        mx,
        my,
        mz,
        cx: mx,
        cy: my,
        cz: mz,
        randomRadiusOffset: (Math.random() - 0.5) * 2,
      })
    }
    return temp
  }, [count, viewport.width, viewport.height])

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return

    const { viewport: v, pointer: m } = state
    const mouseDist = Math.hypot(m.x - lastMousePos.current.x, m.y - lastMousePos.current.y)

    if (mouseDist > 0.001) {
      lastMouseMoveTime.current = Date.now()
      lastMousePos.current = { x: m.x, y: m.y }
    }

    let destX = (m.x * v.width) / 2
    let destY = (m.y * v.height) / 2

    if (autoAnimate && Date.now() - lastMouseMoveTime.current > 2000) {
      const time = state.clock.getElapsedTime()
      destX = Math.sin(time * 0.5) * (v.width / 4)
      destY = Math.cos(time) * (v.height / 4)
    }

    const smoothFactor = 0.05
    virtualMouse.current.x += (destX - virtualMouse.current.x) * smoothFactor
    virtualMouse.current.y += (destY - virtualMouse.current.y) * smoothFactor

    const targetX = virtualMouse.current.x
    const targetY = virtualMouse.current.y
    const globalRotation = state.clock.getElapsedTime() * rotationSpeed

    particles.forEach((particle, i) => {
      particle.t += particle.speed / 2

      const projectionFactor = 1 - particle.cz / 50
      const projectedTargetX = targetX * projectionFactor
      const projectedTargetY = targetY * projectionFactor

      const dx = particle.mx - projectedTargetX
      const dy = particle.my - projectedTargetY
      const dist = Math.hypot(dx, dy)

      let targetPos = {
        x: particle.mx,
        y: particle.my,
        z: particle.mz * depthFactor,
      }

      if (dist < magnetRadius) {
        const angle = Math.atan2(dy, dx) + globalRotation
        const wave = Math.sin(particle.t * waveSpeed + angle) * (0.5 * waveAmplitude)
        const deviation = particle.randomRadiusOffset * (5 / (fieldStrength + 0.1))
        const currentRingRadius = ringRadius + wave + deviation

        targetPos = {
          x: projectedTargetX + currentRingRadius * Math.cos(angle),
          y: projectedTargetY + currentRingRadius * Math.sin(angle),
          z: particle.mz * depthFactor + Math.sin(particle.t) * waveAmplitude * depthFactor,
        }
      }

      particle.cx += (targetPos.x - particle.cx) * lerpSpeed
      particle.cy += (targetPos.y - particle.cy) * lerpSpeed
      particle.cz += (targetPos.z - particle.cz) * lerpSpeed

      dummy.position.set(particle.cx, particle.cy, particle.cz)
      dummy.lookAt(projectedTargetX, projectedTargetY, particle.cz)
      dummy.rotateX(Math.PI / 2)

      const currentDistToMouse = Math.hypot(particle.cx - projectedTargetX, particle.cy - projectedTargetY)
      const distFromRing = Math.abs(currentDistToMouse - ringRadius)
      const scaleFactor = Math.max(0, Math.min(1, 1 - distFromRing / 10))
      const finalScale =
        scaleFactor * (0.8 + Math.sin(particle.t * pulseSpeed) * 0.2 * particleVariance) * particleSize

      dummy.scale.set(finalScale, finalScale, finalScale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })

    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {particleShape === 'capsule' && <capsuleGeometry args={[0.1, 0.4, 4, 8]} />}
      {particleShape === 'sphere' && <sphereGeometry args={[0.2, 16, 16]} />}
      {particleShape === 'box' && <boxGeometry args={[0.3, 0.3, 0.3]} />}
      {particleShape === 'tetrahedron' && <tetrahedronGeometry args={[0.3]} />}
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        toneMapped={false}
        blending={additiveBlend ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </instancedMesh>
  )
}

export default function Antigravity(props: AntigravityProps) {
  return (
    <Canvas camera={{ position: [0, 0, 50], fov: 35 }}>
      <AntigravityInner {...props} />
    </Canvas>
  )
}
