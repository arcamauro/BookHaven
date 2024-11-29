import React, { useState } from 'react';
import { searchUserBooks } from '../../services/api';

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
    <div>
      <h1>Welcome to the librarian page</h1>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search user books"
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
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