from django.urls import path, reverse_lazy
from .views import api_book_list, api_login, api_logout, api_user_account, api_borrow_book, api_toggle_wishlist, api_leave_review, api_get_reviews, api_search_books, check_staff_status, api_register, api_verify_email
# from .views import home, login_view, register_view, book_detail, toggle_wishlist
from .librarian_views import api_search_user_books, api_return_book
from django.contrib.auth import views as auth_views
from django.contrib.auth.forms import SetPasswordForm

urlpatterns = [
    # path('', home, name='home'),
    # path('register/', register_view, name='register'),
    # path('login/', login_view, name='login'),
    # path('book/<str:book_title>/', book_detail, name='book_detail'),
    # path('book/<str:book_title>/wishlist/', toggle_wishlist, name='toggle_wishlist'),
    # # path('account/', account_view, name='account'),
    # path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    # # path('borrow/', borrow_book, name='borrow'),
    # # path('borrow/query=', borrow_book, name='borrowSearch'),
    # path('librarian/', librarian_page, name='librarian'),
    # path('librarian/search_user/', search_user_books, name='search_user_books'),#
    # path('librarian/return_book/<str:book_id>/<str:username>/', return_book, name='return_book'),
    # path('librarian/search_books/', search_books_for_edit, name='search_books_for_edit'),
    # path('librarian/edit_book/<str:book_id>/', edit_book, name='edit_book'),
    # path('librarian/add_book', add_book, name='add_book'),
    # path('librarian/delete_book/<str:book_id>/', delete_book, name='delete_book'),
    # # path('verify-email/<str:uidb64>/<str:token>/', verify_email, name='verify_email'),
    # # path('resend-verification-email/<uid>/', resend_verification_email, name='resend_verification_email'),
    # # path('account/change_password/', CustomPasswordChangeView.as_view(), name='change_password'),
    # path('password_rset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    # path('password_reset_done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    # path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    # path(
    #     'reset/<uidb64>/<token>/',
    #     auth_views.PasswordResetConfirmView.as_view(form_class=SetPasswordForm),
    #     name='password_reset_confirm'
    # ),
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
]