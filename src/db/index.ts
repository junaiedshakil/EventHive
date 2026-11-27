import { Pool } from "pg";
import config from "../config";



export const pool = new Pool({
    connectionString:config.connection_string
})


export const initDB = async () => { 
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'attendee'
    CHECK (role IN ('attendee', 'organizer')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`)
    await pool.query(`
    CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    date TIMESTAMP NOT NULL,
    location TEXT NOT NULL,
    total_seats INTEGER NOT NULL CHECK (total_seats > 0),
    available_seats INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    organizer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_available_seats
    CHECK (
        available_seats >= 0
        AND available_seats <= total_seats
        )
);`)
    await pool.query(`
    CREATE TABLE bookings (
        id SERIAL PRIMARY KEY,
        event_id INTEGER NOT NULL REFERENCES events(id)
        ON DELETE CASCADE,
        attendee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        tickets_booked INTEGER NOT NULL CHECK (tickets_booked > 0),
        total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
        status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    `)
console.log("database connected successfully!!!!")

}