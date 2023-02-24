<template>
  <div class="table-card min-w-0 rounded-lg bg-white p-4 flex flex-col flex-grow basis-0 overflow-hidden shadow-[inset_0_0_1px_0_var(--shadow-color-1,inset_0_4px_24px_-4px_var(--shadow-color-2]">
    <DataTableFilterPanel v-model:search="query" v-model:filters="filter" :total="totalItems" :columns="columns" :loading="loading" @refresh="$emit('refresh')" @export="$emit('export',$event)" />
    <DataTableContent
      v-model="allSelected" v-model:sort-by="sortedBy" v-model:sort-desc="sortedDesc" :items="items" :columns="columns" :selectable="selectable"
      :must-sort="mustSort"
      @rowClick="$emit('rowClick',$event)"
    >
      <template v-for="(index, name) in $slots" #[name]="data">
        <slot :name="name" v-bind="data" />
      </template>
    </DataTableContent>
  </div>
</template>

<script>
import DataTableFilterPanel from '@/components/DataTableFilterPanel.vue';
import DataTableContent from '@/components/DataTableContent.vue';

export default {
  name: 'DataTable',
  components:
    {
      DataTableFilterPanel,
      DataTableContent,
    },
  props:
    {
      /**
       * Rows for the table
       */
      items:
        {
          type: Array,
          default: () => []
        },
      /**
       * The total number of items over all pages
       */
      totalItems:
        {
          type: Number,
          default: 0
        },
      /**
       * Show checkboxes for each row in the table
       */
      selectable:
        {
          type: Boolean,
          default: false
        },
      /**
       * Contains the currently selected rows/items
       */
      modelValue:
        {
          type: Array,
          default: () => []
        },
      /**
       * Definition of the columns
       * @typedef {{
       *   id: String,
       *   name: String,
       * }} operatorDef
       * @typedef {{
       *  name: String,
       *  title: String,
       *  field: String,
       *  icon: Component,
       *  width: Number|String,
       *  formatter: Function,
       *  class: String|Function,
       *  style: String|Function,
       *  visible: Boolean,
       *  operators: operatorDef[],
       * }} columnDefs
       */
      columns:
        {
          type: Array,
          default: () => []
        },
      sortBy:
        {
          type: String,
          default: ''
        },
      sortDesc:
        {
          type: Boolean,
          default: false
        },
      /**
       * When TRUE - clicking on a column will toggle between ascending/descending sorting
       * When FALSE - clicking on a column will cycle through 3 states - ascending, descending and "no sorting"
       */
      mustSort:
        {
          type: Boolean,
          default: false,
        },
      /**
       * Search term
       */
      search:
        {
          type: String,
          default: ''
        },
      /**
       * @typedef {{
       *   key: String,
       *   operator: String,
       *   value: String|Number
       * }} filterRule
       * @typedef {{
       *   condition: ("AND"|"OR"),
       *   rules: Array<filterObject|filterRule>
       * }} filterObject
       */
      filters:
        {
          type: Object,
          default: () => ({})
        },
      /**
       * Whether the data is currently being fetched from the server
       */
      loading:
        {
          type: Boolean,
          default: false
        },
    },
  emits: ['update:model-value', 'update:sort-by', 'update:sort-desc', 'update:search', 'update:filters', 'refresh', 'export', 'rowClick'], // rowClick(row,column), export(allColumns)
  computed:
    {
      allSelected:
        {
          get()
          {
            return this.modelValue;
          },
          set(val)
          {
            this.$emit('update:model-value', val);
          }
        },
      sortedBy:
        {
          get()
          {
            return this.sortBy;
          },
          set(val)
          {
            this.$emit('update:sort-by', val);
          }
        },
      sortedDesc:
        {
          get()
          {
            return this.sortDesc;
          },
          set(val)
          {
            this.$emit('update:sort-desc', val);
          }
        },
      query:
        {
          get()
          {
            return this.search;
          },
          set(val)
          {
            this.$emit('update:search', val);
          }
        },
      filter:
        {
          get()
          {
            return this.filters;
          },
          set(val)
          {
            this.$emit('update:filters', val);
          }
        }
    }
};
</script>

