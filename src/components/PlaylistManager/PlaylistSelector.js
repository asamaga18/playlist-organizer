// src/components/PlaylistSelector.js
import React, { useState } from 'react';
import './PlaylistSelector.css';

const PlaylistSelector = ({ playlists, selectedPlaylists, onPlaylistToggle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'tracks', 'recent'
  const [imageErrors, setImageErrors] = useState(new Set());

  // Filter playlists based on search term
  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (playlist.description && playlist.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort playlists based on selected criteria
  const sortedPlaylists = [...filteredPlaylists].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'tracks':
        return (b.tracks?.total || 0) - (a.tracks?.total || 0);
      case 'recent':
        // Assuming more recently modified playlists come first from API
        return 0;
      default:
        return 0;
    }
  });

  const handleSelectAll = () => {
    const allFilteredIds = sortedPlaylists.map(p => p.id);
    const allSelected = allFilteredIds.every(id => selectedPlaylists.includes(id));
    
    if (allSelected) {
      // Deselect all filtered playlists
      allFilteredIds.forEach(id => {
        if (selectedPlaylists.includes(id)) {
          onPlaylistToggle(id);
        }
      });
    } else {
      // Select all filtered playlists that aren't already selected
      allFilteredIds.forEach(id => {
        if (!selectedPlaylists.includes(id)) {
          onPlaylistToggle(id);
        }
      });
    }
  };

  const handleClearAll = () => {
    selectedPlaylists.forEach(id => onPlaylistToggle(id));
  };

  const handleImageError = (playlistId) => {
    setImageErrors(prev => new Set(prev).add(playlistId));
  };

  const allFilteredSelected = sortedPlaylists.length > 0 && 
    sortedPlaylists.every(p => selectedPlaylists.includes(p.id));

  return (
    <div className="playlist-selector">
      <div className="playlist-selector-header">
        <h3>Select playlists to add this song to:</h3>
        
        {selectedPlaylists.length > 0 && (
          <div className="selection-summary">
            <span className="selection-count">
              {selectedPlaylists.length} playlist{selectedPlaylists.length !== 1 ? 's' : ''} selected
            </span>
            <button onClick={handleClearAll} className="clear-all-btn">
              Clear All
            </button>
          </div>
        )}
      </div>

      <div className="playlist-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search playlists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="sort-container">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="tracks">Sort by Track Count</option>
            <option value="recent">Recent First</option>
          </select>
        </div>

        <button 
          onClick={handleSelectAll}
          className="select-all-btn"
          disabled={sortedPlaylists.length === 0}
        >
          {allFilteredSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="playlist-grid">
        {sortedPlaylists.length === 0 ? (
          <div className="no-playlists">
            {searchTerm ? 'No playlists match your search.' : 'No playlists available.'}
          </div>
        ) : (
          sortedPlaylists.map(playlist => {
            const isSelected = selectedPlaylists.includes(playlist.id);
            const hasImage = playlist.images?.[0] && !imageErrors.has(playlist.id);
            
            return (
              <div 
                key={playlist.id}
                className={`playlist-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onPlaylistToggle(playlist.id)}
              >
                <div className="playlist-card-header">
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onPlaylistToggle(playlist.id)}
                      className="playlist-checkbox"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  
                  {hasImage ? (
                    <img 
                      src={playlist.images[0].url} 
                      alt={playlist.name}
                      className="playlist-image"
                      onError={() => handleImageError(playlist.id)}
                      onLoad={() => console.log(`Playlist image loaded for: ${playlist.name}`)}
                    />
                  ) : (
                    <div className="playlist-image-placeholder">
                      🎵
                    </div>
                  )}
                  
                  <div className="playlist-info">
                    <h4 className="playlist-name">{playlist.name}</h4>
                    <p className="playlist-stats">
                      {playlist.tracks?.total || 0} tracks
                      {playlist.public !== undefined && (
                        <span className="playlist-visibility">
                          • {playlist.public ? 'Public' : 'Private'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {playlist.description && (
                  <p className="playlist-description">
                    {playlist.description.length > 100 
                      ? `${playlist.description.substring(0, 100)}...`
                      : playlist.description
                    }
                  </p>
                )}

                <div className="playlist-card-footer">
                  <span className="owner-info">
                    by {playlist.owner?.display_name || 'Unknown'}
                  </span>
                  {isSelected && (
                    <span className="selected-indicator">✓</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedPlaylists.length > 0 && (
        <div className="selection-footer">
          <div className="selected-playlists">
            <strong>Selected playlists:</strong>
            <div className="selected-playlist-tags">
              {selectedPlaylists.map(id => {
                const playlist = playlists.find(p => p.id === id);
                return playlist ? (
                  <span key={id} className="playlist-tag">
                    {playlist.name}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlaylistToggle(id);
                      }}
                      className="remove-tag"
                    >
                      ×
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistSelector;