const pgp 	= require('pg-promise')();
const db 	= pgp(process.env.DATABASE_URL || 'postgres://yvelinesay@localhost:5432/flying_high_db');  //update YOURNAMEHERE with your name and create a db called "movie 3"

module.exports = db;
