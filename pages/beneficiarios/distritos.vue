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
            :items='lMunicipios'
            item-text='name'
            item-value='id'
            label='Municipio'
            v-model='item.municipio_id'
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
  name: "Distritos",
  data() {
    return {
      //urlModulo: '',
      titModulo: "Distritos",
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
          text: 'Municipio',
          value: 'municipio_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lMunicipios,
        },
      ],
      lMunicipios: [],

    };
  },
  methods: {},
  async mounted() {
    this.lMunicipios = await this.getListaBackend('Municipios', 'id,name', 'municipio_id')

  },
};
</script>

<style lang="stylus"></style>
