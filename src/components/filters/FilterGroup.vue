<template>
  <div class="and-or-template border border-blue-500 border-t-3 rounded mb-4 p-2 relative shadow-sm" :class="isFirst ? 'and-or-first' : '' ">
    <div class="flex and-or-top items-center justify-between">
      <LogicSwitcher v-model="isAnd" />
      <div class="flex items-center">
        <DefaultButton class="px-1" @click.prevent="addGroup">+ Group</DefaultButton>
        <DefaultButton class="ml-1 px-1" @click.prevent="addRule">+ Condition</DefaultButton>
        <button v-if="!isFirst" class="ml-1 inline-flex w-6 h-6 border border-blue-500 rounded-1/2 shadow-sm text-blue-500 hover:(bg-blue-500 text-white) focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" @click.prevent="deleteSelf">
          <IconClose class="m-auto" />
        </button>
      </div>
    </div>
    <template v-for="(rule,index) in modelValue.rules" :key="index">
      <!-- eslint-disable vue/no-mutating-props -->
      <component
        :is="(rule.condition && rule.rules) ? 'FilterGroup' : 'FilterRule'" v-model="modelValue.rules[index]" :options="options" :class="{'ml-30px': rule.condition && rule.rules}"
        @deleteRule="deleteRule(index)" @deleteGroup="deleteRule(index)"
      />
      <!-- eslint-enable vue/no-mutating-props -->
    </template>
  </div>
</template>

<script>
import FilterRule from './FilterRule';
import DefaultButton from '@/components/ui/DefaultButton.vue';
import LogicSwitcher from '@/components/ui/LogicSwitcher.vue';
import IconClose from '@/components/icons/IconClose.vue';

export default {
  name: 'FilterGroup',
  components:
    {
      FilterRule,
      DefaultButton,
      LogicSwitcher,
      IconClose,
    },
  props:
    {
      modelValue:
        {
          // hierarchical filter definition - composed of nested groups (with logical condition) and individual rules
          type: Object,
          default: () => ({})
        },
      options:
        {
          // column definitions - each column also specifies the possible filter operators for that column
          type: Object,
          required: true
        },
      isFirst:
        {
          // first group in the filter can not be deleted
          type: Boolean,
          default: false
        },
    },
  emits: ['deleteGroup'],
  computed:
    {
      isAnd:
        {
          get()
          {
            return (this.modelValue.condition || '').toLowerCase() === 'and';
          },
          set(val)
          {
            this.modelValue.condition = (val ? 'AND' : 'OR'); // eslint-disable-line vue/no-mutating-props
          }
        }
    },
  methods:
  {
    addRule()
    {
      this.modelValue.rules.push({ // eslint-disable-line vue/no-mutating-props
        key: null,
        operator: null,
        value: '',
      });
    },

    addGroup()
    {
      this.modelValue.rules.push({ // eslint-disable-line vue/no-mutating-props
        condition: 'AND',
        rules: [
          {
            key: null,
            operator: null,
            value: '',
          }
        ],
      });
    },

    deleteSelf()
    {
      this.$emit('deleteGroup');
    },

    deleteRule(index)
    {
      this.modelValue.rules.splice(index, 1); // eslint-disable-line vue/no-mutating-props
    },
  }
};
</script>

<style lang="scss">
.and-or-template::before,
.and-or-template::after
{
  content: "";
  position: absolute;
  left: -16px;
  width: 16px;
  height: calc(50% + 12px);
  border-color: #C0C5E2;
  border-style: solid;
}

.and-or-template::before
{
  top: -10px;
  border-width: 0 0 2px 2px;
}

.and-or-template:last-child::before
{
  border-bottom-left-radius: 4px;
}

.and-or-template::after
{
  top: 50%;
  border-width: 0 0 0 2px;
}

.and-or-first::before,
.and-or-first::after,
.and-or-template:last-child::after
{
  border: none;
}

</style>
