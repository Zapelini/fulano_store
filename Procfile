web: python manage.py collectstatic --noinput; newrelic-admin run-program gunicorn -w $5 -t $60 --max-requests 10 main.wsgi