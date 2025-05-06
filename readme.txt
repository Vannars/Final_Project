# SERVER Setup

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




# PYTHON Backend Setupp:

# 1. Creating/Activating the Virtual Environment 

- Open a terminal in the `src/python` directory and run:

# Creating virtual environment named venv

python -m venv venv

# Activating the virtual environment (Windows)

venv\Scripts\activate

# Activating the virtual environment (macOS/Linux)
source venv/bin/activate

# 2. Install Python Dependencies

- With the venv activated, install:

pip install spacy torch transformers

python -m spacy download en_core_web_sm

## 3. Notice:

- Make sure the virtual environment venv is **activated** to test backend Python scripts individually.
- The backend expects to be called from the Node.js server (see `mindmapProcess.js`). Running mindmapProcess.js runs a default context.
- If python is not working, install the version of python from the microsoft store (windows)


- CLIENT SETUP

1)NPM Install:
Node.js
Npm
D3
mammouth
pdfjs-dist

2) Open terminal:

npm install

or

install individually

3) Start Developmet Server -
npm start


REACT_APP_API_URL=http://localhost:3001 or REACT_APP_API_URL=http://localhost:3002 (USUALLY THIS ONE)