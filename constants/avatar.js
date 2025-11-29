// constants/avatars.js - CONSTANTS AND DEFAULT VALUES

export const defaultAvatars = {
  // Generate a default avatar based on user ID
  getDefault(userId) {
    // Array of pleasant colors for default avatars
    const colors = ['#42b883', '#35495e', '#ff6b6b', '#4ecdc4', '#45b7d1'];
    
    // Select a color based on user ID (consistent for same user)
    const color = colors[userId % colors.length];
    
    // Return an SVG avatar with the selected color
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="${color}"/></svg>`;
  }
};

// User roles constants
export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  AUTHOR: 'author',
  READER: 'reader'
};

// Article status constants
export const ARTICLE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  FEATURED: 'featured'
};