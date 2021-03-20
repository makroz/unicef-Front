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
            :isExpanded="true"
          >
            <template slot="detalle" slot-scope="props">
              <v-card flat>
                <v-card-text> Descripcion: {{ props.item.obs }} </v-card-text>
              </v-card>
            </template>
          </mk-data-table>
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
            :readonly="accion == 'show'"
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
            :readonly="accion == 'show'"
          ></v-select>
          <v-select
            v-model="item.usuarios_id"
            :items="lUsuarios"
            :rules="[rules.required]"
            item-text="name"
            item-value="id"
            label="Monitor Asignado"
            :readonly="accion == 'show'"
          ></v-select>
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
          width: '50px',
          headers: true,
          type: 'num',
          search: true,
        },
        {
          text: 'Fecha',
          value: 'created_at',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'date',
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
          headers: false,
          type: 'text',
          search: true,
        },

        {
          text: 'Beneficiarios',
          value: 'beneficiarios',
          width: '10px',
          headers: false,
          type: 'count',
          search: false,
          fromLista: {
            lista: 'rutas_id',
            field: 'beneficiarios',
            join: 'rutas_id',
          },
        },
        {
          text: 'Evaluaciones',
          value: 'evaluaciones',
          width: '10px',
          headers: false,
          type: 'count',
          search: false,
        },
        {
          text: 'Benef./Eval.',
          value: 'benefEval',
          width: '50px',
          headers: true,
          type: 'concat',
          concat: ['beneficiarios', 'evaluaciones'],
          separator: '/',
          search: false,
        },

        {
          text: 'Estado',
          value: 'estado',
          width: '50px',
          headers: true,
          type: 'num',
          search: true,
          lista: 'lEstados',
          lColor: 'lColor',
        },
      ],
      lUsuarios: [],
      lEstados: ['Abierto', 'En progreso', 'Cerrado', 'Verificado'],
      lColor: [
        'red--text',
        'green--text text--lighten-3',
        'green--text text--lighten-1',
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
        // data.lat = ''
        // data.lng = ''
        data.usuarios_id = null
      } else {
        // let coord=data.gps_open.split(' ')
        // data.lat = coord[0]
        // data.lng = coord[1]
      }

      // me.lBeneficiarios = await me.getListaBackend(
      //   'Rutas/beneficiarios/' + data.id,
      //   ''
      // )
    },
  },

  async mounted() {
    let edit = this.getOptionTable('edit')
    edit.color = 'black'
    edit.visibleRow = function (e) {
      console.log('visiblerow:', e.evaluaciones.length)
      return e.estado > 1 || e.evaluaciones.length>0 ? false : true
    }

    let del = this.getOptionTable('del')
    del.visibleRow = edit.visibleRow 
    let sel = this.getOptionTable('sel')
    sel.visibleRow = edit.visibleRow 

    this.lUsuarios = await this.getListaBackend('monitores', '', 'usuarios_id')
    this.lRutas = await this.getListaBackend(
      'Rutas',
      'id,name,usuarios_id',
      'rutas_id'
    )
  },
}
</script>
<style scoped>
</style>
