// ArticleCard.js - BUSINESS LOGIC ONLY
// This file contains all JavaScript logic for the ArticleCard component

// Import utility functions from other files
import { dateFormatter } from '../../utils/fromatter.js'
import { analyticsService } from '../../services/analytics.js'

// Component definition object
export default {
  // Component name for debugging and dev tools
  name: 'ArticleCard',
  
  // ===== PROPS DEFINITION =====
  // Props are the component's API - they define what data the component accepts
  props: {
    // Article ID - required and must be valid
    id: {
      type: [String, Number],  // Accepts both string and number
      required: true,
      validator: (value) => value != null  // Custom validation
    },
    
    // Article title with length validation
    title: {
      type: String,
      required: true,
      validator: (title) => title.length <= 100  // Max 100 characters
    },
    
    // Article excerpt with default value
    excerpt: {
      type: String,
      default: 'No excerpt available'  // Fallback if no excerpt provided
    },
    
    // Author name - required
    authorName: {
      type: String,
      required: true
    },
    
    // Publish date - accepts string or Date object
    publishDate: {
      type: [String, Date],
      required: true
    },
    
    // View count with validation
    viewCount: {
      type: Number,
      default: 0,
      validator: (count) => count >= 0  // Cannot be negative
    },
    
    // Like count
    likeCount: {
      type: Number,
      default: 0
    },
    
    // Article status with predefined allowed values
    status: {
      type: String,
      default: 'draft',
      validator: (value) => ['draft', 'published', 'archived', 'featured'].includes(value)
    },
    
    // Featured flag for styling
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  
  // ===== COMPONENT STATE =====
  // data() returns the local reactive state for this component
  data() {
    return {
      isLiking: false,           // Loading state for like operation
      localLikeCount: this.likeCount  // Local copy of like count
    }
  },
  
  // ===== COMPUTED PROPERTIES =====
  // Reactive properties that are computed from other data
  computed: {
    formattedDate() {
      // Use the imported formatter to format the date consistently
      return dateFormatter.format(this.publishDate)
    }
  },
  
  // ===== METHODS =====
  // Functions that can be called from template or other methods
  methods: {
    // Handle like button click
    async handleLike() {
      // Prevent multiple simultaneous like operations
      if (this.isLiking) return
      
      // Set loading state
      this.isLiking = true
      
      try {
        // Optimistically update UI
        this.localLikeCount++
        
        // Track analytics event (simulated API call)
        await analyticsService.trackEvent('article_liked', {
          articleId: this.id,
          likeCount: this.localLikeCount
        })
        
        // Notify parent component about the like
        this.$emit('article-liked', {
          articleId: this.id,
          newLikeCount: this.localLikeCount
        })
        
      } catch (error) {
        // Handle errors - rollback the like count
        console.error('Like action failed:', error)
        this.localLikeCount--
      } finally {
        // Always reset loading state
        this.isLiking = false
      }
    }
  },
  
  // ===== WATCHERS =====
  // React to changes in specific data properties
  watch: {
    // Update local like count when prop changes from parent
    likeCount(newValue) {
      this.localLikeCount = newValue
    }
  },
 // ADD THIS RENDER FUNCTION:
  render() {
    return this.$createElement('article', { class: this.articleClasses }, [
      // Header
      this.$createElement('div', { class: 'article-card__header' }, [
        this.$createElement('h3', { class: 'article-card__title' }, this.title),
        this.status && this.$createElement('span', { class: `badge badge--${this.status}` }, this.status)
      ]),
      
      // Excerpt
      this.$createElement('p', { class: 'article-card__excerpt' }, this.excerpt),
      
      // Meta info
      this.$createElement('div', { class: 'article-card__meta' }, [
        this.$createElement('span', { class: 'article-card__author' }, `By ${this.authorName}`),
        this.$createElement('span', { class: 'article-card__date' }, this.formattedDate),
        this.$createElement('span', { class: 'article-card__views' }, `${this.viewCount} views`)
      ]),
      
      // Actions
      this.$createElement('div', { class: 'article-card__actions' }, [
        this.$createElement('button', {
          class: 'btn btn--primary',
          on: {
            click: this.handleLike
          },
          attrs: {
            disabled: this.isLiking
          }
        }, `${this.localLikeCount} 👍`),
        this.$createElement('button', {
          class: 'btn btn--secondary',
          on: {
            click: this.handleShare
          }
        }, 'Share')
      ])
    ])
  }

}