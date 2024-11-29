from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User
from django.contrib import messages
from django.db.models import Q, F
from .models import Book, LendedBook, Author
from .forms import BookForm
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Q, Prefetch
from .models import LendedBook


# Views
def librarian_page(request):
    borrowed_books = LendedBook.objects.select_related('book', 'user').all()
    return render(request, 'librarian/librarian.html', {'borrowed_books': borrowed_books})


def librarian_page(request):
    lendedBook = LendedBook.objects.all()
    return render(request, 'librarian/librarian.html', {'borrowed_books': lendedBook})

def search_user_books(request):
    query = request.GET.get('query', '').strip()
    searched_books = LendedBook.objects.none()

    if query:
        # Search by username
        user_matches = User.objects.filter(username__icontains=query)
        
        # Search by book title, ISBN, or username
        searched_books = LendedBook.objects.filter(
            Q(user__in=user_matches) |
            Q(book__title__icontains=query) |
            Q(book__isbn__icontains=query) |
            Q(book__authors__name__icontains=query)
        ).distinct()

    return render(request, 'librarian/search_user.html', {'books': searched_books, 'query': query})

def return_book(request, book_id, username):
    if request.method == "POST":
        quantity = int(request.POST.get('quantity', 1))
        
        returnedBook = get_object_or_404(LendedBook, book_id=book_id, user__username = username)
        
        if returnedBook.number >= quantity:
            if returnedBook.number == quantity:
                returnedBook.delete()
            else:
                returnedBook.number -= quantity
                returnedBook.save()
                
            Book.objects.filter(isbn=book_id).update(lended=F('lended') - quantity)
            messages.success(request, f"{quantity} book(s) returned successfully.")
        else:
            messages.error(request, "Cannot return more books than borrowed.")
    
    return redirect('librarian')

def add_book(request):
    if request.method == 'POST':
        form = BookForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('librarian')
    else:
        form = BookForm()
    return render(request, 'librarian/add_book.html', {'form': form})

def edit_book(request, book_id):
    book = get_object_or_404(Book, isbn=book_id)
    
    if request.method == 'POST':
        form = BookForm(request.POST, request.FILES, instance=book)
        
        if form.is_valid():
            form.save()  # Save the form
            messages.success(request, "Book edited successfully.")
            return redirect('librarian')
    else:
        form = BookForm(instance=book)

    return render(request, 'librarian/edit_book.html', {'form': form, 'book': book})


def search_books_for_edit(request):
    query = request.GET.get('query', '')
    books = Book.objects.filter(
        Q(title__icontains=query) | Q(isbn__icontains=query) | Q(authors__name__icontains=query)
    )
    return render(request, 'librarian/search_books.html', {'books': books})

def delete_book(request, book_id):
    book = get_object_or_404(Book, isbn=book_id)
    book.delete()
    messages.success(request, "Book deleted successfully.")
    return redirect('librarian')

# API
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
        books_data.append({
            'id': lended_book.id,
            'title': lended_book.book.title,
            'isbn': lended_book.book.isbn,
            'authors': authors,
            'borrower': lended_book.user.username
        })

    return Response({'books': books_data, 'query': query})