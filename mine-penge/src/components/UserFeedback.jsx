import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';

function UserFeedback({ articleId, onFeedback }) {
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showComment, setShowComment] = useState(false);

  const handleRating = (value) => {
    setRating(value);
    if (value === 'positive') {
      setShowComment(false);
    } else {
      setShowComment(true);
    }
  };

  const handleSubmit = async () => {
    if (!rating) return;

    const feedback = {
      articleId,
      rating,
      comment: comment.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      // Send feedback to backend
      const response = await fetch('http://localhost:8000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback)
      });

      if (response.ok) {
        setSubmitted(true);
        onFeedback && onFeedback(feedback);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  if (submitted) {
    return (
      <div className="bg-success-50 border border-success-200 rounded-lg p-4 text-center">
        <p className="text-success-800 text-sm">
          Tak for din feedback! Det hjælper os med at forbedre indholdet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-nordic-50 border border-nordic-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-nordic-700">
          Fandt du denne artikel nyttig?
        </h4>
        <MessageCircle className="h-4 w-4 text-nordic-400" />
      </div>
      
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={() => handleRating('positive')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            rating === 'positive'
              ? 'bg-success-100 text-success-800 border border-success-300'
              : 'bg-white text-nordic-600 border border-nordic-300 hover:bg-success-50'
          }`}
        >
          <ThumbsUp className="h-4 w-4" />
          <span className="text-sm font-medium">Ja</span>
        </button>
        
        <button
          onClick={() => handleRating('negative')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            rating === 'negative'
              ? 'bg-error-100 text-error-800 border border-error-300'
              : 'bg-white text-nordic-600 border border-nordic-300 hover:bg-error-50'
          }`}
        >
          <ThumbsDown className="h-4 w-4" />
          <span className="text-sm font-medium">Nej</span>
        </button>
      </div>
      
      {showComment && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-nordic-700 mb-2">
            Hvad kunne være bedre? (valgfrit)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Del dine tanker om artiklen..."
            rows={3}
            className="w-full px-3 py-2 border border-nordic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          />
        </div>
      )}
      
      {rating && (
        <button
          onClick={handleSubmit}
          className="w-full bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
        >
          Send feedback
        </button>
      )}
    </div>
  );
}

export default UserFeedback; 