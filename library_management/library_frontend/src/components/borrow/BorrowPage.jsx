import React, { useState } from 'react';
import { TextField, Button, Typography, List, ListItem, ListItemText } from '@mui/material';
import { fetchBooks, borrowBook } from '../../services/api';

const BorrowPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);

  const handleSearch = async () => {
    try {
      const data = await fetchBooks(searchQuery);
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleBorrow = async (isbn) => {
    try {
      await borrowBook(isbn);
      alert('Book borrowed successfully!');
      handleSearch(); // Refresh the book list
    } catch (error) {
      alert('Failed to borrow book.');
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Borrow Books</Typography>
      <TextField
        label="Search for a book"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search
      </Button>
      <List>
        {books.map((book) => (
          <ListItem key={book.isbn}>
            <ListItemText
              primary={book.title}
              secondary={`Authors: ${book.authors.map(author => author.name).join(', ')}`}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleBorrow(book.isbn)}
              disabled={book.copies <= book.lended}
            >
              Borrow
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default BorrowPage; 