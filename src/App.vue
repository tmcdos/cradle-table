<template>
  <div class="min-h-screen bg-slate-100 p-5">
    <DataTable
      v-model="selected" v-model:sort-by="sortBy" v-model:sort-desc="sortDesc" v-model:search="search" v-model:filters="filters"
      :items="sortedRows" :columns="columnDefs" :total-items="totalRows"
      :loading="loading" selectable class="max-h-600px text-slate-900 overflow-auto"
      @rowClick="rowClicked" @refresh="reloadData" @export="exportRows"
    >
      <template #body-avatar="props">
        <UserAvatar :url="props.row.avatar" :text="props.row.fullName.split(' ').map(item => item[0]).join('')" />
      </template>
      <template #body-lastSeen="{row}">
        <span :title="row.lastSeen ? dateFormat(row.lastSeen, 'eee, PPpp, O') : ''">{{ formatTimePeriod(row.lastSeen) }}</span>
      </template>
    </DataTable>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable.vue';
import UserAvatar from '@/components/ui/UserAvatar.vue';
import IconUser from '@/components/icons/IconUser.vue';
import { markRaw } from 'vue';
import {
  format as dateFormat,
  parseISO,
  differenceInSeconds,
  formatDistanceStrict
} from 'date-fns';

function isDate(d)
{
  return (!!d) && Object.prototype.toString.call(d) === '[object Date]';
}

