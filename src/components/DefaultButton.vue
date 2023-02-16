<template>
  <button type="button" class="inline-flex items-center px-2 py-1.5 border border-transparent text-base font-medium rounded-md text-blue-500 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
    <slot />
  </button>
</template>

<script>
export default
{
  name: 'DefaultButton',
};
</script>
