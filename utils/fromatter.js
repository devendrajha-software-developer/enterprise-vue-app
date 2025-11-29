// utils/formatters.js - UTILITY FUNCTIONS FOR DATA FORMATTING

// Date formatting utility object
export const dateFormatter = {
  // Format a date consistently throughout the application
  format(date) {
    // Use Intl.DateTimeFormat for locale-aware date formatting
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',    // 2024
      month: 'short',     // Jan
      day: 'numeric'      // 15
    }).format(new Date(date)); // Ensure we have a valid Date object
  }
};

// Number formatting utility
export const numberFormatter = {
  format(number) {
    return new Intl.NumberFormat('en-US').format(number);
  }
};

// Text formatting utility
export const textFormatter = {
  truncate(text, maxLength = 100) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
};