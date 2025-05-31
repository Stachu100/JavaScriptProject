const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const fs = require('fs');

(async () => {
  if (!fs.existsSync('./backend')) {
    fs.mkdirSync('./backend');
  }

  const db = await open({
    filename: './backend/database.sqlite',
    driver: sqlite3.Database,
  });

  await db.exec('PRAGMA foreign_keys = ON;');

  await db.exec(`
    CREATE TABLE IF NOT EXISTS Users (
      Id            INTEGER PRIMARY KEY AUTOINCREMENT,
      UserName      TEXT    NOT NULL UNIQUE,
      UserPassword  TEXT    NOT NULL,
      IsAdmin       INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS Books (
      Id          INTEGER PRIMARY KEY AUTOINCREMENT,
      Title       TEXT    NOT NULL,
      Author      TEXT    NOT NULL,
      Image       TEXT,
      MaxDays     INTEGER,
      Genre       TEXT    NOT NULL,
      IsBorrowed  INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS BorrowedBooks (
      Id           INTEGER PRIMARY KEY AUTOINCREMENT,
      UserId       INTEGER NOT NULL,
      BookId       INTEGER NOT NULL,
      BorrowedDate DATETIME NOT NULL,
      ReturnDate   DATETIME NOT NULL,
      FOREIGN KEY (UserId) REFERENCES Users(Id)  ON DELETE CASCADE,
      FOREIGN KEY (BookId) REFERENCES Books(Id)  ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS HistoryBorrowedBooks (
      Id            INTEGER PRIMARY KEY AUTOINCREMENT,
      UserId        INTEGER NOT NULL,
      BookId        INTEGER NOT NULL,
      BorrowedDate  DATETIME NOT NULL,
      ReturnedDate  DATETIME,
      IsReturned    INTEGER,
      FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
      FOREIGN KEY (BookId) REFERENCES Books(Id) ON DELETE CASCADE
    );
  `);

  const admin = await db.get('SELECT 1 FROM Users WHERE UserName = ?', 'admin');
  if (!admin) {
    await db.run(
      'INSERT INTO Users (UserName, UserPassword, IsAdmin) VALUES (?, ?, ?);',
      'admin',
      'admin',
      1
    );
    console.log('Utworzono konto administratora: login "admin", hasło "admin".');
  } else {
    console.log('ℹKonto administratora już istnieje – pomijam seed.');
  }

  await db.close();
})();