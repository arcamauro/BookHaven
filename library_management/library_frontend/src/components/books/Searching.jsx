import React, { useState, useEffect, useCallback } from 'react';
import { searchBooks } from '../../services/api';
import BookCard from './BookCard';
import BookModal from './BookModal';
import CircularProgress from '@mui/material/CircularProgress';
import './Searching.css';

export default function Searching() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  
  const debouncedSearch = useCallback(
    async (searchQuery) => {
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await searchBooks(searchQuery);
        setResults(data);
      } catch (error) {
        console.error('Error searching books:', error);
        setError('Unable to search books. Please try again later.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        debouncedSearch(query);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, debouncedSearch]);

  return (
    <div className="book-search-container">
      <div className="book-search-content">
        <div className="book-search-header">
          <h1 className="book-search-title">Search for books</h1>
          <p className="book-search-description">You can search for books by title, author, or ISBN.</p>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for?"
            className="book-search-input"
          />
        </div>

        {loading ? (
          <div className="rh-books-loading">
            <CircularProgress size={40} />
            <span className="rh-loading-text">Searching for books...</span>
          </div>
        ) : error ? (
          <div className="rh-books-error">
            <span className="rh-error-text">{error}</span>
          </div>
        ) : (
          <div className="book-grid">
            {results.length > 0 ? (
              results.map((book) => (
                <BookCard 
                  key={book.isbn} 
                  book={book} 
                  onClick={() => setSelectedBook(book)} 
                />
              ))
            ) : query.length > 1 ? (
              <div className="rh-no-results">No books found matching your search</div>
            ) : null}
          </div>
        )}
      </div>
      
      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}
