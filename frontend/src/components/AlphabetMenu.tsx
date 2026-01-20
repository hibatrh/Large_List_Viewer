import React, { useState, useEffect } from 'react';
import { fetchAlphabetIndex, AlphabetIndex } from '../services/api';

interface AlphabetMenuProps {
  onLetterClick: (letter: string, position: number) => void;
  itemsPerPage: number;
}

const AlphabetMenu: React.FC<AlphabetMenuProps> = ({ onLetterClick, itemsPerPage }) => {
  const [index, setIndex] = useState<AlphabetIndex>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIndex = async () => {
      try {
        const alphabetIndex = await fetchAlphabetIndex();
        setIndex(alphabetIndex);
      } catch (error) {
        console.error('Error loading alphabet index:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIndex();
  }, []);

  const handleClick = (letter: string) => {
    const position = index[letter];
    if (position !== undefined) {
      onLetterClick(letter, position);
    }
  };

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  if (loading) {
    return <div>Loading alphabet index...</div>;
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '8px', 
      padding: '16px',
      borderBottom: '1px solid #ccc',
      backgroundColor: '#f5f5f5'
    }}>
      {letters.map(letter => (
        <button
          key={letter}
          onClick={() => handleClick(letter)}
          disabled={index[letter] === undefined}
          style={{
            padding: '8px 12px',
            fontSize: '16px',
            cursor: index[letter] !== undefined ? 'pointer' : 'not-allowed',
            backgroundColor: index[letter] !== undefined ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          {letter}
        </button>
      ))}
    </div>
  );
};

export default AlphabetMenu;