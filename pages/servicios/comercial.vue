<template>
  <div id="pageTable">
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <mk-head :titulo="titModulo"></mk-head>
        <v-flex lg12>
          <mk-data-table
            v-bind="dataTable"
            :campos="campos"
            @callAction="callAction"
            @setStatus="setStatus"
            @listar="listar"
            @onPerPageChange="onPerPageChange"
            @column:change="onColChange"
            @onBuscar="onBuscar"
          ></mk-data-table>
        </v-flex>
      </v-layout>
      <mk-form
        ref="mkForm"
        :modal="modal"
        :tit="tituloModal"
        :accion="accion"
        @closeDialog="closeDialog"
        @grabarItem="grabarItem"
      >
        <v-flex>
          <v-select
            :items='lUsuarios'
            item-text='name'
            item-value='id'
            label='Exporto'
            v-model='item.created_by'
            
            validate-on-blur
            readonly
          >
          </v-select>
        </v-flex>
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from "@/components/mkComponentes/mixins/MkModuloMix";

export default {
  middleware: ["authAccess"],
  mixins: [MkModuloMix],
  name: "Comercial",
  data() {
    return {
      //urlModulo: '',
      titModulo: "Comercial",
      campos: [
        {
          text: 'Id',
          value: 'id',
          align: 'right',
          width: '100px',
          headers: true,
          type: 'num',
          search: true,
          
        },
        {
          text: 'Fecha',
          value: 'created_at',
          align: 'center',
          
          headers: true,
          type: 'datetime',
          search: true,
          
        },
        {
          text: 'Exporto',
          value: 'created_by',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lUsuarios,
        },
      ],
      lUsuarios: [],

    };
  },
  methods: {},
  async mounted() {
    this.setOptionTable('add').visible = false
    this.setOptionTable('edit').visible = false
    this.setOptionTable('del').visible = false
    this.setOptionTable('status').visible = false
    this.setOptionTable('restore').visible = false



    let listas = await this.getDatasBackend(this.urlModulo, [
      { mod: 'Usuarios', campos: 'id,name', item: 'created_by' },
    ])


  },
};
</script>

<style lang="stylus"></style>
