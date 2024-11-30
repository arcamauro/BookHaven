import React, { useState } from 'react';
import { searchUserBooks, returnBook } from '../../services/api';
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

  const handleReturnBook = async (bookId, username) => {
    try {
      await returnBook(bookId, username, 1);
      if (searchQuery) {
        handleSearch();
      }
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  return (
    <div className="librarian-wrapper">
      <h1 className="librarian-header">Welcome to the Librarian Page</h1>
      <p className="librarian-description">Manage and search user books efficiently.</p>
      
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search user books"
          className="search-field"
        />
        <button onClick={handleSearch} className="search-btn">
          Search
        </button>
      </div>

      <ul className="librarian-book-collection">
        {searchedBooks.map((book) => (
          <li key={book.id} className="librarian-book-item">
            <img src={book.cover} alt={book.title} className="book-cover-image" />
            <div className="book-info-section">
              <div className="book-title-text">{book.title}</div>
              <div className="book-author-text">by {book.authors}</div>
              <div className="book-borrower-text">Borrowed by {book.borrower}</div>
              <button onClick={() => handleReturnBook(book.isbn, book.borrower)} className="return-btn">
                Return Book
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LibrarianPage;