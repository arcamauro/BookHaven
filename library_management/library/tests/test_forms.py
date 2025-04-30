from django.test import TestCase
from django.contrib.auth.models import User
from library.forms import BookForm, ReviewForm
from library.models import Book, Author, Genre, Review
from django.core.files.uploadedfile import SimpleUploadedFile

class BookFormTest(TestCase):
    def setUp(self):
        self.genre = Genre.objects.create(name="Fiction")
        self.author = Author.objects.create(name="John Doe")

    def test_valid_book_form(self):
        form_data = {
            'isbn': '1234567890123',
            'title': 'Test Book',
            'copies': 5,
            'year': 2023,
            'genres': [self.genre.name],
            'authors': [self.author.id],
        }
        form = BookForm(data=form_data)
        if not form.is_valid():
            print("Form errors:", form.errors)
        self.assertTrue(form.is_valid())

    def test_invalid_book_form(self):
        form_data = {
            'isbn': '',  
            'title': '',  
            'copies': -1, 
            'year': 'invalid',  
        }
        form = BookForm(data=form_data)
        self.assertFalse(form.is_valid())

    def test_isbn_disabled_on_edit(self):
        book = Book.objects.create(
            isbn='1234567890123',
            title='Test Book',
            copies=1,
            year=2023
        )
        form = BookForm(instance=book)
        self.assertTrue(form.fields['isbn'].disabled)

class ReviewFormTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.book = Book.objects.create(
            isbn='1234567890123',
            title='Test Book',
            copies=1,
            year=2023
        )

    def test_valid_review_form(self):
        form_data = {
            'content': 'Great book!',
            'rating': 5,
            'book': self.book.isbn,
            'user': self.user.id
        }
        form = ReviewForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_invalid_review_form(self):
        form_data = {
            'content': '',  # Required field
            'rating': 6,  # Must be between 1 and 5
            'book': '',  # Required field
            'user': ''  # Required field
        }
        form = ReviewForm(data=form_data)
        self.assertFalse(form.is_valid())