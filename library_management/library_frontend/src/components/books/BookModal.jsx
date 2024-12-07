import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, Snackbar, Alert } from '@mui/material';
import Rating from '@mui/material/Rating';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../context/AuthContext';
import './BookModal.css';
import { borrowBook, toggleWishlist, leaveReview, fetchReviews, deleteReview } from '../../services/api';

const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return totalRating / reviews.length;
};

const BookModal = ({ book: initialBook, onClose, onBookUpdate }) => {
  const { user, loading } = useAuth();
  const [bookData, setBookData] = useState(initialBook);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviews, setReviews] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [isInWishlist, setIsInWishlist] = useState(false);
  const isAuthenticated = !!user;
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    setBookData(initialBook);
  }, [initialBook]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchReviews(bookData.isbn);
        setReviews(data);
        if (data.length > 0) {
          const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
          setAverageRating(totalRating / data.length);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };

    if (bookData) {
      loadReviews();
      setIsInWishlist(bookData.in_wishlist || false);
    }
  }, [bookData]);

  const getAvailabilityInfo = () => {
    const totalCopies = parseInt(bookData.copies) || 0;
    const lendedCopies = parseInt(bookData.lended) || 0;
    const availableCopies = Math.max(0, totalCopies - lendedCopies);
    
    return {
      available: availableCopies > 0,
      availableCopies,
      totalCopies,
      lendedCopies
    };
  };

  const handleBorrow = async () => {
    try {
      const updatedBook = await borrowBook(bookData.isbn);
      setBookData(updatedBook);
      if (onBookUpdate) {
        onBookUpdate(updatedBook);
      }
      setNotification({
        open: true,
        message: '1 copy borrowed successfully!',
        severity: 'success'
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to borrow book.';
      const errorType = error.response?.data?.type;

      setNotification({
        open: true,
        message: errorMessage,
        severity: errorType === 'no_copies' ? 'warning' : 'error'
      });
    }
  };

  const handleToggleWishlist = async () => {
    try {
      await toggleWishlist(bookData.isbn);
      setIsInWishlist(!isInWishlist);
      if (bookData.onWishlistChange) {
        bookData.onWishlistChange(bookData.isbn, !isInWishlist);
      }
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
      await leaveReview(bookData.isbn, reviewRating, reviewContent);
      const updatedReviews = await fetchReviews(bookData.isbn);
      setReviews(updatedReviews);
      setAverageRating(calculateAverageRating(updatedReviews));
      
      setNotification({
        open: true,
        message: 'Review submitted successfully!',
        severity: 'success'
      });
      setReviewContent('');
      setReviewRating(5);
    } catch (error) {
      setNotification({
        open: true,
        message: 'Failed to submit review.',
        severity: 'error'
      });
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      const updatedReviews = await fetchReviews(bookData.isbn);
      setReviews(updatedReviews);
      setAverageRating(calculateAverageRating(updatedReviews));
      
      setNotification({
        open: true,
        message: 'Review deleted successfully!',
        severity: 'success'
      });
    } catch (error) {
      setNotification({
        open: true,
        message: 'Failed to delete review.',
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

  if (loading || !bookData) {
    return null;
  }

  const { available, availableCopies, totalCopies, lendedCopies } = getAvailabilityInfo();

  return (
    <Modal open={!!bookData} onClose={onClose}>
      <Box className={`rh-book-modal ${!isAuthenticated ? 'guest-view' : ''}`}>
        <div className="rh-modal-content">
          <img src={bookData.cover} alt={`${bookData.title} cover`} className="rh-book-cover" />
          <div className="rh-book-info">
            <Typography variant="h4" className="rh-modal-book-title" gutterBottom>
              {bookData.title}
            </Typography>
            <Typography variant="subtitle1" className="rh-book-author" gutterBottom>
              by {bookData.authors.map(author => author.name).join(', ')}
            </Typography>
            
            <div className="rh-book-rating">
              <Rating value={averageRating} precision={0.5} readOnly size="large" />
              <Typography variant="body2" className="rh-average-rating">
                {averageRating > 0 
                  ? `${averageRating.toFixed(1)} / 5.0 (${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'})`
                  : 'No ratings yet'
                }
              </Typography>
            </div>

            <Typography variant="body2" className="rh-book-genre" gutterBottom>
              Genre: {bookData.genres.map(genre => genre.name).join(', ')}
            </Typography>
            
            <Typography variant="subtitle2" className="rh-book-isbn" gutterBottom>
              ISBN: {bookData.isbn}
            </Typography>

            <div className="rh-copies-info">
              <span className={`rh-availability-status ${available ? 'available' : 'unavailable'}`}>
                {available ? 'Available' : 'Unavailable'}
              </span>
              <span className="rh-copies-count">
                {availableCopies} of {totalCopies} copies available
              </span>
              <span className="rh-lended-count">
                ({lendedCopies} currently borrowed)
              </span>
            </div>

            {!isAuthenticated && (
              <div className="rh-login-prompt">
                <Typography variant="body1">
                  Please <b>login</b> to borrow books, manage your wishlist, and leave reviews.
                </Typography>
              </div>
            )}
          </div>

          {isAuthenticated && (
            <div className="rh-action-buttons">
              <Button 
                variant="contained" 
                className="rh-borrow-button"
                onClick={handleBorrow}
                startIcon={<MenuBookIcon />}
                disabled={!available}
              >
                Borrow Book {!available ? '(No copies available)' : ''}
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

          <div className="rh-reviews-list">
            <Typography variant="h6" className="rh-review-title" gutterBottom>
              Reviews
            </Typography>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Box key={review.id} className="rh-review-item">
                  <div className="rh-review-header">
                    <Typography variant="subtitle1" className="rh-review-username">
                      {review.username || 'Anonymous'}
                    </Typography>
                    <Rating 
                      value={review.rating} 
                      precision={1} 
                      readOnly 
                      size="small" 
                    />
                    {user && review.username === user.username && (
                      <CloseIcon 
                        className="rh-delete-review-icon" 
                        onClick={() => handleDeleteReview(review.id)}
                        titleAccess="Delete review"
                      />
                    )}
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

          {isAuthenticated && (
            <div className="rh-review-section">
              <Typography variant="h6" className="rh-review-title" gutterBottom>
                Leave a Review
              </Typography>
              <Rating
                name="review-rating"
                value={reviewRating}
                onChange={(event, newValue) => {
                  setReviewRating(Math.round(newValue));
                }}
                precision={1}
                size="large"
              />
              <Typography variant="body2" className="rh-rating-value">
                {reviewRating} stars
              </Typography>
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
          )}

          <Button 
            variant="contained" 
            color="primary" 
            onClick={onClose} 
            style={{ marginTop: '24px' }}
          >
            Close
          </Button>

          <Snackbar 
            open={notification.open} 
            autoHideDuration={6000} 
            onClose={handleCloseNotification}
          >
            <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
              {notification.message}
            </Alert>
          </Snackbar>
        </div>
      </Box>
    </Modal>
  );
};

export default BookModal;
