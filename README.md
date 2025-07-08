# 🎵 Playlist Organizer

A modern web app for organizing your Spotify playlists, one song at a time.

## Features

- **Spotify Authentication**: Securely log in with your Spotify account using the official API and PKCE flow.
- **Source Playlist Selection**: Choose any of your playlists as the "source" to organize.
- **Song-by-Song Review**: Go through each song in your source playlist and decide which other playlists to add it to.
- **Curated Target Playlists (per source)**: Curate which playlists appear as targets for each source playlist, so you only see the ones you care about for that session.
- **Playlist Search & Sorting**: Quickly search and sort your playlists when selecting targets.
- **Hotkeys Sidebar**: (Optional) Save your favorite playlists as "hotkeys" for quick access and one-click adding.
- **Back Button**: Go back to the previous song and change your decision if you make a mistake.
- **Start From Any Song**: Start organizing from any song number or search for a song to begin from.
- **Responsive, Modern UI**: Clean, dark-themed interface with playlist covers, emoji, and smooth controls.

## How It Works

1. **Log in with Spotify**
2. **Select a source playlist** to organize
3. **Curate your target playlists** (optional, per source)
4. **Go through each song**:
    - See song details and album art
    - Select which playlists to add it to
    - Use hotkeys for quick adding (if enabled)
    - Skip, go back, or add to playlists
5. **Finish** when all songs are reviewed!

## Setup & Running Locally

1. **Clone the repo**
2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Set up your Spotify API credentials**
   - Create a `.env` file with your Spotify client ID and redirect URI:
     ```env
     REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id
     REACT_APP_REDIRECT_URI=http://localhost:3000/callback
     ```
   - Register your redirect URI in your Spotify Developer Dashboard.
4. **Start the app**
   ```bash
   npm start
   # or
   yarn start
   ```
5. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Tech Stack
- React (functional components, hooks)
- Spotify Web API (OAuth PKCE)
- Modern CSS (custom properties, flexbox, grid)

## Screenshots
- Playlist selection with covers
- Song-by-song review with album art
- Curate target playlists modal
- Hotkeys sidebar (if enabled)
- Responsive controls with Back/Skip/Add

## Customization
- You can easily change the color scheme, emoji, or add more features (like batch actions or analytics).

## License
MIT
