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
      <v-layout row wrap>
        <v-flex sm10>
          <v-text-field
            label='Nombre'
            v-model='item.name'
            :rules='[rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex sm2>
          <v-text-field
            type='number'
            label='Orden'
            v-model='item.orden'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
      </v-layout>
        <v-layout row wrap>
        <v-flex xs6>
        <v-select
          :items='lTipo'
          item-text='name'
          item-value='id'
          label='Tipo'
          v-model='item.tipo'
          :rules='[rules.required]'
          validate-on-blur
          :readonly="accion == 'show'"
        >
        </v-select>
        </v-flex>
        <v-flex sm6>
          <v-select
            :items='lCheck_categ'
            item-text='name'
            item-value='id'
            label='Categoría'
            v-model='item.categ_id'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        </v-layout>
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from "@/components/mkComponentes/mixins/MkModuloMix";

export default {
  middleware: ["authAccess"],
  mixins: [MkModuloMix],
  name: "Checks",
  data() {
    return {
      //urlModulo: '',
      titModulo: "Checks",
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
          text: 'Tipo',
          value: 'tipo',
          align: 'left',
          width: '150px',
          headers: true,
          type: 'num',
          search: true,
          lista: 'lTipo',
        },
        {
          text: 'Categoría',
          value: 'categ_id',
          align: 'left',
          width: '200px',
          headers: true,
          type: 'num',
          search: true,
          lista: 'lCheck_categ',
        },
        {
          text: 'Orden',
          value: 'orden',
          align: 'right',
          width: '40px',
          headers: true,
          type: 'num',
          search: true,
        },
      ],
      lCheck_categ: [],
      lTipo: [
          { id: 'c', name: 'Check' },
          { id: 'n', name: 'Numero' },
          { id: 't', name: 'Texto' },
          { id: 's', name: 'Si/No' },
        ],
    };
  },
  methods: {
    
  },
  async mounted() {
          let listas = await this.getDatasBackend(this.urlModulo, [
                {mod: 'Check_categ',campos: 'id,name,orden',datos: { modulo: 'mkRecolector' },item: 'categ_id', sort: 'orden'},
          ])
  },
};
</script>

<style lang="stylus"></style>
