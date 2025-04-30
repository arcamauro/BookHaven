from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from library.models import Book, Author, Genre, Review, LendedBook, Wishlist

class URLTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.book = Book.objects.create(
            isbn='1234567890123',
            title='Test Book',
            copies=5,
            year=2023
        )

    def test_book_list_url(self):
        """Test that the book list URL works."""
        response = self.client.get(reverse('api_book_list'))
        self.assertEqual(response.status_code, 200)

    def test_login_url(self):
        """Test that the login URL accepts POST requests."""
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = self.client.post(reverse('api_login'), data)
        self.assertEqual(response.status_code, 200)

    def test_protected_urls_without_login(self):
        """Test that protected URLs require authentication."""
        urls = [
            reverse('api_user_account'),
            reverse('api_borrow_book'),
            reverse('api_toggle_wishlist'),
        ]
        for url in urls:
            response = self.client.get(url)
            self.assertEqual(response.status_code, [401, 403])

    def test_reviews_url(self):
        """Test that the reviews URL works with ISBN parameter."""
        response = self.client.get(
            reverse('api_get_reviews', kwargs={'isbn': self.book.isbn})
        )
        self.assertEqual(response.status_code, 200)

    def test_search_url(self):
        """Test that the search URL accepts query parameters."""
        response = self.client.get(
            reverse('api_search_books'), 
            {'q': 'test'}
        )
        self.assertEqual(response.status_code, 200)
