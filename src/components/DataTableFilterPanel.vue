<template>
  <div class="pb-4 flex items-center">
    <div class="relative rounded-md shadow-sm max-w-xs">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
        <svg aria-hidden="true" focusable="false" class="svg-inline--fa fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            fill="currentColor" d="M508.5 468.9L387.1 347.5c-2.3-2.3-5.3-3.5-8.5-3.5h-13.2c31.5-36.5 50.6-84 50.6-136C416 93.1 322.9 0 208 0S0 93.1 0
          208s93.1 208 208 208c52 0 99.5-19.1 136-50.6v13.2c0 3.2 1.3 6.2 3.5 8.5l121.4 121.4c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17zM208
          368c-88.4 0-160-71.6-160-160S119.6 48 208 48s160 71.6 160 160-71.6 160-160 160z"
          />
        </svg>
      </div>
      <input v-model.trim="search" type="text" class="focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md" placeholder="Search">
    </div>
    <DefaultButton class="ml-2">+ Add filter</DefaultButton>

    <div class="flex-grow" />

    <div class="px-2">{{ total }} rows</div>
    <!-- Refresh -->
    <DefaultButton class="ml-2">
      <IconReload />
    </DefaultButton>
    <!-- Export -->
    <DefaultButton class="ml-2">
      <IconExport />
    </DefaultButton>
    <!-- Columns visibility -->
    <DefaultButton class="ml-2">
      <IconColumns />
    </DefaultButton>
  </div>
</template>

<script>
import DefaultButton from '@/components/DefaultButton.vue';
import IconReload from '@/components/IconReload.vue';
import IconExport from '@/components/IconExport.vue';
import IconColumns from '@/components/IconColumns.vue';

export default
{
  name: 'DataTableFilterPanel',
  components:
    {
      DefaultButton,
      IconExport,
      IconReload,
      IconColumns,
    },
  props:
    {
      total:
        {
          type: Number,
          default: 0
        },
    },
  data()
  {
    return {
      search: '',
    };
  },
};
</script>
