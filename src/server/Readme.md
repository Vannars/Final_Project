# Server Setup

# Prerequisites

node js
npm
mysql
---
## 1. Install Node.js Dependencies

Open a terminal in `src/server` run:

npm install express mysql2 express-session cors body-parser bcrypt express-validator dotenv

---
# 2. Set Up the MySQL Database

# From the src/server directory:
mysql -u <your_mysql_user> -p < create_maprecallis_schema.sql

---

## 3. Configure Environment Variables

Create a `.env` file in `src/server` with your database credentials:

```
HOST=localhost
USER=your_mysql_user
PASSWORD=your_mysql_password
DATABASE=maprecallis
PORT=3001


I used:

USER=maprecallis_app
HOST=localhost
PASSWORD=cjnotes32!
DATABASE=maprecallis
PORT=3001

```

## 4. Start the Server

node server.js

## 5. Python Backend

The server expects Python and the venv in `src/python/venv`.  
See /python/Readme.md
