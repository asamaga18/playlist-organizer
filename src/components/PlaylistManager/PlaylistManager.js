import React, { useState, useEffect } from 'react';
import SpotifyAPI from '../../services/spotifyApi';
import SongDisplay from './SongDisplay';
import PlaylistSelector from './PlaylistSelector';
import Controls from './Controls';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #eee;
`;

const LogoutButton = styled.button`
  background: #ff4757;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background: #ff3838;
  }
`;

const SourcePlaylistSection = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
`;

const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
  margin-top: 15px;
`;

const PlaylistCard = styled.div`
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #1db954;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const BackButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  
  &:hover {
    background: #5a6268;
  }
`;

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
          // Token expired
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
      console.log('Loading tracks for playlist:', playlist.name);
      const tracks = await spotifyApi.getPlaylistTracks(playlist.id);
      const validTracks = tracks.filter(item => item.track && item.track.id); // Filter out null/invalid tracks
      
      setSourcePlaylist(playlist);
      setSourceTracks(validTracks);
      setCurrentTrackIndex(0);
      setSelectedPlaylists([]);
      setProcessedSongs(0);
      
      console.log(`Loaded ${validTracks.length} valid tracks`);
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
      console.log(`Adding "${currentTrack.track.name}" to ${selectedPlaylists.length} playlists`);
      
      await Promise.all(
        selectedPlaylists.map(playlistId =>
          spotifyApi.addTrackToPlaylist(playlistId, currentTrack.track.uri)
        )
      );

      console.log('Song added successfully!');
      
      // Move to next track
      setProcessedSongs(prev => prev + 1);
      
      if (currentTrackIndex < sourceTracks.length - 1) {
        setCurrentTrackIndex(prev => prev + 1);
        setSelectedPlaylists([]); // Reset selections for next song
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
      <Container>
        <div style={{ textAlign: 'center', fontSize: '18px', marginTop: '50px' }}>
          Loading...
        </div>
      </Container>
    );
  }

  // Show playlist selection screen
  if (!sourcePlaylist) {
    return (
      <Container>
        <Header>
          <div>
            <h1>🎵 Playlist Organizer</h1>
            {user && <p>Welcome, {user.display_name}!</p>}
          </div>
          <LogoutButton onClick={onLogout}>Logout</LogoutButton>
        </Header>

        <SourcePlaylistSection>
          <h2>Select Source Playlist</h2>
          <p>Choose the playlist you want to organize. You'll go through each song and decide which other playlists to add it to.</p>
          
          <PlaylistGrid>
            {allPlaylists.map(playlist => (
              <PlaylistCard key={playlist.id} onClick={() => handleSourcePlaylistSelect(playlist)}>
                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{playlist.name}</h3>
                <p style={{ margin: '0', color: '#666' }}>
                  {playlist.tracks.total} tracks
                </p>
                {playlist.description && (
                  <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#888' }}>
                    {playlist.description}
                  </p>
                )}
              </PlaylistCard>
            ))}
          </PlaylistGrid>
        </SourcePlaylistSection>
      </Container>
    );
  }

  // Show song management screen
  const currentTrack = sourceTracks[currentTrackIndex];
  const progress = {
    current: currentTrackIndex + 1,
    total: sourceTracks.length,
    processed: processedSongs
  };
  
  const targetPlaylists = allPlaylists.filter(p => p.id !== sourcePlaylist.id);
  const isLastTrack = currentTrackIndex >= sourceTracks.length - 1;

  return (
    <Container>
      <Header>
        <div>
          <h1>🎵 Playlist Organizer</h1>
          <p>Organizing: <strong>{sourcePlaylist.name}</strong></p>
        </div>
        <LogoutButton onClick={onLogout}>Logout</LogoutButton>
      </Header>

      <BackButton onClick={handleBackToPlaylistSelection}>
        ← Back to Playlist Selection
      </BackButton>

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
    </Container>
  );
};

export default PlaylistManager;