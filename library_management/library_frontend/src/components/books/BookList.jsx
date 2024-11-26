import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBooks } from '../../services/api';
import BookCard from './BookCard'; // Import the BookCard component
import './BookList.css'; // Import the CSS file for styling

export default function BookList() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      }
    };

    loadBooks();
  }, []);

  return (
    <div className="book-list">
      <h2>Available Books</h2>
      <div className="book-grid">
        {books.map((book) => (
          <BookCard key={book.isbn} book={book} />
        ))}
      </div>
    </div>
  );
}
