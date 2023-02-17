<template>
  <div class="bg-blue-100 leading-none">
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="svg-inline--fa w-5 !h-5 progress-spinner" role="img" aria-hidden="true" focusable="false">
      <circle class="progress-spinner__bg" fill="none" cx="12" cy="12" r="10" style="stroke-width: 4px;" />
      <circle class="progress-spinner__fill" fill="none" cx="12" cy="12" r="10" transform="translate(12, 12) rotate(-90) translate(-12, -12)" style="stroke-width: 4px; stroke-dasharray: 15.708px, 1000;" />
    </svg>
  </div>
</template>

<script>
export default
{
  name: 'SpinLoader',
};
</script>

<style lang="scss">
.progress-spinner
{
  animation: progress-spinner-animation 1s linear infinite;
}

.progress-spinner__bg
{
  stroke: var(--spinner-bg, rgba(207, 220, 230, 0.25));
}

.progress-spinner__fill
{
  stroke: var(--spinner-color, #4579E4);
  transition: stroke-dasharray 0.3s;
}

@keyframes progress-spinner-animation
{
  0%
  {
    transform: rotate(0);
  }

  100%
  {
    transform: rotate(360deg);
  }
}
</style>
