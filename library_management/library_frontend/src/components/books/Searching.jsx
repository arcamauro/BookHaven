import React, { useState } from 'react';
import { searchBooks } from '../../services/api';
import BookCard from './BookCard';
import './BookList.css';

export default function Searching() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const data = await searchBooks(query);
      setResults(data);
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  return (
    <div className="book-list">
      <h2>Search Results</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by title, author, or ISBN"
      />
      <button onClick={handleSearch}>Search</button>
      <div className="book-grid">
        {results.map((book) => (
          <BookCard key={book.isbn} book={book} onClick={() => console.log(book.title)} />
        ))}
      </div>
    </div>
  );
}
