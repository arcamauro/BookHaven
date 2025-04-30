from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from library.models import Book, Author, LendedBook
from datetime import datetime, timedelta
from django.utils import timezone

class LibrarianViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        
        self.librarian = User.objects.create_user(
            username='librarian',
            password='librarian123',
            is_staff=True
        )
        
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        
        self.book = Book.objects.create(
            isbn='1234567890123',
            title='Test Book',
            copies=5,
            lended=2,
            year=2023
        )
        
        self.author = Author.objects.create(name='Test Author')
        self.book.authors.add(self.author)
        
        self.lended_book = LendedBook.objects.create(
            book=self.book,
            user=self.user,
            number=2,
            borrowed_on=timezone.now(),
            return_on=timezone.now() + timedelta(days=14)
        )

    def test_search_user_books(self):
        """Test searching for books borrowed by a user."""
        self.client.login(username='librarian', password='librarian123')
        
        response = self.client.get(
            reverse('api_search_user_books'),
            {'query': 'testuser'}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['books']), 1)
        self.assertEqual(response.data['books'][0]['isbn'], '1234567890123')
        
        response = self.client.get(
            reverse('api_search_user_books'),
            {'query': 'Test Book'}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['books']), 1)

    def test_return_book(self):
        """Test returning a borrowed book."""
        self.client.login(username='librarian', password='librarian123')
        
        data = {'quantity': 1}
        response = self.client.post(
            reverse('api_return_book', kwargs={
                'book_id': self.book.isbn,
                'username': self.user.username
            }),
            data,
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        book = Book.objects.get(isbn=self.book.isbn)
        self.assertEqual(book.lended, 1)
        
        lended_book = LendedBook.objects.get(
            book=self.book,
            user=self.user
        )
        self.assertEqual(lended_book.number, 1)

    def test_return_all_books(self):
        """Test returning all books from a user."""
        self.client.login(username='librarian', password='librarian123')
        
        data = {'quantity': 2}
        response = self.client.post(
            reverse('api_return_book', kwargs={
                'book_id': self.book.isbn,
                'username': self.user.username
            }),
            data,
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.assertFalse(
            LendedBook.objects.filter(
                book=self.book,
                user=self.user
            ).exists()
        )
        
        book = Book.objects.get(isbn=self.book.isbn)
        self.assertEqual(book.lended, 0)

    def test_get_all_borrowed_books(self):
        """Test getting all borrowed books."""
        self.client.login(username='librarian', password='librarian123')
        
        response = self.client.get(reverse('api_get_all_borrowed_books'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['books']), 1)
        
        book_data = response.data['books'][0]
        self.assertEqual(book_data['isbn'], '1234567890123')
        self.assertEqual(book_data['title'], 'Test Book')
        self.assertEqual(book_data['borrower'], 'testuser')
        self.assertEqual(book_data['lended'], 2)