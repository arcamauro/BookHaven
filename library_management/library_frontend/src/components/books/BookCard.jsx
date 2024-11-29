import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import './BookCard.css';

const BookCard = ({ book, onClick }) => {
  return (
    <Card className="book-card" onClick={onClick}>
      <Box className="book-cover-container">
        <img src={book.cover} className="book-cover" alt={`${book.title} cover`} />
      </Box>
      <CardContent>
        <Typography variant="h6" className="book-title" noWrap>
          {book.title}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" noWrap>
          by {book.authors.map(author => author.name).join(', ')}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="book-genre">
          {book.genres.map(genre => genre.name).join(', ')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BookCard; 