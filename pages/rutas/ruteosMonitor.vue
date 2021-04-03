<template>
  <div id="pageTable">
    <v-container grid-list-md fluid
    v-if="lRuteos.dispon"
    >
      <v-layout row wrap>
        <v-flex xs12>
          <v-card>
            <!-- presentacion -->
            <v-layout v-bind="binding">
              <v-flex pa-4 class="text-xs-center">
                <img
                  style="max-width: 100%; height: auto"
                  src="~/static/img/hi.gif"
                />
              </v-flex>
              <v-flex>
                <v-card-title primary-title>
                  <div>
                    <div class="font-weight-medium">Bienvenido</div>
                    <div class="headline primary--text text-uppercase">
                      {{
                        $store.state.auth.authUser
                          ? $store.state.auth.authUser.name
                          : 'Desconocido'
                      }}
                    </div>
                    <span
                      >Este es tu panel de control, donde podras visualizar
                      todas tus Rutas abiertas y Disponibles, ademas de otros
                      datos importantes.</span
                    >
                  </div>
                </v-card-title>
              </v-flex>
            </v-layout>
            <v-divider light></v-divider>
            <!-- cuadritos informativos -->
            <v-card-actions class="pa-3">
              <v-layout align-space-around justify-space-around row fill-height>
                <mk-simple-card
                  title="Rutas Disponibles"
                  :text="lRuteos.dispon ? lRuteos.dispon.ok + '' : '0'"
                  color="red darken-4 grey--text"
                ></mk-simple-card>

                <mk-simple-card
                  title="Rutas Abiertas"
                  :text="lRuteos.open ? lRuteos.open.ok + '' : '0'"
                  color="yellow darken-4"
                ></mk-simple-card>

                <mk-simple-card
                  title="Rutas Cerradas"
                  :text="lRuteos.closed ? lRuteos.closed.ok + '' : '0'"
                  color="green darken-4 grey--text"
                ></mk-simple-card>

                <v-icon :color="location ? 'green' : 'grey'"
                  >my_location</v-icon
                >
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
      <!-- Rutas Disponibles -->
      <v-card>
        <v-toolbar color="green darken-4" dark>
          <v-icon>add_location_alt</v-icon>
          <v-toolbar-title>Rutas Disponibles</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list two-line>
          <v-list-tile
            v-for="ruta in lRuteos.dispon.data"
            :key="ruta.id"
            href="#"
          >
            <v-list-tile-avatar>
              <v-btn icon flat color="success" @click="verMapa(ruta, true)">
                <v-badge
                  :value="
                    getDataLista(lRutas, ruta.rutas_id, 'id', 'beneficiarios')
                  "
                  color="cyan"
                  overlap
                >
                  <template v-slot:badge>
                    <span>
                      {{
                        getDataLista(
                          lRutas,
                          ruta.rutas_id,
                          'id',
                          'beneficiarios'
                        ).length
                      }}</span
                    >
                  </template>
                  <v-icon large>map</v-icon>
                </v-badge>
              </v-btn>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                <v-layout row wrap>
                  <v-flex>
                    <span class="caption">
                      {{ ruta.id }}
                    </span>
                    <span class="title text-capitalize">
                      {{ getDataLista(lRutas, ruta.rutas_id) }}</span
                    >
                  </v-flex>
                </v-layout>
              </v-list-tile-title>
              <v-list-tile-sub-title class="caption">{{
                getDataLista(lRutas, ruta.rutas_id, 'id', 'descrip')
              }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon color="primary" @click="addRuteo(ruta)">
                <v-icon>add</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
      <br />
      <!-- Rutas Abiertas -->
      <v-card>
        <v-toolbar color="yellow darken-4" dark>
          <v-icon>pin_drop</v-icon>
          <v-toolbar-title>Rutas Abiertas</v-toolbar-title>
        </v-toolbar>
        <v-list two-line dense>
          <v-list-group
            v-model="ruteo.active"
            v-for="ruteo in lRuteos.open.data"
            :key="ruteo.id"
            active-class="grey"
          >
            <v-list-tile slot="activator">
              <v-list-tile-avatar>
                <v-btn
                  icon
                  flat
                  color="success"
                  @click.stop="
                    verMapa(
                      getDataLista(lRutas, ruteo.rutas_id, 'id', '*'),
                      true
                    )
                  "
                >
                  <v-badge :value="true" color="cyan" overlap>
                    <template v-slot:badge>
                      <span>
                        {{
                          getDataLista(
                            lRutas,
                            ruteo.rutas_id,
                            'id',
                            'beneficiarios'
                          ).length
                        }}
                      </span>
                    </template>
                    <v-icon large>map</v-icon>
                  </v-badge>
                </v-btn>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>
                  <v-layout row wrap>
                    <v-flex>
                      <span class="caption">
                        {{ ruteo.id }}
                      </span>
                      <span class="title text-capitalize">
                        {{ getDataLista(lRutas, ruteo.rutas_id) }}
                      </span>
                    </v-flex>
                  </v-layout>
                </v-list-tile-title>
                <v-list-tile-sub-title class="caption">
                  Abierto: {{ formatDT(ruteo['created_at']) }}
                   {{ getDataLista(lRutas, ruteo.rutas_id, 'id', 'beneficiarios').length  }} -
                      {{ ruteo.evaluaciones.length }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn
                  icon
                  color="primary"
                  @click.stop=""
                  large
                  v-if="
                    getDataLista(lRutas, ruteo.rutas_id, 'id', 'beneficiarios')
                      .length -
                      ruteo.evaluaciones.length >
                    0
                  "
                >
                  <v-badge :value="true" color="green" overlap>
                    <template v-slot:badge>
                      <span>
                        {{
                          getDataLista(
                            lRutas,
                            ruteo.rutas_id,
                            'id',
                            'beneficiarios'
                          ).length - ruteo.evaluaciones.length
                        }}
                      </span>
                    </template>
                    <v-icon large>groups</v-icon>
                  </v-badge>
                </v-btn>
                <v-btn
                  v-else
                  icon
                  color="primary"
                  @click.stop="getPosition(setClose, ruteo.id)"
                  large
                  title="Cerrar Ruteo"
                >
                  <v-icon large>fact_check</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-tile
              v-for="bene in getDataLista(
                lRutas,
                ruteo.rutas_id,
                'id',
                'beneficiariosD'
              )"
              :key="bene.id"
              href="#"
            >
              <v-list-tile-avatar class="pa-0 pm-0">
                <v-btn
                  icon
                  color="green"
                  @click="verMapaBene(bene.id)"
                  small
                  style="margin: 0; margin-right: 3px"
                >
                  <v-icon>person_pin_circle</v-icon>
                </v-btn>
                <v-btn
                  icon
                  color="blue"
                  @click="verMapaBene(bene.id, true)"
                  small
                  style="margin: 0; margin-left: 3px"
                >
                  <v-icon>directions_car</v-icon>
                </v-btn>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>
                  <span class="caption"> {{ ruteo.id }}</span>
                  {{ getDataLista(lBeneficiarios, bene.id) }}
                </v-list-tile-title>
                <v-list-tile-sub-title class="caption">
                  {{ (bene.distancia * 1.0).toFixed(2) }} Km
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action> </v-list-tile-action>

              <v-list-tile-action>
                <v-btn
                  icon
                  :color="getColorEval(ruteo, bene.id)"
                  @dblclick="openEval(ruteo, bene.id)"

                >
                  <v-icon>assignment</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
        </v-list>
      </v-card>
      <br />
      <!-- Rutas Atrasadas  -->
      <v-card>
        <v-toolbar color="red darken-4" dark>
          <v-icon>fmd_bad</v-icon>
          <v-toolbar-title>Rutas Atrasadas </v-toolbar-title>
        </v-toolbar>
        <v-list two-line dense>
          <v-list-group
            v-model="ruteo1.active"
            v-for="ruteo1 in lRuteos.retrased.data"
            :key="ruteo1.id"
            active-class="grey"
          >
            <v-list-tile slot="activator">
              <v-list-tile-avatar>
                <v-btn
                  icon
                  flat
                  color="success"
                  @click.stop="
                    verMapa(
                      getDataLista(lRutas, ruteo1.rutas_id, 'id', '*'),
                      true
                    )
                  "
                >
                  <v-badge :value="true" color="cyan" overlap>
                    <template v-slot:badge>
                      <span>
                        {{
                          getDataLista(
                            lRutas,
                            ruteo1.rutas_id,
                            'id',
                            'beneficiarios'
                          ).length
                        }}
                      </span>
                    </template>
                    <v-icon large>map</v-icon>
                  </v-badge>
                </v-btn>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>
                  <v-layout row wrap>
                    <v-flex>
                      <span class="caption">
                        {{ ruteo1.id }}
                      </span>
                      <span class="title text-capitalize">
                        {{ getDataLista(lRutas, ruteo1.rutas_id) }}
                      </span>
                    </v-flex>
                  </v-layout>
                </v-list-tile-title>
                <v-list-tile-sub-title class="caption">
                  {{ getSubHeader(ruteo1) }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon color="primary" @click.stop="" large>
                  <v-badge :value="true" color="green" overlap>
                    <template v-slot:badge>
                      <span>
                        {{
                          getDataLista(
                            lRutas,
                            ruteo1.rutas_id,
                            'id',
                            'beneficiarios'
                          ).length - ruteo1.evaluaciones.length
                        }}
                      </span>
                    </template>
                    <v-icon large>groups</v-icon>
                  </v-badge>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-tile
              v-for="bene in getDataLista(
                lRutas,
                ruteo1.rutas_id,
                'id',
                'beneficiariosD'
              )"
              :key="bene.id"
              href="#"
            >
              <v-list-tile-avatar class="pa-0 pm-0">
                <v-btn
                  icon
                  color="green"
                  @click="verMapaBene(bene.id)"
                  small
                  style="margin: 0; margin-right: 3px"
                >
                  <v-icon>person_pin_circle</v-icon>
                </v-btn>
                <v-btn
                  icon
                  color="blue"
                  @click="verMapaBene(bene.id, true)"
                  small
                  style="margin: 0; margin-left: 3px"
                >
                  <v-icon>directions_car</v-icon>
                </v-btn>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>
                  {{ getDataLista(lBeneficiarios, bene.id) }}
                </v-list-tile-title>
                <v-list-tile-sub-title class="caption">
                  {{ (bene.distancia * 1.0).toFixed(2) }} Km
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action> </v-list-tile-action>

              <v-list-tile-action>
                <v-btn
                  icon
                  :color="getColorEval(ruteo1, bene.id)"
                  @dblclick="openEval(ruteo1, bene.id)"

                >
                  <v-icon>assignment</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
        </v-list>
      </v-card>
      <br />
      <!-- Rutas Cerradas -->
      <v-card>
        <v-toolbar color="blue darken-4" dark>
          <v-icon>where_to_vote</v-icon>
          <v-toolbar-title>Rutas Cerradas en estas 2 semanas</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list tree-line>
          <v-list-tile
            v-for="rutaC in lRuteos.closed.data"
            :key="rutaC.id"
            href="#"
          >
            <v-list-tile-content>
              <v-list-tile-title>
                <v-layout row wrap>
                  <v-flex>
                    <span class="caption">
                      {{ rutaC.id }}
                    </span>
                    <span class="title text-capitalize">
                      {{ getDataLista(lRutas, rutaC.rutas_id) }}
                    </span>
                    <span class="caption">
                      {{
                        getDataLista(lRutas, rutaC.rutas_id, 'id', 'descrip')
                      }}
                    </span>
                  </v-flex>
                </v-layout>
              </v-list-tile-title>
              <v-list-tile-sub-title class="caption">
                Abierto el:
                {{ formatDT(rutaC.created_at) }}
              </v-list-tile-sub-title>
              <v-list-tile-sub-title class="caption">
                Cerrado el:
                {{ formatDT(rutaC.fec_cerrado) }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
      <br />
      <!-- formulario Principal -->
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
            label="Observaciones"
            v-model="item.obs"
            ref="focus"
          ></v-text-field>
        </v-container>
      </mk-form>
      <!-- formulario Mapa FullScreen -->
      <mk-form-full-screen
        ref="mkFormMap"
        :modal="modalMap"
        :tit="tituloModal"
        accion="show"
        @closeDialog="modalMap = false"
      >
        <v-container grid-list-md fluid ma-o pa-0>
          <div id="map-wrap" style="height: 100%; width: 100%">
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
                  :options-style="styleFunction"
                />
                <div v-if="modalMap && markers && markers.length > 0">
                  <l-marker
                    v-for="(marker, index) in markers"
                    :key="index"
                    :lat-lng="getMarker(marker, item, index)"
                    :draggable="false"
                    :visible="true"
                    :icon="getIcon(marker)"
                  >
                    <l-tooltip>{{
                      getDataLista(lBeneficiarios, marker, 'id', 'name') ||
                      'Tu ubicacion Actual'
                    }}</l-tooltip>
                  </l-marker>
                </div>
              </l-map>
            </client-only>
          </div>
        </v-container>
      </mk-form-full-screen>
      <!-- formulario Evaluaciones FullScreen -->
      <mk-form-full-screen
        ref="mkFormEval"
        :modal="modalEval"
        :tit="tituloModal"
        :accion="accion"
        @closeDialog="modalEval = false"
        @grabarItem="grabarEval"
      >
        <v-container grid-list-md fluid class="white">
          <v-switch
            v-model="estado"
            label="Se Puede resalizar la evaluacion?"
            color="indigo"
          >
          </v-switch>
          <v-text-field
            label="Notas de la Evaluacion"
            v-model="item.obs"
            ref="focusEval"
            :rules="this.estado ? [] : [this.rules.required]"
            validate-on-blur
          ></v-text-field>

          <template v-if="estado && modalEval">
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
                    :key="pregunta.pregunta"
                  >
                    <v-layout row wrap pa-2>
                      <v-flex grow>
                        <span class="title text-capitalize">
                          {{ pregunta.pregunta }}
                        </span>
                      </v-flex>
                      <v-flex shrink>
                        <v-text-field
                          v-if="pregunta.tipo == 2"
                          label="valor"
                          v-model="item.respuestas[pregunta.id]"
                          :rules="[rules.required, rules.num]"
                          validate-on-blur
                          type="number"
                          style="width: 80px"
                        ></v-text-field>

                        <v-radio-group
                          v-if="pregunta.tipo == 1"
                          v-model="item.respuestas[pregunta.id]"
                          row
                          :rules="[rules.required]"
                          validate-on-blur
                        >
                          <v-radio color="green" label="Si" value="1"></v-radio>
                          <v-radio color="red" label="No" value="0"></v-radio>
                        </v-radio-group>
                      </v-flex>
                    </v-layout>
                    <v-divider></v-divider>
                  </div>
                </v-card>
              </v-tab-item>
              <v-tab-item value="tab-2">
                <v-card>
                  <v-list>
                    <template v-for="servicio in lServicios">
                      <v-list-tile
                        :key="servicio.id"
                        :class="
                          servicio.selected
                            ? 'deep-purple lighten-5 deep-purple--text text--accent-4'
                            : ''
                        "
                      >
                        <v-list-tile-action>
                          <v-checkbox
                            v-if="servicio.estado == 1"
                            v-model="servicio.selected"
                            color="deep-purple accent-4"
                          ></v-checkbox>
                        </v-list-tile-action>

                        <v-list-tile-content>
                          <v-list-tile-title>
                            {{ servicio.name }}
                            <span style="font-size: 10px">
                              {{ servicio.obs }}
                              {{ servicio.estado }}
                            </span>
                          </v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-avatar v-if="servicio.selected">
                          <v-text-field
                            v-model="servicio.cantidad"
                            :disabled="
                              servicio.estado == 1
                                ? servicio.cant
                                  ? false
                                  : true
                                : true
                            "
                            :rules="[
                              rules.required,
                              rules.num,
                              rules.minVal(1),
                            ]"
                            validate-on-blur
                            color="primary"
                            :class="servicio.selectded ? 'secondary' : ''"
                            type="number"
                            min="1"
                            style="
                              font-size: 12px;
                              padding-bottom: 0;
                              padding-top: 12px;
                            "
                          ></v-text-field>
                        </v-list-tile-avatar>
                      </v-list-tile>
                    </template>
                  </v-list>
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
import VWidget from '@/components/VWidget'
import MkSimpleCard from '~/components/mkComponentes/mkCards/mkSimpleCard.vue'
import { TargomoClient } from '@targomo/core'
import {
  getDataLista,
  getDistancia,
  formatDT,
} from '@/components/mkComponentes/lib/MkUtils.js'
import { icon } from 'leaflet'
import {
  getCache,
  setCache,
  getCacheKey,
} from '@/components/mkComponentes/lib/MkCache.js'
import MkFormFullScreen from '~/components/mkComponentes/MkFormFullScreen.vue'
const _dirty = process.env.mkConfig.dirty

export default {
  //middleware: ['authAccess'],
  mixins: [MkModuloMix],
  components: { VWidget, MkSimpleCard, MkFormFullScreen },
  name: 'RuteosMonitor',
  disModTable: true,
  data() {
    return {
      urlModulo: 'Ruteos',
      //titModulo: '',
      location: false,
      lUsuarios: [],
      lRuteos: {
        dispon: {
          ok: 0,
          data: [],
        },
        open: {
          ok: 0,
          data: [],
        },
        closed: {
          ok: 0,
          data: [],
        },
        retrased: {
          ok: 0,
          data: [],
        },
      },
      lRutas: [],
      estado: false,
      lBeneficiarios: [],
      lServicios: [],
      lCateg: [],
      lPreguntas: [],
      modalMap: false,
      modalEval: false,
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
        iconSize: [32, 32],
        iconAnchor: [16, 30],
        tooltipAnchor: [16, -22],
      }),
      styleFunction: { color: '#000', weight: 5, opacity: 0.5 },
      jsonData: [],
      jsonLine: [],
      item: { respuestas: {} },
      callBack: false,
    }
  },
  methods: {
    grabarEval() {
      if (!this.$refs.mkFormEval.$refs.form.validate()) {
        return false
      }

      this.item.servicios = {}
      this.lServicios.forEach((e) => {
        if (e.selected && e.estado == 1) {
          this.item.servicios[e.id] = e.cantidad
        }
      })

      let data = {
        _noData: 1,
        id: this.item.id,
        obs: this.item.obs,
        lat: this.coordenadas.latitude,
        lng: this.coordenadas.longitude,
        estado: this.estado ? 2 : 1,
        usuarios_id: this.$store.state.auth.authUser.id,
        ruteos_id: this.item.ruteos_id,
        beneficiarios_id: this.item.beneficiarios_id,
        respuestas: this.item.respuestas,
        servicios: this.item.servicios,
      }
      if (
        this.item.id > 0 &&
        JSON.stringify(this.dirty.item.servicios) !=
          JSON.stringify(this.item.servicios)
      ) {
        data.benef = this.item.beneficiarios_id
      }
      //console.log(this.item, data)

      this.item = data

      if (!this.can('add', true)) {
        return false
      }

      this.urlModulo = 'Evaluaciones'
      this.grabarItem()
      this.urlModulo = 'Ruteos'
      return true
    },
    setClose(id) {
      if (!this.can('edit', true)) {
        return false
      }
      let me = this
      let url = 'RuteosMonitor/setClose'
      me.dataTable.loading = true
      me.$axios
        .post(url + this.getCt(url), {
          id: id,
          lat: this.coordenadas.latitude,
          lng: this.coordenadas.longitude,
        })
        .then(function (response) {
          if (me.isOk(response.data)) {
            me.afterSave(me, 0)
          } else {
            //con error
          }
        })
        .catch(function (error) {
          console.error(error)
        })
        .finally(function () {
          me.dataTable.loading = false
        })
    },
    getColorEval(ruteo, bene) {
      return !getDataLista(
        ruteo.evaluaciones,
        bene,
        'beneficiarios_id',
        'estado'
      )
        ? 'red'
        : getDataLista(ruteo.evaluaciones, bene, 'beneficiarios_id', 'verif')
        ? 'greem'
        : 'yellow'
    },
    openEval(data, bene) {
      if (!this.can('add', true)) {
        return false
      }
      this.getPosition()
      this.item = Object.assign({}, data)
      this.item._noData = 1
      this.item.lat = this.coordenadas.latitude
      this.item.beneficiarios_id = bene
      this.item.lng = this.coordenadas.longitude
      this.item.usuarios_id = this.$store.state.auth.authUser.id
      this.item.ruteos_id = data.id
      this.item.obs = ''
      this.item.id = null
      this.item.estado = 0
      let evaluacion = getDataLista(
        this.item.evaluaciones,
        bene,
        'beneficiarios_id',
        '*'
      )

      this.item.servicios = {}
      this.lServicios.forEach((e) => {
        e.cantidad = 1
        e.selected = false
        e.estado = 1

        if (evaluacion) {
          let existe = getDataLista(
            evaluacion.servicios,
            e.id,
            'servicios_id',
            '*'
          )
          if (existe) {
            e.cantidad = existe.cant
            e.selected = true
            e.estado = existe.estado
            if (existe.estado == 1) {
              this.item.servicios[e.id] = existe.cant
            }
          }
        }
      })

      this.item.respuestas = {}
      this.lPreguntas.forEach((e) => {
        if (evaluacion) {
          this.item.respuestas[e.id] = getDataLista(
            evaluacion.respuestas,
            e.id,
            'preguntas_id',
            'r_s',
            ''
          )
        } else {
          this.item.respuestas[e.id] = ''
        }
      })

      this.dirty.item = null
      if (evaluacion) {
        this.item.id = evaluacion.id
        this.item.estado = 1 * evaluacion.estado
        this.item.obs = evaluacion.obs
        if (_dirty) {
          this.dirty.item = JSON.parse(JSON.stringify(this.item))
        }
      }
      this.estado = this.item.estado <= 1 ? false : true

      this.$refs.mkFormEval.$refs.form.resetValidation()
      this.tituloModal =
        'Evaluacion de ' + getDataLista(this.lBeneficiarios, bene) //colocar computada de acuerdo al tamano
      if (!this.modalEval) this.modalEval = true
      //this.$nextTick(this.$refs.focus.focus)
    },
    formatDT(d,time=true) {
      return formatDT(d,time)
    },
    getSubHeader(data) {
      return 'Abierto:' + this.formatDT(data.created_at)
    },
    async getRutasOptimizada(ruta) {
      let store = [
        {
          uuid: 'inicio',
          address: {
            lat: this.coordenadas.latitude,
            lng: this.coordenadas.longitude,
          },
        },
      ]
      let orders = ruta.beneficiarios.map((f) => {
        return {
          uuid: getDataLista(this.lBeneficiarios, f),
          storeUuid: 'inicio',
          priority: 1,
          address: {
            lat: getDataLista(this.lBeneficiarios, f, 'id', 'lat'),
            lng: getDataLista(this.lBeneficiarios, f, 'id', 'lng'),
            avgHandlingTime: 1,
          },
        }
      })

      let cacheKey = 'rutasCached_' + getCacheKey([store, orders])

      let cached = getCache(cacheKey)
      console.log('consultando cacheado:', cacheKey, cached)
      if (cached) {
        this.jsonLine = null
        this.jsonData = cached
        console.log('rutas recuperadas del cache')
        //TODO: aqui otra formula para calcular habra que primero calcular elmas cercano del inicio y de ahi calcular todo de nuevo las distancias espaciales recursivamente hasta tener todo ordenado por distancia espacial..
        // let camino='';
        // ruta.beneficiarios.map(e=>{
        //   camino=camino+getDataLista(this.lBeneficiarios, e,'id','lat')+','+getDataLista(this.lBeneficiarios, e,'id','lng')+'/'
        // })
        // camino='https://www.google.com/maps/dir/'+camino+'/@'+this.coordenadas.latitude+','+this.coordenadas.longitude+',13z/data=!4m2!4m1!3e0'
        // console.log('camino',camino)

        return true
      }

      if (this.$nuxt.isOffline) {
        return false
      }

      const client = new TargomoClient('south_america', 'DF6SNYWF3ENCGQGGWEKU')
      const routingConfig = {
        optimizationAlgorithm: 'GREEDY_TSP',
        optimizationTime: 1,
        stores: store,
        orders: orders,
        transports: [
          {
            vehicle: {
              uuid: 'v1',
              storeUuid: 'inicio',
              priority: 1,
            },
          },
        ],
        optimizationMetadata: {
          geojsonCreation: 'ROUTING_SERVICE',
          travelOptions: {
            travelType: 'car',
            maxEdgeWeight: 1800,
            serviceUrl: 'https://api.targomo.com/south_america/',
            serviceKey: client.serviceKey,
          },
        },
      }

      //TODO: aqui otra formula para calcular habra que primero calcular elmas cercano del inicio y de ahi calcular todo de nuevo las distancias espaciales recursivamente hasta tener todo ordenado por distancia espacial..
      // let camino='';
      // ruta.beneficiarios.map(e=>{
      //   camino=camino+getDataLista(this.lBeneficiarios, e,'id','lat')+','+getDataLista(this.lBeneficiarios, e,'id','lng')+'/'
      // })
      // camino='https://www.google.com/maps/dir/'+camino+'/@'+this.coordenadas.latitude+','+this.coordenadas.longitude+',13z/data=!4m2!4m1!3e0'
      // console.log('camino',camino)

      const url = `https://api.targomo.com/fleetplanner/v1/api/key-auth/optimizations?key=${client.serviceKey}`
      try {
        const data = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(routingConfig),
        })
        const r = await data.json()
        //  console.log(r)

        let dd = [] //assign.Object([],r.tours[0].featureCollection.features)
        r.tours[0].featureCollection.features.forEach((d) => {
          if (d.geometry.type != 'Point') {
            dd.push(d)
          }
        })
        r.tours[0].featureCollection.features = dd
        this.jsonLine = null
        this.jsonData = r.tours[0].featureCollection
        setCache(cacheKey, this.jsonData)
      } catch (error) {
        console.error(error)
      }
    },
    distancia(d) {
      if (!d) {
        return -1
      }
      return getDistancia(
        this.coordenadas.latitude,
        this.coordenadas.longitude,
        d.lat,
        d.lng
      )
    },
    async afterSave(me, isError = 0) {
      if (isError != 1) {
        me.lRuteos = await this.getListaBackend('RuteosMonitor')
      }
      if (isError >= 0) {
        this.modalEval = false
        //modalMap=false;
      }
      return true
    },
    addRuteo(data) {
      if (!this.can('add', true)) {
        return false
      }
      this.item = Object.assign({}, data)
      this.item.lat = this.coordenadas.latitude
      this.item.lng = this.coordenadas.longitude
      this.item.usuarios_id = this.$store.state.auth.authUser.id
      this.item.rutas_id = data.id
      this.item._noData = 1
      this.item.obs = ''
      this.item.id = null

      this.$refs.mkForm.$refs.form.resetValidation()
      this.tituloModal =
        'Abrir Ruteo para ' + getDataLista(this.lRutas, this.item.rutas_id)
      this.modal = true
      this.$nextTick(this.$refs.focus.focus)
    },
    vermapaGoogle() {
      //
    },
    verMapaBene(bene, google = false) {
      this.getPosition()
      let benef = getDataLista(this.lBeneficiarios, bene, 'id', '*')
      
      if (!google) {
        this.markers = [0, bene]
        this.jsonData = [
          {
            type: 'LineString',
            coordinates: [
              [this.coordenadas.longitude, this.coordenadas.latitude],
              [benef.lng, benef.lat],
            ],
          },
        ]

        this.tituloModal = 'Ubicacion de ' + benef.name
        //this.jsonData = null
        this.modalMap = true
        setTimeout(() => {
          this.initMap()
        }, 300)
      } else {
        let url =
          'https://www.google.com/maps/dir/?api=1&origion=' +
          this.coordenadas.latitude +
          ',' +
          this.coordenadas.longitude +
          '&destination=' +
          benef.lat +
          ',' +
          benef.lng +
          '&dir_action=navigate'
        window.open(url)
      }
    },
    verMapa(data, posAct = false) {
      this.jsonData = []
      this.jsonLine = null
      this.markers = Object.assign([], data.beneficiarios)
      this.getRutasOptimizada(data)
      if (posAct) {
        this.markers.push(0)
      }
      this.item = Object.assign({}, data) //TODO:verificar porque da error al cargar mapa despues cargar evaluacion y volver a cargar mapa en esta sentencia

      this.item.lat = this.coordenadas.latitude
      this.item.lng = this.coordenadas.longitude
      this.item.usuarios_id = this.$store.state.auth.authUser.id
      this.item.rutas_id = data.id
      this.item._noData = 1
      this.item.obs = ''
      this.item.id = null
      this.tituloModal =
        'Mapa Ruteo de ' + getDataLista(this.lRutas, this.item.rutas_id)
      this.modalMap = true
      setTimeout(() => {
        this.initMap()
      }, 300)
    },
    getDataLista(lista, valor, busco = 'id', devuelvo = 'name') {
      return getDataLista(lista, valor, busco, devuelvo)
    },
    change(e) {
      this.item.usuarios_id = this.lRutas.find((el) => el.id === e).usuarios_id
    },
    getPosition(callBack = false, id = -1) {
      let options = {
        enableHighAccuracy: true,
        timeout: 6000,
        maximumAge: 10,
      }
      this.callBack = callBack
      this.location = id
      navigator.geolocation.getCurrentPosition(
        this.successGps,
        this.errorGps,
        options
      )
    },
    successGps(position) {
      if (
        this.coordenadas.latitude != position.coords.latitude ||
        this.coordenadas.longitude != position.coords.longitude
      ) {
        this.coordenadas = position.coords
        this.item.lat = this.coordenadas.latitude
        this.item.lng = this.coordenadas.longitude
        //console.log('Localizado', this.callBack)
        this.ordBeneficiarios(this.lRutas)
      }
      if (this.callBack != false) {
        this.callBack(this.location)
      }
      this.location = true
      this.callBack = false
    },
    errorGps(error) {
      this.location = false
      console.warn('ERROR(' + error.code + '): ' + error.message)
    },
    beforeOpen(accion, data = {}) {
      data.lat = this.coordenadas.latitude
      data.lng = this.coordenadas.longitude
    },
    getIcon(id) {
      if (id == 0) {
        return this.icon1
      } else {
        return this.icon2
      }
    },
    getMarker(id, item, index) {
      let marker = this.center
      if (id > 0) {
        let lmarker = this.lBeneficiarios.filter((e) => e.id == id)
        if (lmarker.length > 0) {
          marker = [lmarker[0].lat, lmarker[0].lng]
        }
      } else {
        marker = [this.coordenadas.latitude, this.coordenadas.longitude]
      }
      if (!item.beneficiarios) {
        return marker
      }

      if (index == item.beneficiarios.length - 1) {
        setTimeout(() => {
          this.fitMapBounds()
        }, 300)
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
    getL(ruta) {
      return false
      const client = new TargomoClient('south_america', 'DF6SNYWF3ENCGQGGWEKU')
      let targets = ruta.beneficiarios.map((el) => {
        let marker = {
          id: el,
          lat: this.coordenadas.latitude,
          lng: this.coordenadas.longitude,
        }
        if (el > 0) {
          let lmarker = this.lBeneficiarios.filter((e) => e.id == el)
          if (lmarker.length > 0) {
            marker = { id: el, lat: lmarker[0].lat, lng: lmarker[0].lng }
          }
          return marker
        }
      })

      let source = {
        id: 0,
        lat: this.coordenadas.latitude,
        lng: this.coordenadas.longitude,
      }
      console.log('targets', targets)
      // The travel options used to determine which routes should be searched for
      const options = {
        travelType: 'car',
        maxEdgeWeight: 900,
        edgeWeight: 'time',
        pathSerializer: 'geojson',
        // yes, "polygon"... this comes from a legacy implementation when polygons were the only service.
        // Will be changing in the future to a more generalized approach.
        polygon: {
          srid: 4326,
        },
      }

      // Requesting routes from the Targomo API.
      client.routes.fetch([source], targets, options).then((result) => {
        console.log('rrrr:', result)
        this.jsonData = result
      })
    },
    async getRutas(ruta) {
      return false
      if (this.$nuxt.isOffline) {
        return false
      }
      //TODO: hacer cache de peticiones
      const client = new TargomoClient('south_america', 'DF6SNYWF3ENCGQGGWEKU')
      const routingConfig = {
        optimizationAlgorithm: 'GREEDY_TSP',
        optimizationTime: 1,
        stores: [
          {
            uuid: 'inicio',
            address: {
              lat: this.coordenadas.latitude,
              lng: this.coordenadas.longitude,
            },
          },
        ],
        orders: ruta.beneficiarios.map((f) => {
          return {
            uuid: getDataLista(this.lBeneficiarios, f),
            storeUuid: 'inicio',
            priority: 1,
            address: {
              lat: getDataLista(this.lBeneficiarios, f, 'id', 'lat'),
              lng: getDataLista(this.lBeneficiarios, f, 'id', 'lng'),
              avgHandlingTime: 1,
            },
          }
        }),
        transports: [
          {
            vehicle: {
              uuid: 'v1',
              storeUuid: 'inicio',
              priority: 1,
            },
          },
        ],
        optimizationMetadata: {
          geojsonCreation: 'ROUTING_SERVICE',
          travelOptions: {
            travelType: 'car',
            maxEdgeWeight: 1800,
            serviceUrl: 'https://api.targomo.com/south_america/',
            serviceKey: client.serviceKey,
          },
        },
      }

      //TODO: aqui otra formula para calcular habra que primero calcular elmas cercano del inicio y de ahi calcular todo de nuevo las distancias espaciales recursivamente hasta tener todo ordenado por distancia espacial..
      // let camino='';
      // ruta.beneficiarios.map(e=>{
      //   camino=camino+getDataLista(this.lBeneficiarios, e,'id','lat')+','+getDataLista(this.lBeneficiarios, e,'id','lng')+'/'
      // })
      // camino='https://www.google.com/maps/dir/'+camino+'/@'+this.coordenadas.latitude+','+this.coordenadas.longitude+',13z/data=!4m2!4m1!3e0'
      // console.log('camino',camino)

      const url = `https://api.targomo.com/fleetplanner/v1/api/key-auth/optimizations?key=${client.serviceKey}`
      try {
        const data = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(routingConfig),
        })
        const r = await data.json()
        //  console.log(r)

        let dd = [] //assign.Object([],r.tours[0].featureCollection.features)
        r.tours[0].featureCollection.features.forEach((d) => {
          if (d.geometry.type != 'Point') {
            dd.push(d)
          }
        })
        r.tours[0].featureCollection.features = dd

        this.jsonData = r.tours[0].featureCollection
      } catch (error) {
        console.error(error)
      }
    },
    ordBeneficiarios(lista) {
      lista.forEach((e) => {
        let r = []
        e.beneficiarios.forEach((el) => {
          r.push({
            id: el,
            distancia: this.distancia(
              getDataLista(this.lBeneficiarios, el, 'id', '*')
            ),
          })
        })
        r.sort(function (a, b) {
          return a.distancia - b.distancia
        })
        e.beneficiariosD = r
      })
      return lista
    },
  },
  computed: {
    binding() {
      const binding = {}
      if (this.$vuetify.breakpoint.xs) binding.column = true
      return binding
    },
    lPregCateg: (app) => (categ) => {
      let l = app.lPreguntas.filter((e) => e.categ_id == categ)

      //console.log('categ:', categ, l)
      return l
    },
  },
  watch: {},
  async mounted() {
    //console.log('monted monitor');
    this.getPosition()

    this.lUsuarios = await this.getListaBackend('monitores')
    this.lBeneficiarios = await this.getListaBackend('Beneficiarios', 'id,name')
    this.lRuteos = await this.getListaBackend('RuteosMonitor')

    let rutas = await this.getListaBackend(
      'Rutas',
      'id,name,usuarios_id,descrip'
    )

    if (rutas.length > 0){
      this.lRutas = this.ordBeneficiarios(rutas)
    }
    

    this.lCateg = await this.getListaBackend('Categ', 'id,name,orden')
    this.lPreguntas = await this.getListaBackend('Preguntas')

    if (this.lCateg.length > 0){
    this.lCateg.sort(function (a, b) {
      return a.orden - b.orden
    })
    }

    if (this.lPreguntas.length > 0){
    this.lPreguntas.sort(function (a, b) {
      return a.orden - b.orden
    })
    }

    let services = await this.getDataBackend('Servicios')
    if (services.length > 0){
    services.forEach((e) => {
      e.cantidad = 1
      e.selected = false
    })
    }
    this.lServicios = services
    //this.setOptionTable('del').visible=false;
  },
}
</script>
<style scoped>
</style>
