const pgp 	= require('pg-promise')();

const cn = {
  host: 'localhost',
  port: 5432,
  url: 'postgres://annarpack:yamibk11@localhost:5432/flying_high_db',
  database: 'flying_high_db',
  user: 'annarpack',
  password: 'yamibk11'
}

const db 	= pgp('postgres://annarpack:yamibk11@localhost:5432/flying_high_db' || cn );

module.exports = db;
