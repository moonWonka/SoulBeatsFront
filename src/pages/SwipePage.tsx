import './SwipePage.css'; // Assuming you'll create a corresponding CSS file
import { User } from '../types'; // Import the User interface

const SwipePage: React.FC = () => {
  // You'll manage the content to be swiped here, likely using state  const [currentItem, setCurrentItem] = React.useState<User | null>(null);
  const [currentItem, setCurrentItem] = React.useState<User | null>(null); 

  // Example user data
  const items: User[] = [
    { id: 1, name: 'Alice', description: 'Enjoys hiking and reading.', imageUrl: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=Alice' },
    { id: 2, name: 'Bob', description: 'Loves playing guitar and cooking.', imageUrl: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=Bob' },
    { id: 3, name: 'Charlie', description: 'Into photography and travel.', imageUrl: 'https://via.placeholder.com/150/3357FF/FFFFFF?text=Charlie' },
    { id: 4, name: 'Diana', description: 'Passionate about painting and yoga.', imageUrl: 'https://via.placeholder.com/150/FFFF33/000000?text=Diana' },
    { id: 5, name: 'Ethan', description: 'Software engineer and gamer.', imageUrl: 'https://via.placeholder.com/150/FF33FF/FFFFFF?text=Ethan' },
  ];

  React.useEffect(() => {
    // Load initial item
    // Ensure there are items before setting the current item
    if (items.length > 0) {
    setCurrentItem(items[0]);
  }, []);

  const handleSwipe = (direction: 'like' | 'dislike' | 'superlike') => {
    console.log(`Swiped ${direction} on ${currentItem.name}`);
    // Implement your logic for handling the swipe (e.g., moving to the next item, making API calls)
    const currentIndex = items.findIndex(item => item.id === currentItem.id);
    if (currentIndex < items.length - 1) {
      setCurrentItem(items[currentIndex + 1]);
    } else {
      setCurrentItem(null); // No more items
    }
  };

  return (
    <div className="swipe-page-container">
      <header className="swipe-page-header">
        <h1>Swipe App</h1>
        {/* Add header content here */}
      </header>

      <main className="swipe-page-main">
        {currentItem ? (
          <div className="swipe-card">
            <h2>{currentItem.name}</h2>
            <img src={currentItem.imageUrl} alt={currentItem.name} style={{ width: '100%', height: 'auto' }} />
            <p>{currentItem.description}</p>
            {/* Add more content for the card here (e.g., image) */}
          </div>
        ) : (
          <div className="no-more-items">
            No more items to display.
          </div>
        )}
      </main>

      <footer className="swipe-page-footer">
        <div className="swipe-buttons">
          <button className="dislike-button" onClick={() => handleSwipe('dislike')}>Dislike</button>
          <button className="superlike-button" onClick={() => handleSwipe('superlike')}>Super Like</button>
          <button className="like-button" onClick={() => handleSwipe('like')}>Like</button>
        </div>
        {/* Add footer content here */}
      </footer>
    </div>
  );
};

export default SwipePage;