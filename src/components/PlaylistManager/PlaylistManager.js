import React, { useState, useEffect } from 'react';
import SpotifyAPI from '../../services/spotifyApi';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
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

const PlaylistManager = ({ token, onLogout }) => {
  const [spotifyApi] = useState(() => new SpotifyAPI(token));
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userData, userPlaylists] = await Promise.all([
          spotifyApi.getCurrentUser(),
          spotifyApi.getUserPlaylists()
        ]);
        
        setUser(userData);
        setPlaylists(userPlaylists);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [spotifyApi]);

  if (loading) {
    return <Container>Loading your Spotify data...</Container>;
  }

  return (
    <Container>
      <Header>
        <div>
          <h1>🎵 Playlist Organizer</h1>
          {user && <p>Welcome, {user.display_name}!</p>}
        </div>
        <LogoutButton onClick={onLogout}>Logout</LogoutButton>
      </Header>

      <div>
        <h2>Your Playlists ({playlists.length})</h2>
        {playlists.map(playlist => (
          <div key={playlist.id} style={{ 
            padding: '10px', 
            margin: '10px 0', 
            border: '1px solid #ddd', 
            borderRadius: '5px' 
          }}>
            <strong>{playlist.name}</strong> - {playlist.tracks.total} tracks
          </div>
        ))}
      </div>
    </Container>
  );
};

export default PlaylistManager;