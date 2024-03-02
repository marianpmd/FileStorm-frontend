FROM nginx:alpine
LABEL authors="MarianPetrica"

ADD ./dist/file-storm-frontend /var/www/mariancr.go.ro/html
