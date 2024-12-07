from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db.models import Q, F
from .models import Book, LendedBook, Author
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Q, Prefetch
from .models import LendedBook

# Api view to search for books borrowed by a user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_search_user_books(request):
    query = request.GET.get('query', '').strip()
    searched_books = LendedBook.objects.none()

    if query:
        user_matches = User.objects.filter(username__icontains=query)
        searched_books = LendedBook.objects.filter(
            Q(user__in=user_matches) |
            Q(book__title__icontains=query) |
            Q(book__isbn__icontains=query) |
            Q(book__authors__name__icontains=query)
        ).distinct().select_related('book', 'user').prefetch_related(
            Prefetch('book__authors', queryset=Author.objects.all())
        )

    books_data = []
    for lended_book in searched_books:
        authors = ', '.join(author.name for author in lended_book.book.authors.all())
        cover_url = request.build_absolute_uri(lended_book.book.cover.url) if lended_book.book.cover else None
        books_data.append({
            'id': lended_book.id,
            'isbn': lended_book.book.isbn,
            'title': lended_book.book.title,
            'authors': authors,
            'borrower': lended_book.user.username,
            'lended': lended_book.number,
            'cover': cover_url,
            'return_date': lended_book.return_on.isoformat()
        })

    return Response({'books': books_data, 'query': query})

# Api view to allow the librarian to return a book borrowed by a user
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_return_book(request, book_id, username):
    quantity = int(request.data.get('quantity', 1))
    
    returnedBook = get_object_or_404(LendedBook, book__isbn=book_id, user__username=username)
    
    if returnedBook.number >= quantity:
        if returnedBook.number == quantity:
            returnedBook.delete()
        else:
            returnedBook.number -= quantity
            returnedBook.save()
            
        Book.objects.filter(isbn=book_id).update(lended=F('lended') - quantity)
        return Response({'success': f"{quantity} book(s) returned successfully."})
    else:
        return Response({'error': "Cannot return more books than borrowed."}, status=400)

# Api view to get all the books borrowed by the users
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_get_all_borrowed_books(request):
    borrowed_books = LendedBook.objects.all().select_related(
        'book', 'user'
    ).prefetch_related(
        Prefetch('book__authors', queryset=Author.objects.all())
    )

    books_data = []
    for lended_book in borrowed_books:
        authors = ', '.join(author.name for author in lended_book.book.authors.all())
        cover_url = request.build_absolute_uri(lended_book.book.cover.url) if lended_book.book.cover else None
        books_data.append({
            'id': lended_book.id,
            'isbn': lended_book.book.isbn,
            'title': lended_book.book.title,
            'authors': authors,
            'borrower': lended_book.user.username,
            'lended': lended_book.number,
            'cover': cover_url,
            'borrowed_on': lended_book.borrowed_on.isoformat(),
            'return_date': lended_book.return_on.isoformat()
        })

    return Response({'books': books_data})