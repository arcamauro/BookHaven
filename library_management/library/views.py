from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.core.exceptions import ValidationError
from django.db.models import Q, Count, Case, When, Value, IntegerField
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
from .serializers import BookSerializer, ReviewSerializer, UserSerializer, UserAccountSerializer
from django.contrib.auth.password_validation import validate_password
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.core.mail import send_mail

# Api view to get all the books in the library
@api_view(['GET'])
@permission_classes([AllowAny])
def api_book_list(request):
    books = Book.objects.all()
    serializer = BookSerializer(books, many=True, context={
        'request': request,
        'user': request.user if request.user.is_authenticated else None
    })
    return Response(serializer.data)

# Api view to allow the user to login
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
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

# Api view to allow the user to logout
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_logout(request):
    logout(request)
    return Response({'success': 'Logged out successfully.'}, status=status.HTTP_200_OK)

# Api view to get the user account details
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_user_account(request):
    user = request.user
    serializer = UserAccountSerializer(user, context={'request': request})
    return Response(serializer.data)

# Api view to allow the user to borrow a book
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_borrow_book(request):
    isbn = request.data.get('isbn')
    quantity = request.data.get('quantity', 1) 
    book = get_object_or_404(Book, isbn=isbn)

    existing_lended_book = LendedBook.objects.filter(user=request.user, book=book).first()

    if existing_lended_book:
        if book.copies >= book.lended + quantity:
            existing_lended_book.number += quantity
            existing_lended_book.save()
            book.lended += quantity
            book.save()
            
            serializer = BookSerializer(book, context={'request': request})
            return Response(
                {
                    'success': f'{quantity} copies borrowed successfully.',
                    'type': 'success',
                    'book': serializer.data 
                }, 
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {
                    'error': 'Not enough copies available.',
                    'type': 'no_copies'
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )
    else:
        if book.copies >= book.lended + quantity:
            book.lended += quantity
            book.save()
            LendedBook.objects.create(user=request.user, book=book, number=quantity)
            
            serializer = BookSerializer(book, context={'request': request})
            return Response(
                {
                    'success': f'{quantity} copies borrowed successfully.',
                    'type': 'success',
                    'book': serializer.data 
                }, 
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {
                    'error': 'Not enough copies available.',
                    'type': 'no_copies'
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )

# Api view to allow the user to add or remove a book to their wishlist
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_toggle_wishlist(request):
    isbn = request.data.get('isbn')
    book = get_object_or_404(Book, isbn=isbn)
    wishlist_item, created = Wishlist.objects.get_or_create(user=request.user, book=book)

    if not created:
        wishlist_item.delete()
        in_wishlist = False
    else:
        in_wishlist = True
        
    serializer = BookSerializer(book, context={'request': request})
    
    return Response({
        'success': 'Book {} from wishlist.'.format('added to' if created else 'removed from'),
        'book': serializer.data
    }, status=status.HTTP_200_OK)

# Api view to allow the user to leave a review for a book
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_leave_review(request):
    isbn = request.data.get('isbn')
    rating = request.data.get('rating')
    content = request.data.get('content')

    book = get_object_or_404(Book, isbn=isbn)
    existing_review = Review.objects.filter(book=book, user=request.user).first()

    if existing_review:
        existing_review.rating = rating
        existing_review.content = content
        existing_review.save()
        serializer = ReviewSerializer(existing_review)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        review = Review.objects.create(book=book, user=request.user, rating=rating, content=content)
        serializer = ReviewSerializer(review)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# Api view to get all the reviews for a book
@api_view(['GET'])
@permission_classes([AllowAny])
def api_get_reviews(request, isbn):
    reviews = Review.objects.filter(book__isbn=isbn)
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)

# Api view to search for books by title, author or isbn
@api_view(['GET'])
@permission_classes([AllowAny])
def api_search_books(request):
    query = request.query_params.get('q', '')
    
    if len(query) < 2:
        return Response([], status=status.HTTP_200_OK)

    books = Book.objects.filter(
        Q(title__icontains=query) |
        Q(authors__name__icontains=query) |
        Q(isbn__icontains=query)
    ).annotate(
        relevance=Count('authors') + (
            Case(
                When(title__istartswith=query, then=Value(10)),
                default=Value(0),
                output_field=IntegerField(),
            ) +
            Case(
                When(title__iexact=query, then=Value(5)),
                default=Value(0),
                output_field=IntegerField(),
            )
        )
    ).order_by('-relevance').distinct()[:10]

    serializer = BookSerializer(books, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)

# Api view to check if the user is a staff member, it's used to check if an user is a librarian, an email is sent to the user to verify their account
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_staff_status(request):
    is_staff = request.user.is_staff
    return Response({'is_staff': request.user.is_staff}, status=status.HTTP_200_OK)

# Api view to allow the user to register to the library website
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

# Api view to verify the user's email
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

# Api view to allow the user to delete a review of his own
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def api_delete_review(request, review_id):
    try:
        review = Review.objects.get(id=review_id, user=request.user)
        review.delete()
        return Response({'success': 'Review deleted successfully.'}, status=status.HTTP_200_OK)
    except Review.DoesNotExist:
        return Response({'error': 'Review not found or not authorized to delete.'}, status=status.HTTP_404_NOT_FOUND)

# Api view to allow the user to request a password reset via email
@api_view(['POST'])
@permission_classes([AllowAny])
def api_password_reset_request(request):
    email = request.data.get('email')
    try:
        user = User.objects.get(email=email)
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_url = f"http://localhost:3000/reset-password/{uid}/{token}/"
        
        send_mail(
            'Password Reset Request',
            f'Click the following link to reset your password: {reset_url}',
            'from@example.com',
            [email],
            fail_silently=False,
        )
        return Response({'success': 'Password reset email sent successfully.'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'success': 'If an account exists with this email, a password reset link will be sent.'}, status=status.HTTP_200_OK)

# Api view to allow the user to confirm the password reset
@api_view(['POST'])
@permission_classes([AllowAny])
def api_password_reset_confirm(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        new_password = request.data.get('new_password')
        try:
            validate_password(new_password)
            user.set_password(new_password)
            user.save()
            return Response({'success': 'Password reset successful.'}, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({'error': list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'error': 'Invalid reset link.'}, status=status.HTTP_400_BAD_REQUEST)

# Api view to allow the user to change their password
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_change_password(request):
    try:
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        
        if not request.user.check_password(current_password):
            return Response(
                {'error': 'Current password is incorrect.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            validate_password(new_password)
        except ValidationError as e:
            return Response(
                {'error': list(e.messages)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        request.user.set_password(new_password)
        request.user.save()
        
        update_session_auth_hash(request, request.user)
        
        return Response(
            {'success': 'Password changed successfully.'}, 
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )