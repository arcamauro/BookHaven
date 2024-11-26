from rest_framework import serializers
from django.conf import settings
from .models import Book, Review, LendedBook, Wishlist, Author, Genre
from django.contrib.auth.models import User

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['name']

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['name']

class BookSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many=True, read_only=True)
    genres = GenreSerializer(many=True, read_only=True)

    class Meta:
        model = Book
        fields = ['isbn', 'title', 'cover', 'authors', 'genres']

    def get_cover(self, obj):
        if obj.cover:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cover.url)
        return None

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class LendedBookSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)

    class Meta:
        model = LendedBook
        fields = ['book', 'borrowed_on', 'return_on']

class WishlistSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = ['book']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class UserAccountSerializer(serializers.ModelSerializer):
    borrowed_books = LendedBookSerializer(many=True, read_only=True, source='lendedbook_set')
    wishlist = WishlistSerializer(many=True, read_only=True, source='wishlist_set')

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'borrowed_books', 'wishlist']
