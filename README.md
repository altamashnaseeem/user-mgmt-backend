                                            ---------------------instruction to run code into machine-------------------------------
1-clone this repo into your vs code.
2-run command npm install in root directory
3-create firebase project after that go to project setting>>service accounts then generate private key.
4-create key.json file in root directory and in dist/key.json directory paste the private key into that file.
5-dist folder automatically generated when you run the command tsc.
6-run command npm start.

                                           -----------------------------DATABASE STRUCTURE-------------------------------------------
1. users Collection
Each document represents a user. The document ID is the user's unique identifier.

Fields:
name (String): The name of the user.
email (String): The user's email address (unique per user).
password (String): The hashed password for the user (bcrypt hashed).

2. notes Collection
Each document represents a note associated with a specific user.

Fields:
userId (String): A reference to the users document (user who created the note).
title (String): The title of the note.
content (String): The content of the note.
createdAt (Timestamp): The timestamp when the note was created.

                                         ---------------------Example requests for each API using Postman-------------------------

1. Register User
Endpoint:POST http://localhost:3000/api/users/register

Request Body:
{
  "name": "altamash",
  "email": "altamash@gmail.com",
  "password": "password"
}
##################################################################

4. Update User
Endpoint: PUT http://localhost:3000/api/users/:id

Request Body:
{
  "name": "altamashnaseem",
  "password": "newpassword",
  "email":"altamash01@gmail.com"
}
####################################################################
5. Delete User
Endpoint:DELETE http://localhost:3000/api/users/:userId

####################################################################
1. Save Note
Endpoint:POST http://localhost:3000/api/notes/save

Request Body:
{
  "title":"Reactjs",
  "content":"reactjs is a library",
  "userId":"sdfdfdfedffdf",
}

#######################################################################
2. Get Note
Endpoint:Get http://localhost:3000/api/notes/:userId

##########################################################################
