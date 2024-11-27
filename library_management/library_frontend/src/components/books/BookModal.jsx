import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';
import Rating from '@mui/material/Rating'; // Import Rating component
import './BookModal.css';
import { borrowBook, toggleWishlist, leaveReview, fetchReviews } from '../../services/api'; // Import fetchReviews

const BookModal = ({ book, onClose }) => {
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchReviews(book.isbn);
        setReviews(data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };

    if (book) {
      loadReviews();
    }
  }, [book]);

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

  const handleLeaveReview = async () => {
    try {
      await leaveReview(book.isbn, reviewRating, reviewContent);
      alert('Review submitted successfully!');
      setReviewContent('');
      setReviewRating(5);
      const updatedReviews = await fetchReviews(book.isbn);
      setReviews(updatedReviews);
    } catch (error) {
      alert('Failed to submit review.');
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
        <div className="button-group">
          <Button variant="contained" color="primary" onClick={handleBorrow}>
            Borrow Book
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleToggleWishlist}>
            Add to Wishlist
          </Button>
        </div>
        <div className="review-section">
          <Typography variant="h6" gutterBottom>Leave a Review</Typography>
          <Rating
            name="review-rating"
            value={reviewRating}
            onChange={(event, newValue) => {
              setReviewRating(newValue);
            }}
            precision={0.5}
            size="large"
          />
          <TextField
            label="Review"
            multiline
            rows={4}
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleLeaveReview}>
            Submit Review
          </Button>
        </div>
        <Button variant="contained" color="primary" onClick={onClose} style={{ marginTop: '10px' }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default BookModal;
