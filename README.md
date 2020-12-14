# vigilant-guacamole
Yet Another Task Tracker

Used technologies: .NET Core + EF + PostgreSQL, React + Redux, Docker, Heroku

For deploy on Heroku
```
heroku container:push --recursive -a just-do-sangaki   \\ just-do-sangaki - name of app in Heroku
heroku container:release web -a just-do-sangaki
heroku ps:scale web=1 -a just-do-sangaki
```