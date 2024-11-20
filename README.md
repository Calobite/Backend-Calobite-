# Calobite

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
<br>

### Ingredients Management
Get Ingredients :
```bash
GET /ingredients
```

Get Ingredients by Id :
```bash
GET /ingredients/{id}
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
