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
          <v-text-field
            type='number'
            label='Tipo'
            v-model='item.tipo'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            type='number'
            label='Cant'
            v-model='item.cant'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            label='Observaciones'
            v-model='item.obs'
            
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-select
            :items='lMovimientos'
            item-text='name'
            item-value='id'
            label='Movimiento'
            v-model='item.movimiento_id'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-select
            :items='lMateriales'
            item-text='name'
            item-value='id'
            label='Material'
            v-model='item.material_id'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
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
  name: "Mov_det",
  data() {
    return {
      //urlModulo: '',
      titModulo: "Detalles del Movimiento",
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
          text: 'Tipo',
          value: 'tipo',
          align: 'right',
          
          headers: true,
          type: 'num',
          search: true,
          
        },
        {
          text: 'Cant',
          value: 'cant',
          align: 'right',
          
          headers: true,
          type: 'num',
          search: true,
          
        },
        {
          text: 'Observaciones',
          value: 'obs',
          align: 'left',
          
          headers: true,
          type: 'text',
          search: true,
          
        },
        {
          text: 'Movimiento',
          value: 'movimiento_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lMovimientos,
        },
        {
          text: 'Material',
          value: 'material_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lMateriales,
        },
      ],
      lMovimientos: [],
      lMateriales: [],
    };
  },
  methods: {},
  async mounted() {
          let listas = await this.getDatasBackend(this.urlModulo, [
                {mod: 'Movimientos',campos: 'id,name',datos: { modulo: 'mkAlmacenes' },item: 'movimiento_id'},
                {mod: 'Materiales',campos: 'id,name',datos: { modulo: 'mkServicios' },item: 'material_id'},
          ])
  },
};
</script>

<style lang="stylus"></style>
