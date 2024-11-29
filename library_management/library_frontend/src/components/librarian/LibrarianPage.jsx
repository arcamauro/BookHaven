import React, { useState } from 'react';
import { searchUserBooks, returnBook } from '../../services/api';

const LibrarianPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [returnQuantity, setReturnQuantity] = useState(1);

  const handleSearch = async () => {
    try {
      const books = await searchUserBooks(searchQuery);
      setSearchedBooks(books);
    } catch (error) {
      console.error('Error searching user books:', error);
    }
  };

  const handleReturn = async (lendedBookId) => {
    try {
      const response = await returnBook(lendedBookId, returnQuantity);
      console.log(response.success);
      // Optionally refresh the list or update the UI
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  return (
    <div>
      <h1>Librarian Page</h1>
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
            {book.title} by {book.authors}
            <input
              type="number"
              value={returnQuantity}
              onChange={(e) => setReturnQuantity(e.target.value)}
              min="1"
            />
            <button onClick={() => handleReturn(book.id)}>Return</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LibrarianPage;