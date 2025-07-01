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
    } catch (error) {
      console.error('Error loading playlist tracks:', error);
      alert('Error loading playlist tracks. Please try again.');
    }
    setLoading(false);
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
                <h3 style={{ margin: '0 0 10px 0'}}>{playlist.name}</h3>
                <p style={{ margin: '0', color: '#666' }}>
                  {playlist.tracks.total} tracks
                </p>
                {playlist.description && (
                  <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#888' }}>
                    {playlist.description}
                  </p>
                )}
              </div>
            ))}
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
