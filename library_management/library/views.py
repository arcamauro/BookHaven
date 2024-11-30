from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, get_user_model, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse
from django.core.mail import send_mail
from django.core.exceptions import ValidationError
from django.contrib.auth.decorators import login_required
from django.db.models import Avg, Q, F, Count, Case, When, Value, IntegerField
# from datetime import datehome
from dateutil.relativedelta import relativedelta
import threading
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Book, LendedBook, Wishlist
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Book, Review, LendedBook, Wishlist
from .serializers import BookSerializer, ReviewSerializer, LendedBookSerializer, WishlistSerializer, UserSerializer, UserAccountSerializer
from django.contrib.auth.password_validation import validate_password
from rest_framework.viewsets import ModelViewSet
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.http import require_http_methods

# # Old Views (Template-based)

# def home(request):
#     books = Book.objects.prefetch_related('authors').all()
#     members = User.objects.filter(is_active=True)
#     for book in books:    
#         book.remaining_copies = book.copies - book.lended
#     return render(request, 'library/home.html', {'books': books, 'members': members})

# def login_view(request):
#     if request.user.is_authenticated:
#         return redirect('home')

#     if request.method == 'POST':
#         username = request.POST['username']
#         password = request.POST['password']
#         user = authenticate(request, username=username, password=password)

#         if user is not None:
#             login(request, user)
#             next_url = request.GET.get('next', '/')
#             return redirect(next_url)
#         else:
#             inactive_user = User.objects.filter(username=username, is_active=False)
#             if inactive_user:
#                 uid = urlsafe_base64_encode(force_bytes(inactive_user.pk))
#                 verification_url = reverse('resend_verification_email', args=[uid])
#                 messages.error(request, f'You have to verify your email. <a href="{verification_url}">Click here</a> to send a new verification email.')
#             else:
#                 messages.error(request, 'Invalid username or password.')

#     return render(request, 'account/login.html')

# def register_view(request):
#     if request.user.is_authenticated:
#         return redirect('home')
    
#     if request.method == 'POST':
#         firstName = request.POST['first_name']
#         lastName = request.POST['last_name']
#         email = request.POST['email']
#         username = request.POST['username']
#         password = request.POST['password']
        
#         try:
#             validate_password(password)
#         except ValidationError as e:
#             for error in e.messages:
#                 messages.error(request, error)
#             return render(request, 'account/register.html')
        
#         if User.objects.filter(username=username).exists():
#             messages.error(request, 'Username already exists.')
#             return render(request, 'account/register.html')

#         if User.objects.filter(email=email).exists():
#             messages.error(request, 'Email already exists.')
#             return render(request, 'account/register.html')

#         try:
#             user = User.objects.create_user(
#                 first_name=firstName, last_name=lastName,
#                 username=username, email=email, password=password,
#                 is_active=False 
#             )

#             token = default_token_generator.make_token(user)
#             uid = urlsafe_base64_encode(force_bytes(user.pk))
#             verification_url = f"{request.build_absolute_uri(reverse('verify_email', args=[uid, token]))}"

#             async_send_verification_email(user, verification_url)
#             messages.success(request, 'Registration successful. Check your email to verify your account.')
#             return redirect('login')
#         except ValidationError as e:
#             print(f"Validation error occurred: {e}")
#         except Exception as e:
#             print(f"An error occurred: {e}")
#     return render(request, 'account/register.html')

# def book_detail(request, book_title):
#     book = get_object_or_404(Book.objects.prefetch_related('authors'), title=book_title)
#     authors = book.authors.all()
#     reviews = Review.objects.filter(book=book)
#     average_rating = reviews.aggregate(Avg("rating"))['rating__avg']

#     reviewed = False
#     if request.user.is_authenticated:
#         reviewed = Review.objects.filter(book=book, user=request.user).exists()

#     if request.method == 'POST':
#         if 'rating' in request.POST:  # Review form
#             rating = request.POST['rating']
#             review_text = request.POST['review_text']
#             Review.objects.create(book=book, user=request.user, rating=rating, content=review_text)
#             return redirect('book_detail', book_title=book_title)

#     remaining_copies = book.copies - book.lended
#     in_wishlist = False
#     if request.user.is_authenticated:
#         in_wishlist = Wishlist.objects.filter(book=book, user=request.user).exists()

#     return render(request, 'library/default_book_page.html', {
#         'book': book, 
#         'reviews': reviews, 
#         'average_rating': average_rating, 
#         'reviewed': reviewed, 
#         'remaining_copies': remaining_copies, 
#         'author': authors,
#         'in_wishlist': in_wishlist
#     })

# @login_required
# def toggle_wishlist(request, book_title):
#     if request.method == 'POST':
#         book = get_object_or_404(Book, title=book_title)
#         wishlist_item, created = Wishlist.objects.get_or_create(
#             user=request.user,
#             book=book
#         )
#         if not created:
#             wishlist_item.delete()
#             messages.add_message(request, messages.SUCCESS, 
#                 f"'{book.title}' removed from wishlist.", 
#                 extra_tags='wishlist')
#         else:
#             messages.add_message(request, messages.SUCCESS, 
#                 f"'{book.title}' added to wishlist.", 
#                 extra_tags='wishlist')
        
