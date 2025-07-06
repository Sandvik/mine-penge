// Utility function to calculate reading time
export const calculateReadingTime = (text) => {
  if (!text) return 1;
  
  // Average reading speed: 200-250 words per minute
  // Using 225 words per minute as a reasonable average
  const wordsPerMinute = 225;
  
  // Count words (split by whitespace and filter out empty strings)
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Calculate reading time in minutes
  const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
  
  // Return at least 1 minute
  return Math.max(1, readingTimeMinutes);
};

// Format reading time for display
export const formatReadingTime = (minutes) => {
  if (minutes === 1) {
    return '1 min læsning';
  } else {
    return `${minutes} min læsning`;
  }
};

// Calculate reading time for an article
export const getArticleReadingTime = (article) => {
  if (!article) return 1;
  
  // Brug content hvis det findes, ellers summary + title
  const content = article.content || '';
  if (content && content.length > 50) {
    return calculateReadingTime(content);
  }
  const title = article.title || '';
  const summary = article.summary || '';
  const combinedText = `${title} ${summary}`;
  return calculateReadingTime(combinedText);
}; 