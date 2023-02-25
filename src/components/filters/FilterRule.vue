<template>
  <div class="flex items-center gap-2 my-2 and-or-rule">
    <!-- eslint-disable vue/no-mutating-props -->
    <div class="basis-1/4 flex-grow">
      <!-- List of table columns -->
      <select v-model="modelValue.key" class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
        <option v-for="option in options.keys" :key="option.id" :value="option.id">
          {{ option.name }}
        </option>
      </select>
    </div>

    <div class="basis-1/4 flex-grow">
      <!-- List of possible filter operators for that column -->
      <select v-model="modelValue.operator" class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
        <option v-for="option in allowedOperators" :key="option.id" :value="option.id">
          {{ option.name }}
        </option>
      </select>
    </div>

    <div class="basis-1/4 flex-grow">
      <!-- Parameter for the chosen filter operator -->
      <input v-model="modelValue.value" type="text" class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Value ...">
    </div>
    <!-- eslint-enable vue/no-mutating-props -->
    <button class="inline-flex w-6 h-6 border border-blue-500 rounded-full shadow-sm text-blue-500 hover:(bg-blue-500 text-white) focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" @click.prevent="deleteSelf">
      <IconClose class="m-auto" />
    </button>
  </div>
</template>

<script>
import IconClose from '@/components/icons/IconClose.vue';

export default
{
  name: 'FilterRule',
  components:
    {
      IconClose,
    },
  props:
    {
      options:
        {
          type: Object,
          required: true
        },
      modelValue:
        {
          type: Object,
          required: true
        },
    },
  emits: ['deleteRule'],
  computed:
    {
      chosenField()
      {
        return this.options.keys.find(item => item.id === this.modelValue.key);
      },
      allowedOperators()
      {
        return (this.chosenField || {}).operators || [];
      },
    },
  watch:
  {
    'modelValue.key'()
    {
      this.reset();
    },
    allowedOperators()
    {
      this.reset();
    }
  },
  methods:
  {
    deleteSelf()
    {
      this.$emit('deleteRule');
    },
    reset()
    {
      this.modelValue.operator = null; // eslint-disable-line vue/no-mutating-props
      this.modelValue.value = ''; // eslint-disable-line vue/no-mutating-props
    }
  }
};
</script>

<style lang="scss">
.and-or-rule
{
  position: relative;
  margin-left: 30px !important;
  padding-left: 0;
}

.and-or-rule::before,
.and-or-rule::after
{
  content: "";
  position: absolute;
  left: -15px;
  width: 16px;
  height: calc(50% + 11px);
  border-color: #C0C5E2;
  border-style: solid;
}

.and-or-rule::before
{
  top: -9px;
  border-width: 0 0 2px 2px;
}

.and-or-rule:last-child::before
{
  border-bottom-left-radius: 4px;
}

.and-or-rule::after
{
  top: 50%;
  border-width: 0 0 0 2px;
}

.and-or-rule:last-child::after
{
  border: none;
}
</style>
