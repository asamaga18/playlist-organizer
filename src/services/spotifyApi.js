import axios from 'axios';

class SpotifyAPI {
  constructor(token) {
    this.token = token;
    this.api = axios.create({
      baseURL: 'https://api.spotify.com/v1',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async getUserPlaylists() {
    const response = await this.api.get('/me/playlists?limit=50');
    return response.data.items;
  }

  async getPlaylistTracks(playlistId) {
    const response = await this.api.get(`/playlists/${playlistId}/tracks`);
    return response.data.items;
  }

  async addTrackToPlaylist(playlistId, trackUri) {
    await this.api.post(`/playlists/${playlistId}/tracks`, {
      uris: [trackUri]
    });
  }

  async getCurrentUser() {
    const response = await this.api.get('/me');
    return response.data;
  }
}

export default SpotifyAPI;