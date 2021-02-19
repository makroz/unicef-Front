<template>
  <v-card>
    <mk-table-head
      @callAction="callAction"
      @busqueda:avanzada="onBuscar"
      :sel="lista.selected"
      :busquedas="busquedas"
      :headers="campos"
      @column:change="onColChange"
      :acciones="acciones"
    ></mk-table-head>
    <v-divider></v-divider>
    <v-card-text class="pa-0">
      <v-data-table
        :headers="campos"
        :items="lista.items"
        :headers-length="campos.length+3"
        :class="['elevation-1']"
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
            <th 
                style="width:50px;padding:0 12px">
              <v-checkbox
                
                :input-value="props.all"
                :indeterminate="props.indeterminate"
                primary
                hide-details
                @click.stop="toggleAll"
              ></v-checkbox>
            </th>
            <th  v-if="(!$store.state.config.tbl_opts_p)&&((can('edit') || can('del')))"
                key="__act__"
                :class="['column', 'text-xs-center','pa-0','ma-0']"
                style="width:52px;padding:0 12px"
             >
                Acc</th>
            <template v-for="header in props.headers">
              <th
                v-if="header.headers && !header.hidden"
                :key="header.value"
                :class="['column', header.sortable !==false? 'sortable' : '', header.align?'text-xs-'+header.align:'text-xs-left', paginator.options.descending ? 'desc' : 'asc', header.value === paginator.options.sortBy ? 'active' : '']"
                @click="changeSort(header.value,!(header.sortable===false))"
                :style="header.width?'width:'+header.width+';padding:0 12px;':'padding:0 12px;'"
             >
                {{ header.text }} <v-icon  v-if="header.sortable!==false" small>arrow_upward</v-icon></th>

            </template>
            <th
                key="__st__"
                :class="['column', 'text-xs-center','pa-0','ma-0']"
                style="width:50px;padding:0 12px"
             >
                Status</th>
            <th  v-if="($store.state.config.tbl_opts_p)&&((can('edit') || can('del')))"
                key="__act__"
                :class="['column', 'text-xs-center','pa-0','ma-0']"
                style="width:52px;padding:0 12px"
             >
                Acc</th>
          </tr>
        </template>

        <template slot="items" slot-scope="props">
          <mk-table-row
            :datos="props"
            :acciones="acciones"
            :headers="campos"
            @callAction="callAction"
            @onStatus="setStatus"
            :isExpanded="isExpanded"
          ></mk-table-row>
        </template>
        
        <template  v-if="isExpanded" slot="expand"  slot-scope="props" >
          <slot name="detalle" v-bind:item="props.item" >....</slot>
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
    'paginator',
    'acciones',
    'isExpanded'
  ],
  data() {
    return {
     // expand:false,

    }
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
    callAction(opt, item) {
      //console.log('callAction DataTable',opt,item);
      this.$emit('callAction', opt, item)
      //this.$emit(opt.action, opt.id,item)
    },
    deleteItem(action,item) {
      this.$emit('deleteItem',action, item)
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

  },
  mounted() {
    // this.expand=true
    // console.log(this);
  },
}
</script>
<style >
 .loading table > tbody{

    color:rgb(195, 195, 195);
  }
</style>
