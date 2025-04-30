from django.test import TestCase
from django.contrib.auth.models import User
from library.models import Book, Author, Genre, Review, LendedBook, Wishlist
from library.serializers import (
    BookSerializer, GenreSerializer, ReviewSerializer, 
    LendedBookSerializer, WishlistSerializer, AuthorSerializer
)

class AuthorSerializerTest(TestCase): 
    def setUp(self):
        self.author = Author.objects.create(name="John Doe")

    def test_author_serializer(self):
        serializer = AuthorSerializer(self.author)
        self.assertEqual(serializer.data['name'], "John Doe")
    
    def test_author_serializer_invalid(self):
        serializer = AuthorSerializer(data={})
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)
        self.assertEqual(serializer.errors['name'], ['This field is required.'])

class BookSerializerTest(TestCase):
    def setUp(self):
        self.genre = Genre.objects.create(name="Fiction")
        self.author = Author.objects.create(name="John Doe")
        self.book = Book.objects.create(
            isbn='1234567890123',
            title='Test Book',
            copies=5,
            year=2023
        )
        self.book.genres.add(self.genre)
        self.book.authors.add(self.author)
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )

    def test_book_serializer(self):
        serializer = BookSerializer(self.book, context={'user': self.user})
        data = serializer.data
        self.assertEqual(data['isbn'], '1234567890123')
        self.assertEqual(data['title'], 'Test Book')
        self.assertEqual(data['copies'], 5)
        self.assertEqual(len(data['authors']), 1)
        self.assertEqual(data['authors'][0]['name'], 'John Doe')
        self.assertEqual(len(data['genres']), 1)
        self.assertEqual(data['genres'][0]['name'], 'Fiction')
        self.assertFalse(data['in_wishlist'])

    def test_book_in_wishlist(self):
        Wishlist.objects.create(user=self.user, book=self.book)
        serializer = BookSerializer(self.book, context={'user': self.user})
        self.assertTrue(serializer.data['in_wishlist'])

class ReviewSerializerTest(TestCase):
    def setUp(self):
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
        self.review = Review.objects.create(
            content='Great book!',
            rating=5,
            book=self.book,
            user=self.user
        )

    def test_review_serializer(self):
        serializer = ReviewSerializer(self.review)
        data = serializer.data
        self.assertEqual(data['content'], 'Great book!')
        self.assertEqual(data['rating'], 5)
        self.assertEqual(data['username'], 'testuser')