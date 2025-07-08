import React from 'react';
import './Controls.css';

const Controls = ({ onSubmit, onSkip, canSubmit, isLastTrack, selectedCount, onBack, canGoBack }) => {
  return (
    <div className="controls-container">
      <button
        onClick={onBack}
        className={`controls-button ${canGoBack ? 'controls-skip' : 'controls-submit-disabled'}`}
        disabled={!canGoBack}
        style={{ marginRight: 8 }}
      >
        <span style={{ marginRight: 8, fontWeight: 'bold', fontSize: 18 }}>⬅️</span>
        <span style={{ fontWeight: 'bold', color: canGoBack ? '#fff' : 'var(--text-muted)' }}>
          Back
        </span>
      </button>
      <button
        onClick={onSkip}
        className="controls-button controls-skip"
      >
        <span style={{ marginRight: 8, fontWeight: 'bold', fontSize: 18 }}>⏭️</span>
        <span style={{ fontWeight: 'bold' }}>Skip Song</span>
      </button>
      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className={`controls-button ${canSubmit ? 'controls-submit' : 'controls-submit-disabled'}`}
      >
        <span style={{ marginRight: 8, color: canSubmit ? '#fff' : '#b3b3b3', fontWeight: 'bold', fontSize: 18 }}>➕</span>
        <span style={{ fontWeight: 'bold', color: canSubmit ? '#fff' : 'var(--text-muted)' }}>
          Add to {selectedCount || 0} Playlist{(selectedCount !== 1) ? 's' : ''}
        </span>
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