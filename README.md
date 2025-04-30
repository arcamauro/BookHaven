# ReadHaven

ReadHaven is a library management system developed as part of a university course on UI programming. The system provides functionality for two types of users:
- **Normal User**: Can borrow books, add reviews, and manage a wishlist.
- **Librarian**: Has all the capabilities of a normal user, with the additional ability to manage book returns for users.

## Requirements

To run this project, you need the following:
- Python 3.11(preferrable, to avoid compatibility problems)
- Django (backend framework)
- Node.js and npm (for the frontend, if applicable)

## Getting Started

To use the website, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/arcamauro/ReadHaven
   ```

2. Navigate to the project directory:
   ```bash
   cd ReadHaven
   ```

3. Install the required dependencies:
   - For the backend:
     ```bash
     pip install -r requirements.txt
     ```
   - For the frontend (if applicable):
     ```bash
     cd library_frontend
     npm install
     ```

4. Set up the environment variables:
   - Create a `.env` file in the `library_management` directory and configure it as needed.

5. Run the application:
   - Start the backend server:
     ```bash
     cd library_management
     python manage.py runserver
     ```
   - Start the frontend development server in a separate terminal:
     ```bash
     cd library_management/library_frontend
     npm start
     ```

## Project Structure

```
ReadHaven/
├── library_management/
│   ├── library/                # Backend application
│   ├── library_frontend/       # Frontend application
│   ├── media/                  # Media files (e.g., book covers)
│   ├── manage.py               # Django management script
│   ├── settings.py             # Project settings
│   └── urls.py                 # URL routing
├── requirements.txt            # Backend dependencies
├── README.md                   # Project documentation
└── LICENSE                     # License information
```

## Demo Video

[Download the demo video](path/to/video.mp4)

## License

This project is licensed under the terms of the [MIT License](LICENSE).

---

> The backend is developed by Davide Scaccia, Danilo Spera, Giovanni Romano, and Arcangelo Mauro.  
> This specific application is authored by Arcangelo Mauro.
