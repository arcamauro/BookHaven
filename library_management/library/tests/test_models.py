from django.test import TestCase
from django.contrib.auth.models import User
from library.models import Book, Author, Genre, Review, LendedBook, Wishlist

class BookModelTest(TestCase):
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

    def test_book_str(self):
        self.assertEqual(str(self.book), 'Test Book')

    def test_book_genres(self):
        genres = list(self.book.genres.all())
        self.assertIn(self.genre, genres)

    def test_book_authors(self):
        authors = list(self.book.authors.all())
        self.assertIn(self.author, authors)

    def test_book_fields(self):
        """Test that all fields are saved correctly"""
        self.assertEqual(self.book.isbn, '1234567890123')
        self.assertEqual(self.book.title, 'Test Book')
        self.assertEqual(self.book.copies, 5)
        self.assertEqual(self.book.year, 2023)
        self.assertEqual(self.book.lended, 0)