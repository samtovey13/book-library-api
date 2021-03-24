# Book Library API

*Users can create accounts, list books and search by genre.*

This project built on my existing backend learning. Key features of this project are:

* a REST API with CRUD operations
* Express API using SQL and Sequelize
* Mocha/Chai and Supertest testing
* schema validation using Sequelize
* manipulation of responses to hide the user's password
* error handling
* complex relationships between database tables
* use of 'helper' files for refactoring and making code DRY


This is an Express app based on a MySQL database, using Sequelize ORM.


# Routes Available

Reader routes
- POST /readers
- GET /readers
- GET /readers/:id
- PATCH /readers/:id
- DELETE /readers/:id

Book routes
- POST /books
- GET /books
- GET /books/:id
- PATCH /books/:id
- DELETE /books/:id

Genre routes
- POST /genres
- GET /genres
- GET /genres/:id
- PATCH /genres/:id
- DELETE /genres/:id

# Run the app locally

## Setup

### Install Docker

Install docker [here](https://docs.docker.com/get-docker/).

Once you have docker installed, you can pull and run a MySQL image using:

```
docker run -d -p 3307:3306 --name book_library -e MYSQL_ROOT_PASSWORD=<PASSWORD> mysql
```
(make sure to replace **\<PASSWORD\>** with a password of your choosing.)


### Install MySQL Workbench

Install MySQL workbench [here](https://dev.mysql.com/downloads/workbench/).


### Connect to your MySQL container

Open up mysql-workbench and connect to your MySQL container. The connection parameters should be:
```
host: 127.0.0.1
port: 3307
password: whatever you set it to when you ran the container
```
If you are able to connect and run queries, then you're ready to move on.

### Install Postman

Install Postman [here](https://www.postman.com/downloads/).

You can use Postman to send and receive API requests. If sending data in the body, make sure to set the body to 'raw' and select JSON as the language.

### Set up your local repo

Clone this git repo to your machine.
Initialise a new NPM project in the project directory with `npm init`.
Install express as a dependency: `npm i -S express`
Install `dotenv` and `nodemon` as development dependencies
Install Sequelize with `npm i -S sequelize`
Install the mysql2 package with `npm i -S mysql2`
Install mocha, chai, and supertest as dev dependencies `npm i -D mocha chai supertest`


Create a **.env** file with the following variables, and check that .env is listed on your **.gitignore** file:
```
DB_PASSWORD=<YOUR_PASSWORD>
DB_NAME=<YOUR_APP_NAME>
DB_USER=root
DB_HOST=localhost
DB_PORT=3307
```
Add a **.env.test** with the same environment variables as your .env. Make sure to give your test database a different name. Having this file will allow you to run tests in a different database which will be wiped after each test run. Check that this file is also listed on your **.gitignore.**


Test your app. Run `npm start`. You should see that the app is listening to port 4000 in your terminal.

You should now see your new database in MySQL Workbench.

You can now explore the available endpoints in Postman, via `localhost:4000/`.


## Running tests

This app uses **supertest** and **chai**.
Check the test suites are working by running `npm test`.


