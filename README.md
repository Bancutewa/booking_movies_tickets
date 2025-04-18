# Movie Ticket Booking System

## Overview

The Movie Ticket Booking System is a web-based application designed to facilitate online movie ticket booking for a single theater. The system allows users to register, log in, browse movies, select showtimes, choose seats, make payments (simulated), and receive electronic tickets via email with QR codes. Administrators can manage movies, showtimes, rooms, and user accounts through an admin dashboard integrated with an existing UI. The project is developed by a team of 5 students within a 1-month timeframe (April 16, 2025 - May 16, 2025).

## Objectives

- **For Users**:
  - Provide a user-friendly platform to search for movies, view showtimes, book tickets, and select seats.
  - Support online payment simulation and deliver e-tickets with QR codes via email.
  - Allow ticket cancellation with clear policies and status notifications.
  - (Optional) Enable movie rating with star-based scores and short comments.
- **For Administrators**:
  - Offer an admin dashboard to manage movies, showtimes, rooms, and user accounts.
  - Ensure secure access with role-based authorization (user/admin).
- **For the Development Team**:
  - Build a functional system within 1 month using modern web technologies.
  - Apply knowledge of NestJS, MySQL, and API integration with an existing UI.
  - Ensure effective collaboration and task division among team members.

## Technologies

### Backend

- **NestJS**: A progressive Node.js framework for building scalable server-side applications.
- **MySQL**: Relational database for storing user data, movies, showtimes, tickets, and transactions.
- **TypeORM/Sequelize**: ORM for interacting with MySQL in NestJS.
- **Libraries**:
  - `@nestjs/jwt`, `bcrypt`: Authentication and password hashing.
  - `nodemailer`: Sending emails for OTP, tickets, and notifications.
  - `qrcode`: Generating QR codes for tickets.
  - `@nestjs/websockets`, `socket.io`: Real-time updates for seat/showtime status.
  - `@nestjs/schedule`: Managing temporary seat reservations.
  - `@nestjs/stripe` (or mock API): Simulated payment processing.

### Frontend

- **Existing UI**: Pre-built UI (React/Vue/Angular) integrated with backend APIs using `axios` or `fetch`.
- **Chart.js** (optional): Displaying statistics in the admin dashboard.

### Development Tools

- **Git**: Version control (GitHub/GitLab).
- **Postman**: API testing.
- **MySQL Workbench**: Database management.
- **Trello/Jira**: Task tracking and project management.

## Database Design

The database is designed using MySQL to support a single theater, with the following tables and relationships:

### Tables

1. **Users**:

   - Stores user information (email, password, full name, phone number, role).
   - Columns: `user_id` (PK), `email` (UNIQUE), `password`, `full_name`, `phone_number`, `role` (user/admin), `created_at`, `updated_at`.

2. **Genres**:

   - Stores movie genres (e.g., Action, Romance).
   - Columns: `genre_id` (PK), `name`, `description`.

3. **Movies**:

   - Stores movie details linked to a genre.
   - Columns: `movie_id` (PK), `title`, `genre_id` (FK), `description`, `duration`, `poster_url`, `created_at`, `updated_at`.

4. **Rooms**:

   - Stores rooms in the single theater (e.g., Room 1, Room 2).
   - Columns: `room_id` (PK), `name`, `total_seats`, `created_at`, `updated_at`.

5. **Showtimes**:

   - Stores showtime details linked to a movie and room.
   - Columns: `showtime_id` (PK), `movie_id` (FK), `room_id` (FK), `start_time`, `end_time`, `price`, `created_at`, `updated_at`.

6. **Seats**:

   - Stores seat details for each room with status (available/reserved/booked).
   - Columns: `seat_id` (PK), `room_id` (FK), `seat_number`, `status`, `created_at`, `updated_at`.

7. **Tickets**:

   - Stores ticket details linked to a user, showtime, and seat.
   - Columns: `ticket_id` (PK), `user_id` (FK), `showtime_id` (FK), `seat_id` (FK), `qr_code`, `status` (active/cancelled), `created_at`, `updated_at`.

8. **Payments**:

   - Stores payment transactions linked to a ticket.
   - Columns: `payment_id` (PK), `ticket_id` (FK), `amount`, `payment_method` (mock/stripe), `status` (pending/success/failed), `created_at`, `updated_at`.

9. **Ratings**:

   - Stores movie ratings linked to a user and movie.
   - Columns: `rating_id` (PK), `user_id` (FK), `movie_id` (FK), `rating` (1-5), `comment`, `created_at`, `updated_at`.

10. **OTPs**:
    - Stores temporary OTP codes for user verification.
    - Columns: `otp_id` (PK), `user_id` (FK), `otp_code`, `expires_at`, `created_at`.

### Relationships

