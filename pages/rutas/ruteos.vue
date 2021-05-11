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
              <v-card class="pa-2 black">
                <v-card>
                  <v-layout
                    align-center
                    v-for="(evalua, index) in props.item.evaluaciones"
                    :key="evalua.id"
                    row
                    :class="
                      index % 2 == 0 ? 'indigo lighten-4' : 'orange lighten-5'
                    "
                  >
                    <v-flex xs1>
                      <v-btn
                        icon
                        color="indigo"
                        small
                        @click="openEval(evalua)"
                      >
                        <v-icon small>assignment</v-icon>
                      </v-btn>
                    </v-flex>
                    <v-flex grow>
                      {{ evalua.beneficiario_coord.name }}
                    </v-flex>
                    <v-flex shrink>
                      {{ formatDT(evalua.created_at) }}
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-card>
            </template>
          </mk-data-table>
        </v-flex>
      </v-layout>
      <!-- formulario Show Edit-->
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

      <!-- formulario verRuteo FullScreen -->
      <mk-form-full-screen
        ref="mkFormShow"
        :modal="modalShow"
        :tit="tituloModal"
        :accion="accion"
        @closeDialog="modalShow = false"
        @grabarItem="modalShow = false"
      >
        <v-container grid-list-md fluid v-if="modalShow && accion == 'show'" pb-0 white>
          <!-- Datos Basicos -->
          <v-layout row wrap>
            <v-flex xs6
              ><span class="font-weight-black">Ruta:</span> {{ item.ruta.name }}
            </v-flex>
            <v-flex xs6
              ><span class="font-weight-black">Monitor:</span>
              {{ item.monitor.name }}
            </v-flex>
            <v-flex>
              <span class="font-weight-black">Abrio:</span>
              {{ getDataLista(lUsuarios, item.open_id, 'id', 'name') }},
              {{ formatDT(item.created_at) }}
            </v-flex>
            <v-flex v-if="item.fec_cerrado">
              <span class="font-weight-black">Cerro:</span>
              {{ getDataLista(lUsuarios, item.close_id, 'id', 'name') }},
              {{ formatDT(item.fec_cerrado) }}
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <!-- Columna Evaluaciones -->
            <v-flex xs6>
              <!-- grafico Benef/eval -->
              <v-card>
                <v-card-text>
                  <div
                    class="layout row ma-0 align-center justify-space-between"
                  >
                    <div class="text-box">
                      <div class="subheading pb-2">Benef/Eval</div>
                      <span class="grey--text">
                        {{ item.nBenef }} / {{ item.evaluaciones.length }}
                        <v-icon small color="green">groups</v-icon>
                      </span>
                    </div>
                    <div class="chart">
                      <v-progress-circular
                        :size="50"
                        :width="5"
                        :rotate="360"
                        :value="(item.evaluaciones.length * 100) / item.nBenef"
                        color="success"
                      >
                        <span style="font-size: 10px">
                          {{
                            (
                              (item.evaluaciones.length * 100) /
                              item.nBenef
                            ).toFixed(1)
                          }}%
                        </span>
                      </v-progress-circular>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
              <!-- grafico evaluaciones -->
              <v-card v-if="modalShow">
                <v-card-title>Evaluaciones</v-card-title>
                <e-chart
                  :path-option="getOptionsEvaluaciones()"
                  height="150px"
                  width="100%"
                >
                </e-chart>
              </v-card>
              <!-- grafico Respuestas -->
              <v-card v-if="modalShow">
                <v-select
                  v-model="item.pregunta"
                  :items="lPreguntas"
                  item-text="pregunta"
                  item-value="id"
                  label="Pregunta"
                  @change="changePregunta"
                  dense
                  small
                ></v-select>
                <e-chart
                  v-if="showRespuesta"
                  :path-option="getOptionPregunta()"
                  height="150px"
                  width="100%"
                >
                </e-chart>
              </v-card>
            </v-flex>
            <!-- Columna Servicios -->
            <v-flex xs6>
              <!-- grafico benef/serv -->
              <v-card>
                <v-card-text>
                  <div
                    class="layout row ma-0 align-center justify-space-between"
                  >
                    <div class="text-box">
                      <div class="subheading pb-2">Benef/Solic.Serv</div>
                      <span class="grey--text"
                        >{{ item.nBenef }} / {{ item.nServicios }}
                        <v-icon small color="blue">handyman</v-icon>
                      </span>
                    </div>
                    <div class="chart">
                      <v-progress-circular
                        :size="50"
                        :width="5"
                        :rotate="360"
                        :value="(item.nServicios * 100) / item.nBenef"
                        color="blue"
                      >
                        <span style="font-size: 10px"
                          >{{
                            ((item.nServicios * 100) / item.nBenef).toFixed(1)
                          }}%</span
                        >
                      </v-progress-circular>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
              <!-- grafico Servivicios -->
              <v-card v-if="modalShow">
                <v-card-title>Servicios</v-card-title>
                <e-chart
                  :path-option="getOptionsServicios()"
                  height="150px"
                  width="100%"
                >
                </e-chart>
              </v-card>
              <!-- mapa de ruteo -->
              <v-card style="margin-top: 5px">
                <div id="map-wrap" style="height: 214px; width: 100%">
                  <client-only>
                    <l-map
                      :zoom="zoom"
                      :center="center"
                      style="height: 100%; width: 100%"
                      ref="mymap"
                    >
                      <l-tile-layer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="<a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
                        :useCors="false"
                      ></l-tile-layer>
                      <l-polyline
                        v-if="jsonLine"
                        :lat-lngs="jsonLine"
                        color="blue"
                      ></l-polyline>
                      <l-geo-json
                        v-if="jsonData"
                        :geojson="jsonData"
                        :options-style="getStyles"
                      />
                      <div v-if="modalShow && markers && markers.length > 0">
                        <l-marker
                          v-for="(marker, index) in markers"
                          :key="index"
                          :lat-lng="getMarker(marker, item, index)"
                          :draggable="false"
                          :visible="true"
                          :icon="getIcon(marker)"
                        >
                          <l-tooltip>
                            {{ marker.name || 'Tu ubicacion Actual' }}
                            {{ marker.posi ? ' (' + marker.posi + ')' : '' }}
                          </l-tooltip>
                        </l-marker>
                      </div>
                    </l-map>
                  </client-only>
                </div>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </mk-form-full-screen>

      <!-- formulario Evaluaciones FullScreen -->
      <mk-form-full-screen
        ref="mkFormEval"
        :modal="modalEval"
        :tit="tituloModal"
        :accion="accion"
        @closeDialog="modalEval = false"
        @grabarItem="modalEval = false"
      >
        <v-container grid-list-md fluid class="white">
          <span v-if="!item.estado" class="danger title"
            >No se realizó la Evaluación</span
          >
          <v-text-field
            v-if="item.obs"
            label="Notas de la Evaluacion"
            :value="item.obs"
            readonly
          ></v-text-field>

          <template v-if="item.estado && modalEval">
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
import EChart from '@/components/chart/echart'
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'
import MkFormFullScreen from '@/components/mkComponentes/MkFormFullScreen.vue'
import {
  formatDT,
} from '@/components/mkComponentes/lib/MkUtils.js'
import Material from 'vuetify/es5/util/colors'
import { icon } from 'leaflet'

