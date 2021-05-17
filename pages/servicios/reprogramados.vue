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
            label='Obs'
            v-model='item.obs'
            :rules='[rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-select
            :items='lSolicitud_servicios'
            item-text='obs'
            item-value='id'
            label='Solicitud de servicio'
            v-model='item.solicitud_servicio_id'
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
            label='Recolector'
            v-model='item.recolector_id'
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
  name: "Reprogramados",
  data() {
    return {
      //urlModulo: '',
      titModulo: "Reprogramados",
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
          text: 'Obs',
          value: 'obs',
          align: 'left',
          
          headers: true,
          type: 'text',
          search: true,
          
        },
        {
          text: 'Solicitud de servicio',
          value: 'solicitud_servicio_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lSolicitud_servicios,
        },
        {
          text: 'Recolector',
          value: 'recolector_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lUsuarios,
        },
      ],
      lSolicitud_servicios: [],

      lUsuarios: [],

    };
  },
  methods: {},
  async mounted() {
    this.lSolicitud_servicios = await this.getListaBackend('SolicitudServicios', 'id,obs', 'solicitud_servicio_id')

    this.lUsuarios = await this.getListaBackend('Usuarios', 'id,name', 'recolector_id')

  },
};
</script>

<style lang="stylus"></style>
