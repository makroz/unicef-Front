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
          <v-flex grow>
            <v-text-field
              label="Nombre"
              v-model="item.name"
              :rules="[rules.required]"
              ref="focus"
              validate-on-blur
              autofocus
              :readonly="accion == 'show'"
            ></v-text-field>
          </v-flex>
          <v-flex shrink>
            <v-switch
              v-model="item.cant"
              label="Admite Cantidades"
              value="1"
              color="success"
            ></v-switch>
          </v-flex>
        </v-layout>
        <v-text-field
          label="Observacion"
          v-model="item.obs"
          :readonly="accion == 'show'"
        ></v-text-field>
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'

export default {
  middleware: ['authAccess'],

  mixins: [MkModuloMix],
  name: 'Servicios',
  data() {
    return {
      //urlModulo: '',
      //titModulo: '',
      campos: [
        {
          text: 'Id',
          value: 'id',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'num',
          search: true
        },
        {
          text: 'Nombre',
          value: 'name',
          width: '150px',
          headers: true,
          type: 'text',
          search: true
        },
        {
          text: 'Cant',
          value: 'cant',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'check',
          options: [1, 'Si', 'No'],
          search: true
        },
        {
          text: 'Observacion',
          value: 'obs',
          align: 'left',
          headers: true,
          type: 'text',
          search: true
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="stylus"></style>
