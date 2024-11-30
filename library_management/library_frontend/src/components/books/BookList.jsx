import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBooks } from '../../services/api';
import BookCard from './BookCard';
import './BookList.css';
import CircularProgress from '@mui/material/CircularProgress';
import BookModal from './BookModal';

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data);
      } catch (error) {
        console.error('Failed to fetch books:', error);
        setError('Unable to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  if (loading) {
    return (
      <div className="rh-books-loading">
        <CircularProgress size={40} />
        <span className="rh-loading-text">Loading our collection of books...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rh-books-error">
        <span className="rh-error-text">{error}</span>
      </div>
    );
  }

  return (
    <div className="book-list">
      <div className="welcome-section">
        <h1>Welcome to <span className="readhaven-title">ReadHaven</span>!</h1>
        <p>Here you will find a safe place to read and share your favorite books.</p>
      </div>
      
      <div className="books-section">
        <h2 className="section-title">The books you can find here</h2>
        <div className="book-grid">
          {books.map((book) => (
            <BookCard 
              key={book.isbn} 
              book={book} 
              onClick={() => setSelectedBook(book)} 
            />
          ))}
        </div>
      </div>

      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}
