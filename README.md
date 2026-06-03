# Luma Mazury Hotel - React Booking UI & Demo

I built this hotel booking system to practice managing complex UI state in React without relying on heavy external state libraries. It's a demo reservation portal for a fictional hotel on the Mazury lakes.

## What is in here

- **Multi-step booking flow**: Walks you through selecting a room, picking regional add-ons (like sauna hours or breakfast), filling in guest details, and doing a mock payment.
- **State & Pricing**: Calculates taxes, service fees, and dates (nights) dynamically. It also handles mock promo codes (like MAZURY10).
- **Hold Timer**: When you pick a room, a temporary hold starts. It counts down and expires if you take too long, simulating a real inventory reservation.
- **Room Recommendation**: A simple logic proposes the best room tier based on how many adults/kids you enter.
- **Express & SQLite Server**: There's a simple local backend under `/server` that stores bookings in a SQLite file for testing concurrent saves.

## Running it

1. Make sure you have Node installed.
2. Go to the project directory and run `npm install`.
3. Start the Vite dev server: `npm run dev`.
4. (Optional) Run the local Express server to handle mock orders: `node server/server.js`.
