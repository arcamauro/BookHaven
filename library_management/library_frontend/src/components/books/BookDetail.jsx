import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardContent } from '@mui/material';

export default function BookDetail() {
  const { isbn } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    fetchBookDetail();
  }, [isbn]);

  const fetchBookDetail = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/books/${isbn}/`);
      if (response.ok) {
        const data = await response.json();
        setBook(data);
      }
    } catch (error) {
      console.error('Failed to fetch book details:', error);
    }
  };

  if (!book) return <p>Loading...</p>;

  return (
    <Container>
      <Card>
        <CardContent>
          <Typography variant="h4">{book.title}</Typography>
          <Typography variant="h6">by {book.authors.map(author => author.name).join(', ')}</Typography>
          <Typography variant="body1">ISBN: {book.isbn}</Typography>
          <Typography variant="body1">Copies Available: {book.copies - book.lended}</Typography>
          <Typography variant="body1">Year: {book.year}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
