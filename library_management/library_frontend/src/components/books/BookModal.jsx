import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, Snackbar, Alert } from '@mui/material';
import Rating from '@mui/material/Rating'; // Import Rating component
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useAuth } from '../../context/AuthContext'; // Add this import
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
  const { user } = useAuth(); // Add this line to get user context

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
      <Box className="rh-book-modal">
        <div className="rh-modal-content">
          <img src={book.cover} alt={`${book.title} cover`} className="rh-book-cover" />
          <div className="rh-book-info">
            <Typography variant="h4" className="rh-modal-book-title" gutterBottom>
              {book.title}
            </Typography>
            <Typography variant="subtitle1" className="rh-book-author" gutterBottom>
              by {book.authors.map(author => author.name).join(', ')}
            </Typography>
            <Typography variant="body2" className="rh-book-genre" gutterBottom>
              Genre: {book.genres.map(genre => genre.name).join(', ')}
            </Typography>
            <Typography variant="subtitle2" className="rh-book-isbn" gutterBottom>ISBN: {book.isbn}</Typography>
          </div>

          {user && ( // Only show action buttons if user is logged in
            <div className="rh-action-buttons">
              <Button 
                variant="contained" 
                className="rh-borrow-button"
                onClick={handleBorrow}
                startIcon={<MenuBookIcon />}
              >
                Borrow Book
              </Button>
              <Button 
                variant={isInWishlist ? "contained" : "outlined"}
                className={`rh-wishlist-button ${isInWishlist ? 'active' : ''}`}
                onClick={handleToggleWishlist}
                startIcon={isInWishlist ? <BookmarkRemoveIcon /> : <BookmarkAddIcon />}
              >
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>
          )}

          <div className="rh-review-section">
            <Typography variant="h6" className="rh-review-title" gutterBottom>Leave a Review</Typography>
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

          <div className="rh-reviews-list">
            <Typography variant="h6" className="rh-review-title" gutterBottom>Reviews</Typography>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <Box key={index} className="rh-review-item">
                  <div className="rh-review-header">
                    <Typography variant="subtitle1" className="rh-review-username">
                      {review.username || 'Anonymous'}
                    </Typography>
                    <Rating value={review.rating} readOnly size="small" />
                  </div>
                  <Typography variant="body2" className="rh-review-content">
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
        </div>
      </Box>
    </Modal>
  );
};

export default BookModal;
