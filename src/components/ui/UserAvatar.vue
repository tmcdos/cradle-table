<template>
  <div class="user-avatar bg-blue-500 text-white text-center uppercase overflow-hidden rounded-1/2 flex justify-center items-center">
    <img v-if="url" :src="url" class="object-cover w-full h-full">
    <template v-else>{{ text }}</template>
  </div>
</template>

<script>
export default
{
  name: 'UserAvatar',
  props:
    {
      url:
        {
          type: String,
          default: ''
        },
      text:
        {
          type: String,
          default: ''
        },
    }
};
</script>

<style lang="scss">
.user-avatar
{
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.25rem;
  line-height: 2.5rem;
}
</style>
