# Full Stack Open Backend

This project is the backend for the Full Stack Open application. It provides a simple REST API for managing a phonebook.

## Base URL

The backend is deployed at: [https://fullstackopen-2-lj7q.onrender.com](https://fullstackopen-2-lj7q.onrender.com)

## API Endpoints

### Get all persons
```
GET /api/persons
```
Retrieves a list of all persons in the phonebook.

### Get a person by ID
```
GET /api/persons/:id
```
Retrieves a single person by their ID.

### Delete a person by ID
```
DELETE /api/persons/:id
```
Deletes a person from the phonebook by their ID.

### Add a new person
```
POST /api/persons
```
Adds a new person to the phonebook. The request body should be in JSON format and contain a `name` and `number`.

Example request body:
```json
{
  "name": "John Doe",
  "number": "123-4567890"
}
```