function strCompare(a, b)
{
  if (a === null) return 1;
  else if (b === null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (isDate(a) || isDate(b))
  {
    const now = new Date();
    return (a || now).getTime() - (b || now).getTime();
  }
  // if (a.match(/^[+-]?[0-9]+(\.[0-9]+)?$/) && b.match(/^[+-]?[0-9]+(\.[0-9]+)?$/)) return a - b;
  if (a < b) return -1;
  else if (a > b) return 1;
  else return 0;
}

const operatorsText = [
  {
    name: 'is',
    id: 'equal'
  },
  {
    name: 'is not',
    id: 'differs'
  },
  {
    name: 'contains',
    id: 'includes'
  },
  {
    name: 'does not contain',
    id: 'excludes'
  },
  {
    name: 'starts with',
    id: 'prefix'
  },
  {
    name: 'ends with',
    id: 'suffix'
  },
  {
    name: 'has any value',
    id: 'isset'
  },
  {
    name: 'is empty',
    id: 'empty'
  },
];

const operatorsDate = [
  {
    name: 'less than x days ago',
    id: 'less'
  },
  {
    name: 'exactly x days ago',
    id: 'exact'
  },
  {
    name: 'more than x days ago',
    id: 'more'
  },
  {
    name: 'before a specific date',
    id: 'before'
  },
  {
    name: 'on a specific date',
    id: 'date'
  },
  {
    name: 'after a specific date',
    id: 'after'
  },
  {
    name: 'has any value',
    id: 'isset'
  },
  {
    name: 'is empty',
    id: 'empty'
  },
];

export default {
  name: 'App',
  components:
    {
      DataTable,
      UserAvatar,
    },
  data()
  {
    return {
      timer: null, // the timer ticks every second - so that we can update the LastSeen column
      updateNow: false, // every time the timer event triggers - we toggle this flag to force an update of the computer property "currentNow"
      loading: false,
      rows:
        [
          {
            fullName: 'Alice Anderson',
            email: 'alice@example.com',
            lastSeen: null,
            signedUp: new Date(Date.now() - Math.random() * 864000000),
            avatar: 'https://userflow-assets.storage.googleapis.com/example-avatars/michelle.jpg',
          },
          {
            fullName: 'Adrian Wisoky',
            email: 'adrian@example.com',
            lastSeen: new Date(),
            signedUp: new Date(Date.now() - Math.random() * 864000000),
          },
          {
            fullName: 'Marjorie Kilback',
            email: 'marjorie@example.com',
            lastSeen: new Date(Date.now() - Math.random() * 9999000),
            signedUp: new Date(Date.now() - Math.random() * 864000000),
            avatar: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
          },
          {
            fullName: 'Gilbert Mayer',
            email: 'gilbert@example.com',
            lastSeen: new Date(Date.now() - Math.random() * 9999000),
            signedUp: new Date(Date.now() - Math.random() * 864000000),
          },
          {
            fullName: 'Raina Hyatt',
            email: 'raina@example.com',
            lastSeen: new Date(Date.now() - Math.random() * 9999000),
            signedUp: new Date(Date.now() - Math.random() * 864000000),
            avatar: 'https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
          },
          {
            fullName: 'Sheldon Trantow',
            email: 'sheldon@example.com',
            lastSeen: new Date(Date.now() - Math.random() * 9999000),
            signedUp: new Date(Date.now() - Math.random() * 864000000),
            avatar: 'https://images.unsplash.com/photo-1456327102063-fb5054efe647?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=f05c14dd4db49f08a789e6449604c490',
          },
          {
            fullName: 'Freeda Schumm',
            email: 'freeda@example.com',
            lastSeen: new Date(Date.now() - Math.random() * 9999000),
            signedUp: new Date(Date.now() - Math.random() * 864000000),
            avatar: 'https://images.pexels.com/photos/598745/pexels-photo-598745.jpeg?h=350&auto=compress&cs=tinysrgb',
          },
          {
            fullName: 'Rigoberto Kuhlman',
            email: 'rigoberto@example.com',
            lastSeen: new Date(Date.now() - Math.random() * 9999000),
            signedUp: new Date(Date.now() - Math.random() * 864000000),
          },
          {
            fullName: 'Magdalena Witting',
            email: 'magdalena@example.com',
            lastSeen: new Date(Date.now() - Math.random() * 9999000),
            signedUp: new Date(Date.now() - Math.random() * 864000000),
          },
          {
            fullName: 'Tyreek Rogahn',
            email: 'tyreek@example.com',
            lastSeen: new Date(Date.now() - Math.random() * 9999000),
            signedUp: new Date(Date.now() - Math.random() * 864000000),
          },
          {
            fullName: 'Yasmine Fahey',
            email: 'yasmine@example.com',
            lastSeen: new Date(Date.now() - Math.random() * 9999000),
            signedUp: new Date(Date.now() - Math.random() * 864000000),
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=707b9c33066bf8808c934c8ab394dff6',
          },
          {
            fullName: 'Vince Kling',
            email: 'vince@example.com',
            lastSeen: new Date(Date.now() - Math.random() * 9999000),
            signedUp: new Date(Date.now() - Math.random() * 864000000),
          },
          {
            fullName: 'Bridget Collins',
            email: 'bridget@example.com',
            lastSeen: new Date(Date.now() - Math.random() * 9999000),
            signedUp: new Date(Date.now() - Math.random() * 864000000),
            avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?h=350&auto=compress&cs=tinysrgb',
          },
          {
            fullName: 'Boyd Kovacek',
            email: 'boyd@example.com',
            lastSeen: new Date(Date.now() - Math.random() * 9999000),
            signedUp: new Date(Date.now() - Math.random() * 864000000),
          },
          {
            fullName: 'Rosamond Abernathy',
            email: 'rosamond@example.com',
            lastSeen: new Date(Date.now() - Math.random() * 9999000),
            signedUp: new Date(Date.now() - Math.random() * 864000000),
            avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=d5849d81af587a09dbcf3f11f6fa122f',
          },
          {
            fullName: 'Leonard Hettinger',
            email: 'leonard@example.com',
            lastSeen: new Date(Date.now() - Math.random() * 9999000),
            signedUp: new Date(Date.now() - Math.random() * 864000000),
          },
          {
            fullName: 'Lula Jaskolski',
            email: 'lula@example.com',
            lastSeen: new Date(Date.now() - Math.random() * 9999000),
            signedUp: new Date(Date.now() - Math.random() * 864000000),
            avatar: 'https://images.unsplash.com/photo-1498529605908-f357a9af7bf5?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=047fade70e80ebb22ac8f09c04872c40',
          },
        ],
      columnDefs:
      [
        {
          name: 'avatar',
          field: 'avatar',
          width: 40,
          visible: true,
          operators: [
            {
              name: 'has avatar',
              id: 'isset'
            },
            {
              name: 'without avatar',
              id: 'empty'
            },
          ],
        },
        {
          name: 'user', // name is not supposed to be localizable
          title: 'User', // title can be localized
          field: 'fullName',
          visible: true,
          operators: operatorsText,
        },
        {
          name: 'email',
          title: 'Email',
          field: 'email',
          icon: markRaw(IconUser), // otherwise Vue tries to make it reactive and complains with a warning
          visible: true,
          operators: operatorsText,
        },
        {
          name: 'lastSeen',
          title: 'Last seen',
          field: 'lastSeen',
          icon: markRaw(IconUser),
          visible: true,
          operators: operatorsDate,
        },
        {
          name: 'signedUp',
          title: 'Signed Up',
          field: 'signedUp',
          icon: markRaw(IconUser),
          formatter: this.formatTimePeriod,
          visible: true,
          operators: operatorsDate,
        },
      ],
      selected: [],
      sortBy: '',
      sortDesc: false,
      search: '',
      filters: null,
    };
  },
  computed:
    {
      currentNow()
      {
        // without this flag flipping Vue will not update the cached value of our computed property - and thus the temporal distances in LastSeen column will not be updated as time goes on
        if (this.updateNow) return new Date(); // we just need to make the computed property dependable on the flag - when the flag flips, the computed property will be recalculated
        return new Date();
      },
      totalRows()
      {
        return Math.round(960 * Math.random()) + 42;
      },
      /**
       * This is just for demonstration purpose - sorting and filtration should be done on the server
       * @returns {Array}
       */
      filteredRows()
      {
        const term = (this.search || '').toLowerCase();
        const cols = this.columnDefs.filter(col => col.visible).map(col => col.field);
        return this.rows.filter(obj => cols.some(fieldName => String(obj[fieldName]).toLowerCase().indexOf(term) !== -1));
      },
      sortedRows()
      {
        if (!this.sortBy) return this.filteredRows;
        const sortBy = this.columnDefs.find(col => col.name === this.sortBy).field;
        const descending = this.sortDesc ? -1 : +1;
        return this.filteredRows.slice().sort((a, b) => strCompare(a[sortBy], b[sortBy]) * descending);
      },
    },
  created()
  {
    this.timer = setInterval(() =>
    {
      // trigger recalculation of the computed property "currentNow"
      this.updateNow = !this.updateNow;
    }, 1000);
  },
  beforeUnmount()
  {
    if (this.timer) clearInterval(this.timer);
  },
  methods:
    {
      dateFormat,
      rowClicked(row, column)
      {
        console.log(row, column);
      },
      /**
       * Refresh button was clicked
       */
      reloadData()
      {
        this.loading = true;
        setTimeout(() =>
        {
          this.loading = false;
        }, 2500);
      },
      /**
       * Formats date-time value into human readable string as a temporal distance in the past from current points in time
       * @param date {Date}
       * @param absolute {Boolean} - whether to show the date value after the temporal distance
       * @returns {string}
       */
      formatTimePeriod(date, absolute)
      {
        date = typeof date === 'string' ? parseISO(date) : date;
        if (!date || isNaN(date.valueOf()))
        {
          return 'Never';
        }
        const now = this.currentNow;
        const diff = Math.abs(differenceInSeconds(date, now));
        if (diff < 60)
        {
          return 'Just now';
        }
        else if (diff < 60 * 60 * 24 || !absolute)
        {
          return formatDistanceStrict(date, now, { addSuffix: true });
        }
        else
        {
          return formatDistanceStrict(date, now, { addSuffix: true }) + ' - ' + dateFormat(date, 'PP');
        }
      },
      exportRows(allColumns)
      {
        //
      },
    }
};
</script>

<style>
@import url("https://p.typekit.net/p.css?s=1&k=rak3tdq&ht=tk&f=8474.8476.8478.8480&a=13523315&app=typekit&e=css");

@font-face
{
  font-family: faricy-new-web;
  src:
    url("https://use.typekit.net/af/106faa/00000000000000003b9afac0/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"),
    url("https://use.typekit.net/af/106faa/00000000000000003b9afac0/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"),
    url("https://use.typekit.net/af/106faa/00000000000000003b9afac0/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
  font-display: auto;
  font-style: normal;
  font-weight: 700;
  font-stretch: normal;
}

@font-face
{
  font-family: faricy-new-web;
  src:
    url("https://use.typekit.net/af/7c73c2/00000000000000003b9afaba/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n3&v=3") format("woff2"),
    url("https://use.typekit.net/af/7c73c2/00000000000000003b9afaba/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n3&v=3") format("woff"),
    url("https://use.typekit.net/af/7c73c2/00000000000000003b9afaba/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n3&v=3") format("opentype");
  font-display: auto;
  font-style: normal;
  font-weight: 300;
  font-stretch: normal;
}

@font-face
{
  font-family: faricy-new-web;
  src:
    url("https://use.typekit.net/af/5b22f8/00000000000000003b9afabf/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n5&v=3") format("woff2"),
    url("https://use.typekit.net/af/5b22f8/00000000000000003b9afabf/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n5&v=3") format("woff"),
    url("https://use.typekit.net/af/5b22f8/00000000000000003b9afabf/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n5&v=3") format("opentype");
  font-display: auto;
  font-style: normal;
  font-weight: 500;
  font-stretch: normal;
}

@font-face
{
  font-family: faricy-new-web;
  src:
    url("https://use.typekit.net/af/bb5b9f/00000000000000003b9afabd/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3") format("woff2"),
    url("https://use.typekit.net/af/bb5b9f/00000000000000003b9afabd/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3") format("woff"),
    url("https://use.typekit.net/af/bb5b9f/00000000000000003b9afabd/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3") format("opentype");
  font-display: auto;
  font-style: normal;
  font-weight: 400;
  font-stretch: normal;
}

body
{
  font-family: faricy-new-web, sans-serif;
}
</style>
