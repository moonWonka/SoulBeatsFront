import React, { useState, useRef } from 'react'
import { ActionButtons } from '../revision'
import { UserProfile } from '../../types'

// Simple header with placeholder logo text
const DemoHeader: React.FC = () => (
  <header className="flex justify-center mb-2">
    <span className="text-white font-bold text-lg">SoulBeats</span>
  </header>
)

// Individual profile card
interface ProfileCardProps {
  profile: UserProfile
  index: number
  total: number
  onStartDrag: (e: React.MouseEvent | React.TouchEvent) => void
}

const SwipeCard: React.FC<ProfileCardProps> = ({ profile, index, total, onStartDrag }) => (
  <article
    className="absolute inset-0 w-full h-full rounded-xl shadow-lg cursor-grab overflow-hidden"
    style={{ zIndex: total - index }}
    onMouseDown={onStartDrag}
    onTouchStart={onStartDrag}
  >
    <img
      src={profile.imageUrl}
      alt={`${profile.name} ${profile.age}`}
      className="w-full h-full object-cover"
    />
    <h2 className="text-white absolute inset-0 flex items-end p-4 text-xl font-semibold bg-gradient-to-t from-black/80 via-black/30 to-transparent">
      {profile.name}, <span className="ml-2 font-light">{profile.age}</span>
    </h2>
  </article>
)

// Card stack container
interface CardStackProps {
  profiles: UserProfile[]
  isAnimating: boolean
  onStartDrag: (e: React.MouseEvent | React.TouchEvent) => void
}

const CardStack: React.FC<CardStackProps> = ({ profiles, onStartDrag }) => (
  <div className="relative w-full h-full mx-auto">
    {profiles.map((profile, idx) => (
      <SwipeCard
        key={profile.id}
        profile={profile}
        index={idx}
        total={profiles.length}
        onStartDrag={onStartDrag}
      />
    ))}
  </div>
)

// Hook for swipe logic
const useSwipe = (
  profiles: UserProfile[],
  setProfiles: React.Dispatch<React.SetStateAction<UserProfile[]>>, 
  setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const pullDeltaX = useRef(0)
  const DECISION_THRESHOLD = 75

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    const card = (e.target as HTMLElement).closest('article') as HTMLElement | null
    if (!card) return

    const startX = 'touches' in e ? e.touches[0].pageX : e.pageX
    if (!startX) return

    const onMove = (ev: MouseEvent | TouchEvent) => {
      const currentX = 'touches' in ev ? ev.touches[0].pageX : (ev as MouseEvent).pageX
      pullDeltaX.current = currentX - startX
      if (pullDeltaX.current === 0) return
      setIsAnimating(true)
      const deg = pullDeltaX.current / 15
      card.style.transform = `translateX(${pullDeltaX.current}px) rotate(${deg}deg)`
      card.style.cursor = 'grabbing'
    }

    const onEnd = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onEnd)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onEnd)

      const decision = Math.abs(pullDeltaX.current) >= DECISION_THRESHOLD
      if (decision) {
        const goRight = pullDeltaX.current >= 0
        card.classList.add(goRight ? 'go-right' : 'go-left')
        card.addEventListener('transitionend', () => {
          setProfiles(p => p.slice(1))
          setIsAnimating(false)
        }, { once: true })
      } else {
        card.classList.add('reset')
        setTimeout(() => {
          setIsAnimating(false)
          pullDeltaX.current = 0
          card.removeAttribute('style')
          card.style.cursor = 'grab'
        }, 300)
      }
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onEnd)
    document.addEventListener('touchmove', onMove, { passive: true })
    document.addEventListener('touchend', onEnd, { passive: true })
  }

  return { startDrag }
}

// Main demo component
const SwipeDemo2: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [profiles, setProfiles] = useState<UserProfile[]>([
    { id: '1', name: 'Álex', age: 25, imageUrl: '/descarga.jpg', bio: '', interests: [] },
    { id: '2', name: 'María', age: 27, imageUrl: '/descarga.jpg', bio: '', interests: [] },
    { id: '3', name: 'Carlos', age: 29, imageUrl: '/descarga.jpg', bio: '', interests: [] }
  ])

  const { startDrag } = useSwipe(profiles, setProfiles, setIsAnimating)

  const handleLike = () => {
    setProfiles(p => p.slice(1))
  }

  const handleNope = () => {
    setProfiles(p => p.slice(1))
  }

  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <main
        className="relative flex shadow-2xl"
        style={{
          backgroundImage: `url('/img/iphone.webp')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          width: '320px',
          height: '640px'
        }}
      >
        <section className="bg-white dark:bg-gray-900 w-full rounded-3xl flex flex-col gap-4 overflow-hidden relative p-4 m-6">
          <DemoHeader />
          <div className="flex-grow relative">
            <CardStack profiles={profiles} isAnimating={isAnimating} onStartDrag={startDrag} />
          </div>
          <ActionButtons onLike={handleLike} onNope={handleNope} disabled={isAnimating} />
        </section>
      </main>
      <style jsx>{`
        .go-left {
          transform: translateX(-200%) rotate(-30deg) !important;
          transition: transform 0.3s ease;
        }
        .go-right {
          transform: translateX(200%) rotate(30deg) !important;
          transition: transform 0.3s ease;
        }
        .reset {
          transition: transform 0.3s ease;
          transform: translateX(0) !important;
        }
      `}</style>
    </div>
  )
}

export default SwipeDemo2
