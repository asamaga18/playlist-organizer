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
    <div>
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

        <div className="song-info">
          <h2 className="song-title" title={songData.name}>{songData.name}</h2>
          <p className="artist-name" title={songData.artists.map(a => a.name).join(', ')}>
            👤 {songData.artists.map(a => a.name).join(', ')}
          </p>
          <p className="album-name" title={songData.album.name}>💿 {songData.album.name}</p>

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
      </div>
    </div>
  );
};

export default SongDisplay;
