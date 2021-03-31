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
        <v-container grid-list-md fluid>
          <v-text-field
            label="Descripcion"
            v-model="item.obs"
            ref="focus"
          :readonly="accion=='show'" ></v-text-field>
          <v-select
            v-model="item.rutas_id"
            :items="lRutas"
            :rules="[rules.required]"
            item-text="name"
            item-value="id"
            label="Ruta Asignada"
            @change="change"
          :readonly="accion=='show'" 
></v-select>
          <v-select
            v-model="item.usuarios_id"
            :items="lUsuarios"
            :rules="[rules.required]"
            item-text="name"
            item-value="id"
            label="Monitor Asignado"
          :readonly="accion=='show'" 
></v-select>
          <v-text-field
            label="Latitud"
            v-model="item.lat"
            disabled
          :readonly="accion=='show'" ></v-text-field>
          <v-text-field
            label="longitud"
            v-model="item.lng"
            disabled
          :readonly="accion=='show'" ></v-text-field>
        </v-container>
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'

export default {
  //middleware: ['authAccess'],
  mixins: [MkModuloMix],
  components: {},
  name: 'Evaluaciones',
  data() {
    return {
      //urlModulo: '',
      //titModulo: '',
      tabs: 0,
      campos: [
        {
          text: 'Id',
          value: 'id',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'num',
          search: true,
        },
        {
          text: 'Ruta',
          value: 'ruteos.rutas_id',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'num',
          search: true,
          lista: 'lRutas',
        },
        {
          text: 'Ruteo',
          value: 'ruteos_id',
          align: 'left',
          width: '50px',
          headers: true,
          type: 'num',
          search: true,
        },
        {
          text: 'Monitor',
          value: 'usuarios_id',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'num',
          search: true,
          lista: 'lUsuarios',
        },
        {
          text: 'Descripcion',
          value: 'obs',
          headers: true,
          type: 'text',
          search: true,
        },

        {
          text: 'Beneficiario',
          value: 'beneficiario.name',
          sortBy: 'beneficiarios.name',
          width: '100px',
          headers: true,
          type: 'text',
          search: true,
          lista: 'lBeneficiarios',
        },
        {
          text: 'Estado',
          value: 'estado',
          width: '100px',
          headers: true,
          type: 'num',
          search: true,
          lista: 'lEstados',
          lColor: 'lColor',
        },
      ],
      lUsuarios: [],
      lEstados: [
        'Pendiente',
        'Terminado',
        'No se Realizo',
        'Cerrado',
      ],
      lColor: [
        'grey--text',
        'green--text text--lighten-3',
        'red--text text--lighten-1',
        'green--text',
      ],
      lRutas: [],

    }
  },
  methods: {
    change(e) {
      this.item.usuarios_id = this.lRutas.find((el) => el.id === e).usuarios_id
    },
    getPosition() {
      let options = {
        enableHighAccuracy: true,
        timeout: 6000,
        maximumAge: 0,
      }

      navigator.geolocation.getCurrentPosition(
        this.successGps,
        this.errorGps,
        options
      )
    },
    successGps(position) {
      var coordenadas = position.coords
      this.item.lat = coordenadas.latitude
      this.item.lng = coordenadas.longitude
      //console.log('Tu posición actual es:')
      //console.log(position)
    },

    errorGps(error) {
      console.warn('ERROR(' + error.code + '): ' + error.message)
    },

    beforeOpen(accion, data = {}) {
      let me = this
      if (accion == 'add') {
        this.getPosition()
        data.lng = ''
        data.lng = ''
        data.usuarios_id = null
      }

      // me.lBeneficiarios = await me.getListaBackend(
      //   'Rutas/beneficiarios/' + data.id,
      //   ''
      // )
    },
  },

  async mounted() {
    this.setOptionTable('add').visible=false;
    this.lUsuarios = await this.getListaBackend('monitores', '','usuarios_id')
//    this.lRuteos = await this.getListaBackend('Ruteos', '','ruteos_id')
//    this.lBeneficiarios = await this.getListaBackend('Beneficiarios', '','beneficiarios_id')
    this.lRutas = await this.getListaBackend(
      'Rutas',
      'id,name',
      'ruteos.rutas_id'
    )
    
  },
}
</script>
<style scoped>
</style>
