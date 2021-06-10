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
      <mk-date
      v-model='item.fecha'
      label='Fecha'
      :rules='[rules.required]'
      :accion='accion'
      >
      </mk-date>
        </v-flex>
        <v-flex>
          <v-text-field
            type='number'
            label='Km_salida'
            v-model='item.km_salida'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            type='number'
            label='Km_refreso'
            v-model='item.km_refreso'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
      <v-textarea
        label='Obs'
        v-model='item.obs'
        
        validate-on-blur
        rows='2'
        :readonly="accion == 'show'"
      >
      </v-textarea>
        </v-flex>
        <v-flex>
          <v-select
            :items='lUsuarios'
            item-text='name'
            item-value='id'
            label='Recolector'
            v-model='item.recolector_id'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-select
            :items='lVehiculos'
            item-text='placa'
            item-value='id'
            label='Vehiculo'
            v-model='item.vehiculo_id'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-select
            :items='lChoferes'
            item-text='name'
            item-value='id'
            label='Chofer'
            v-model='item.chofer_id'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-select
            :items='lUsuarios'
            item-text='name'
            item-value='id'
            label='Verifico Salida'
            v-model='item.salida_id'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-select
            :items='lUsuarios'
            item-text='name'
            item-value='id'
            label='Verifico Llegada'
            v-model='item.llegada_id'
            :rules='[rules.num,rules.required]'
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
  name: "Check_diarios",
  data() {
    return {
      //urlModulo: '',
      titModulo: "Checks Diarios",
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
          value: 'fecha',
          align: 'center',
          
          headers: true,
          type: 'date',
          search: true,
          
          
        },
        {
          text: 'Salida',
          value: 'salida',
          align: 'center',
          
          headers: true,
          type: 'time',
          search: true,
          
          
        },
        {
          text: 'Regreso',
          value: 'regreso',
          align: 'center',
          
          headers: true,
          type: 'time',
          search: true,
          
          
        },
        {
          text: 'Km_salida',
          value: 'km_salida',
          align: 'right',
          
          headers: true,
          type: 'num',
          search: true,
          
          
        },
        {
          text: 'Km_refreso',
          value: 'km_refreso',
          align: 'right',
          
          headers: true,
          type: 'num',
          search: true,
          
          
        },
        {
          text: 'Recolector',
          value: 'recolector_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          
          lista: 'lUsuarios',
        },
        {
          text: 'Vehiculo',
          value: 'vehiculo_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          
          lista: 'lVehiculos',
        },
        {
          text: 'Chofer',
          value: 'chofer_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          
          lista: 'lChoferes',
        },
        {
          text: 'Verif.Salida',
          value: 'salida_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          
          lista: 'lUsuarios',
        },
        {
          text: 'Verif.Llegada',
          value: 'llegada_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          
          lista: 'lUsuarios',
        },
      ],
      lUsuarios: [],
      lVehiculos: [],
      lChoferes: [],
      lUsuarios: [],
      lUsuarios: [],
    };
  },
  methods: {},
  async mounted() {
          let listas = await this.getDatasBackend(this.urlModulo, [
                {mod: 'Usuarios',campos: 'id,name',datos: { modulo: 'mkUsuarios' },item: 'recolector_id'},
                {mod: 'Vehiculos',campos: 'id,placa',datos: { modulo: 'mkRecolector' },item: 'vehiculo_id'},
                {mod: 'Choferes',campos: 'id,name',datos: { modulo: 'mkRecolector' },item: 'chofer_id'},
                {mod: 'Usuarios',campos: 'id,name',datos: { modulo: 'mkUsuarios' },item: 'salida_id'},
                {mod: 'Usuarios',campos: 'id,name',datos: { modulo: 'mkUsuarios' },item: 'llegada_id'},
          ])
  },
};
</script>

<style lang="stylus"></style>
