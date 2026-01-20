import React, { useCallback, useState, useEffect, useRef } from 'react';
import './App.css';
import VirtualList from './components/VirtualList';
import AlphabetMenu from './components/AlphabetMenu';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';

const ITEMS_PER_PAGE = 500;

function App() {
  const { items, total, hasMore, loading, loadMore, jumpToPosition } = useInfiniteScroll(ITEMS_PER_PAGE);
  const [scrollToIndex, setScrollToIndex] = useState<number | undefined>(undefined);
  const targetPositionRef = useRef<number | null>(null);
  const isLoadingTargetRef = useRef(false);

  // When loading finishes and we have a target position, scroll to it
  useEffect(() => {
    if (!loading && targetPositionRef.current !== null && items.length > 0 && isLoadingTargetRef.current) {
      const targetId = targetPositionRef.current + 1; // Convert to 1-based
      const index = items.findIndex(item => item.id >= targetId);
      if (index >= 0) {
        setScrollToIndex(index);
        isLoadingTargetRef.current = false;
      } else {
        // If not found, the item might not be loaded yet, wait a bit more
        setTimeout(() => {
          const retryIndex = items.findIndex(item => item.id >= targetId);
          if (retryIndex >= 0) {
            setScrollToIndex(retryIndex);
          } else {
            setScrollToIndex(0);
          }
          isLoadingTargetRef.current = false;
        }, 300);
        return;
      }
      targetPositionRef.current = null; // Reset
    }
  }, [loading, items]);

  const handleLetterClick = useCallback((letter: string, position: number) => {
    targetPositionRef.current = position; // Store target position
    isLoadingTargetRef.current = true;
    setScrollToIndex(undefined); // Reset scroll index
    jumpToPosition(position); // Load items around this position
  }, [jumpToPosition]);

  return (
    <div className="App">
      <header style={{ padding: '20px', backgroundColor: '#282c34', color: 'white' }}>
        <h1>Large List Viewer - 10M Users</h1>
        <p>Loaded: {items.length.toLocaleString()} / {total > 0 ? total.toLocaleString() : '...'} users</p>
      </header>
      
      <AlphabetMenu 
        onLetterClick={handleLetterClick} 
        itemsPerPage={ITEMS_PER_PAGE}
      />
      
      <div style={{ padding: '20px' }}>
        <VirtualList
          items={items}
          total={total}
          hasMore={hasMore}
          loadMore={loadMore}
          scrollToIndex={scrollToIndex}
        />
        {loading && <div style={{ padding: '20px', textAlign: 'center' }}>Loading more...</div>}
      </div>
    </div>
  );
}

export default App;