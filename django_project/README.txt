Django Back End Project
A Django-based project that provides a REST API with JWT authentication, CORS support, and MySQL connectivity.

Prerequisites
Before you begin, ensure you have the following installed:

Python 3.x (compatible with Django 5.1.7)
pip – Python’s package installer
A virtual environment tool (such as venv or virtualenv) to manage project dependencies
MySQL Server – with a configured database for the project

Installation
Clone the Repository
Clone the project repository to your local machine:

git clone <repository-url> cd <repository-directory>

Create and Activate a Virtual Environment
Create a virtual environment to isolate your dependencies.

On macOS/Linux: python3 -m venv env source env/bin/activate

On Windows: python -m venv env env\Scripts\activate

Install Dependencies
Install the required packages from the requirements.txt file:

pip install -r requirements.txt

The requirements.txt file should include at least the following packages:

makefile
Copy
Django==5.1.7
djangorestframework
djangorestframework-simplejwt
django-cors-headers
django-environ
mysqlclient
Configure Environment Variables
This project uses django-environ to manage environment variables. Create a .env file at the root of your project with the following content (replace the placeholders with your actual database credentials):
NAME=your_database_name
USER=your_database_user
PASSWORD=your_database_password
HOST=your_database_host
PORT=your_database_port

Apply Migrations
Set up your database and create the necessary tables by running:

python manage.py migrate
Create a Superuser (Optional)
To access the Django admin interface, create a superuser:


python manage.py createsuperuser
Follow the prompts to complete the superuser creation.

Run the Development Server
Start the Django development server with:

python manage.py runserver
Open your browser and visit http://127.0.0.1:8000/ to view the project.