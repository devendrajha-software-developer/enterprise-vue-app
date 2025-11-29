// DataTable.js - BUSINESS LOGIC
// Handles data manipulation, sorting, pagination, and selection

export default {
  name: 'DataTable',
  
  // ===== PROPS DEFINITION =====
  props: {
    // Array of data objects to display
    data: {
      type: Array,
      required: true,
      default: () => [],
      validator: (data) => Array.isArray(data)
    },
    
    // Column configuration
    columns: {
      type: Array,
      required: true,
      default: () => [],
      validator: (columns) => {
        return columns.every(col => 
          col && 
          typeof col.key === 'string' && 
          typeof col.label === 'string'
        )
      }
    },
    
    // Table title
    title: {
      type: String,
      default: ''
    },
    
    // Accessibility caption
    caption: {
      type: String,
      default: ''
    },
    
    // Enable row selection
    selectable: {
      type: Boolean,
      default: false
    },
    
    // Enable column sorting
    sortable: {
      type: Boolean,
      default: false
    },
    
    // Enable horizontal scrolling
    scrollable: {
      type: Boolean,
      default: false
    },
    
    // Stripe alternate rows
    striped: {
      type: Boolean,
      default: true
    },
    
    // Add hover effects
    hoverable: {
      type: Boolean,
      default: true
    },
    
    // Enable pagination
    pagination: {
      type: [Boolean, Object],
      default: false,
      validator: (value) => {
        if (typeof value === 'boolean') return true
        return typeof value === 'object' && value !== null
      }
    },
    
    // Items per page for pagination
    itemsPerPage: {
      type: Number,
      default: 10,
      validator: (value) => value > 0
    },
    
    // Row key generator for Vue's v-for
    rowKey: {
      type: [String, Function],
      default: 'id'
    },
    
    // Initial sort configuration
    initialSort: {
      type: Object,
      default: () => ({}),
      validator: (sort) => {
        if (!sort.key && !sort.direction) return true
        return sort.key && ['asc', 'desc'].includes(sort.direction)
      }
    }
  },
  
  // ===== COMPONENT STATE =====
  data() {
    return {
      currentPage: 1,
      sortBy: this.initialSort.key || '',
      sortDirection: this.initialSort.direction || 'asc',
      selectedRows: new Set(), // Track selected rows by their key
      internalData: [...this.data] // Local copy for sorting
    }
  },
  
  // ===== COMPUTED PROPERTIES =====
  computed: {
    // Calculate total number of items
    totalItems() {
      return this.internalData.length
    },
    
    // Calculate total number of pages
    totalPages() {
      if (!this.pagination) return 1
      const itemsPerPage = this.getItemsPerPage()
      return Math.ceil(this.totalItems / itemsPerPage)
    },
    
    // Get items per page from prop or configuration
    getItemsPerPage() {
      return () => {
        if (typeof this.pagination === 'object' && this.pagination.itemsPerPage) {
          return this.pagination.itemsPerPage
        }
        return this.itemsPerPage
      }
    },
    
    // Get sorted data based on current sort configuration
    sortedData() {
      if (!this.sortBy || !this.sortable) {
        return this.internalData
      }
      
      return [...this.internalData].sort((a, b) => {
        const aValue = this.getCellValue(a, { key: this.sortBy })
        const bValue = this.getCellValue(b, { key: this.sortBy })
        
        // Handle different data types
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return this.sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }
        
        // Numeric and other types
        return this.sortDirection === 'asc' 
          ? (aValue > bValue ? 1 : -1)
          : (aValue < bValue ? 1 : -1)
      })
    },
    
    // Get paginated data subset
    paginatedData() {
      if (!this.pagination) {
        return this.sortedData
      }
      
      const itemsPerPage = this.getItemsPerPage()
      const startIndex = (this.currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      
      return this.sortedData.slice(startIndex, endIndex)
    },
    
    // Calculate display range for pagination info
    rangeStart() {
      if (!this.pagination || this.totalItems === 0) return 0
      const itemsPerPage = this.getItemsPerPage()
      return (this.currentPage - 1) * itemsPerPage + 1
    },
    
    rangeEnd() {
      if (!this.pagination) return this.totalItems
      const itemsPerPage = this.getItemsPerPage()
      return Math.min(this.currentPage * itemsPerPage, this.totalItems)
    },
    
    // Check if all rows on current page are selected
    allSelected() {
      if (this.paginatedData.length === 0) return false
      return this.paginatedData.every(row => this.isSelected(row))
    },
    
    // Check if selection is indeterminate (some but not all selected)
    isIndeterminate() {
      const selectedCount = this.paginatedData.filter(row => this.isSelected(row)).length
      return selectedCount > 0 && selectedCount < this.paginatedData.length
    },
    
    // Calculate total columns for colspan
    totalColumns() {
      let count = this.columns.length
      if (this.selectable) count++
      if (this.$slots['row-actions']) count++
      return count
    },
    
    // Dynamic table classes
    tableClasses() {
      return {
        'data-table--striped': this.striped,
        'data-table--hoverable': this.hoverable,
        'data-table--selectable': this.selectable
      }
    }
  },
  
  // ===== METHODS =====
  methods: {
    // Get unique key for a row
    getRowKey(row, index) {
      if (typeof this.rowKey === 'function') {
        return this.rowKey(row, index)
      }
      return row[this.rowKey] || index
    },
    
    // Get cell value for a specific column
    getCellValue(row, column) {
      const value = row[column.key]
      
      // Handle nested properties (e.g., 'user.name')
      if (column.key.includes('.') && typeof value === 'undefined') {
        return column.key.split('.').reduce((obj, key) => obj?.[key], row)
      }
      
      return value
    },
    
    // Handle column sorting
    handleSort(column) {
      if (!this.sortable || column.sortable === false) return
      
      if (this.sortBy === column.key) {
        // Toggle direction if same column
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        // New column, default to ascending
        this.sortBy = column.key
        this.sortDirection = 'asc'
      }
      
      // Reset to first page when sorting
      this.currentPage = 1
      
      // Emit sort change event
      this.$emit('sort-change', {
        column: column.key,
        direction: this.sortDirection
      })
    },
    
    // Check if a column is currently sorted
    isSorted(column, direction) {
      return this.sortBy === column.key && this.sortDirection === direction
    },
    
    // Get header cell classes
    getHeaderClass(column) {
      return {
        'data-table__header--sortable': this.sortable && column.sortable !== false,
        'data-table__header--sorted': this.sortBy === column.key,
        [`data-table__header--${column.align}`]: column.align
      }
    },
    
    // Get row classes
    getRowClass(row, index) {
      const rowKey = this.getRowKey(row, index)
      return {
        'data-table__row--selected': this.isSelected(row),
        'data-table__row--even': index % 2 === 0,
        'data-table__row--odd': index % 2 !== 0
      }
    },
    
    // Get cell classes
    getCellClass(column, row) {
      return {
        [`data-table__cell--${column.align}`]: column.align,
        'data-table__cell--numeric': typeof this.getCellValue(row, column) === 'number'
      }
    },
    
    // Handle row selection
    toggleSelection(row) {
      const rowKey = this.getRowKey(row)
      
      if (this.selectedRows.has(rowKey)) {
        this.selectedRows.delete(rowKey)
      } else {
        this.selectedRows.add(rowKey)
      }
      
      this.$emit('selection-change', {
        selected: Array.from(this.selectedRows),
        row: row
      })
    },
    
    // Check if a row is selected
    isSelected(row) {
      return this.selectedRows.has(this.getRowKey(row))
    },
    
    // Toggle select all on current page
    toggleSelectAll() {
      const allCurrentlySelected = this.allSelected
      
      this.paginatedData.forEach(row => {
        const rowKey = this.getRowKey(row)
        
        if (allCurrentlySelected) {
          this.selectedRows.delete(rowKey)
        } else {
          this.selectedRows.add(rowKey)
        }
      })
      
      this.$emit('selection-change', {
        selected: Array.from(this.selectedRows),
        allSelected: !allCurrentlySelected
      })
    },
    
    // Handle row click
    handleRowClick(row, event) {
      if (this.selectable && event.target.type !== 'checkbox') {
        this.toggleSelection(row)
      }
      
      this.$emit('row-click', row, event)
    },
    
    // Pagination methods
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.$emit('page-change', page)
      }
    },
    
    // Public method to refresh data
    refreshData(newData) {
      this.internalData = [...newData]
      this.currentPage = 1
      this.selectedRows.clear()
    },
    
    // Public method to clear selection
    clearSelection() {
      this.selectedRows.clear()
      this.$emit('selection-change', { selected: [] })
    }
  },
  
  // ===== WATCHERS =====
  watch: {
    // Watch for external data changes
    data: {
      handler(newData) {
        this.internalData = [...newData]
        // Reset to first page when data changes
        this.currentPage = 1
      },
      deep: true
    },
    
    // Watch for pagination changes
    pagination: {
      handler() {
        this.currentPage = 1
      },
      deep: true
    }
  },
  
  // ===== LIFECYCLE HOOKS =====
  created() {
    console.log(`DataTable created with ${this.data.length} rows and ${this.columns.length} columns`)
  },

 // ADD THIS SIMPLE RENDER FUNCTION:
  render() {
    return this.$createElement('div', { class: 'data-table' }, [
      // Title
      this.title && this.$createElement('h3', { class: 'data-table__title' }, this.title),
      
      // Table
      this.$createElement('div', { class: 'data-table__wrapper' }, [
        this.$createElement('table', { class: 'data-table__table' }, [
          // Header
          this.$createElement('thead', { class: 'data-table__head' }, [
            this.$createElement('tr', {},
              this.columns.map(column => 
                this.$createElement('th', {
                  on: {
                    click: () => this.handleSort(column)
                  }
                }, column.label)
              )
            )
          ]),
          
          // Body
          this.$createElement('tbody', { class: 'data-table__body' },
            this.paginatedData.length > 0 ? 
              this.paginatedData.map(row => 
                this.$createElement('tr', { key: row.id },
                  this.columns.map(column => 
                    this.$createElement('td', row[column.key])
                  )
                )
              ) : [
                this.$createElement('tr', [
                  this.$createElement('td', {
                    attrs: { colspan: this.columns.length }
                  }, 'No data available')
                ])
              ]
          )
        ])
      ])
    ])
  }

}