<style lang="scss">
.table-card
{
  --shadow-color-1: rgba(15, 51, 77, 0.25);
  --shadow-color-2: rgba(15, 51, 77, 0.10);

  input,
  select,
  textarea
  {
    outline: none;
  }
}

svg:not(:root).svg-inline--fa
{
  overflow: visible;
}

.svg-inline--fa
{
  display: inline-block;
  font-size: inherit;
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;

  .fa-primary
  {
    fill: var(--fa-primary-color, currentColor);
    opacity: var(--fa-primary-opacity, 1);
  }

  .fa-secondary
  {
    fill: var(--fa-secondary-color, currentColor);
    opacity: var(--fa-secondary-opacity, 0.4);
  }
}

.data-table
{
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.data-table:not(.data-table--no-row-padding) tr::after,
.data-table:not(.data-table--no-row-padding) tr::before
{
  content: "";
  display: table-cell;
  width: 1rem;
  padding: 0;
}

.data-table td,
.data-table th
{
  vertical-align: middle;
  padding: 1rem 0.5rem;
}

.data-table td:first-child,
.data-table th:first-child
{
  padding-left: 1rem;
}

.data-table td:last-child,
.data-table th:last-child
{
  padding-right: 1rem;
}

.data-table th
{
  font-size: 0.875rem;
  font-weight: normal;
  border-bottom: 1px solid #E4EBF0;
}

.data-table tr:not(:last-child) td,
.data-table.data-table--border-last tr:not(.data-table__empty) td
{
  border-bottom: 1px solid #E4EBF0;
}

.data-table thead tr::after,
.data-table thead tr::before
{
  border-bottom: 1px solid #E4EBF0;
}

.data-table thead td,
.data-table thead th
{
  padding-bottom: 0.5rem;
}

.data-table tbody tr:not(.data-table__empty):not(.disabled-row)
{
  transition: background-color 0.2s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.data-table tbody tr:not(.data-table__empty):not(.disabled-row):hover
{
  background-color: #F7FAFF;
}

.data-table--no-head
{
  border-top: 1px solid #E4EBF0;
}

.data-table--fixed
{
  table-layout: fixed;
}

.data-table--nowrap td,
.data-table--nowrap th
{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.data-table--sticky-header
{
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #FFFFFF;
}

.data-table--sm td,
.data-table--sm th
{
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.data-table__row-pad
{
  padding: 0 !important;
  width: 1rem;
}

.data-table__row-pad::before
{
  content: "";
  display: block;
  width: 1rem;
}

td.data-table__row-pad
{
  border-bottom: 0 !important;
}

.data-table-sticky-header-container
{
  position: relative;
}

.data-table__column-header
{
  display: inline-flex;
  align-items: center;
}

.data-table__column-header--clickable
{
  cursor: pointer;
}

.data-table__column-header--clickable:hover
{
  text-decoration: underline;
}

.data-table__column-header-icon
{
  margin-right: 0.25rem;
}

.data-table__column-header-sort
{
  font-size: 1rem;
  margin-left: 0.25rem;
}

.data-table__empty
{
  color: #627685;
}

.data-table__empty td
{
  text-align: center !important;
  padding: 2rem 0 !important;
}

.data-table__loading
{
  text-align: center !important;
  padding: 4rem 0 !important;
}

.data-table__cell-sm
{
  width: 2.5rem;
}

.data-table__cell-sm:first-child,
.data-table__cell-sm:last-child
{
  width: 3rem;
}

.checkbox-column
{
  padding: 0 !important;
  overflow: visible !important;
  width: 2rem;
  height: 1px;
}

.checkbox-column input
{
  pointer-events: none;
}

.checkbox-column--hidden *
{
  visibility: hidden;
}

.checkbox-column--hidden .checkbox-column__click-area
{
  padding-top: 0;
  padding-bottom: 0;
}

.checkbox-column--hidden .checkbox-column__circle
{
  height: auto;
}

.checkbox-column__click-area
{
  cursor: pointer;
  position: relative;
  left: -1rem;
  margin-right: -1.5rem;
  padding: 1rem 0.5rem;
  height: 100%;
}

.data-table th .checkbox-column__click-area
{
  padding-bottom: 0.4rem;
}

.checkbox-column__click-area:hover .checkbox-column__circle
{
  background-color: rgba(69, 121, 228, 0.1);
}

.checkbox-column__circle
{
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
