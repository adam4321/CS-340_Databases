# OSU CS-340 Summer 2020 Group 34 Project 

The project is a bug tracking application which uses a server built in 
Node.js to server-side render the pages using the handlebars templating
system.

The server is located in app.js and will need all dependencies installed
via npm before the server can be started. The mysql database connection
can be set by adding a credentials.js file which exports an object with
the necessary connection details. The credentials.js file is listed in
the .gitignore file, so it won't be added to version control and the
log in details will remain secure.

Start the app for testing with CLI call => node app.js 