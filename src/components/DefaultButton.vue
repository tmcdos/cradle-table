<template>
  <button type="button" class="inline-flex items-center justify-center min-w-8.5 min-h-7.5 border border-transparent text-base font-medium rounded-md text-blue-500 bg-white hover:bg-blue-50 focus:outline-none">
    <slot />
  </button>
</template>

<script>
export default
{
  name: 'DefaultButton',
};
</script>
