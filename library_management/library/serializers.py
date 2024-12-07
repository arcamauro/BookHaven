from rest_framework import serializers
from .models import Book, Review, LendedBook, Wishlist, Author, Genre
from django.contrib.auth.models import User

# Serializer for the Author model
class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['name']

# Serializer for the Genre model
class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['name']

# Serializer for the Book model
class BookSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many=True, read_only=True)
    genres = GenreSerializer(many=True, read_only=True)
    in_wishlist = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ['isbn', 'title', 'authors', 'genres', 'cover', 'copies', 'lended', 'in_wishlist']

    def get_in_wishlist(self, obj):
        user = self.context.get('user')
        if user and user.is_authenticated:
            return Wishlist.objects.filter(user=user, book=obj).exists()
        return False

# Serializer for the Review model
class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'content', 'rating', 'book', 'username']

# Serializer for the LendedBook model
class LendedBookSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)

    class Meta:
        model = LendedBook
        fields = ['book', 'borrowed_on', 'return_on', 'number']

# Serializer for the Wishlist model
class WishlistSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = ['book']

# Serializer for the User model
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

# Serializer for the UserAccount model
class UserAccountSerializer(serializers.ModelSerializer):
    borrowed_books = LendedBookSerializer(many=True, read_only=True, source='lendedbook_set')
    wishlist = WishlistSerializer(many=True, read_only=True, source='wishlist_set')

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'borrowed_books', 'wishlist']
