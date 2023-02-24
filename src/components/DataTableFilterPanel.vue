<template>
  <div>
    <div class="pb-4 flex items-center">
      <div class="flex rounded-md max-w-xs border-2 border-gray-300 focus-within:border-blue-500">
        <div class="relative flex items-stretch flex-grow rounded-l-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <svg aria-hidden="true" focusable="false" class="svg-inline--fa w-4 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                fill="currentColor" d="M508.5 468.9L387.1 347.5c-2.3-2.3-5.3-3.5-8.5-3.5h-13.2c31.5-36.5 50.6-84 50.6-136C416 93.1 322.9 0 208 0S0 93.1 0
                  208s93.1 208 208 208c52 0 99.5-19.1 136-50.6v13.2c0 3.2 1.3 6.2 3.5 8.5l121.4 121.4c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17zM208
                  368c-88.4 0-160-71.6-160-160S119.6 48 208 48s160 71.6 160 160-71.6 160-160 160z"
              />
            </svg>
          </div>
          <input ref="search" v-model.trim="query" type="text" class="block w-full rounded-l pl-10 sm:text-sm border-0" :class="{'rounded-r': !search}" placeholder="Search" @keydown.esc.stop="query = ''">
        </div>
        <button v-if="search" type="button" class="relative inline-flex items-center px-4 py-2 border border-transparent rounded-r-md text-blue-500 bg-blue-50 hover:bg-blue-100" @click="query = '',$refs.search.focus()">
          <IconClose />
        </button>
      </div>
      <DefaultButton v-if="filters" class="ml-2 px-1" @click="resetFilter">Reset filter</DefaultButton>
      <DefaultButton v-else class="ml-2 px-1" @click="addFilter">+ Add filter</DefaultButton>
      <div class="flex-grow" />

      <div class="px-2">{{ total }} rows</div>
      <!-- Refresh -->
      <DefaultButton class="ml-2" :class="{'bg-blue-100': loading}" @click="$emit('refresh')">
        <SpinLoader v-if="loading" />
        <IconReload v-else />
      </DefaultButton>
      <!-- Export -->
      <DropDown as="div" class="relative inline-block text-left">
        <MenuButton class="ml-2 inline-flex items-center justify-center min-w-8.5 min-h-7.5 border border-transparent text-base font-medium rounded-md text-blue-500 bg-white hover:bg-blue-50 focus:outline-none">
          <IconExport />
        </MenuButton>
        <transition
          enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95"
        >
          <MenuItems class="z-2 p-4 origin-top-right absolute right-0 mt-1 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <fieldset>
              <legend class="sr-only">Export type</legend>
              <!-- Only visible columns -->
              <div class="flex items-center my-4">
                <input id="export_visible_only" type="radio" :checked="!exportAllColumns" class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 cursor-pointer" @click="exportAllColumns = false">
                <label for="export_visible_only" class="ml-3 block text-sm font-medium text-gray-700 hover:text-blue-500 cursor-pointer">Export displayed columns only</label>
              </div>
              <!-- All columns -->
              <div class="flex items-center my-4">
                <input id="export_all_cols" type="radio" :checked="exportAllColumns" class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 cursor-pointer" @click="exportAllColumns = true">
                <label for="export_all_cols" class="ml-3 block text-sm font-medium text-gray-700 hover:text-blue-500 cursor-pointer">Export all available columns</label>
              </div>
            </fieldset>
            <div class="flex justify-center">
              <MenuItem>
                <button type="button" class="inline-flex items-center justify-center min-w-8.5 min-h-10 px-6 shadow-lg text-base font-medium rounded-full bg-blue-500 text-white hover:bg-blue-400 focus:outline-none" @click="exportData">
                  Export as CSV
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </DropDown>
      <!-- Columns visibility -->
      <DropDown as="div" class="relative inline-block text-left">
        <MenuButton class="ml-2 inline-flex items-center justify-center min-w-8.5 min-h-7.5 border border-transparent text-base font-medium rounded-md text-blue-500 bg-white hover:bg-blue-50 focus:outline-none">
          <IconColumns />
        </MenuButton>
        <transition
          enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95"
        >
          <MenuItems class="z-2 p-4 origin-top-right absolute right-0 mt-1 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div class="uppercase text-gray-500 pb-2">Visible columns</div>
            <fieldset>
              <legend class="sr-only">Columns visibility</legend>
              <div v-for="(col,colIndex) in columns" :key="colIndex" class="relative flex items-center my-3">
                <input :id="`col-vis-${colIndex}`" :aria-describedby="col.title || col.name" type="checkbox" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer" :checked="col.visible" @click="col.visible = !col.visible">
                <label :for="`col-vis-${colIndex}`" class="text-gray-700 text-sm ml-3 cursor-pointer">{{ col.title || col.name }}</label>
              </div>
            </fieldset>
          </MenuItems>
        </transition>
      </DropDown>
    </div>
    <div class="max-h-300px overflow-auto">
      <FilterGroup v-if="showFilters" ref="filter" v-model="filterObject" :options="filterOptions" is-first />
    </div>
  </div>
</template>

<script>
import DefaultButton from '@/components/ui/DefaultButton.vue';
import IconReload from '@/components/icons/IconReload.vue';
import IconExport from '@/components/icons/IconExport.vue';
import IconColumns from '@/components/icons/IconColumns.vue';
import IconClose from '@/components/icons/IconClose.vue';
import SpinLoader from '@/components/ui/SpinLoader.vue';
import FilterGroup from '@/components/filters/FilterGroup.vue';
import { Menu as DropDown, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';

export default
{
  name: 'DataTableFilterPanel',
  components:
    {
      MenuItem,
      DefaultButton,
      SpinLoader,
      IconExport,
      IconReload,
      IconColumns,
      IconClose,
      DropDown,
      MenuButton,
      MenuItems,
      FilterGroup,
    },
  props:
    {
      total:
        {
          type: Number,
          default: 0
        },
      search:
        {
          type: String,
          default: ''
        },
      loading:
        {
          type: Boolean,
          default: false
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
      filters:
        {
          type: Object,
          default: () => ({})
        },
    },
  emits: ['update:search', 'update:filters', 'refresh', 'export'], // export(allColumns)
  data()
  {
    return {
      exportAllColumns: false,
      showFilters: false,
    };
  },
  computed:
    {
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
      filterOptions()
      {
        return {
          keys: [
            {
              name: 'Choose column',
              id: null,
              operators: [],
            }].concat(this.columns.filter(column => column.operators).map(column => ({
            id: column.name,
            name: column.title || column.name,
            operators: column.operators,
          })))
        };
      },
      filterObject:
      {
        get()
        {
          return this.filters;
        },
        set(val)
        {
          this.$emit('update:filters', val);
        }
      },
    },
  methods:
    {
      exportData()
      {
        this.$emit('export', this.exportAllColumns);
      },
      addFilter()
      {
        this.showFilters = true;
      },
      resetFilter()
      {
        this.showFilters = false;
        this.filter = null;
      },
    }
};
</script>
