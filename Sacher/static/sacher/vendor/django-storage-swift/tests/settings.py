import os

PROJECT_DIR = os.path.abspath(os.path.dirname(__file__))
SECRET_KEY = key

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(PROJECT_DIR, 'test.db')
    }
}
