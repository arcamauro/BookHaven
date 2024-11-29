import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardContent, Box, Chip, CircularProgress } from '@mui/material';

export default function BookDetail() {
  const { isbn } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
      <CircularProgress />
    </Box>
  );

  if (!book) return (
    <Container>
      <Typography variant="h5" color="error">Book not found</Typography>
    </Container>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        overflow: 'hidden',
        borderRadius: 2
      }}>
        <Box sx={{ 
          width: { xs: '100%', md: '40%' }, 
          minHeight: 400,
          position: 'relative'
        }}>
          <img 
            src={book.cover} 
            alt={book.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute'
            }}
          />
        </Box>
        <CardContent sx={{ flex: 1, p: 4 }}>
          <Typography variant="h4" gutterBottom>{book.title}</Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            by {book.authors.map(author => author.name).join(', ')}
          </Typography>
          <Box sx={{ my: 2 }}>
            {book.genres.map(genre => (
              <Chip 
                key={genre.name} 
                label={genre.name} 
                sx={{ mr: 1 }} 
              />
            ))}
          </Box>
          <Typography variant="body1">ISBN: {book.isbn}</Typography>
          <Typography variant="body1">Copies Available: {book.copies - book.lended}</Typography>
          <Typography variant="body1">Year: {book.year}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
