import './SwipePage.css'
import { SwipeCard } from '../components/swipe'

export function SwipePage() {
  const handleSwipe = (direction: 'left' | 'right') => {
    console.log(`Swiped ${direction}`)
  }

  return (
    <div className="page-container">
      <SwipeCard onSwipe={handleSwipe}>
        <div className="card-content">
          <img
            src="https://cdn-icons-png.flaticon.com/512/727/727218.png"
            alt="género"
            className="genre-icon"
          />
          <h2>🎶 Indie Pop</h2>
          <p>Conecta con amantes de la música alternativa y sonidos suaves.</p>
        </div>
      </SwipeCard>

    </div>
  )
}

export default SwipePage
