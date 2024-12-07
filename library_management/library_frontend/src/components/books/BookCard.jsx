import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import './BookCard.css';

//Component for the book card, which will be used in the book search page and the book list page(homepage)
const BookCard = ({ book, onClick }) => {
  return (
    <Card className="book-card">
      <Box className="book-cover-container" onClick={onClick}>
        <img src={book.cover} className="book-cover" alt={`${book.title} cover`} />
      </Box>
      <CardContent onClick={onClick}>
        <Typography variant="h6" className="book-title">
          {book.title}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
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
