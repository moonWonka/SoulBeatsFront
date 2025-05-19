// src/components/swipe/SwipeCard.tsx
import { useSpring, animated as a } from '@react-spring/web'
import { useGesture } from '@use-gesture/react'

interface SwipeCardProps {
  onSwipe: (direction: 'left' | 'right') => void
  children: React.ReactNode
}

export function SwipeCard({ onSwipe, children }: SwipeCardProps) {
  const [{ x, rot, scale }, api] = useSpring(() => ({
    x: 0,
    rot: 0,
    scale: 1,
    config: { tension: 300, friction: 30 },
  }))

  const bind = useGesture({
    onDrag: ({ down, movement: [mx], direction: [dx], velocity }) => {
      const trigger = velocity[0] > 0.3
      const dir = dx < 0 ? -1 : 1

      if (!down && trigger) {
        api.start({ x: dir * 1000, rot: dir * 45, scale: 1 })
        onSwipe(dir === 1 ? 'right' : 'left')
      } else {
        api.start({
          x: down ? mx : 0,
          rot: down ? mx / 20 : 0,
          scale: down ? 1.05 : 1,
        })
      }
    }
  })

  return (
    <a.div
      className="swipe-card"
      {...bind()}
      style={{
        x,
        rotateZ: rot.to((r) => `${r}deg`),
        scale,
        touchAction: 'none',
      }}
    >
      {children}
    </a.div>
  )
}
