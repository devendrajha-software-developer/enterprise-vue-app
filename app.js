// app.js - MAIN APPLICATION COMPONENT
// console.log('Importing components...')

import ArticleCard from "./components/article-card/article-card.vue"
import UserProfile from "./components/user-profile/user-profile.vue"
import DataTable from "./components/data-table/data-table.vue"
// import { defaultAvatars } from "./constants/avatar.js"
// import { dateFormatter } from "./utils/formatters.js"
// import { analyticsService } from "./services/analytics.js"

// console.log('ArticleCard:', ArticleCard)
// console.log('UserProfile:', UserProfile)
// console.log('DataTable:', DataTable)


// console.log('ArticleCard template:', ArticleCard.template)
// console.log('ArticleCard render:', ArticleCard.render)

// Main application configuration object
export default {
  name: 'App',
  
  // data() function returns the reactive state for the application
  data() {
    return {
      // Current logged-in user data
      currentUser: {
        id: 12345,
        name: "Devendra Jha",
        avatar: "https://plus.unsplash.com/premium_photo-1677094310956-7f88ae5f5c6b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=880",
        role: "FullStack developer",
        bio: "I have been working in XYZ company with 1.9+ years of experience building scalable web applications.",
        isOnline: true,
      },

      // Array of statistics to display in user profile
      userStats: [
        { label: "Articles", value: 42 },
        { label: "Followers", value: 1284 },
        { label: "Following", value: 89 },
      ],

      // Featured articles array - displayed in sidebar
      featuredArticles: [
        {
          id: 1,
          title: "Advanced Vue 3 Composition API Patterns",
          excerpt: "Explore enterprise-level patterns for building scalable Vue applications with Composition API.",
          authorName: "Devendra Jha",
          publishDate: new Date("202-04-15"),
          viewCount: 2847,
          likeCount: 156,
          status: "featured",
        },
      ],

      // Recent articles array - displayed in main content area
      recentArticles: [
        {
          id: 2,
          title: "Vue 3 State Management Best Practices",
          excerpt: "Learn how to manage complex state in large-scale Vue applications with Pinia.",
          authorName: "Mike Rodriguez",
          publishDate: new Date("2025-8-10"),
          viewCount: 1423,
          likeCount: 89,
          status: "published",
        },
        {
          id: 3,
          title: "Building Micro-Frontends with Vue",
          excerpt: "A comprehensive guide to implementing micro-frontend architecture using Vue.js.",
          authorName: "Emma Davis",
          publishDate: new Date("2025-10-08"),
          viewCount: 956,
          likeCount: 67,
          status: "published",
        },
      ],

      // DataTable data
      tableData: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', status: 'Inactive' },
        { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Editor', status: 'Active' },
        { id: 5, name: 'Tom Brown', email: 'tom@example.com', role: 'User', status: 'Pending' }
      ],

      tableColumns: [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'role', label: 'Role', sortable: true },
        { key: 'status', label: 'Status', sortable: true }
      ],
      
      dynamicTitle: 'Dynamically Bound Title',
      initialCounter: 5,
      sampleText: '   Vue.js is AWESOME!   '
    }
  },

  // components option registers child components that this app can use
  components: {
    ArticleCard,
    UserProfile,
    DataTable
  },

  // methods option contains functions that can be called from template or other methods
  methods: {
    // Handles when user likes an article
    handleArticleLiked({ articleId, newLikeCount }) {
      console.log(`Article ${articleId} liked! New count: ${newLikeCount}`)

      // Update the local state to reflect the new like count
      const article = this.findArticleById(articleId)
      if (article) {
        article.likeCount = newLikeCount
      }
    },

    // Handles when user shares an article
    handleShareArticle(articleId) {
      console.log(`Sharing article ${articleId}`)
    },

    // Helper method to find article by ID across both arrays
    findArticleById(id) {
      return [...this.featuredArticles, ...this.recentArticles].find(
        (article) => article.id === id
      )
    },

    // User Profile methods
    handleFollow(userData) {
      console.log('Follow action:', userData)
      if (userData.isFollowing) {
        console.log(`Now following user ${userData.userId}`)
      } else {
        console.log(`Unfollowed user ${userData.userId}`)
      }
    },
    
    // DataTable methods
    handleSelection(selectionData) {
      console.log('Selection changed:', selectionData)
    },
    
    handleSort(sortData) {
      console.log('Sort changed:', sortData)
    },
    
    handleRowClick(row, event) {
      console.log('Row clicked:', row)
    },

    // Additional utility methods
    editUser(user) {
      console.log('Edit user:', user)
    },

    deleteUser(user) {
      console.log('Delete user:', user)
    },

    addUser() {
      console.log('Add new user')
    }
  }
}