# 🎵 Playlist Organizer

A personal web app to help you organize your Spotify playlists, one song at a time.

## What is this?

This is a project I built for myself to make it easier to move songs between my Spotify playlists. It lets you pick a playlist, review each song, and quickly add it to any of your other playlists—all in a clean, modern interface.

## Features

- **Spotify Login**: Securely log in with your Spotify account (PKCE flow).
- **Pick a Source Playlist**: Choose any of your playlists to organize.
- **Song-by-Song Review**: Go through each song and decide which other playlists to add it to.
- **Curate Target Playlists**: (Optional) For each source playlist, you can choose which playlists show up as targets, so you only see the ones you care about.
- **Search & Sort Playlists**: Quickly find the right playlist when adding songs.
- **Start Anywhere**: Start organizing from any song number or search for a song to begin from.
- **Responsive, Dark UI**: Looks great on desktop and mobile, with album art, emoji, and smooth controls.
- **Listen on Spotify**: Open any song directly in Spotify with one click.

## How it works

1. **Log in with Spotify**
2. **Pick a playlist to organize**
3. **(Optional) Curate your target playlists**
4. **Go through each song**:
    - See song details and album art
    - Select which playlists to add it to
    - Skip, go back, or add to playlists
    - Open the song in Spotify
5. **Done!**

## Getting Started (Local Setup)

1. **Clone this repo**
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
   - Register your redirect URI in your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications).
4. **Start the app**
   ```bash
   npm start
   # or
   yarn start
   ```
5. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Tech Stack
- React (hooks, functional components)
- Spotify Web API (OAuth PKCE)
- Modern CSS (flexbox, grid, custom properties)

## License
MIT
