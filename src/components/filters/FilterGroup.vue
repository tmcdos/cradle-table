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

    <FilterRule v-for="(rule, index) in rules" ref="rules" :key="'r'+index" v-model="rules[index]" :options="options" @deleteRule="deleteRule(index)" />

    <FilterGroup v-for="(group, index) in groups" ref="groups" :key="'g'+index" v-model="groups[index]" class="ml-30px" :options="options" @deleteGroup="deleteGroup(index)" />
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
          type: Object,
          default: () => ({})
        },
      options:
        {
          type: Object,
          required: true
        },
      isFirst:
        {
          type: Boolean,
          default: false
        },
    },
  emits: ['deleteGroup', 'update:model-value'],
  data()
  {
    return {
      isAnd: true,
      groups: [],
      rules: []
    };
  },
  watch:
    {
      modelValue:
        {
          deep: true,
          immediate: true,
          handler(newVal)
          {
            this.fillFormStatus(newVal);
          }
        }
    },
  created()
  {
    this.addRule();
  },
  methods:
  {
    addRule()
    {
      this.rules.push(this.generateId());
      this.updateModel();
    },

    addGroup()
    {
      this.groups.push(this.generateId());
      this.updateModel();
    },

    deleteSelf()
    {
      this.$emit('deleteGroup');
    },

    deleteRule(index)
    {
      this.rules.splice(index, 1);
      this.updateModel();
    },

    deleteGroup(index)
    {
      this.groups.splice(index, 1);
      this.updateModel();
    },

    updateModel()
    {
      this.$nextTick(() =>
      {
        this.$emit('update:model-value', this.queryFormStatus());
      });
    },
    queryFormStatus()
    {
      const query = {};
      const rules = this.$refs.rules || {};
      const groups = this.$refs.groups || {};
      let i, j;

      query.condition = this.isAnd ? 'AND' : 'OR';
      query.rules = [];
      for (i = 0; i < rules.length; i++)
      {
        query.rules.push(rules[i].queryFormStatus());
      }
      for (j = 0; j < groups.length; j++)
      {
        query.rules[query.rules.length] = groups[j].queryFormStatus();
      }
      return query;
    },

    fillFormStatus(data)
    {
      this.rules = [];
      this.groups = [];
      if (data)
      {
        this.isAnd = /and/i.test(data.condition);
        data.rules.forEach(rule =>
        {
          if (rule.condition)
          {
            this.groups.push(this.generateId());
            // this.$nextTick(() =>
            // {
            //   this.$refs.groups[this.groups.length - 1].fillFormStatus(rule);
            // });
          }
          else
          {
            this.rules.push(this.generateId());
            // this.$nextTick(() =>
            // {
            //   this.$refs.rules[this.rules.length - 1].fillRuleStatus(rule);
            // });
          }
        });
      }
    },

    generateId()
    {
      return 'xxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c)
      {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
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
