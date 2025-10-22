// UserProfile.js - BUSINESS LOGIC
// Handles user data, avatar management, and component behavior

// Import constants for default avatars
import { defaultAvatars } from '../../constants/avatar'

export default {
  // Component name for debugging and Vue DevTools
  name: 'UserProfile',
  
  // ===== PROPS DEFINITION =====
  // Define the component's public interface
  props: {
    // Unique user identifier - required
    userId: {
      type: [String, Number],
      required: true,
      validator: (value) => value != null && value !== ''
    },
    
    // User's display name - required
    displayName: {
      type: String,
      required: true,
      validator: (name) => name && name.length <= 50
    },
    
    // Avatar image URL - optional with fallback
    avatarUrl: {
      type: String,
      default: null,
      validator: (url) => {
        if (!url) return true // null/empty is valid (uses default)
        return url.startsWith('http') || url.startsWith('/') || url.startsWith('data:')
      }
    },
    
    // User's role or position
    role: {
      type: String,
      default: 'Member',
      validator: (role) => role.length <= 30
    },
    
    // User biography - optional
    bio: {
      type: String,
      default: '',
      validator: (bio) => bio.length <= 200
    },
    
    // Online status indicator
    isOnline: {
      type: Boolean,
      default: false
    },
    
    // Whether to show online status dot
    showOnlineStatus: {
      type: Boolean,
      default: true
    },
    
    // Compact mode for smaller display
    compact: {
      type: Boolean,
      default: false
    },
    
    // Array of statistics to display
    stats: {
      type: Array,
      default: () => [], // Default empty array
      validator: (stats) => {
        // Validate each stat object has required properties
        return stats.every(stat => 
          stat && 
          typeof stat.label === 'string' && 
          typeof stat.value !== 'undefined'
        )
      }
    }
  },
  
  // ===== COMPONENT STATE =====
  // Local reactive data for this component
  data() {
    return {
      imageLoaded: true, // Track if custom avatar loaded successfully
      isFollowing: false // Local follow state
    }
  },
  
  // ===== COMPUTED PROPERTIES =====
  // Reactive values derived from props or data
  computed: {
    // Determine which avatar URL to use
    computedAvatarUrl() {
      // Use custom avatar if provided and loaded successfully, otherwise use default
      return this.imageLoaded && this.avatarUrl 
        ? this.avatarUrl 
        : defaultAvatars.getDefault(this.userId)
    },
    
    // Format role with proper capitalization
    formattedRole() {
      return this.role.charAt(0).toUpperCase() + this.role.slice(1).toLowerCase()
    }
  },
  
  // ===== METHODS =====
  // Functions called from template or other methods
  methods: {
    // Handle avatar image loading errors
    handleImageError() {
      console.warn(`Avatar failed to load for user ${this.userId}, using default`)
      this.imageLoaded = false
    },
    
    // Handle follow action
    handleFollow() {
      this.isFollowing = !this.isFollowing
      // Emit event to parent with follow state and user ID
      this.$emit('follow-user', {
        userId: this.userId,
        isFollowing: this.isFollowing
      })
    },
    
    // Get initials for fallback avatar text
    getUserInitials() {
      return this.displayName
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
  },
  
  // ===== LIFECYCLE HOOKS =====
  // Vue component lifecycle methods
  created() {
    console.log(`UserProfile component created for user: ${this.displayName}`)
  },
  
  mounted() {
    // Component has been added to DOM
    console.log(`UserProfile mounted for user: ${this.displayName}`)
  },

 // ADD THIS RENDER FUNCTION:
  render() {
    const children = [
      // Avatar
      this.$createElement('div', { class: 'user-profile__avatar' }, [
        this.$createElement('img', {
          attrs: {
            src: this.computedAvatarUrl,
            alt: `${this.displayName} avatar`
          },
          on: {
            error: this.handleImageError
          }
        }),
        this.showOnlineStatus && this.$createElement('div', {
          class: [
            'online-indicator',
            { 'online-indicator--online': this.isOnline }
          ]
        })
      ]),
      
      // Info
      this.$createElement('div', { class: 'user-profile__info' }, [
        this.$createElement('h4', { class: 'user-profile__name' }, this.displayName),
        this.$createElement('p', { class: 'user-profile__role' }, this.role),
        this.bio && !this.compact && this.$createElement('p', { class: 'user-profile__bio' }, this.bio),
        
        // Stats
        this.stats && this.stats.length > 0 && !this.compact && this.$createElement('div', { class: 'user-profile__stats' }, 
          this.stats.map(stat => 
            this.$createElement('div', { class: 'stat-item' }, [
              this.$createElement('div', { class: 'stat-item__value' }, stat.value),
              this.$createElement('div', { class: 'stat-item__label' }, stat.label)
            ])
          )
        )
      ])
    ]

    // Actions (only if not compact)
    if (!this.compact) {
      children.push(
        this.$createElement('div', { class: 'user-profile__actions' }, [
          this.$createElement('button', {
            class: 'btn btn--outline',
            on: {
              click: this.handleFollow
            }
          }, this.isFollowing ? 'Unfollow' : 'Follow')
        ])
      )
    }

    return this.$createElement('div', { class: this.profileClasses }, children)
  }
}