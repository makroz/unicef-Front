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
          <v-text-field
            label="Dirección"
            v-model="item.dir"
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-layout row wrap>
          <v-flex sm6>
            <v-text-field
              label="Documento de Identidad"
              v-model="item.ci"
              :rules="[rules.required]"
              validate-on-blur
              :readonly="accion == 'show'"
            >
            </v-text-field>
          </v-flex>
          <v-flex sm6>
            <mk-date
              v-model="item.fec_nac"
              label="Fecha Nacimiento"
              :readonly="accion == 'show'"
            >
            </mk-date>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
        <v-flex sm6>
          <v-text-field
            label="Teléfono"
            v-model="item.tel"
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex sm6>
          <v-select
            :items="lLic"
            item-text="name"
            item-value="id"
            label="Licencia"
            v-model="item.lic"
            :rules="[rules.required]"
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
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'

export default {
  middleware: ['authAccess'],
  mixins: [MkModuloMix],
  name: 'Choferes',
  data() {
    return {
      //urlModulo: '',
      titModulo: 'Choferes',
      campos: [
        {
          text: 'Id',
          value: 'id',
          align: 'right',
          width: '100px',
          headers: true,
          type: 'num',
          search: true
        },
        {
          text: 'Nombre',
          value: 'name',
          align: 'left',
          headers: true,
          type: 'text',
          search: true
        },
        {
          text: 'Ci',
          value: 'ci',
          align: 'left',
          headers: true,
          type: 'text',
          search: true
        },
        {
          text: 'Dirección',
          value: 'dir',
          align: 'left',
          headers: true,
          type: 'text',
          search: true
        },
        {
          text: 'Teléfono',
          value: 'tel',
          align: 'left',
          headers: true,
          type: 'text',
          search: true
        },
        {
          text: 'Licencia',
          value: 'lic',
          align: 'left',
          headers: true,
          type: 'num',
          search: true,
          lista: 'lLic'
        },
        {
          text: 'Fecha Nac.',
          value: 'fec_nac',
          align: 'center',
          headers: true,
          type: 'date',
          search: true
        }
      ],
      lLic: [
        { id: 'P', name: 'Particular' },
        { id: 'A', name: 'Categ. A' },
        { id: 'B', name: 'Categ. B' },
        { id: 'C', name: 'Categ. C' }
      ]
    }
  },
  methods: {},
  async mounted() {}
}
</script>

<style lang="stylus"></style>
