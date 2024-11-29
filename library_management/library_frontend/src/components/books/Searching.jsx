import React, { useState, useEffect, useCallback } from 'react';
import { searchBooks } from '../../services/api';
import BookCard from './BookCard';
import BookModal from './BookModal';
import './BookList.css';
import './Searching.css';

export default function Searching() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  
  // Debounced search function
  const debouncedSearch = useCallback(
    async (searchQuery) => {
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await searchBooks(searchQuery);
        setResults(data);
      } catch (error) {
        console.error('Error searching books:', error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Use effect for debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(query);
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [query, debouncedSearch]);

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  return (
    <div className="book-list">
      <div className="search-container">
        <h1 className="search-title">Search In Our Library</h1>
        <p className="search-subtitle">Find books by title, author, or ISBN number.<br/>Then click on the book to borrow; to add to wishlist; or to leave a review.</p>
        
        <div className="search-box">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for?"
            className="search-input"
          />
        </div>

        {loading ? (
          <div className="loading-message">Loading...</div>
        ) : (
          <>
            <div className="book-grid">
              {results.map((book) => (
                <BookCard key={book.isbn} book={book} onClick={() => handleBookClick(book)} />
              ))}
            </div>
          </>
        )}
      </div>
      {selectedBook && (
        <BookModal book={selectedBook} onClose={handleCloseModal} />
      )}
    </div>
  );
}
