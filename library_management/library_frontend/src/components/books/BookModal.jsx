import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, Snackbar, Alert } from '@mui/material';
import Rating from '@mui/material/Rating'; // Import Rating component
import './BookModal.css';
import { borrowBook, toggleWishlist, leaveReview, fetchReviews } from '../../services/api'; // Import fetchReviews

const BookModal = ({ book, onClose }) => {
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviews, setReviews] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [isInWishlist, setIsInWishlist] = useState(book?.in_wishlist || false);

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
      const response = await borrowBook(book.isbn, 1);
      setNotification({
        open: true,
        message: '1 copy borrowed successfully!',
        severity: 'success'
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to borrow book.';
      const errorType = error.response?.data?.type;

      let severity = 'error';
      if (errorType === 'no_copies') {
        severity = 'warning';
      }

      setNotification({
        open: true,
        message: errorMessage,
        severity: severity
      });
    }
  };

  const handleToggleWishlist = async () => {
    try {
      await toggleWishlist(book.isbn);
      setIsInWishlist(!isInWishlist);
      setNotification({
        open: true,
        message: isInWishlist ? 'Removed from wishlist!' : 'Added to wishlist!',
        severity: 'success'
      });
    } catch (error) {
      setNotification({
        open: true,
        message: 'Failed to update wishlist.',
        severity: 'error'
      });
    }
  };

  const handleLeaveReview = async () => {
    try {
      await leaveReview(book.isbn, reviewRating, reviewContent);
      setNotification({
        open: true,
        message: 'Review submitted successfully!',
        severity: 'success'
      });
      setReviewContent('');
      setReviewRating(5);
      const updatedReviews = await fetchReviews(book.isbn);
      setReviews(updatedReviews);
    } catch (error) {
      setNotification({
        open: true,
        message: 'Failed to submit review.',
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  return (
    <Modal open={!!book} onClose={onClose}>
      <Box className="book-modal">
        <img src={book.cover} alt={`${book.title} cover`} className="book-cover" />
        <div className="book-info">
          <Typography variant="h4" gutterBottom>{book.title}</Typography>
          <Typography variant="subtitle1" gutterBottom>
            by {book.authors.map(author => author.name).join(', ')}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Genre: {book.genres.map(genre => genre.name).join(', ')}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>ISBN: {book.isbn}</Typography>
        </div>
        <div className="button-group">
          <Button 
            variant="contained" 
            sx={{ 
              backgroundColor: '#FFBA08', 
              color: '#000000', 
              '&:hover': { backgroundColor: '#e0a806' } 
            }}
            onClick={handleBorrow}
          >
            Borrow Book
          </Button>
          <Button 
            variant={isInWishlist ? "contained" : "outlined"}
            sx={{ 
              backgroundColor: isInWishlist ? '#e0a806' : 'transparent',
              borderColor: '#FFBA08', 
              color: isInWishlist ? '#000000' : '#FFBA08', 
              '&:hover': { 
                backgroundColor: isInWishlist ? '#FFBA08' : 'transparent',
                borderColor: '#e0a806', 
                color: isInWishlist ? '#000000' : '#e0a806' 
              } 
            }}
            onClick={handleToggleWishlist}
          >
            {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
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

        <div className="reviews-list">
          <Typography variant="h6" gutterBottom>Reviews</Typography>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <Box key={index} className="review-item">
                <div className="review-header">
                  <Typography variant="subtitle1" className="review-username">
                    {review.username || 'Anonymous'}
                  </Typography>
                  <Rating value={review.rating} readOnly size="small" />
                </div>
                <Typography variant="body2" className="review-content">
                  {review.content}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2">No reviews yet.</Typography>
          )}
        </div>

        <Button variant="contained" color="primary" onClick={onClose} style={{ marginTop: '10px' }}>
          Close
        </Button>

        <Snackbar 
          open={notification.open} 
          autoHideDuration={6000} 
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
};

export default BookModal;
