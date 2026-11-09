# Cool Furman Games

## Initialize the score database

From the repository root, run this once before starting the app:

```sh
sqlite3 db/coolfurmangames.db ".read db/create_db.sql"
```

This creates the `scores` table and inserts the six initial scores. The Flask app
reads leaderboard scores from this SQLite database.
