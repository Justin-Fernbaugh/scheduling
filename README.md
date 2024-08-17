# Appointment Scheduling

## Technologies Used

### Frontend

- **React**
- **TypeScript**
- **Axios**
- **Tailwind CSS**

### Backend

- **Node.js**
- **Express**
- **Axios**
- **Cors**

## How to Run / Setup the Frontend and Backend

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org).
- **npm**: Node.js package manager, which comes with Node.js.

### Backend Setup

1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the backend server:
   ```sh
   npm start
   ```
4. The backend server will start on port 8000 by default.

### Frontend Setup

1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Install setup:
   ```sh
   npm run setup
   ```
4. Run the frontend development server:
   ```sh
   npm run dev
   ```
5. The frontend development server will start on port 5173 by default.

#### (Optional) Build for Production

1.  ```sh
    npm run build
    ```

1.  Alternative
    ```sh
    docker build . -t <container_name>
    docker run  -p <port_number>:80 <container_name>
    ```

## API Routes

### `/api/appointments`

- **Method**: GET
- **Description**: Fetches appointments for the current or next month based on the `currentMonth` query parameter.
- **Query Parameters**:
  - `currentMonth` (optional): If `1` or not provided, fetches appointments for the current month. If `0`, fetches appointments for the next month.
- **Response**: Returns a list of appointments.

### `/api/appointments/slots`

- **Method**: GET
- **Description**: Fetches available appointment slots for a specific date.
- **Query Parameters**:
  - `date` (required): The date for which to fetch available slots in `YYYY-MM-DD` format.
- **Response**: Returns a list of available appointment slots for the specified date.

## How the Frontend Works

### Components

#### `AppointmentCalendar.tsx`

- **State Management**:
  - `selectedDate`: Stores the currently selected date.
  - `availability`: Stores the availability data for the current or next month.
  - `slots`: Stores the available slots for the selected date.
  - `currentMonth`: Stores the current month being viewed (1 for current month, 0 for next month).
- **Effects**:
  - `useEffect` to fetch availability data when `currentMonth` changes.
- **Functions**:
  - `handleDateClick`: Fetches available slots for the selected date.
  - `handleMonthToggle`: Toggles between the current month and the next month.
  - `getMonthName`: Returns the name of the month based on the index.
- **Rendering**:
  - Renders a calendar with available dates.
  - Renders available slots for the selected date.

#### `App.tsx`

- **Props**:
  - `router`: The router instance created using `createRouter`.
- **Rendering**:
  - Renders the header bar with the title "Scheduling".
  - Renders the `AppointmentCalendar` component in the main content area.

## Running the Application (After Setup)

1. Start the backend server:
   ```sh
   cd backend
   npm run dev
   ```
2. Start the frontend development server:
   ```sh
   cd frontend
   npm run dev
   ```
3. Access the application: Open your browser and navigate to [http://localhost:5173](http://localhost:5173).

The frontend will communicate with the backend to fetch appointment data and display it in a user-friendly calendar interface.
