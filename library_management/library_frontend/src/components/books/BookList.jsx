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
  const [selectedBook, setSelectedBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  return (
    <div className="book-list">
      <div className="welcome-section">
        <h1>Welcome to <span style={{ color: '#' }}>ReadHaven</span>!</h1>
        <p>Here you will find a safe place to read and share your favorite books.</p>
      </div>
      
      <div className="books-section">
        <h2 className="section-title">Available Books</h2>
        {loading ? (
          <div className="loading-container">
            <CircularProgress />
            <span>Loading books...</span>
          </div>
        ) : (
          <div className="book-grid">
            {books.map((book) => (
              <BookCard 
                key={book.isbn} 
                book={book} 
                onClick={() => handleBookClick(book)} 
              />
            ))}
          </div>
        )}
      </div>

      {selectedBook && (
        <BookModal book={selectedBook} onClose={handleCloseModal} />
      )}
    </div>
  );
}
