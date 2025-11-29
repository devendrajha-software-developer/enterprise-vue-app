<!-- 
  ArticleCard.vue - TEMPLATE ONLY FILE
  This file contains ONLY the HTML template structure
  It imports JavaScript logic and styles from separate files
-->

<template>
  <!-- 
    Root element with dynamic classes:
    - 'article-card' is always applied
    - 'article-card--featured' is applied conditionally when isFeatured is true
  -->
  <article class="article-card" :class="{'article-card--featured': isFeatured}">
    
    <!-- Header section with title and status badge -->
    <div class="article-card__header">
      <h3 class="article-card__title">{{ title }}</h3>
      
      <!-- 
        Conditional rendering: only show badge if status exists
        badge-component is a hypothetical child component
        :type and :label are props passed to the badge component
      -->
      <badge-component 
        v-if="status"
        :type="status"
        :label="status"
      />
    </div>
    
    <!-- Article excerpt text -->
    <p class="article-card__excerpt">{{ excerpt }}</p>
    
    <!-- Meta information section -->
    <div class="article-card__meta">
      <span class="article-card__author">By {{ authorName }}</span>
      <span class="article-card__date">{{ formattedDate }}</span>
      <span class="article-card__views">{{ viewCount }} views</span>
    </div>
    
    <!-- Action buttons -->
    <div class="article-card__actions">
      <!-- 
        Like button with dynamic properties:
        :disabled="isLiking" - disables button during like operation
        @click="handleLike" - calls handleLike method when clicked
      -->
      <button 
        class="btn btn--primary"
        @click="handleLike"
        :disabled="isLiking"
      >
        {{ likeCount }} 👍  <!-- Display like count with emoji -->
      </button>
      
      <!-- 
        Share button that emits custom event to parent
        @click="$emit('share-article', id)" - emits event with article ID
      -->
      <button 
        class="btn btn--secondary"
        @click="$emit('share-article', id)"
      >
        Share
      </button>
    </div>
  </article>
</template>

<!-- Import JavaScript business logic from separate file -->
<script src="./article-card.js"></script>

<!-- 
  Import scoped Sass styles
  scoped attribute means these styles only apply to this component
  lang="sass" enables Sass preprocessing
-->
<style src="./article-card.sass" lang="sass" scoped></style>