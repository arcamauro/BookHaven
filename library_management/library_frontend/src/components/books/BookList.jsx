import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBooks } from '../../services/api';
import BookCard from './BookCard'; // Import the BookCard component
import './BookList.css'; // Import the CSS file for styling
import CircularProgress from '@mui/material/CircularProgress'; // Import a loading spinner
import BookModal from './BookModal'; // Import the BookModal component

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [selectedBook, setSelectedBook] = useState(null); // State for selected book
  const navigate = useNavigate();

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    loadBooks();
  }, []);

  const handleBookClick = (book) => {
    setSelectedBook(book); // Set the selected book
  };

  const handleCloseModal = () => {
    setSelectedBook(null); // Close the modal
  };

  return (
    <div className="book-list">
      <h2>Available Books</h2>
      {loading ? ( // Show loading spinner if loading
        <CircularProgress />
      ) : (
        <div className="book-grid">
          {books.map((book) => (
            <BookCard key={book.isbn} book={book} onClick={() => handleBookClick(book)} />
          ))}
        </div>
      )}
      {selectedBook && (
        <BookModal book={selectedBook} onClose={handleCloseModal} />
      )}
    </div>
  );
}
