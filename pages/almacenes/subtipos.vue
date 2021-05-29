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
            label="Nombre"
            v-model="item.name"
            :rules="[rules.required]"
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-select
            :items="lTipos"
            item-text="name"
            item-value="id"
            label="Tipo de Movimiento"
            v-model="item.tipo"
            :rules="[rules.num, rules.required]"
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
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'

export default {
  middleware: ['authAccess'],
  mixins: [MkModuloMix],
  name: 'Subtipos',
  data() {
    return {
      //urlModulo: '',
      titModulo: 'Subtipos de Movimientos',
      campos: [
        {
          text: 'Id',
          value: 'id',
          align: 'right',
          width: '50px',
          headers: true,
          type: 'num',
          search: true,
        },
        {
          text: 'Tipo',
          value: 'tipo',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'num',
          search: true,
          lista: 'lTipos',
          lColor: 'lColor',
        },
        {
          text: 'Nombre',
          value: 'name',
          align: 'left',

          headers: true,
          type: 'text',
          search: true,
        },
      ],
      lTipos: [
        { id: 1, name: 'Ingresos' },
        { id: 2, name: 'Egresos' },
        { id: 3, name: 'Ajustes' },
      ],
      lColor: ['grey--text', 'green--text', 'red--text', 'orange--text'],
    }
  },
  methods: {},
  async mounted() {},
}
</script>

<style lang="stylus"></style>
