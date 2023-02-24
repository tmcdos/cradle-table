<template>
  <div class="flex flex-shrink-0 w-20 text-center text-sm leading-8 rounded overflow-hidden font-medium cursor-pointer">
    <button class="filter-condition-and pr-1.5 min-w-0" :class="{active: isAND,'hover:text-[#004D26]': !isAND}" @click="isAND = true">AND</button>
    <button class="filter-condition-or pr-1.5 min-w-0" :class="{active: !isAND,'hover:text-[#4D2600]': isAND}" @click="isAND = false">OR</button>
  </div>
</template>

<script>
export default {
  name: 'LogicSwitcher',
  props:
    {
      modelValue:
        {
          type: Boolean,
          default: false,
        },
    },
  emits: ['update:model-value'],
  computed:
    {
      isAND:
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
    }
};
</script>

<style lang="scss">
.filter-condition-and
{
  background-color: #F5F8FA;
  color: #CFDCE6;
  flex: 1 1 0;
  margin-right: -6px;
  appearance: none;

  &.active
  {
    background-color: #AAF2CE;
    color: #004D26;
  }
}

.filter-condition-or
{
  background-color: #F5F8FA;
  color: #CFDCE6;
  flex: 1 1 0;
  margin-left: -6px;
  clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%);
  appearance: none;

  &.active
  {
    background-color: #FCED47;
    color: #4D2600;
  }
}

</style>
