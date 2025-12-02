# Meeting Note Taker - Frontend

Next.js frontend for the Meeting Note Taker application.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and set the backend API URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3001](http://localhost:3001) (or the port shown in the terminal)

## Features

- ✅ Add Google Meet links with Grant ID
- ✅ Real-time meeting status updates
- ✅ Automatic polling for active meetings
- ✅ View meeting details and generated notes
- ✅ Progress tracking with visual indicators
- ✅ Responsive design

## Project Structure

```
frontend/
├── app/
│   ├── layout.js          # Root layout
│   ├── page.js            # Main page
│   └── globals.css        # Global styles
├── components/
│   ├── MeetingForm.js     # Form to add meetings
│   ├── MeetingsList.js    # List of all meetings
│   └── MeetingModal.js    # Modal for meeting details
├── lib/
│   └── api.js            # API client
└── package.json
```

## API Integration

The frontend communicates with the backend API at `http://localhost:3000` by default. Make sure the backend server is running before using the frontend.

## Build for Production

```bash
npm run build
npm start
```

# meeting-note-taker-ui
