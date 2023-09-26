FROM python:3.11-alpine

WORKDIR /app/backend

COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "wsgi.py"]