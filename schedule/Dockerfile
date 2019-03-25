FROM python:3.7-slim-stretch

RUN apt-get -y update

COPY . .

RUN pip3 install -r requirements.txt

CMD ["python3", "reset_database.py"]