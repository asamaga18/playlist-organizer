import React, { useState, useEffect } from 'react';
import SpotifyAPI from '../../services/spotifyApi';
import SongDisplay from './SongDisplay';
import PlaylistSelector from './PlaylistSelector';
import Controls from './Controls';
import './PlaylistManager.css';

const PlaylistManager = ({ token, onLogout }) => {
  const [spotifyApi] = useState(() => new SpotifyAPI(token));
  const [user, setUser] = useState(null);
  const [allPlaylists, setAllPlaylists] = useState([]);
  const [sourcePlaylist, setSourcePlaylist] = useState(null);
  const [sourceTracks, setSourceTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processedSongs, setProcessedSongs] = useState(0);
  const [showSongSelector, setShowSongSelector] = useState(false);
  const [startSongNumber, setStartSongNumber] = useState(1);
  const [songSearchTerm, setSongSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userData, userPlaylists] = await Promise.all([
          spotifyApi.getCurrentUser(),
          spotifyApi.getUserPlaylists()
        ]);
        
        setUser(userData);
        setAllPlaylists(userPlaylists);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        if (error.response?.status === 401) {
          onLogout();
        }
        setLoading(false);
      }
    };

    loadData();
  }, [spotifyApi, onLogout]);

  const handleSourcePlaylistSelect = async (playlist) => {
    setLoading(true);
    try {
      const tracks = await spotifyApi.getPlaylistTracks(playlist.id);
      const validTracks = tracks.filter(item => item.track && item.track.id);
      
      setSourcePlaylist(playlist);
      setSourceTracks(validTracks);
      setCurrentTrackIndex(0);
      setSelectedPlaylists([]);
      setProcessedSongs(0);
      setStartSongNumber(1);
      setSongSearchTerm('');
      setShowSongSelector(true);
    } catch (error) {
      console.error('Error loading playlist tracks:', error);
      alert('Error loading playlist tracks. Please try again.');
    }
    setLoading(false);
  };

  const handleStartFromSong = () => {
    const startIndex = Math.max(0, Math.min(startSongNumber - 1, sourceTracks.length - 1));
    setCurrentTrackIndex(startIndex);
    setShowSongSelector(false);
  };

  const handleStartFromSearch = () => {
    if (!songSearchTerm.trim()) return;
    
    const searchTerm = songSearchTerm.toLowerCase();
    const foundIndex = sourceTracks.findIndex(item => 
      item.track && (
        item.track.name.toLowerCase().includes(searchTerm) ||
        item.track.artists.some(artist => artist.name.toLowerCase().includes(searchTerm))
      )
    );
    
    if (foundIndex !== -1) {
      setCurrentTrackIndex(foundIndex);
      setShowSongSelector(false);
      setSongSearchTerm('');
    } else {
      alert('No songs found matching your search. Please try a different search term.');
    }
  };

  const handlePlaylistToggle = (playlistId) => {
    setSelectedPlaylists(prev => 
      prev.includes(playlistId)
        ? prev.filter(id => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  const handleSubmit = async () => {
    if (selectedPlaylists.length === 0) {
      alert('Please select at least one playlist to add the song to.');
      return;
    }

    const currentTrack = sourceTracks[currentTrackIndex];
    setLoading(true);
    
    try {
      await Promise.all(
        selectedPlaylists.map(playlistId =>
          spotifyApi.addTrackToPlaylist(playlistId, currentTrack.track.uri)
        )
      );
      
      setProcessedSongs(prev => prev + 1);
      
      if (currentTrackIndex < sourceTracks.length - 1) {
        setCurrentTrackIndex(prev => prev + 1);
        setSelectedPlaylists([]);
      } else {
        alert(`🎉 All done! Processed ${sourceTracks.length} songs from "${sourcePlaylist.name}"`);
      }
    } catch (error) {
      console.error('Error adding track to playlists:', error);
      alert('Error adding song to playlists. Please try again.');
    }
    
    setLoading(false);
  };

  const handleSkip = () => {
    setProcessedSongs(prev => prev + 1);
    
    if (currentTrackIndex < sourceTracks.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
      setSelectedPlaylists([]);
    } else {
      alert(`Finished reviewing all songs from "${sourcePlaylist.name}"`);
    }
  };

  const handleBackToPlaylistSelection = () => {
    setSourcePlaylist(null);
    setSourceTracks([]);
    setCurrentTrackIndex(0);
    setSelectedPlaylists([]);
    setProcessedSongs(0);
    setShowSongSelector(false);
    setStartSongNumber(1);
    setSongSearchTerm('');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  if (!sourcePlaylist) {
    return (
      <div className="container">
        <div className="header">
          <div>
            <h1>🎵 Playlist Organizer</h1>
            {user && <p>Welcome, {user.display_name}!</p>}
          </div>
          <button className="logout-button" onClick={onLogout}>Logout</button>
        </div>

        <div className="source-playlist-section">
          <h2>Select Source Playlist</h2>
          <p>Choose the playlist you want to organize. You'll go through each song and decide which other playlists to add it to.</p>
          
          <div className="playlist-grid">
            {allPlaylists.map(playlist => (
              <div key={playlist.id} className="playlist-card" onClick={() => handleSourcePlaylistSelect(playlist)}>
                <div className="playlist-card-header">
                  {playlist.images?.[0] ? (
                    <img 
                      src={playlist.images[0].url} 
                      alt={playlist.name}
                      className="playlist-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="playlist-image-placeholder" style={{ display: playlist.images?.[0] ? 'none' : 'flex' }}>
                    🎵
                  </div>
                  <div className="playlist-info">
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>{playlist.name}</h3>
                    <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                      {playlist.tracks.total} tracks
                    </p>
                    {playlist.description && (
                      <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#888', lineHeight: '1.3' }}>
                        {playlist.description.length > 80 
                          ? `${playlist.description.substring(0, 80)}...`
                          : playlist.description
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show song selector if we have tracks but haven't started yet
  if (showSongSelector && sourceTracks.length > 0) {
    return (
      <div className="container">
        <div className="header">
          <div>
            <h1>🎵 Playlist Organizer</h1>
            <p>Organizing: <strong>{sourcePlaylist.name}</strong></p>
          </div>
          <button className="logout-button" onClick={onLogout}>Logout</button>
        </div>

        <button className="back-button" onClick={handleBackToPlaylistSelection}>
          ← Back to Playlist Selection
        </button>

        <div className="song-selector-section">
          <h2>Choose Starting Point</h2>
          <p>Select where you want to start organizing your playlist:</p>
          
          <div className="song-selector-options">
            <div className="option-card">
              <h3>🎯 Start from Song Number</h3>
              <p>Begin from a specific song number (1-{sourceTracks.length})</p>
              <div className="input-group">
                <input
                  type="number"
                  min="1"
                  max={sourceTracks.length}
                  value={startSongNumber}
                  onChange={(e) => setStartSongNumber(parseInt(e.target.value) || 1)}
                  className="song-number-input"
                  placeholder="Enter song number"
                />
                <button 
                  onClick={handleStartFromSong}
                  className="start-button"
                >
                  Start from Song #{startSongNumber}
                </button>
              </div>
            </div>

            <div className="option-card">
              <h3>🔍 Search for a Song</h3>
              <p>Find and start from a specific song by name or artist</p>
              <div className="input-group">
                <input
                  type="text"
                  value={songSearchTerm}
                  onChange={(e) => setSongSearchTerm(e.target.value)}
                  className="song-search-input"
                  placeholder="Search by song name or artist..."
                  onKeyPress={(e) => e.key === 'Enter' && handleStartFromSearch()}
                />
                <button 
                  onClick={handleStartFromSearch}
                  className="start-button"
                  disabled={!songSearchTerm.trim()}
                >
                  Search & Start
                </button>
              </div>
            </div>

            <div className="option-card">
              <h3>🚀 Start from Beginning</h3>
              <p>Begin organizing from the first song in the playlist</p>
              <button 
                onClick={() => {
                  setCurrentTrackIndex(0);
                  setShowSongSelector(false);
                }}
                className="start-button"
              >
                Start from Song #1
              </button>
            </div>
          </div>

          <div className="playlist-preview">
            <h3>Playlist Preview ({sourceTracks.length} songs)</h3>
            <div className="preview-list">
              {sourceTracks.slice(0, 10).map((item, index) => (
                <div key={index} className="preview-item">
                  <span className="song-number">{index + 1}.</span>
                  <span className="song-name">{item.track?.name || 'Unknown Track'}</span>
                  <span className="artist-name">by {item.track?.artists?.map(a => a.name).join(', ') || 'Unknown Artist'}</span>
                </div>
              ))}
              {sourceTracks.length > 10 && (
                <div className="preview-more">
                  ... and {sourceTracks.length - 10} more songs
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentTrack = sourceTracks[currentTrackIndex];
  const progress = {
    current: currentTrackIndex + 1,
    total: sourceTracks.length,
    processed: processedSongs
  };
  
  const targetPlaylists = allPlaylists.filter(p => p.id !== sourcePlaylist.id);
  const isLastTrack = currentTrackIndex >= sourceTracks.length - 1;

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>🎵 Playlist Organizer</h1>
          <p>Organizing: <strong>{sourcePlaylist.name}</strong></p>
        </div>
        <button className="logout-button" onClick={onLogout}>Logout</button>
      </div>

      <button className="back-button" onClick={handleBackToPlaylistSelection}>
        ← Back to Playlist Selection
      </button>

      {currentTrack ? (
        <>
          <SongDisplay 
            track={currentTrack} 
            progress={progress}
            sourcePlaylistName={sourcePlaylist.name}
          />
          
          <PlaylistSelector
            playlists={targetPlaylists}
            selectedPlaylists={selectedPlaylists}
            onPlaylistToggle={handlePlaylistToggle}
          />
          
          <Controls
            onSubmit={handleSubmit}
            onSkip={handleSkip}
            canSubmit={selectedPlaylists.length > 0}
            isLastTrack={isLastTrack}
            selectedCount={selectedPlaylists.length}
          />
        </>
      ) : (
        <div style={{ textAlign: 'center', fontSize: '18px' }}>
          No valid tracks found in this playlist.
        </div>
      )}
    </div>
  );
};

export default PlaylistManager;
