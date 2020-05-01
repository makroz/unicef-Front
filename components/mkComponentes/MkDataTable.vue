<template>
  <v-card>
    <mk-table-head
      @openDialog="openDialog"
      @deleteItem="deleteItem"
      @busqueda:avanzada="onBuscar"
      :sel="lista.selected"
      :busquedas="busquedas"
      :campos="search_campos"
      :headers="headers"
      @column:change="onColChange"
    ></mk-table-head>
    <v-divider></v-divider>
    <v-card-text class="pa-0">
      <v-data-table
        :headers="headers"
        :items="lista.items"
        class="elevation-1"
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
                v-if="header.visible"
                :key="header.value"
                :class="['column', header.sortable ? 'sortable' : '', 'text-xs-'+header.align, paginator.options.descending ? 'desc' : 'asc', header.value === paginator.options.sortBy ? 'active' : '']"
                @click="changeSort(header.value,header.sortable)"
                :width="header.width?header.width:'100%'"
              >
                <v-icon v-if="header.sortable" small>arrow_upward</v-icon>
                {{ header.text }}
              </th>
            </template>
          </tr>
        </template>

        <template slot="items" slot-scope="props">
          <mk-table-row
            :datos="props"
            :headers="headers"
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
import MkTableHead from '@/components/mkComponentes/MkTableHead'
import MkTableRow from '@/components/mkComponentes/MkTableRow'
import MkPaginator from '@/components/mkComponentes/MkPaginator'

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
    'search_campos',
    'headers',
    'loading',
    'paginator'
  ],
  data() {
    return {}
  },
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
    onColChange(headers) {
      this.$emit('column:change', headers);
    }

  }
}
</script>