- **Users ↔ OTPs**: 1:N (One user has many OTPs, `ON DELETE CASCADE`).
- **Users ↔ Tickets**: 1:N (One user has many tickets, `ON DELETE SET NULL`).
- **Users ↔ Ratings**: 1:N (One user has many ratings, `ON DELETE SET NULL`).
- **Genres ↔ Movies**: 1:N (One genre has many movies, `ON DELETE SET NULL`).
- **Movies ↔ Showtimes**: 1:N (One movie has many showtimes, `ON DELETE CASCADE`).
- **Movies ↔ Ratings**: 1:N (One movie has many ratings, `ON DELETE CASCADE`).
- **Rooms ↔ Showtimes**: 1:N (One room has many showtimes, `ON DELETE CASCADE`).
- **Rooms ↔ Seats**: 1:N (One room has many seats, `ON DELETE CASCADE`).
- **Showtimes ↔ Tickets**: 1:N (One showtime has many tickets, `ON DELETE CASCADE`).
- **Seats ↔ Tickets**: 1:1 (One seat belongs to one ticket, `ON DELETE CASCADE`).
- **Tickets ↔ Payments**: 1:1 (One ticket has one payment, `ON DELETE CASCADE`).

## Features

### User Features

1. **Register/Login**: Users can create accounts and log in using JWT-based authentication.
2. **OTP Verification**: Simulated OTP verification via email or console.
3. **Profile Management**: Update personal information (name, email, phone).
4. **Movie Browsing**: Search and filter movies by title, genre, or showtime.
5. **Ticket Booking**: Select showtimes, choose seats, and book tickets with temporary seat reservation (5 minutes).
6. **Payment**: Simulated payment (mock API or Stripe test mode).
7. **E-Ticket**: Receive tickets via email with QR codes for theater scanning.
8. **Ticket Cancellation**: Cancel tickets before 2 hours with an 80% refund (simulated).
9. **Movie Rating**: Rate movies (1-5 stars) with optional short comments.

### Admin Features

1. **Movie Management**: Create, update, delete movies and genres.
2. **Room Management**: Manage rooms in the theater (e.g., Room 1, Room 2).
3. **Showtime Management**: Schedule showtimes with real-time seat status updates (WebSocket/polling).
4. **User Management**: View and manage user accounts and roles.
5. **Admin Dashboard**: View movies, showtimes, tickets, and user data with optional statistics (Chart.js).

## Setup Instructions

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Bancutewa/booking_movies_tickets.git
   cd booking_movies_tickets
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment**:

   - Create a `.env` file based on `.env.example`.
   - Set MySQL connection details, JWT secret, email service (Nodemailer), and Stripe API key (if used).

4. **Setup Database**:

   - Run the SQL script (`database.sql`) to create tables.
   - Use MySQL Workbench or command line:
     ```bash
     mysql -u <username> -p < database.sql
     ```

5. **Run the Application**:

   ```bash
   npm run start:dev
   ```

6. **Integrate with UI**:
   - Ensure the existing UI (React/Vue/Angular) calls the correct API endpoints.
   - Test API integration using Postman.

## Missing Features and Future Improvements

Due to the 1-month timeline and student project constraints, the following features are not fully implemented or require future enhancements:

1. **Real Payment Integration**:

   - Currently uses a mock API or Stripe test mode. Integration with real payment gateways (e.g., PayPal, local payment providers) is needed for production.

2. **SMS Notifications**:

   - SMS for tickets and OTPs is simulated via console output. Integration with an SMS service (e.g., Twilio) could enhance user experience.

3. **Advanced Search and Recommendation**:

   - Current search supports basic filtering (title, genre, showtime). Future versions could include AI-based movie recommendations.

4. **Scalability**:

   - The system is designed for a single theater. Supporting multiple theaters requires reintroducing the `Theaters` table and adjusting relationships.

5. **Comprehensive Testing**:

   - Limited to basic unit tests and integration tests. Load testing and stress testing are needed for production readiness.

6. **UI Enhancements**:
   - The existing UI may need improvements for better UX (e.g., interactive seat maps, responsive design).

## Team Responsibilities

- **Member 1**: Authentication, user management, OTP verification.
- **Member 2**: Movie, genre, room, and showtime management, real-time updates.
- **Member 3**: Ticket booking, seat selection, cancellation.
- **Member 4**: Movie rating, e-ticket delivery, QR code generation.
- **Member 5**: Payment processing, admin dashboard integration.

## Timeline

- **Sprint 1 (Apr 16-22, 2025)**: Database design, project setup, basic APIs (auth, movies, rooms).
- **Sprint 2 (Apr 23-29, 2025)**: Showtime management, ticket booking, OTP simulation.
- **Sprint 3 (Apr 30-May 6, 2025)**: Payment simulation, e-ticket delivery, real-time updates.
- **Sprint 4 (May 7-16, 2025)**: UI integration, testing, documentation.

## License

This project is developed for educational purposes and is not licensed for commercial use.

---

For issues or contributions, contact the team via GitHub Issues or email.
