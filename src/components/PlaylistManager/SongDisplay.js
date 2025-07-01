import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const SongContainer = styled.div`
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  border: 1px solid #dee2e6;
  animation: ${fadeIn} 0.5s ease-out;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }
`;

const AlbumArtContainer = styled.div`
  position: relative;
  margin-right: 25px;
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 20px;
  }
`;

const AlbumArt = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const AlbumArtPlaceholder = styled.div`
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #e9ecef, #dee2e6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 14px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const PlayButton = styled.button`
  position: absolute;
  bottom: -10px;
  right: -10px;
  background: #1db954;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(29, 185, 84, 0.4);
  transition: all 0.2s;
  
  &:hover {
    background: #1ed760;
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(29, 185, 84, 0.6);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SongInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const SongTitle = styled.h2`
  margin: 0 0 8px 0;
  color: #1db954;
  font-size: 28px;
  font-weight: bold;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const ArtistName = styled.p`
  margin: 0 0 8px 0;
  color: #333;
  font-size: 18px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AlbumName = styled.p`
  margin: 0 0 16px 0;
  color: #666;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SongDetails = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

const DetailBadge = styled.span`
  background: ${props => props.variant === 'explicit' ? '#ff4757' : 
                      props.variant === 'popular' ? '#ffa502' : 
                      '#e9ecef'};
  color: ${props => props.variant === 'explicit' || props.variant === 'popular' ? 'white' : '#495057'};
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ProgressSection = styled.div`
  text-align: right;
  min-width: 220px;
  padding-left: 20px;

  @media (max-width: 768px) {
    min-width: 100%;
    padding-left: 0;
    margin-top: 20px;
    text-align: center;
  }
`;

const ProgressText = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
`;

const ProgressSubtext = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 10px;
  background: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
  margin: 10px 0;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
`;

const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #1db954, #1ed760);
  border-radius: 5px;
  transition: width 0.6s ease;
  width: ${props => props.percentage}%;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-image: linear-gradient(
      -45deg,
      rgba(255, 255, 255, .2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, .2) 50%,
      rgba(255, 255, 255, .2) 75%,
      transparent 75%,
      transparent
    );
    z-index: 1;
    background-size: 50px 50px;
    animation: move 2s linear infinite;
  }

  @keyframes move {
    0% { background-position: 0 0; }
    100% { background-position: 50px 50px; }
  }
`;

const SourcePlaylistBadge = styled.div`
  background: #1db954;
  color: white;
  padding: 8px 16px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(29, 185, 84, 0.3);
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #1db954;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SongDisplay = ({ track, progress, sourcePlaylistName }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  if (!track || !track.track) {
    return (
      <SongContainer>
        <div style={{ textAlign: 'center', width: '100%', color: '#666' }}>
          <h3>No track data available</h3>
          <p>This might be a local file or unavailable track.</p>
        </div>
      </SongContainer>
    );
  }

  const { track: songData } = track;
  
  // Calculate progress percentage
  const progressPercentage = (progress.current / progress.total) * 100;
  
  // Format duration
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  // Get the best quality album art
  const albumArt = songData.album.images && songData.album.images.length > 0 
    ? songData.album.images[0].url 
    : null;

  const handlePlayPreview = async () => {
    if (!songData.preview_url) return;
    
    setAudioLoading(true);
    try {
      // Create audio element and play preview
      const audio = new Audio(songData.preview_url);
      audio.volume = 0.3; // Lower volume for preview
      await audio.play();
      
      // Stop after 15 seconds
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 15000);
    } catch (error) {
      console.error('Error playing preview:', error);
      // Fallback to opening in new tab
      window.open(songData.preview_url, '_blank');
    } finally {
      setAudioLoading(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <div>
      <SourcePlaylistBadge>
        📂 From: {sourcePlaylistName}
      </SourcePlaylistBadge>
      
      <SongContainer>
        <AlbumArtContainer>
          {albumArt && !imageError ? (
            <>
              {imageLoading && (
                <AlbumArtPlaceholder>
                  <LoadingSpinner />
                </AlbumArtPlaceholder>
              )}
              <AlbumArt 
                src={albumArt} 
                alt={`${songData.album.name} album cover`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{ display: imageLoading ? 'none' : 'block' }}
              />
            </>
          ) : (
            <AlbumArtPlaceholder>
              🎵<br/>No Image
            </AlbumArtPlaceholder>
          )}
          
          {songData.preview_url && (
            <PlayButton 
              onClick={handlePlayPreview}
              disabled={audioLoading}
              title="Play 15-second preview"
            >
              {audioLoading ? <LoadingSpinner /> : '▶️'}
            </PlayButton>
          )}
        </AlbumArtContainer>
        
        <SongInfo>
          <SongTitle title={songData.name}>
            {songData.name}
          </SongTitle>
          
          <ArtistName title={songData.artists.map(a => a.name).join(', ')}>
            👤 {songData.artists.map(a => a.name).join(', ')}
          </ArtistName>
          
          <AlbumName title={songData.album.name}>
            💿 {songData.album.name}
          </AlbumName>
          
          <SongDetails>
            {songData.duration_ms && (
              <DetailBadge>
                ⏱️ {formatDuration(songData.duration_ms)}
              </DetailBadge>
            )}
            
            {songData.album.release_date && (
              <DetailBadge>
                📅 {new Date(songData.album.release_date).getFullYear()}
              </DetailBadge>
            )}
            
            {songData.popularity > 70 && (
              <DetailBadge variant="popular">
                🔥 {songData.popularity}% popular
              </DetailBadge>
            )}
            
            {songData.explicit && (
              <DetailBadge variant="explicit">
                🚫 Explicit
              </DetailBadge>
            )}
          </SongDetails>
        </SongInfo>
        
        <ProgressSection>
          <ProgressText>
            Song {progress.current} of {progress.total}
          </ProgressText>
          
          <ProgressSubtext>
            {progress.processed} completed
          </ProgressSubtext>
          
          <ProgressBarContainer>
            <ProgressBar percentage={progressPercentage} />
          </ProgressBarContainer>
          
          <ProgressSubtext>
            {Math.round(progressPercentage)}% complete
          </ProgressSubtext>
        </ProgressSection>
      </SongContainer>
    </div>
  );
};

export default SongDisplay;