"use client";
import React from 'react';

export const ResultModal = ({ isOpen, onClose, result, error }) => {
  // Automatically close modal on pressing Escape key
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        {error ? (
          <div className="modal-content modal-content--error">
            <div className="modal-icon modal-icon--error">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h2>Analysis Failed</h2>
            <p className="modal-error-message">{error}</p>
          </div>
        ) : result ? (
          <div className="modal-content modal-content--success">
            <div className="modal-icon modal-icon--success">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2>Pipeline Analyzed</h2>
            <p className="modal-success-subtitle">Successfully processed and parsed your workflow graph.</p>
            
            <div className="modal-metrics">
              <div className="metric-card">
                <span className="metric-label">Nodes</span>
                <span className="metric-value">{result.num_nodes}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Edges</span>
                <span className="metric-value">{result.num_edges}</span>
              </div>
              <div className="metric-card highlight-dag">
                <span className="metric-label">DAG Status</span>
                <span className={`metric-value ${result.is_dag ? 'dag-yes' : 'dag-no'}`}>
                  {result.is_dag ? 'Valid DAG' : 'Cyclic Graph'}
                </span>
                <span className="metric-helper">
                  {result.is_dag 
                    ? 'No circular dependencies detected.' 
                    : 'Loops exist within node connections.'}
                </span>
              </div>
            </div>
          </div>
        ) : null}
        <div className="modal-footer">
          <button className="primary-button modal-action-btn" onClick={onClose}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
