import React from 'react';
import './Controls.css';

const Controls = ({ onSubmit, onSkip, canSubmit, isLastTrack, selectedCount }) => {
  return (
    <div className="controls-container">
      <button 
        onClick={onSkip}
        className="controls-button controls-skip"
      >
        ⏭️ Skip Song
      </button>
      
      <button 
        onClick={onSubmit}
        disabled={!canSubmit}
        className={`controls-button ${canSubmit ? 'controls-submit' : 'controls-submit-disabled'}`}
      >
        ➕ Add to {selectedCount || 0} Playlist{(selectedCount !== 1) ? 's' : ''}
      </button>

      {isLastTrack && (
        <div className="last-song-badge">
          Last Song!
        </div>
      )}
    </div>
  );
};

export default Controls;