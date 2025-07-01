import React from 'react';

const Controls = ({ onSubmit, onSkip, canSubmit, isLastTrack, selectedCount }) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      gap: '20px', 
      padding: '20px',
      background: '#f8f9fa',
      borderRadius: '10px',
      margin: '20px 0'
    }}>
      <button 
        onClick={onSkip}
        style={{
          padding: '15px 30px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          fontSize: '16px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
      >
        ⏭️ Skip Song
      </button>
      
      <button 
        onClick={onSubmit}
        disabled={!canSubmit}
        style={{
          padding: '15px 30px',
          backgroundColor: canSubmit ? '#1db954' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          fontSize: '16px',
          cursor: canSubmit ? 'pointer' : 'not-allowed',
          fontWeight: 'bold'
        }}
        onMouseOver={(e) => {
          if (canSubmit) e.target.style.backgroundColor = '#1ed760';
        }}
        onMouseOut={(e) => {
          if (canSubmit) e.target.style.backgroundColor = '#1db954';
        }}
      >
        ➕ Add to {selectedCount || 0} Playlist{(selectedCount !== 1) ? 's' : ''}
      </button>

      {isLastTrack && (
        <div style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px',
          background: '#ff9800',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '15px',
          fontSize: '12px'
        }}>
          Last Song!
        </div>
      )}
    </div>
  );
};

export default Controls;