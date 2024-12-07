from django.urls import path
from .views import api_book_list, api_login, api_logout, api_user_account, api_borrow_book, api_toggle_wishlist, api_leave_review, api_get_reviews, api_search_books, check_staff_status, api_register, api_verify_email, api_delete_review, api_password_reset_request, api_password_reset_confirm, api_change_password
from .librarian_views import api_search_user_books, api_return_book, api_get_all_borrowed_books

urlpatterns = [
    path('api/login/', api_login, name='api_login'),
    path('api/books/', api_book_list, name='api_book_list'),
    path('api/logout/', api_logout, name='api_logout'),
    path('api/account/', api_user_account, name='api_user_account'),
    path('api/borrow/', api_borrow_book, name='api_borrow_book'),
    path('api/wishlist/', api_toggle_wishlist, name='api_toggle_wishlist'),
    path('api/review/', api_leave_review, name='api_leave_review'),
    path('api/reviews/<str:isbn>/', api_get_reviews, name='api_get_reviews'),
    path('api/search/', api_search_books, name='api_search_books'),
    path('api/check_staff/', check_staff_status, name='check_staff_status'),
    path('api/search_user/', api_search_user_books, name='api_search_user_books'),
    path('api/register/', api_register, name='api_register'),
    path('api/verify-email/<str:uidb64>/<str:token>/', api_verify_email, name='api_verify_email'),
    path('api/return_book/<str:book_id>/<str:username>/', api_return_book, name='api_return_book'),
    path('api/borrowed_books/', api_get_all_borrowed_books, name='api_get_all_borrowed_books'),
    path('api/review/<int:review_id>/', api_delete_review, name='api_delete_review'),
    path('api/password-reset/', api_password_reset_request, name='api_password_reset_request'),
    path('api/password-reset-confirm/<str:uidb64>/<str:token>/', api_password_reset_confirm, name='api_password_reset_confirm'),
    path('api/change-password/', api_change_password, name='api_change_password'),
]