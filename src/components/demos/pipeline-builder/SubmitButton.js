"use client";
// SubmitButton.js

import { useState } from 'react';
import { useStore } from './store';
import { ResultModal } from './ResultModal';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const parsePipeline = async ({ nodes, edges }) => {
    const response = await fetch(`${API_BASE_URL}/pipelines/parse`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes, edges }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Unable to analyze pipeline.');
    }

    return response.json();
};

export const SubmitButton = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [analysisError, setAnalysisError] = useState(null);

    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const isCanvasEmpty = nodes.length === 0;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setAnalysisError(null);
        setAnalysisResult(null);

        try {
            const result = await parsePipeline({ nodes, edges });
            setAnalysisResult(result);
            setModalOpen(true);
        } catch (error) {
            setAnalysisError('Pipeline analysis failed. Please make sure the backend is running and try again.');
            setModalOpen(true);
            console.error('Pipeline analysis failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="submit-bar">
            <button
                type="button"
                className="primary-button"
                onClick={handleSubmit}
                disabled={isSubmitting || isCanvasEmpty}
                title={isCanvasEmpty ? 'Add nodes to the canvas first' : 'Analyze pipeline'}
            >
                {isSubmitting ? 'Analyzing...' : 'Submit Pipeline'}
            </button>

            <ResultModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                result={analysisResult}
                error={analysisError}
            />
        </div>
    );
}

