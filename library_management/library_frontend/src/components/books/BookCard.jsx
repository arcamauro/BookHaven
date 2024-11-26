import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import './BookCard.css'; // Import the CSS file for styling

const BookCard = ({ book, onClick }) => {
  return (
    <Card className="book-card" onClick={onClick}>
      <img src={book.cover} className="book-cover" alt={`${book.title} cover`} />
      <CardContent>
        <Typography variant="h5">{book.title}</Typography>
        <Typography variant="subtitle1">
          by {book.authors.map(author => author.name).join(', ')}
        </Typography>
        <Typography variant="body2">
          Genre: {book.genres.map(genre => genre.name).join(', ')}
        </Typography>
        <Typography variant="subtitle2">ISBN: {book.isbn}</Typography>
      </CardContent>
    </Card>
  );
};

export default BookCard; 