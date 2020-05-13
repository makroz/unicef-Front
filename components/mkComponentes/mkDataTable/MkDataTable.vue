<template>
  <v-card>
    <mk-table-head
      @openDialog="openDialog"
      @deleteItem="deleteItem"
      @busqueda:avanzada="onBuscar"
      :sel="lista.selected"
      :busquedas="busquedas"
      :headers="campos"
      @column:change="onColChange"
    ></mk-table-head>
    <v-divider></v-divider>
    <v-card-text class="pa-0">
      <v-data-table
        :headers="campos"
        :items="lista.items"
        :class="[loading?'loading':'','elevation-1']"
        item-key="id"
        select-all
        v-model="lista.selected"
        :loading="loading"
        :server-items-length="paginator.total"
        @update:pagination="listar"
        hide-actions
        :pagination.sync="paginator.options"
      >
        <template slot="headers" slot-scope="props">
          <tr>
            <th>
              <v-checkbox
                :input-value="props.all"
                :indeterminate="props.indeterminate"
                primary
                hide-details
                @click.stop="toggleAll"
              ></v-checkbox>
            </th>
            <template v-for="header in props.headers">
              <th
                v-if="header.headers && !header.hidden"
                :key="header.value"
                :class="['column', header.sortable !==false? 'sortable' : '', header.align?'text-xs-'+header.align:'text-xs-left', paginator.options.descending ? 'desc' : 'asc', header.value === paginator.options.sortBy ? 'active' : '']"
                @click="changeSort(header.value,!(header.sortable===false))"
                :style="'width:'+header.width?header.width:null"
             >
                {{ header.text }} <v-icon  v-if="header.sortable!==false" small>arrow_upward</v-icon></th>

            </template>
            <th
                key="__st__"
                :class="['column', 'text-xs-center']"
                :style="'width:50px'"
             >
                Status</th>
            <th  v-if="(can('edit') || can('del'))"
                key="__act__"
                :class="['column', 'text-xs-center']"
                :style="'width:165px'"
             >
                Acciones</th>
          </tr>
        </template>

        <template slot="items" slot-scope="props">
          <mk-table-row
            :datos="props"
            :headers="campos"
            @openDialog="openDialog"
            @deleteItem="deleteItem"
            @onStatus="setStatus"
          ></mk-table-row>
        </template>
      </v-data-table>
    </v-card-text>
    <mk-paginator :paginator="paginator" @input="listar" @change="onPerPageChange"></mk-paginator>
  </v-card>
</template>
<script>
import MkTableHead from '@/components/mkComponentes/MkDataTable/MkTableHead'
import MkTableRow from '@/components/mkComponentes/MkDataTable/MkTableRow'
import MkPaginator from '@/components/mkComponentes/MkDataTable/MkPaginator'

export default {
  name: 'MkDataTable',
  components: {
    MkTableHead,
    MkTableRow,
    MkPaginator
  },

  props: [
    'lista',
    'busquedas',
    'campos',
    'loading',
    'paginator'
  ],
  data() {
    return {}
  },
   inject: ['Auth','can'],
  methods: {
    toggleAll() {
      if (this.lista.selected.length) this.lista.selected = []
      else this.lista.selected = this.lista.items.slice()
    },
    changeSort(column, sortable = false) {
      if (!sortable) {
        return false
      }

      if (this.paginator.options.sortBy === column) {
        this.paginator.options.descending = !this.paginator.options.descending
      } else {
        this.paginator.options.sortBy = column
        this.paginator.options.descending = false
      }
      this.listar()
    },
    onBuscar(datos, quitarbuscar = false) {
      this.$emit('onBuscar', datos, quitarbuscar)
    },
    deleteItem(id, restore = false) {
      this.$emit('deleteItem', id, restore)
    },
    openDialog(accion, data = {}) {
      this.$emit('openDialog', accion, data)
    },
    setStatus(id, newStatus) {
      this.$emit('setStatus', id, newStatus)
    },
    listar(d, quitarbuscar = false) {
      this.$emit('listar', d, quitarbuscar)
    },
    onPerPageChange(page) {
      this.$emit('onPerPageChange', page)
    },
    onColChange(headers,visible=false) {
      this.$emit('column:change', headers,visible);
    }

  }
}
</script>
<style >
 .loading table > tbody{

    color:rgb(195, 195, 195);
  }
</style>