#         return redirect('book_detail', book_title=book_title)

# New API Views (JSON-based)

@api_view(['GET'])
@permission_classes([AllowAny])
def api_book_list(request):
    books = Book.objects.all()
    serializer = BookSerializer(books, many=True, context={'request': request})
    return Response(serializer.data)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Please provide both username and password.'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(request, username=username, password=password)
    
    if user is not None:
        login(request, user)
        return Response({'success': 'Logged in successfully.'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@ensure_csrf_cookie
def api_logout(request):
    logout(request)
    return Response({'success': 'Logged out successfully.'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_user_account(request):
    user = request.user
    serializer = UserAccountSerializer(user, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_borrow_book(request):
    isbn = request.data.get('isbn')
    book = get_object_or_404(Book, isbn=isbn)

    # Check if user already has borrowed this book
    if LendedBook.objects.filter(user=request.user, book=book).exists():
        return Response(
            {
                'error': 'You have already borrowed this book.',
                'type': 'already_borrowed'
            }, 
            status=status.HTTP_400_BAD_REQUEST
        )

    if book.copies > book.lended:
        book.lended += 1
        book.save()
        LendedBook.objects.create(user=request.user, book=book, number=1)
        return Response(
            {
                'success': 'Book borrowed successfully.',
                'type': 'success'
            }, 
            status=status.HTTP_200_OK
        )
    else:
        return Response(
            {
                'error': 'No copies available. You can add it to your wishlist to be notified when it becomes available.',
                'type': 'no_copies'
            }, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_toggle_wishlist(request):
    isbn = request.data.get('isbn')
    book = get_object_or_404(Book, isbn=isbn)
    wishlist_item, created = Wishlist.objects.get_or_create(user=request.user, book=book)

    if not created:
        wishlist_item.delete()
        return Response({'success': 'Book removed from wishlist.'}, status=status.HTTP_200_OK)
    else:
        return Response({'success': 'Book added to wishlist.'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_leave_review(request):
    isbn = request.data.get('isbn')
    rating = request.data.get('rating')
    content = request.data.get('content')

    book = get_object_or_404(Book, isbn=isbn)
    existing_review = Review.objects.filter(book=book, user=request.user).first()

    if existing_review:
        # Update the existing review
        existing_review.rating = rating
        existing_review.content = content
        existing_review.save()
        serializer = ReviewSerializer(existing_review)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        # Create a new review
        review = Review.objects.create(book=book, user=request.user, rating=rating, content=content)
        serializer = ReviewSerializer(review)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([AllowAny])
def api_get_reviews(request, isbn):
    reviews = Review.objects.filter(book__isbn=isbn)
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def api_search_books(request):
    query = request.query_params.get('q', '')
    
    # Return empty list for very short queries to avoid unnecessary searches
    if len(query) < 2:
        return Response([], status=status.HTTP_200_OK)

    books = Book.objects.filter(
        Q(title__icontains=query) |
        Q(authors__name__icontains=query) |
        Q(isbn__icontains=query)
    ).annotate(
        relevance=Count('authors') + (
            # Prioritize matches at the start of titles
            Case(
                When(title__istartswith=query, then=Value(10)),
                default=Value(0),
                output_field=IntegerField(),
            ) +
            # Prioritize exact matches in title
            Case(
                When(title__iexact=query, then=Value(5)),
                default=Value(0),
                output_field=IntegerField(),
            )
        )
    ).order_by('-relevance').distinct()[:10]  # Limit to 10 results for better performance

    serializer = BookSerializer(books, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_staff_status(request):
    is_staff = request.user.is_staff
    return Response({'is_staff': request.user.is_staff}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def api_register(request):
    try:
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        email = request.data.get('email')
        username = request.data.get('username')
        password = request.data.get('password')
        confirm_password = request.data.get('confirm_password')

        # Validate required fields
        if not all([first_name, last_name, email, username, password, confirm_password]):
            return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if password != confirm_password:
            return Response({'error': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(password)
        except ValidationError as e:
            return Response({'error': list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            first_name=first_name,
            last_name=last_name,
            username=username,
            email=email,
            password=password,
            is_active=False
        )

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        verification_url = f"http://localhost:3000/verify-email/{uid}/{token}/"

        try:
            send_mail(
                'Verify your email',
                f'Please verify your email by clicking the following link: {verification_url}',
                'from@example.com',
                [email],
                fail_silently=False,
            )
        except Exception as e:
            # If email sending fails, delete the user and return error
            user.delete()
            return Response(
                {'error': 'Failed to send verification email. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {'success': 'Registration successful. Check your email to verify your account.'},
            status=status.HTTP_201_CREATED
        )

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([AllowAny])
def api_verify_email(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return Response({'success': 'Email verified successfully.'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid verification link.'}, status=status.HTTP_400_BAD_REQUEST)
