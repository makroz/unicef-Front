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
            label='Nombre'
            v-model='item.name'
            :rules='[rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-select
            :items='lMedidas'
            item-text='name'
            item-value='id'
            label='Medida'
            v-model='item.medida_id'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-text-field
            type='number'
            label='Stock'
            v-model='item.stock'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            type='number'
            label='Stock Mínimo'
            v-model='item.min_stock'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            type='number'
            label='Costo'
            v-model='item.costo'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            type='number'
            label='Precio'
            v-model='item.precio'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
      <v-checkbox
        v-model='item.lnota'
        value='1'
        label='Listado en Orden de Solicitud'
        :readonly="accion == 'show'"
      >
      </v-checkbox>
        </v-flex>
        <v-flex>
          <v-select
            :items='lMat_categ'
            item-text='name'
            item-value='id'
            label='Categoría'
            v-model='item.mat_categ_id'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-select
            :items='lUbicaciones'
            item-text='name'
            item-value='id'
            label='Ubicación en Almacén'
            v-model='item.ubicacion_id'
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
  name: "Materiales",
  data() {
    return {
      //urlModulo: '',
      titModulo: "Materiales",
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
          text: 'Nombre',
          value: 'name',
          align: 'left',
          
          headers: true,
          type: 'text',
          search: true,
          
        },
        {
          text: 'Medida',
          value: 'medida_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lMedidas,
        },
        {
          text: 'Stock',
          value: 'stock',
          align: 'right',
          
          headers: true,
          type: 'num',
          search: true,
          
        },
        {
          text: 'Stock Mínimo',
          value: 'min_stock',
          align: 'right',
          
          headers: true,
          type: 'num',
          search: true,
          
        },
        {
          text: 'Costo',
          value: 'costo',
          align: 'right',
          
          headers: true,
          type: 'num',
          search: true,
          
        },
        {
          text: 'Precio',
          value: 'precio',
          align: 'right',
          
          headers: true,
          type: 'num',
          search: true,
          
        },
        {
          text: 'List.Ord.Sol.',
          value: 'lnota',
          align: 'left',
          
          headers: true,
          type: 'check',
          search: true,
          options: [1, 'Si', 'No'],
          
        },
        {
          text: 'Categoría',
          value: 'mat_categ_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lMat_categ,
        },
        {
          text: 'Ubicación',
          value: 'ubicacion_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lUbicaciones,
        },
      ],
      lMedidas: [],
      lMat_categ: [],
      lUbicaciones: [],
      lSiNo: [{id:'0',value:'No'},{id:'1',value:'Si'}],
    };
  },
  methods: {},
  async mounted() {
          let listas = await this.getDatasBackend(this.urlModulo, [
                {mod: 'Medidas',campos: 'id,name',datos: { modulo: 'mkServicios' },item: 'medida_id'},
                {mod: 'Mat_categ',campos: 'id,name',datos: { modulo: 'mkAlmacenes' },item: 'mat_categ_id'},
                {mod: 'Ubicaciones',campos: 'id,name',datos: { modulo: 'mkAlmacenes' },item: 'ubicacion_id'},
          ])
  },
};
</script>

<style lang="stylus"></style>
