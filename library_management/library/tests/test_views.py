from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from library.models import Book, Author, Genre, Review, LendedBook, Wishlist

class ViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com'
        )
        
        self.book = Book.objects.create(
            isbn='1234567890123',
            title='Test Book',
            copies=5,
            year=2023
        )

    def test_book_list_view(self):
        """Test getting the book list."""
        response = self.client.get(reverse('api_book_list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_login_view(self):
        """Test user login."""
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = self.client.post(reverse('api_login'), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_borrow_book_view(self):
        """Test borrowing a book."""
        self.client.login(username='testuser', password='testpass123')
        
        data = {
            'isbn': '1234567890123',
            'quantity': 1  
        }
        response = self.client.post(
            reverse('api_borrow_book'), 
            data,
            content_type='application/json'  # Specify content type as JSON
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        book = Book.objects.get(isbn='1234567890123')
        self.assertEqual(book.lended, 1)

    def test_leave_review_view(self):
        """Test leaving a review for a book."""
        self.client.login(username='testuser', password='testpass123')
        
        data = {
            'isbn': '1234567890123',
            'rating': 5,
            'content': 'Great book!'
        }
        response = self.client.post(reverse('api_leave_review'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Check if review was created
        self.assertTrue(Review.objects.filter(
            book=self.book,
            user=self.user,
            rating=5
        ).exists())

    def test_search_books_view(self):
        """Test searching for books."""
        response = self.client.get(
            reverse('api_search_books'),
            {'q': 'Test'}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Should find our test book

    def test_toggle_wishlist_view(self):
        """Test adding/removing a book from wishlist."""
        self.client.login(username='testuser', password='testpass123')
        
        data = {'isbn': '1234567890123'}
        response = self.client.post(reverse('api_toggle_wishlist'), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.assertTrue(Wishlist.objects.filter(
            user=self.user,
            book=self.book
        ).exists())
        
        response = self.client.post(reverse('api_toggle_wishlist'), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.assertFalse(Wishlist.objects.filter(
            user=self.user,
            book=self.book
        ).exists())