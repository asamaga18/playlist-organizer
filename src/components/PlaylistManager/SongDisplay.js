import React, { useState } from 'react';
import './SongDisplay.css';

const SongDisplay = ({ track, progress, sourcePlaylistName }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  if (!track || !track.track) {
    return (
      <div className="song-container">
        <div style={{ textAlign: 'center', width: '100%', color: '#666' }}>
          <h3>No track data available</h3>
          <p>This might be a local file or unavailable track.</p>
        </div>
      </div>
    );
  }

  const { track: songData } = track;
  const progressPercentage = (progress.current / progress.total) * 100; 

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  const albumArt = songData.album.images?.[0]?.url || null;

  const handlePlayPreview = async () => {
    if (!songData.preview_url) return;
    setAudioLoading(true);
    try {
      const audio = new Audio(songData.preview_url);
      audio.volume = 0.3;
      await audio.play();
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 15000);
    } catch (error) {
      window.open(songData.preview_url, '_blank');
    } finally {
      setAudioLoading(false);
    }
  };

  return (
    <>
      <div className="source-playlist-badge">
        📂 From: {sourcePlaylistName}
      </div>

      <div className="song-container">
        <div className="album-art-container">
          {albumArt && !imageError ? (
            <>
              {imageLoading && <div className="album-art-placeholder"><div className="loading-spinner" /></div>}
              <img
                className="album-art"
                src={albumArt}
                alt={`${songData.album.name} album cover`}
                style={{ display: imageLoading ? 'none' : 'block' }}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false);
                  setImageError(true);
                }}
              />
            </>
          ) : (
            <div className="album-art-placeholder">🎵<br />No Image</div>
          )}

          {songData.preview_url && (
            <button
              className="play-button"
              onClick={handlePlayPreview}
              disabled={audioLoading}
              title="Play 15-second preview"
            >
              {audioLoading ? <div className="loading-spinner" /> : '▶️'}
            </button>
          )}
        </div>

        <h2 className="song-title" title={songData.name}>{songData.name}</h2>
        <p className="artist-name" title={songData.artists.map(a => a.name).join(', ')}>
          👤 {songData.artists.map(a => a.name).join(', ')}
        </p>
        <p className="album-name" title={songData.album.name}>💿 {songData.album.name}</p>

        {/* Listen on Spotify button */}
        {songData.external_urls?.spotify && (
          <a
            href={songData.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="spotify-link-button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#1DB954',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: 24,
              fontWeight: 600,
              textDecoration: 'none',
              margin: '12px 0',
              fontSize: 16,
              boxShadow: '0 2px 8px rgba(30,185,84,0.2)',
              transition: 'background 0.2s',
            }}
            title="Listen on Spotify"
          >
            <svg width="22" height="22" viewBox="0 0 168 168" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="84" cy="84" r="84" fill="#1DB954"/>
              <path d="M120.1 121.6c-2.1 3.5-6.6 4.6-10.1 2.5-27.7-16.9-62.6-20.7-103.7-11.2-4 0.9-8.1-1.6-9-5.6-0.9-4 1.6-8.1 5.6-9 44.6-10.1 82.2-6 112.1 12.5 3.5 2.1 4.6 6.6 2.5 10.1zm14.3-28.7c-2.6 4.2-8.1 5.6-12.3 3-31.8-19.4-80.3-25-117.8-13.5-4.6 1.3-9.4-1.3-10.7-5.9-1.3-4.6 1.3-9.4 5.9-10.7 41.8-12.2 94.1-6.1 129.2 15.1 4.2 2.6 5.6 8.1 3 12.3zm15.2-31.2c-37.1-22.1-98.2-24.2-133.2-13.1-5.1 1.6-10.5-1.2-12.1-6.3-1.6-5.1 1.2-10.5 6.3-12.1 38.7-12.1 104.2-9.7 145.7 14.1 5 3 6.6 9.5 3.6 14.5-3 5-9.5 6.6-14.5 3.6z" fill="#fff"/>
            </svg>
            Listen on Spotify
          </a>
        )}

        <div className="song-details">
          {songData.duration_ms && <span className="detail-badge">⏱️ {formatDuration(songData.duration_ms)}</span>}
          {songData.album.release_date && <span className="detail-badge">📅 {new Date(songData.album.release_date).getFullYear()}</span>}
          {songData.popularity > 70 && <span className="detail-badge popular">🔥 {songData.popularity}% popular</span>}
          {songData.explicit && <span className="detail-badge explicit">🚫 Explicit</span>}
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-text">Song {progress.current} of {progress.total}</div>
        <div className="progress-subtext">{progress.processed} completed</div>

        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progressPercentage}%` }} />
        </div>

        <div className="progress-subtext">{Math.round(progressPercentage)}% complete</div>
      </div>
    </>
  );
};

export default SongDisplay;
