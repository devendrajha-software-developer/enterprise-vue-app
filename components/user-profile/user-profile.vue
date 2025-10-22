<!-- 
  UserProfile.vue - TEMPLATE ONLY
  Displays user information with avatar, stats, and actions
  Supports both compact and detailed views
-->
<template>
  <!-- 
    Root container with conditional class based on 'compact' prop
    :class binding dynamically applies CSS classes
  -->
  <div class="user-profile" :class="{'user-profile--compact': compact}">
    
    <!-- Avatar section with image and online status indicator -->
    <div class="user-profile__avatar">
      <!-- 
        User avatar image with error handling
        :src dynamically binds to computedAvatarUrl
        @error handles image loading failures
      -->
      <img 
        :src="computedAvatarUrl" 
        :alt="`${displayName} avatar`"
        @error="handleImageError"
      >
      
      <!-- 
        Online status indicator - conditionally rendered
        Only shows if showOnlineStatus is true
        :is-online passes the online status to child component
      -->
      <online-indicator 
        v-if="showOnlineStatus" 
        :is-online="isOnline" 
      />
    </div>
    
    <!-- Main user information section -->
    <div class="user-profile__info">
      <!-- User's display name -->
      <h4 class="user-profile__name">{{ displayName }}</h4>
      
      <!-- User's role -->
      <p class="user-profile__role">{{ role }}</p>
      
      <!-- User biography - conditionally rendered -->
      <p v-if="bio" class="user-profile__bio">{{ bio }}</p>
      
      <!-- Statistics section - conditionally rendered -->
      <div v-if="stats && stats.length > 0" class="user-profile__stats">
        <!-- 
          Loop through stats array and render each stat item
          v-for directive creates multiple elements from array
          :key provides unique identifier for Vue's virtual DOM
        -->
        <stat-item 
          v-for="stat in stats" 
          :key="stat.label"
          :value="stat.value"
          :label="stat.label"
        />
      </div>
    </div>
    
    <!-- Actions section - hidden in compact mode -->
    <div v-if="!compact" class="user-profile__actions">
      <!-- 
        Slot for custom actions - parent can inject content here
        Default content shown if no slot content provided
      -->
      <slot name="actions">
        <!-- Default follow button -->
        <button class="btn btn--outline" @click="$emit('follow-user', userId)">
          Follow
        </button>
      </slot>
    </div>
  </div>
</template>

<!-- Import JavaScript business logic -->
<script src="./user-profile.js"></script>

<!-- Import scoped Sass styles -->
<style src="./user-profile.sass" lang="sass" scoped></style>