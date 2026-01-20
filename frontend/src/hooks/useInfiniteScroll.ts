import { useState, useEffect, useCallback } from 'react';
import { fetchUsers, fetchTotalCount, User, UsersResponse } from '../services/api';

interface UseInfiniteScrollReturn {
  items: User[];
  total: number;
  hasMore: boolean;
  loading: boolean;
  loadMore: () => void;
  jumpToPosition: (position: number) => void;
  loadAroundPosition: (position: number, range: number) => void;
}

export const useInfiniteScroll = (itemsPerPage: number = 500): UseInfiniteScrollReturn => {
  const [items, setItems] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());

  const loadData = useCallback(async (page: number, append: boolean = true) => {
    if (loading || loadedPages.has(page)) return;
    
    setLoading(true);
    try {
      const response: UsersResponse = await fetchUsers(page, itemsPerPage);
      
      if (response.total !== undefined) {
        setTotal(response.total);
      }
      
      if (append) {
        setItems(prev => {
          // Merge and sort by id to maintain order
          const merged = [...prev, ...response.data];
          const unique = merged.filter((item, index, self) => 
            index === self.findIndex((t) => t.id === item.id)
          );
          return unique.sort((a, b) => a.id - b.id);
        });
      } else {
        setItems(response.data);
        setLoadedPages(new Set([page]));
      }
      
      setHasMore(response.hasMore);
      setCurrentPage(page);
      setLoadedPages(prev => {
        const newSet = new Set(prev);
        newSet.add(page);
        return newSet;
      });
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, itemsPerPage, loadedPages]);

  const loadAroundPosition = useCallback(async (position: number, range: number = 1000) => {
    if (loading) return;
    
    const startPage = Math.max(1, Math.floor((position - range) / itemsPerPage) + 1);
    const endPage = Math.floor((position + range) / itemsPerPage) + 1;
    
    setLoading(true);
    try {
      const promises = [];
      for (let page = startPage; page <= endPage; page++) {
        if (!loadedPages.has(page)) {
          promises.push(fetchUsers(page, itemsPerPage));
        }
      }
      
      const responses = await Promise.all(promises);
      
      let allUsers: User[] = [];
      let totalCount = total;
      
      responses.forEach((response: UsersResponse) => {
        allUsers = [...allUsers, ...response.data];
        if (response.total !== undefined) {
          totalCount = response.total;
        }
      });
      
      setTotal(totalCount);
      
      // Merge with existing items
      setItems(prev => {
        const merged = [...prev, ...allUsers];
        const unique = merged.filter((item, index, self) => 
          index === self.findIndex((t) => t.id === item.id)
        );
        return unique.sort((a, b) => a.id - b.id);
      });
      
      // Update loaded pages
      const newPages = new Set(loadedPages);
      for (let page = startPage; page <= endPage; page++) {
        newPages.add(page);
      }
      setLoadedPages(newPages);
      
      setHasMore(endPage * itemsPerPage < totalCount);
      setCurrentPage(endPage);
    } catch (error) {
      console.error('Error loading users around position:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, itemsPerPage, loadedPages, total]);

  useEffect(() => {
    // Load total count first
    fetchTotalCount().then(count => {
      setTotal(count);
    }).catch(error => {
      console.error('Error fetching total count:', error);
    });
    
    // Load first page
    loadData(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadData(currentPage + 1, true);
    }
  }, [currentPage, hasMore, loading, loadData]);

  const jumpToPosition = useCallback((position: number) => {
    // Load items around this position
    loadAroundPosition(position, 2000); // Load 2000 items around the position
  }, [loadAroundPosition]);

  return {
    items,
    total,
    hasMore,
    loading,
    loadMore,
    jumpToPosition,
    loadAroundPosition,
  };
};