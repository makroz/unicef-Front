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
            label='Puntos'
            v-model='item.puntos'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
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
            item-text='fecha_2'
            item-value='id'
            label='Solicitud_servicio'
            v-model='item.solicitud_servicio_id'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-select
            :items='lControl_calidades'
            item-text='name'
            item-value='id'
            label='Control_calidad'
            v-model='item.control_calidad_id'
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
  name: "Control_solicitudes",
  data() {
    return {
      //urlModulo: '',
      titModulo: "Control de Solicitudes",
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
          text: 'Puntos',
          value: 'puntos',
          align: 'right',
          
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
          text: 'Solicitud_servicio',
          value: 'solicitud_servicio_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lSolicitud_servicios,
        },
        {
          text: 'Control_calidad',
          value: 'control_calidad_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lControl_calidades,
        },
      ],
      lSolicitud_servicios: [],

      lControl_calidades: [],

    };
  },
  methods: {},
  async mounted() {
    this.lSolicitud_servicios = await this.getListaBackend('SolicitudServicios', 'id,fecha_2', 'solicitud_servicio_id')

    this.lControl_calidades = await this.getListaBackend('Control_calidades', 'id,name', 'control_calidad_id')

  },
};
</script>

<style lang="stylus"></style>
