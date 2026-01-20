import React, { useRef, useEffect, useState } from 'react';
import { User } from '../services/api';

interface VirtualListProps {
  items: User[];
  total?: number;
  hasMore: boolean;
  loadMore: () => void;
  onItemsRendered?: (visibleRange: { startIndex: number; stopIndex: number }) => void;
  scrollToIndex?: number;
}

const VirtualList: React.FC<VirtualListProps> = ({ 
  items, 
  total,
  hasMore, 
  loadMore,
  onItemsRendered,
  scrollToIndex
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const itemHeight = 40;
  const containerHeight = 600;
  const overscan = 5; // Render extra items above/below viewport

  // Scroll to specific index when scrollToIndex changes
  useEffect(() => {
    if (scrollToIndex !== undefined && scrollToIndex >= 0 && scrollToIndex < items.length && containerRef.current) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        if (containerRef.current) {
          const targetScrollTop = scrollToIndex * itemHeight;
          containerRef.current.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
          });
          setScrollTop(targetScrollTop);
        }
      }, 50);
    }
  }, [scrollToIndex, itemHeight, items.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);

      // Load more if near bottom
      const scrolledToBottom = 
        container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
      
      if (scrolledToBottom && hasMore) {
        loadMore();
      }

      // Notify parent of visible range
      if (onItemsRendered) {
        const visibleStartIndex = Math.floor(container.scrollTop / itemHeight);
        const visibleStopIndex = Math.min(
          items.length - 1,
          Math.ceil((container.scrollTop + container.clientHeight) / itemHeight)
        );
        onItemsRendered({ startIndex: visibleStartIndex, stopIndex: visibleStopIndex });
      }
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => container.removeEventListener('scroll', handleScroll);
  }, [items.length, hasMore, loadMore, onItemsRendered, itemHeight]);

  // Calculate which items to render
  const visibleStartIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleStopIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = [];
  for (let i = visibleStartIndex; i <= visibleStopIndex; i++) {
    if (i < items.length) {
      visibleItems.push(items[i]);
    }
  }

  // Use total if provided, otherwise use items.length
  const totalItems = total && total > 0 ? total : items.length;
  const totalHeight = totalItems * itemHeight;
  const offsetY = visibleStartIndex * itemHeight;

  return (
    <div
      ref={containerRef}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
        border: '1px solid #ddd'
      }}
    >
      {/* Spacer for items above viewport */}
      <div style={{ height: offsetY }} />
      
      {/* Visible items */}
      <div>
        {visibleItems.map((item, index) => {
          const actualIndex = visibleStartIndex + index;
          return (
            <div
              key={item.id || actualIndex}
              style={{
                height: itemHeight,
                padding: '10px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <span style={{ marginRight: '10px', color: '#666' }}>#{item.id}</span>
              <span>{item.name}</span>
            </div>
          );
        })}
      </div>

      {/* Spacer for items below viewport */}
      <div style={{ height: Math.max(0, totalHeight - (visibleStopIndex + 1) * itemHeight) }} />

      {/* Loading indicator */}
      {hasMore && visibleStopIndex >= items.length - 1 && (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div>Loading more...</div>
        </div>
      )}
    </div>
  );
};

export default VirtualList;