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
        :accion="item.id"
        @closeDialog="closeDialog"
        @grabarItem="grabarItem"
      >
        <v-container grid-list-md fluid>
          <v-text-field
            label="Descripcion"
            v-model="item.obs"
            ref="focus"
          ></v-text-field>
          <v-select
            v-model="item.rutas_id"
            :items="lRutas"
            :rules="[rules.required]"
            item-text="name"
            item-value="id"
            label="Ruta Asignada"
            @change="change"
          ></v-select>
          <v-select
            v-model="item.usuarios_id"
            :items="lUsuarios"
            :rules="[rules.required]"
            item-text="name"
            item-value="id"
            label="Monitor Asignado"
          ></v-select>
          <v-text-field
            label="Latitud"
            v-model="item.lat"
            disabled
          ></v-text-field>
          <v-text-field
            label="longitud"
            v-model="item.lng"
            disabled
          ></v-text-field>
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
  name: 'Ruteos',
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
          value: 'rutas_id',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'num',
          search: true,
          lista: 'lRutas',
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
          text: 'Beneficiarios',
          value: 'beneficiarios',
          width: '100px',
          headers: true,
          type: 'text',
          search: true,
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
        'Abierto',
        'En progreso',
        'Terminado',
        'Verificado',
        'Cerrado',
      ],
      lColor: [
        'red--text',
        'green--text text--lighten-3',
        'green--text text--lighten-1',
        'green--text',
        'green--text text--darken-4',
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
    this.lUsuarios = await this.getListaBackend('monitores', '','usuarios_id')
    this.lRutas = await this.getListaBackend(
      'Rutas',
      'id,name,usuarios_id',
      'rutas_id'
    )
    //this.setOptionTable('del').visible=false;
  },
}
</script>
<style scoped>
</style>
