CREATE DATABASE IF NOT EXISTS maprecallis;
USE maprecallis;

CREATE USER IF NOT EXISTS 'maprecallis_app'@'localhost' IDENTIFIED BY 'cjnotes32!';
GRANT ALL PRIVILEGES ON maprecallis.* TO 'maprecallis_app'@'localhost';
FLUSH PRIVILEGES;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  UserID INT AUTO_INCREMENT PRIMARY KEY,
  Username VARCHAR(100) NOT NULL UNIQUE,
  Email VARCHAR(255) NOT NULL UNIQUE,
  PasswordHash VARCHAR(255) NOT NULL,
  DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  LastLogin TIMESTAMP
);

-- Mindmaps table (stores JSON as TEXT)
CREATE TABLE IF NOT EXISTS mindmaps (
  MindMapID INT AUTO_INCREMENT PRIMARY KEY,
  UserID INT NOT NULL,
  MindMapName VARCHAR(255) NOT NULL,
  MapData TEXT NOT NULL, -- stores JSON string
  DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  LastModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (UserID) REFERENCES users(UserID) ON DELETE CASCADE
);