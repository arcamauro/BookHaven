import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import './BookModal.css'; // Import the CSS file for styling

const BookModal = ({ book, onClose }) => {
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
        <Typography variant="body1" paragraph>{book.description}</Typography>
        <Button variant="contained" color="primary" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default BookModal;
