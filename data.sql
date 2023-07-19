CREATE TABLE users (
    user_id integer pk increments unique,
	email varchar(255) NOT NULL,
	password text NOT NULL
) WITH (
    OIDS = False
);