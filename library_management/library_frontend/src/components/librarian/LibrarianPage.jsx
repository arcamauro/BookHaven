import React, { useState } from 'react';
import { searchUserBooks, returnBook } from '../../services/api';
import './LibrarianPage.css';

const LibrarianPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [notification, setNotification] = useState('');

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
      setNotification('Book returned successfully!');
      setTimeout(() => setNotification(''), 3000);
      if (searchQuery) {
        handleSearch();
      }
    } catch (error) {
      console.error('Error returning book:', error);
      setNotification('Failed to return book');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  return (
    <div className="rh-librarian-wrapper">
      <h1 className="rh-librarian-header">Librarian Dashboard</h1>
      <p className="rh-librarian-description">
        Search for borrowed books by username or book title
      </p>

      <div className="rh-librarian-search">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by username or book title..."
          className="rh-librarian-search-input"
        />
        <button onClick={handleSearch} className="rh-librarian-search-button">
          Search
        </button>
      </div>

      {notification && (
        <div className={`rh-notification ${notification.includes('Failed') ? 'error' : 'success'}`}>
          {notification}
        </div>
      )}

      <ul className="rh-librarian-book-collection">
        {searchedBooks.map((book) => (
          <li key={book.id} className="rh-librarian-book-item">
            <img src={book.cover} alt={book.title} className="rh-book-cover-image" />
            <div className="rh-book-info-section">
              <div className="rh-book-title-text">{book.title}</div>
              <div className="rh-book-author-text">by {book.authors}</div>
              <div className="rh-book-borrower-text">Borrowed by {book.borrower}</div>
              <div className="rh-book-copies-badge">
                <span className="rh-copies-number">{book.lended}</span>
                <span className="rh-copies-text">copies borrowed</span>
              </div>
              <button 
                onClick={() => handleReturnBook(book.isbn, book.borrower)} 
                className="rh-return-btn"
              >
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