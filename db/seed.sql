DROP DATABASE IF EXISTS flying_high_db;
CREATE DATABASE flying_high_db;
\c flying_high_db

DROP TABLE IF EXISTS places;

CREATE TABLE places(
  id SERIAL PRIMARY KEY,
  placeId VARCHAR(255),
  city VARCHAR(255),
  country VARCHAR(255),
  state VARCHAR(255),
  lat DOUBLE PRECISION,
  long DOUBLE PRECISION
);
