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
        :accion="accion"
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

      <!-- formulario Show FullScreen -->
      <mk-form-full-screen
        ref="mkFormShow"
        :modal="modalShow"
        :tit="tituloModal"
        :accion="accion"
        @closeDialog="modalShow = false"
        @grabarItem="modalShow = false"
      >
        <v-container grid-list-md fluid v-if="accion == 'show'">
          <v-layout row>
            <v-flex> Ruta: {{ item.ruta.name }} </v-flex>
            <v-flex> Monitor: {{ item.monitor.name }} </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex>
              Abrio: {{ getDataLista(lUsuarios, item.open_id, 'id', 'name') }}
            </v-flex>
            <v-flex> Fecha Apertura: {{ formatDT(item.created_at) }} </v-flex>
            <v-flex>
              Cerro: {{ getDataLista(lUsuarios, item.close_id, 'id', 'name') }}
            </v-flex>
            <v-flex> Fecha Cerrado: {{ formatDT(item.fec_cerrado) }} </v-flex>
          </v-layout>
        </v-container>
      </mk-form-full-screen>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'
import MkFormFullScreen from '@/components/mkComponentes/MkFormFullScreen.vue'
import {
  getDataLista,
  formatDT,
} from '@/components/mkComponentes/lib/MkUtils.js'

export default {
  //middleware: ['authAccess'],
  mixins: [MkModuloMix],
  components: { MkFormFullScreen },
  name: 'Ruteos',
  data() {
    return {
      //urlModulo: '',
      //titModulo: '',
      modalShow: false,
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
    openShow(accion, data) {
      this.accion = accion
      this.item = Object.assign({}, data)
      this.item.ruta = getDataLista(this.lRutas, data.rutas_id, 'id', '*')
      this.item.monitor = getDataLista(
        this.lUsuarios,
        data.usuarios_id,
        'id',
        '*'
      )

      this.tituloModal = 'Ver ' + this.titModulo
      if (data.obs) {
        this.tituloModal = this.tituloModal + '|' + data.obs
      }
      this.modalShow = true
    },
    formatDT(d, time = true) {
      return formatDT(d, time)
    },
    getDataLista(lista, valor, busco = 'id', devuelvo = 'name') {
      return getDataLista(lista, valor, busco, devuelvo)
    },
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
      }
      // if (accion == 'show') {
      //   data.ruta = getDataLista(this.lRutas, data.rutas_id, 'id', '*')
      //   data.monitor = getDataLista(this.lUsuarios, data.usuarios_id, 'id', '*')
      // }
    },
    // afterOpen(accion, data = {}) {
    //   if (data.obs && accion != 'add') {
    //     this.tituloModal = this.tituloModal + '|' + data.obs
    //   }
    // },
  },

  async mounted() {
    let edit = this.getOptionTable('edit')
    edit.color = 'black'
    edit.visibleRow = function (e) {
      return e.estado > 1 || e.evaluaciones.length > 0 ? false : true
    }

    let del = this.getOptionTable('del')
    del.visibleRow = edit.visibleRow
    let sel = this.getOptionTable('sel')
    sel.visibleRow = edit.visibleRow
    let show = this.getOptionTable('show')
    show.action = 'openShow'

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
