# Calobite -- C242-PS311 

<br>

## Tech
### Tools
- Visual Studio Code
- Postman
- Google Cloud Platform - Console

### Libraries
- Node.js = A JavaScript runtime built on Chrome's V8 engine. It allows developers to run JavaScript on the server-side, enabling the creation of scalable and high-performance web applications.
- @hapi/hapi = A server-side framework for Node.js used to easily create HTTP servers. It is ideal for building REST APIs or backend applications.
- @hapi/joi = A library for data validation, ensuring that user-supplied data complies with specified formats or rules.
- bcryptjs = A library for hashing data, mainly used for hashing passwords. It ensures sensitive data is not stored in plain text.
- jsonwebtoken = Used to create and verify JSON Web Tokens (JWT), which are commonly utilized for token-based authentication.
- mysql2 = A library for connecting to and interacting with MySQL databases. It supports modern features like prepared statements and promises.

### Google Cloud Service
- App Engine : For Backend and Machine Learning API services.
- Google Cloud Storage : For storing unstructure data.
- Cloud SQL : For storing our database API

<br>

### Google Cloud Pricing Calculator

![price gcp](https://github.com/user-attachments/assets/c8e565c5-9f74-43ba-a75b-61db9ff8a919)


<br>

## Endpoints API
### User Management

Register User :
```bash
POST /register
```

Login User :
```bash
POST /login
```

Get User Email :
```bash
GET /user/{userId}
```
<br>

### Food Management
Get Foods :
```bash
GET /foods
```

Get Food Detail :
```bash
GET /foods/{id}
```

Get Food By Ingredients :
```bash
GET /foods?ingredients={ingredients name}
```
<br>

### Ingredients Management
Get Ingredients :
```bash
GET /ingredients
```

Get Ingredients by Id :
```bash
GET /ingredients/id/{id}
```

Get Ingredients by Name :
```bash
GET /ingredients/name/{name}
```

Add Ingredients :
```bash
POST /ingredients
```

Update Ingredients :
```bash
PUT /ingredients/{id}
```

Delete Ingredients by Id :
```bash
DELETE /ingredients/{id}
```
