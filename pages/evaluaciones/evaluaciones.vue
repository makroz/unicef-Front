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
      <!-- formulario Evaluaciones FullScreen -->
      <mk-form-full-screen
        ref="mkForm"
        :modal="modal"
        :tit="tituloModal"
        :accion="accion"
        @closeDialog="modal = false"
        @grabarItem="modal = false"
      >
        <v-container grid-list-md fluid class="white">
          <span v-if="!estado" class="danger title"
            >No se realizó la Evaluación</span
          >
          <v-text-field
            v-if="item.obs"
            label="Notas de la Evaluacion"
            :value="item.obs"
            readonly
          ></v-text-field>

          <template v-if="estado && modal">
            <v-tabs centered color="indigo" dark icons-and-text>
              <v-tabs-slider color="yellow"></v-tabs-slider>

              <v-tab href="#tab-1" elevation-10>
                Encuesta
                <v-icon>content_paste</v-icon>
              </v-tab>

              <v-tab href="#tab-2" elevation-10>
                Servicios
                <v-icon>plumbing</v-icon>
              </v-tab>

              <v-tab-item value="tab-1">
                <v-card v-for="categ in lCateg" :key="categ.id" elevation-5>
                  <v-toolbar color="secondary" dark dense>
                    <v-toolbar-side-icon></v-toolbar-side-icon>
                    <v-toolbar-title> {{ categ.name }}</v-toolbar-title>
                  </v-toolbar>

                  <div
                    v-for="pregunta in lPregCateg(categ.id)"
                    :key="pregunta.id"
                  >
                    <v-layout row wrap pa-1 ma-0 align-center>
                      <v-flex grow pa-0 ma-0>
                        <span class="text-capitalize">
                          {{ pregunta.pregunta }}
                        </span>
                      </v-flex>
                      <v-flex shrink pa-0 ma-0>
                        <v-text-field
                          v-if="pregunta.tipo == 2"
                          pa-0
                          ma-0
                          label="Valor"
                          :value="
                            getDataLista(
                              item.respuestas,
                              pregunta.id,
                              'preguntas_id',
                              'r_s'
                            )
                          "
                          type="number"
                          style="width: 50px"
                          readonly
                        ></v-text-field>

                        <v-radio-group
                          pa-0
                          ma-0
                          v-if="pregunta.tipo == 1"
                          :value="
                            getDataLista(
                              item.respuestas,
                              pregunta.id,
                              'preguntas_id',
                              'r_s'
                            )
                          "
                          row
                          readonly
                        >
                          <v-radio
                            v-if="
                              getDataLista(
                                item.respuestas,
                                pregunta.id,
                                'preguntas_id',
                                'r_s'
                              ) == 1
                            "
                            color="green"
                            label="Si"
                            value="1"
                          ></v-radio>
                          <v-radio
                            v-else
                            color="red"
                            label="No"
                            value="0"
                          ></v-radio>
                        </v-radio-group>
                      </v-flex>
                    </v-layout>
                    <v-divider></v-divider>
                  </div>
                </v-card>
              </v-tab-item>
              <v-tab-item value="tab-2">
                <v-card>
                  <div v-for="servicio in item.servicios" :key="servicio.id">
                    <v-layout row wrap pa-1 ma-0 align-center>
                      <v-flex grow pa-0 ma-0>
                        <span class="text-capitalize">
                          {{
                            getDataLista(
                              lServicios,
                              servicio.servicios_id,
                              'id',
                              'name'
                            )
                          }}
                          <span style="font-size: 10px">
                            {{
                              getDataLista(
                                lServicios,
                                servicio.servicios_id,
                                'id',
                                'obs'
                              )
                            }}
                          </span>
                        </span>
                      </v-flex>
                      <v-flex shrink pa-0 ma-0>
                        <v-text-field
                          pa-0
                          ma-0
                          label="Cant"
                          :value="servicio.cant"
                          type="number"
                          style="width: 50px"
                          readonly
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-divider></v-divider>
                  </div>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </template>
        </v-container>
      </mk-form-full-screen>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'
import MkFormFullScreen from '@/components/mkComponentes/MkFormFullScreen.vue'

export default {
  middleware: ['authAccess'],
  mixins: [MkModuloMix],
  components: { MkFormFullScreen },
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
      lEstados: ['Pendiente', 'No se Realizo', 'Terminado', 'Cerrado'],
      lColor: [
        'grey--text',
        'red--text text--lighten-1',
        'green--text text--lighten-3',
        'green--text',
      ],
      lRutas: [],
      lCateg: [],
      lPreguntas: [],
      lServicios: [],
      estado: false,
    }
  },
  methods: {
    beforeOpen(accion, data = {}) {
      this.accion = 'show'
      this.estado = data.estado <= 1 ? false : true
    },
    alferOpen(accion, data = {}) {
      this.tituloModal = this.tituloModal +' de ' + data.beneficiario.name
    },
  },
  computed: {
    lPregCateg: (app) => (categ) => {
      let l = app.lPreguntas.filter((e) => e.categ_id == categ)
      return l
    },
  },

  async mounted() {
    this.setOptionTable('add').visible = false
    this.setOptionTable('edit').visible = false
    this.setOptionTable('del').visibleRow = function (e) {
      return e.estado == 0 ? true : false
    }

    let filtros=[
            ['roles_slug','=','monitor',],
            ['status','<>',0]
        ];
    let listas= await this.getDatasBackend(this.urlModulo,[
      {mod:'Usuarios',campos:'id,name',datos:{filtros:filtros},item:'usuarios_id'},
      {mod:'Rutas',campos:'id,name',item:'ruteos.rutas_id',datos:{rel:1}},
      {mod:'Preguntas',sort:'orden'},
      {mod:'Categ',campos:'id,name,orden',item:'rutas_id',datos:{modulo:'mkPreguntas'},sort:'orden'},
      {mod:'Servicios',each:(e) => {
        e.cantidad = 1
        e.selected = false
      }},
    ])

  },
}
</script>
<style scoped>
</style>
