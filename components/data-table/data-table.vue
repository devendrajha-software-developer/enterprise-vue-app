<!-- 
  DataTable.vue - TEMPLATE ONLY
  Reusable data table with sorting, pagination, and selection
  Supports customizable columns and actions
-->
<template>
  <!-- Main table container -->
  <div class="data-table" :class="tableClasses">
    
    <!-- Table header with title and controls -->
    <div class="data-table__header" v-if="$slots.header || title || $slots.actions">
      <!-- Custom header slot or default title -->
      <slot name="header">
        <h3 class="data-table__title">{{ title }}</h3>
      </slot>
      
      <!-- Actions slot for buttons and controls -->
      <div class="data-table__actions" v-if="$slots.actions">
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- Table wrapper for responsive scrolling -->
    <div class="data-table__wrapper" :class="{'data-table__wrapper--scrollable': scrollable}">
      
      <!-- Main table element -->
      <table class="data-table__table">
        
        <!-- Table caption for accessibility -->
        <caption v-if="caption" class="data-table__caption">
          {{ caption }}
        </caption>
        
        <!-- Table header with column definitions -->
        <thead class="data-table__head">
          <tr>
            <!-- Selection checkbox column -->
            <th v-if="selectable" class="data-table__select-column">
              <input
                type="checkbox"
                :checked="allSelected"
                @change="toggleSelectAll"
                :indeterminate="isIndeterminate"
              >
            </th>
            
            <!-- Dynamic column headers -->
            <th
              v-for="column in columns"
              :key="column.key"
              :class="getHeaderClass(column)"
              @click="handleSort(column)"
            >
              <div class="data-table__header-content">
                <span>{{ column.label }}</span>
                
                <!-- Sort indicators -->
                <span v-if="sortable && column.sortable !== false" class="data-table__sort-icons">
                  <span class="data-table__sort-arrow" :class="{'data-table__sort-arrow--active': isSorted(column, 'asc')}">↑</span>
                  <span class="data-table__sort-arrow" :class="{'data-table__sort-arrow--active': isSorted(column, 'desc')}">↓</span>
                </span>
              </div>
            </th>
            
            <!-- Actions column if actions are provided -->
            <th v-if="$slots['row-actions']" class="data-table__actions-column">
              Actions
            </th>
          </tr>
        </thead>
        
        <!-- Table body with data rows -->
        <tbody class="data-table__body">
          <tr
            v-for="(row, index) in paginatedData"
            :key="getRowKey(row, index)"
            :class="getRowClass(row, index)"
            @click="handleRowClick(row, $event)"
          >
            <!-- Selection checkbox -->
              <!--@click.stop ===> Prevent row click event -->
            <td v-if="selectable" class="data-table__select-column">
              <input
                type="checkbox"
                :checked="isSelected(row)"
                @change="toggleSelection(row)"
                @click.stop                 
              >
            </td>
            
            <!-- Data cells -->
            <td
              v-for="column in columns"
              :key="column.key"
              :class="getCellClass(column, row)"
            >
              <!-- Custom cell rendering or default -->
              <slot
                :name="`cell-${column.key}`"
                :value="getCellValue(row, column)"
                :row="row"
                :column="column"
              >
                {{ getCellValue(row, column) }}
              </slot>
            </td>
            
            <!-- Row actions -->
            <td v-if="$slots['row-actions']" class="data-table__actions-column">
              <slot name="row-actions" :row="row" :index="index"></slot>
            </td>
          </tr>
          
          <!-- Empty state -->
          <tr v-if="paginatedData.length === 0">
            <td :colspan="totalColumns" class="data-table__empty">
              <slot name="empty" :columns="columns">
                <div class="data-table__empty-state">
                  <span class="data-table__empty-icon">📊</span>
                  <p>No data available</p>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Table footer with pagination and summary -->
    <div class="data-table__footer" v-if="pagination || $slots.footer">
      
      <!-- Pagination controls -->
      <div class="data-table__pagination" v-if="pagination">
        <div class="data-table__pagination-info">
          Showing {{ rangeStart }} to {{ rangeEnd }} of {{ totalItems }} entries
        </div>
        
        <div class="data-table__pagination-controls">
          <button
            class="data-table__pagination-btn"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            Previous
          </button>
          
          <span class="data-table__pagination-pages">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          
          <button
            class="data-table__pagination-btn"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
      
      <!-- Custom footer content -->
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<!-- Import JavaScript business logic -->
<script src="./data-table.js"></script>

<!-- Import scoped Sass styles -->
<style src="./data-table.sass" lang="sass" scoped></style>