<template>
  <div class="min-w-0 flex-grow pb-8 overflow-auto">
    <table class="w-full relative border-separate data-table data-table--nowrap data-table--no-row-padding data-table--border-last">
      <thead class="sticky top-0 bg-white z-1">
        <th class="data-table__row-pad" />
        <!-- Check/uncheck All -->
        <th class="checkbox-column" :class="{'checkbox-column--hidden': !selectable || items.length === 0}" @click.stop>
          <div class="checkbox-column__click-area" @click="toggleSelectAll">
            <div class="checkbox-column__circle">
              <input type="checkbox" :checked="items.length > 0 && modelValue.length === items.length">
            </div>
          </div>
        </th>
        <!-- Remaining columns -->
        <th v-for="(col,colIndex) in visibleColumns" :key="'c'+colIndex" :align="col.align || 'left'">
          <div class="data-table__column-header data-table__column-header--clickable" @click="changeSorting(col)">
            <!-- Column icon, if any -->
            <div v-if="col.icon" class="data-table__column-header-icon">
              <component :is="col.icon" aria-hidden="true" focusable="false" role="img" class="svg-inline--fa w-4" />
            </div>
            <!-- Column title -->
            <div>{{ col.title }}</div>
            <!-- Sorting indicator -->
            <div class="data-table__column-header-sort">
              <template v-if="col.name === sortBy && col.title">
                <svg aria-hidden="true" focusable="false" class="svg-inline--fa w-2.5 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <g class="fa-group">
                    <template v-if="sortDesc">
                      <path class="fa-primary" fill="currentColor" d="M296.07 329.05L177 448.05a23.9 23.9 0 0 1-33.8.1l-.1-.1-119-119c-15.1-15.1-4.4-41 17-41h238c21.37 0 32.04 25.95 16.97 41z" />
                      <path class="fa-secondary" fill="currentColor" d="M279.07 224.05h-238c-21.4 0-32.1-25.9-17-41l119-119a23.9 23.9 0 0 1 33.8-.1l.1.1 119.1 119c15.07 15.05 4.4 41-17 41z" />
                    </template>
                    <template v-else>
                      <path class="fa-primary" fill="currentColor" d="M24.05 183.05l119.1-119A23.9 23.9 0 0 1 177 64a.94.94 0 0 1 .1.1l119 119c15.1 15.1 4.4 41-17 41h-238c-21.45-.05-32.1-25.95-17.05-41.05z" />
                      <path class="fa-secondary" fill="currentColor" d="M41.05 288.05h238c21.4 0 32.1 25.9 17 41l-119 119a23.9 23.9 0 0 1-33.8.1l-.1-.1-119.1-119c-15.05-15.05-4.4-41 17-41z" />
                    </template>
                  </g>
                </svg>
              </template>
            </div>
          </div>
        </th>

        <th class="data-table__row-pad" />
      </thead>
      <tbody>
        <tr v-if="items.length === 0">
          <td class="data-table__row-pad" />
          <td :colspan="visibleColumns.length" class="text-center">No data to display!</td>
          <td class="data-table__row-pad" />
        </tr>
        <template v-else>
          <tr v-for="(row,rowIndex) in items" :key="rowIndex" class="cursor-pointer">
            <td class="data-table__row-pad" />
            <!-- Checkbox -->
            <td class="checkbox-column" :class="{'checkbox-column--hidden': !selectable}">
              <div class="checkbox-column__click-area" @click="toggleRow(row)">
                <div class="checkbox-column__circle">
                  <input type="checkbox" :checked="modelValue.includes(row)">
                </div>
              </div>
            </td>
            <!-- Columns -->
            <td
              v-for="(col,colIndex) in visibleColumns" :key="'d'+colIndex" class="max-w-300px overflow-hidden overflow-ellipsis whitespace-nowrap"
              :class="typeof col.class === 'function' ? col.class(row,col) : col.class" :style="typeof col.style === 'function' ? col.style(row,col) : col.style" :align="col.align" :width="col.width"
              @click="$emit('rowClick',row,col)"
            >
              <slot :name="`body-${col.name}`" :row="row" :row-index="rowIndex" :column="col" :col-index="colIndex" :value="(col.formatter && typeof col.formatter === 'function') ? col.formatter(row[col.field]) : row[col.field]">
                {{ (col.formatter && typeof col.formatter === 'function') ? col.formatter(row[col.field]) : row[col.field] }}
              </slot>
            </td>

            <td class="data-table__row-pad" />
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
export default
{
  name: 'DataTableContent',
  props:
    {
      /**
       * The rows for the table
       */
      items:
        {
          type: Array,
          default: () => []
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
       *  name: String,
       *  title: String,
       *  field: String,
       *  icon: Component,
       *  width: Number|String,
       *  formatter: Function,
       *  class: String|Function,
       *  style: String|Function,
       *  visible: Boolean,
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
    },
  emits: ['update:model-value', 'update:sort-by', 'update:sort-desc', 'rowClick'], // rowClick(row,column)
  computed:
    {
      visibleColumns()
      {
        return this.columns.filter(col => col.visible);
      },
    },
  methods:
    {
      toggleSelectAll()
      {
        this.$emit('update:model-value', this.modelValue.length === 0 ? this.items : []);
      },
      toggleRow(item)
      {
        const index = this.modelValue.indexOf(item);
        this.$emit('update:model-value', index < 0 ? this.modelValue.concat([item]) : this.modelValue.filter(obj => obj !== item));
      },
      changeSorting(column)
      {
        if (this.sortBy === column.name)
        {
          if (this.sortDesc)
          {
            if (!this.mustSort) this.$emit('update:sort-by', '');
            this.$emit('update:sort-desc', false);
          }
          else
          {
            this.$emit('update:sort-desc', true);
          }
        }
        else
        {
          this.$emit('update:sort-desc', false);
          this.$emit('update:sort-by', column.name);
        }
      },
    }
};
</script>
