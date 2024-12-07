import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBooks } from '../../services/api';
import BookCard from './BookCard';
import './BookList.css';
import Skeleton from '@mui/material/Skeleton';
import BookModal from './BookModal';

// Add Skeleton component
const BookCardSkeleton = () => (
  <div className="book-card-skeleton">
    <Skeleton 
      variant="rectangular" 
      className="book-cover-skeleton" 
      height={320}
    />
    <div className="book-info-skeleton">
      <Skeleton variant="text" width="80%" height={24} />
      <Skeleton variant="text" width="60%" height={20} />
      <Skeleton variant="text" width="40%" height={20} />
    </div>
  </div>
);

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

  const handleBookUpdate = (updatedBook) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.isbn === updatedBook.isbn ? updatedBook : book
      )
    );
    setSelectedBook(updatedBook);
  };

  const handleWishlistChange = (isbn, newWishlistState) => {
    setBooks(prevBooks => 
      prevBooks.map(book => 
        book.isbn === isbn 
          ? { ...book, in_wishlist: newWishlistState }
          : book
      )
    );
    // Also update the selected book if it's currently open in the modal
    if (selectedBook?.isbn === isbn) {
      setSelectedBook(prev => ({ ...prev, in_wishlist: newWishlistState }));
    }
  };

  if (loading) {
    return (
      <div className="book-list">
        <div className="welcome-section">
          <h1>Welcome to <span className="readhaven-title">ReadHaven</span>!</h1>
          <p>Here you will find a safe place to read and share your favorite books.</p>
        </div>
        
        <div className="books-section">
          <h2 className="section-title">The books you can find here</h2>
          <div className="book-grid">
            {[...Array(12)].map((_, index) => (
              <BookCardSkeleton key={index} />
            ))}
          </div>
        </div>
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
        <BookModal 
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onBookUpdate={handleBookUpdate}
          onWishlistChange={handleWishlistChange}
        />
      )}
    </div>
  );
}
