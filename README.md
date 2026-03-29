# BlindTest

A cross-platform app for organizing blind tasting events. Built with React + Vite for the web, and wrapped with [Capacitor](https://capacitorjs.com/) for Android and iOS (WebView).

While originally designed for blind beer tasting, it is fully generic and customizable — you can create forms for wine, coffee, whiskey, chocolate, cheese, olive oil, tea, or anything else.

## Features

- **Groups/Organizations** — Create groups, add members with admin/member roles
- **Customizable Testing Forms** — Define scoring criteria with configurable scales; preset templates for beer, wine, coffee, and more
- **Testing Events** — Create events, assign a form, add anonymous sample codes, invite participants by email
- **Blind Tasting UI** — Participants score each sample on every criterion using sliders, with per-criterion notes and overall comments
- **Results Tracking** — Submissions are collected per event

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Mobile**: Capacitor (WebView wrapper for Android & iOS)
- **Routing**: React Router v7
- **State**: React Context + useReducer

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & Run (Web)

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

### Add Native Platforms (Capacitor)

```bash
# Add Android
npx cap add android

# Add iOS (macOS only)
npx cap add ios

# Build the web app, then sync to native projects
npm run build
npx cap sync

# Open in Android Studio / Xcode
npx cap open android
npx cap open ios
```

## Project Structure

```
src/
├── models/         # TypeScript interfaces (Organization, TestingForm, etc.)
├── context/        # React Context + reducer for state management
├── screens/        # All app screens (Home, Organizations, Forms, Events, BlindTest)
├── components/     # Shared UI components (TabBar)
├── theme/          # Global CSS styles and variables
├── App.tsx         # Root component with routing
└── main.tsx        # Entry point
```