export default {
  middleware: ['authAccess'],
  mixins: [MkModuloMix],
  components: { MkFormFullScreen, EChart },
  name: 'Ruteos',
  data() {
    return {
      //urlModulo: '',
      //titModulo: '',
      modalShow: false,
      modalEval: false,
      color: Material,
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
          sortable:false,
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
      lPreguntas: [],
      item: {
        nEval: [],
        respuesta: 0,
      },
      showRespuesta: false,
      //
      center: [-17.783373986957255, -63.18209478792436],
      zoom: 13,
      coordenadas: {},
      markers: [],
      icon1: icon({
        iconUrl: require('~/static/img/icon1.png'),
        iconSize: [32, 32],
        iconAnchor: [16, 30],
        tooltipAnchor: [16, -22],
      }),
      icon2: icon({
        iconUrl: require('~/static/img/icon2.png'),
        iconSize: [16, 16],
        iconAnchor: [8, 14],
        tooltipAnchor: [16, -12],
      }),
      icon0: icon({
        iconUrl: require('~/static/img/icon0.png'),
        iconSize: [32, 32],
        iconAnchor: [16, 30],
        tooltipAnchor: [16, -22],
      }),

      jsonData: [],
      jsonLine: [],
    }
  },
  methods: {
    getOptionsServicios() {
      return [
        ['dataset.source', this.item.nServ],
        [
          'color',
          [
            this.color.grey.base,
            this.color.green.base,
            this.color.pink.base,
            this.color.indigo.base,
            this.color.teal.base,
            this.color.purple.base,
          ],
        ],
        ['legend.orient', 'vertical'],
        ['legend.left', 'left'],
        ['legend.padding', 2],
        ['legend.itemGap', 2],
        ['legend.itemWidth', 15],
        ['legend.itemHeight', 5],
        ['legend.textStyle.fontSize', 10],
        ['legend.show', true],
        ['xAxis.show', false],
        ['yAxis.show', false],
        ['series[0].type', 'pie'],
        ['series[0].radius', '70%'],
        ['series[0].center', ['70%', '50%']],
        ['series[0].label.position', 'inside'],
        ['series[0].label.formatter', '{@[1]}'],
        ['series[0].label.fontSize.', '10px'],
      ]
    },
    getOptionsEvaluaciones() {
      return [
        ['dataset.source', this.item.nEval],
        [
          'color',
          [
            this.color.grey.base,
            this.color.pink.base,
            this.color.green.base,
            this.color.indigo.base,
            this.color.teal.base,
            this.color.purple.base,
          ],
        ],
        ['legend.orient', 'vertical'],
        ['legend.left', 'left'],
        ['legend.padding', 2],
        ['legend.itemGap', 2],
        ['legend.itemWidth', 15],
        ['legend.itemHeight', 5],
        ['legend.textStyle.fontSize', 10],
        ['legend.show', true],
        ['xAxis.show', false],
        ['yAxis.show', false],
        ['series[0].type', 'pie'],
        ['series[0].radius', '70%'],
        ['series[0].center', ['70%', '50%']],
        ['series[0].label.position', 'inside'],
        ['series[0].label.formatter', '{d}%'],
        ['series[0].label.fontSize.', '10px'],
      ]
    },
    getOptionPregunta() {
      let preg = this.getDataLista(this.lPreguntas, this.item.pregunta, 'id', '*')
      let r = [
        ['dataset.source', preg.nResp],
        [
          'color',
          [
            this.color.indigo.base,
            this.color.pink.base,
            this.color.green.base,
            this.color.teal.base,
            this.color.purple.base,
            this.color.amber.base,
          ],
        ],
        ['legend.orient', 'horizontal'],
        ['legend.show', false],
        ['legend.y', 'bottom'],
        ['xAxis.show', false],
        ['yAxis.show', false],
        ['series[0].type', 'pie'],
        ['series[0].label.show', true],
        ['series[0].label.formatter', '{b}: \n {d} %'],
        ['series[0].label.position', 'inside'],
        ['series[0].label.fontSize.', '10px'],
      ]
      if (preg.tipo == 2) {
        r = [
          ['dataset.source', preg.nResp],
          [
            'color',
            [
              this.color.indigo.base,
              this.color.pink.base,
              this.color.green.base,
              this.color.teal.base,
              this.color.purple.base,
              this.color.amber.base,
            ],
          ],
          ['legend.orient', 'horizontal'],
          ['legend.show', true],
          ['legend.y', 'bottom'],
          ['xAxis.show', true],
          ['yAxis.show', false],
          ['series[0].type', 'bar'],
          ['series[0].label.show', true],
          ['series[1].type', 'bar'],
          ['series[1].label.show', true],
          ['series[2].type', 'bar'],
          ['series[2].label.show', true],
        ]
      }
      return r
    },
    changePregunta() {
      this.showRespuesta = false
      setTimeout(() => {
        this.showRespuesta = true
      }, 100)
    },
    async openShow(accion, data) {
      this.accion = accion
      this.item = Object.assign({}, data)
      this.item.ruta = this.getDataLista(this.lRutas, data.rutas_id, 'id', '*')
      this.item.monitor = this.getDataLista(
        this.lUsuarios,
        data.usuarios_id,
        'id',
        '*'
      )
      this.item.nBenef = this.getDataLista(
        this.lRutas,
        data.rutas_id,
        'id',
        'beneficiarios'
      ).length

      this.item.nServ = []
      this.item.nServicios = 0

      this.lServicios.forEach((e) => {
        this.item.nServ.push({ Servicio: e.name, value: 0, id: e.id })
      })

      this.item.evaluaciones.forEach((e) => {
        if (e.servicios.length > 0) {
          this.item.nServicios++
          e.servicios.forEach((s) => {
            let ser = this.getDataLista(this.item.nServ, s.servicios_id, 'id', '*')
            ser.value = ser.value + s.cant * 1
          })
        }
      })
      //console.log(this.item.nServ);
      this.item.nEvalVal = [0, 0, 0]
      this.item.evaluaciones.forEach((e) => {
        this.item.nEvalVal[e.estado * 1]++
      })
      this.item.nEvalVal[0] =
        this.item.evaluaciones.length -
        (this.item.nEvalVal[1] + this.item.nEvalVal[2])

      this.item.nEval = [
        {
          Evaluaciones: 'No Realizadas',
          value: this.item.nEvalVal[0],
        },
        {
          Evaluaciones: 'No Respondidas',
          value: this.item.nEvalVal[1],
        },
        {
          Evaluaciones: 'Respondidas',
          value: this.item.nEvalVal[2],
        },

      ]

      this.lPreguntas.forEach((e) => {
        if (e.tipo == '1') {
          e.nResp = [
            {
              Respuesta: 'No',
              value: 0,
            },
            {
              Respuesta: 'Si',
              value: 0,
            },
          ]
        }
        if (e.tipo == '2') {
          e.nResp = [
            { product: 'Cant.', '=1': 0, '>1': 0, Total: 0 },
            //            ['Cantidad',0,5,10]
          ]
        }
      })
      this.item.evaluaciones.forEach((e) => {
        e.respuestas.forEach((e1) => {
          let preg = this.getDataLista(this.lPreguntas, e1.preguntas_id, 'id', '*')
          if (preg.tipo == '1') {
            preg.nResp[e1.r_s * 1].value++
          }
          if (preg.tipo == '2') {
            preg.nResp[0]['Total'] = preg.nResp[0]['Total'] + e1.r_s * 1
            if (e1.r_s * 1 == 1) {
              preg.nResp[0]['=1']++
            }
            if (e1.r_s * 1 > 1) {
              preg.nResp[0]['>1']++
            }
          }
        })
      })

      this.item.pregunta = this.lPreguntas[0].id

      this.markers = []
      this.jsonData = []
      let gps = []
      let orig = []
      if (data.gps_open) {
        gps = data.gps_open.split(' ')
        orig = [gps[1], gps[0]]
        //this.markers.push([gps[0], gps[1]])
      }
      //let orig=[[gps[1], gps[0]]]

      // this.jsonData.push(
      //   {
      //     type: 'LineString',
      //     coordinates: [
      //       orig,
      //       [benef.lng, benef.lat],
      //     ],
      //   },
      // )

      let posi = 1
      data.evaluaciones.forEach((e) => {
        gps = e.coord.split(' ')
        this.markers.push({ ...e.beneficiario_coord, icon: 0, posi: posi })
        this.markers.push({
          id: e.beneficiario_coord.id,
          name: e.beneficiario_coord.name,
          lat: gps[0],
          lng: gps[1],
          icon: 1,
          posi: posi,
        })
        this.jsonData.push({
          type: 'LineString',
          coordinates: [
            [e.beneficiario_coord.lng, e.beneficiario_coord.lat],
            [gps[1], gps[0]],
          ],
          color: 0,
        })

        this.jsonData.push({
          type: 'LineString',
          coordinates: [orig, [gps[1], gps[0]]],
          color: 1,
        })
        posi++
        orig = [gps[1], gps[0]]
      })

      if (data.gps_open) {
        gps = data.gps_open.split(' ')
        this.markers.push({
          id: 0,
          name: 'Inicio',
          lat: gps[0],
          lng: gps[1],
          icon: 2,
        })
        //this.markers.push([gps[0], gps[1]])
      }

      if (data.gps_close) {
        gps = data.gps_close.split(' ')
        this.markers.push({
          id: 0,
          name: 'Fin',
          lat: gps[0],
          lng: gps[1],
          icon: 2,
        })

        this.jsonData.push({
          type: 'LineString',
          coordinates: [orig, [gps[1], gps[0]]],
          color: 1,
        })
      }

      this.showRespuesta = true

      this.tituloModal = 'Ver ' + this.titModulo
      if (data.obs) {
        this.tituloModal = this.tituloModal + '|' + data.obs
      }
      this.modalShow = true
    },
    openEval(data) {
      this.accion='show'
      this.item = Object.assign({}, data)
      this.item.estado = this.item.estado <= 1 ? false : true
      this.tituloModal = 'Evaluacion de ' + data.beneficiario_coord.name
      this.modalEval = true
    },
    formatDT(d, time = true) {
      return formatDT(d, time)
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
      switch(error.code) {
        case error.PERMISSION_DENIED:
            // El usuario denegó el permiso para la Geolocalización.
            alert('El Usuario denego el permiso de obtener la UBICACION, este Paso necesita que habilite el permiso por Favor')
            break;
        case error.POSITION_UNAVAILABLE:
            // La ubicación no está disponible.
            break;
        case error.TIMEOUT:
            // Se ha excedido el tiempo para obtener la ubicación.
            alert('El Usuario puede que no otorgo poermisos de UBICACION, este Paso necesita que habilite el permiso por Favor')
            break;
        case error.UNKNOWN_ERROR:
            // Un error desconocido.
            break;
    }
      console.warn('ERROR(' + error.code + '): ' + error.message)
    },
    beforeOpen(accion, data = {}) {
      let me = this
      if (accion == 'add') {
        this.getPosition()
        data.usuarios_id = null
      }
    },
    //metodos del mapa
    getIcon(item) {
      if (item.icon == 0) {
        return this.icon0
      }
      if (item.icon == 1) {
        return this.icon1
      } else {
        return this.icon2
      }
    },
    getStyles(features) {
      if (features.geometry.color == 1) {
        return { color: 'blue', weight: 2, opacity: 0.6 }
      }
      return { color: 'red', weight: 5, opacity: 0.3 }
      //console.log(features);
    },
    getMarker(id, item, index) {
      let marker = this.center
      marker = [id.lat, id.lng]
      if (index == this.markers.length - 1) {
        //console.log('index')
        setTimeout(() => {
          this.fitMapBounds()
        }, 1500)
      }
      return marker
    },
    initMap() {
      this.zoom = 13
      this.$refs.mymap.mapObject.invalidateSize().setView(this.center)
      this.fitMapBounds()
    },
    fitMapBounds() {
      let map = this.$refs.mymap.mapObject
      const visibleMarkers = []
      map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
          visibleMarkers.push(layer)
        }
      })

      if (visibleMarkers.length > 0) {
        const markersBounds = L.latLngBounds([visibleMarkers[0].getLatLng()])
        visibleMarkers.forEach((marker) => {
          markersBounds.extend(marker.getLatLng())
        })

        map.flyToBounds(markersBounds, {
          padding: L.point(36, 36),
          animate: true,
        })
      }
    },
  },
  computed: {
    lPregCateg: (app) => (categ) => {
      let l = app.lPreguntas.filter((e) => e.categ_id == categ)
      return l
    },
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


    let filtros=[
            ['roles_id','=','2',],
            ['status','<>',0]
        ];
    let listas= await this.getDatasBackend(this.urlModulo,[
      {mod:'Usuarios',campos:'id,name',datos:{filtros:filtros},item:'usuarios_id'},
      {mod:'Rutas',campos:'id,name,usuarios_id',item:'rutas_id',datos:{rel:1}},
      {mod:'Preguntas',sort:'orden'},
      {mod:'Categ',campos:'id,name,orden',datos:{modulo:'mkPreguntas'},sort:'orden'},
      {mod:'Servicios'},
    ])
  },
}
</script>
<style scoped>
</style>
