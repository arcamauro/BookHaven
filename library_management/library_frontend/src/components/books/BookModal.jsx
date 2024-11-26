import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import './BookModal.css';
import { borrowBook, toggleWishlist } from '../../services/api'; // Import API functions

const BookModal = ({ book, onClose }) => {
  const handleBorrow = async () => {
    try {
      await borrowBook(book.isbn);
      alert('Book borrowed successfully!');
    } catch (error) {
      alert('Failed to borrow book.');
    }
  };

  const handleToggleWishlist = async () => {
    try {
      await toggleWishlist(book.isbn);
      alert('Wishlist updated successfully!');
    } catch (error) {
      alert('Failed to update wishlist.');
    }
  };

  return (
    <Modal open={!!book} onClose={onClose}>
      <Box className="book-modal">
        <img src={book.cover} alt={`${book.title} cover`} className="book-cover" />
        <Typography variant="h4" gutterBottom>{book.title}</Typography>
        <Typography variant="subtitle1" gutterBottom>
          by {book.authors.map(author => author.name).join(', ')}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Genre: {book.genres.map(genre => genre.name).join(', ')}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>ISBN: {book.isbn}</Typography>
        <Button variant="contained" color="primary" onClick={handleBorrow}>
          Borrow
        </Button>
        <Button variant="contained" color="secondary" onClick={handleToggleWishlist}>
          {book.wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </Button>
        <Button variant="contained" color="primary" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default BookModal;
