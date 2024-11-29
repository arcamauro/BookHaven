import React, { useState } from 'react';
import { searchUserBooks } from '../../services/api';
import './LibrarianPage.css';

const LibrarianPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedBooks, setSearchedBooks] = useState([]);

  const handleSearch = async () => {
    try {
      const books = await searchUserBooks(searchQuery);
      setSearchedBooks(books);
    } catch (error) {
      console.error('Error searching user books:', error);
    }
  };

  return (
    <div className="librarian-container">
      <h1 className="librarian-title">Welcome to the Librarian Page</h1>
      <p className="librarian-subtitle">Manage and search user books efficiently.</p>
      
      <div className="search-box">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search user books"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      <ul className="book-list">
        {searchedBooks.map((book) => (
          <li key={book.id}>
            {book.title} by {book.authors} borrowed by {book.borrower}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LibrarianPage;