<template>
  <div id="pageTable">
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card>
            <!-- presentacion -->
            <v-layout>
              <v-flex pa-4 class="text-xs-center">
                <img
                  style="max-width: 100%; max-height: 250px; height: auto"
                  src="~/static/img/recolector.jpg"
                />
              </v-flex>
              <v-flex>
                <v-card-title primary-title>
                  <div>
                    <div class="font-weight-medium">Bienvenido Recolector</div>
                    <div class="headline primary--text text-uppercase">
                      {{
                        $store.state.auth.authUser
                          ? $store.state.auth.authUser.name
                          : 'Guess'
                      }}
                    </div>
                    <div v-show="$store.state.auth.pwa">
                      <v-btn id="buttonInstall" large class="error">
                        Instalar APPLICACION
                      </v-btn>
                    </div>
                    <span>
                      Este es tu panel de control, donde podras visualizar todas
                      tus Recolecciones Disponibles y Activas, ademas de otros
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
                  title="Solicitudes Disponibles"
                  :text="lSolicitudServicios.length + ''"
                  color="red darken-4 grey--text"
                ></mk-simple-card>

                <mk-simple-card
                  title="Solicitudes Aceptadas"
                  :text="nAceptadas"
                  color="yellow darken-4"
                ></mk-simple-card>

                <mk-simple-card
                  title="Ordenes de Servicios 7d"
                  :text="Object.keys(lOrdenes).length + ''"
                  color="green darken-4 grey--text"
                ></mk-simple-card>

                <v-icon
                  :color="location ? 'green' : 'grey'"
                  @click="getPosition()"
                  >my_location</v-icon
                >
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
      <!-- Solicitudes Disponibles -->
      <v-card>
        <v-toolbar color="green darken-4" dark>
          <v-icon>add_location_alt</v-icon>
          <v-toolbar-title>Solicitudes Disponibles</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list two-line>
          <v-list-tile v-for="(sol, index) in lDispon" :key="index" href="#">
            <v-list-tile-avatar>
              <v-btn
                icon
                flat
                color="success"
                @click="verMapaBene(index, false)"
              >
                <v-icon large>map</v-icon>
              </v-btn>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                <v-layout row wrap>
                  <v-flex>
                    <span class="title text-capitalize">
                      {{ sol.name ? sol.name : 'Desconicido' }}
                    </span>
                  </v-flex>
                </v-layout>
              </v-list-tile-title>
              <v-list-tile-sub-title class="caption">
                Cant. Solicitudes:
                {{ Object.keys(sol.lista).length }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon color="primary" @click="aceptarSol(sol, index)">
                <v-icon>add_task</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
      <br />
      <!-- Solicitudes Aceptadas -->
      <v-card>
        <v-toolbar color="yellow darken-4" dark>
          <v-icon>add_location_alt</v-icon>
          <v-toolbar-title>Solicitudes Aceptadas</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list two-line>
          <v-list-tile v-for="(sol, index) in lAsignadaD" :key="index" href="#">
            <v-list-tile-avatar>
              <v-btn
                icon
                flat
                color="success"
                @click="verMapaBene(sol.id, false)"
              >
                <v-icon large>map</v-icon>
              </v-btn>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                <v-layout row wrap>
                  <v-flex>
                    <span class="title text-capitalize">
                      {{
                        lAsignada[sol.id].name
                          ? lAsignada[sol.id].name
                          : 'Desconocido'
                      }}
                    </span>
                  </v-flex>
                </v-layout>
              </v-list-tile-title>
              <v-list-tile-sub-title class="caption">
                Cant. Solicitudes:
                {{ Object.keys(lAsignada[sol.id].lista).length }}
                Distancia: {{ (sol.distancia * 1.0).toFixed(2) }} Km
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn
                icon
                color="red"
                dark
                @click="realizarSol(lAsignada[sol.id], sol.id)"
              >
                <v-icon>plumbing</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
      <br />
      <!-- Solicitudes Realizadas -->
      <v-card>
        <v-toolbar color="blue darken-4" dark>
          <v-icon>add_location_alt</v-icon>
          <v-toolbar-title>Ordenes de Servicios 7 dias</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list two-line>
          <v-list-tile
            class="elevation-1"
            v-for="(ordenes, index) in lOrdenes"
            :key="index"
            href="#"
          >
            <v-list-tile-avatar>
              <v-btn
                icon
                flat
                color="success"
                @click="verMapaBene(ordenes.beneficiario_id, false)"
              >
                <v-icon large>map</v-icon>
              </v-btn>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                <v-layout row wrap>
                  <v-flex>
                    <span class="title text-capitalize">
                      {{
                        getDataLista(
                          lBeneficiarios,
                          ordenes.beneficiario_id,
                          'id',
                          'name',
                          'Desconocido'
                        )
                      }}
                    </span>
                  </v-flex>
                </v-layout>
              </v-list-tile-title>
              <v-list-tile-sub-title class="caption">
                Orden No. {{ ordenes.id }} - Ref: {{ ordenes.ref }} <br />
                Fecha {{ formatDT(ordenes.created_at) }} Estado:
                {{ lEstadosSol[ordenes.estado] }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn
                icon
                dark
                :color="lColorSol[ordenes.estado]"
                @click="verRealizadas(ordenes)"
              >
                <v-icon>visibility</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
      <br />
      <!-- formulario Principal -->
      <mk-form-full-screen
        ref="mkForm"
        :modal="modal"
        :tit="tituloModal"
        :accion="accion"
        @closeDialog="closeDialog"
        @grabarItem="grabarItem"
        :bTitulo="bTitulo"
      >
        <mk-show-solicitud
          :item="item"
          :accion="item.accion"
          :lBeneficiarios="lBeneficiarios"
          :lForma_pagos="lForma_pagos"
          :lEstadosSol="lEstadosSol"
          :lMateriales="lMateriales"
          :lServices="lServices"
          :lMedidas="lMedidas"
          :lControl_calidades="lControl_calidades"
          :mkImgData="mkImgData"
        >
        </mk-show-solicitud>
      </mk-form-full-screen>
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
    </v-container>
  </div>
</template>
<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'
import MkEstadosMix from '@/components/mkComponentes/mixins/MkEstadosMix'
import MkImgMix from '@/components/mkComponentes/mixins/MkImgMix'
import MkSimpleCard from '~/components/mkComponentes/mkCards/mkSimpleCard.vue'
import MkShowSolicitud from '@/components/mkComponentes/MkShowSolicitud'
import {
  getDataLista,
  getDistancia,
} from '@/components/mkComponentes/lib/MkUtils.js'
import { icon } from 'leaflet'
import MkFormFullScreen from '~/components/mkComponentes/MkFormFullScreen.vue'
//const _dirty = process.env.mkConfig.dirty

export default {
  middleware: ['authAccess'],
  mixins: [MkModuloMix, MkEstadosMix, MkImgMix],
  components: { MkSimpleCard, MkFormFullScreen, MkShowSolicitud },
  name: 'Recolector',
  //disModTable: true,
  data() {
    return {
      urlModulo: 'SolicitudServicios',
      //titModulo: '',

      location: false,
      modalMap: false,
      center: [-17.332269, -63.252798],
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

      lBeneficiarios: [],
      lServicios: [],
      lSolicitudServicios: [],
      lDispon: {},
      lAsignada: {},
      lAsignadaD: [],
      lServices: [],
      lUsuarios: [],
      lMateriales: [],
      lMedidas: [],
      lForma_pagos: [],
      lControl_calidades: [],
      lOrdenes: {},
      nAceptadas: 0,
      imgPrefix: 'solicitud_servicios',
      callBack: false,
      bTitulo: '',
    }
  },
  methods: {
    aceptarSol(data, id) {
      data.id = id
      data.estado = 1
      data.accion = 'aceptar'
      this.openDialog('edit', data)
    },
    realizarSol(data, id) {
      data.id = id
      data.estado = 2
      data.accion = 'realizar'
      this.openDialog('edit', data)
    },
    verRealizadas(data) {
      if (data.estado == 0) {
        data.estado = 3
      }

      data.accion = 'show'
      this.openDialog('edit', data)
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
    getSolicitudServicios() {
      let user = this.$store.state.auth.authUser.id
      let fecha = new Date()
      fecha.setDate(fecha.getDate() - 7)
      return [
        {
          mod: 'SolicitudServicios',
          datos: {
            modulo: 'mkServicios',
            rel: 1,
            filtros: [['estado', '=', '1']],
          },
          each: (e) => {
            if (e.estado == 1) {
              if (this.lDispon[e.beneficiarios_id]) {
                this.lDispon[e.beneficiarios_id].lista[e.id] = e
              } else {
                this.lDispon[e.beneficiarios_id] = {
                  name: this.getDataLista(
                    this.lBeneficiarios,
                    e.beneficiarios_id,
                    'id',
                    'name',
                    'Desconocido'
                  ),
                  lista: {},
                }
                this.lDispon[e.beneficiarios_id].lista[e.id] = e
              }
            }
          },
        },
        {
          mod: 'SolicitudServicios',
          lista: 'Asignado',
          datos: {
            modulo: 'mkServicios',
            filtros: [
              ['estado', '=', '2'],
              ['usuarios_id_2', '=', user],
            ],
          },
          each: (e) => {
            if (e.estado == 2) {
              if (this.lAsignada[e.beneficiarios_id]) {
                this.lAsignada[e.beneficiarios_id].lista[e.id] = e
              } else {
                this.lAsignada[e.beneficiarios_id] = {
                  name: this.getDataLista(
                    this.lBeneficiarios,
                    e.beneficiarios_id,
                    'id',
                    'name',
                    'Desconocido'
                  ),
                  lista: {},
                }
                this.lAsignada[e.beneficiarios_id].lista[e.id] = e
                this.lAsignadaD.push({
                  id: e.beneficiarios_id,
                  distancia: 0,
                })
              }
            }
          },
        },
        {
          mod: 'Orden_servicios',
          datos: {
            modulo: 'mkServicios',
            filtros: [
              ['created_at', '>', fecha],
              ['recolector_id', '=', user],
            ],
          },
          each: (e) => {
            this.lOrdenes[e.id] = {
              name: this.getDataLista(
                this.lBeneficiarios,
                e.beneficiario_id,
                'id',
                'name',
                'Desconocido'
              ),
              lista: {},
              ...e,
            }
          },
        },
        {
          mod: 'SolicitudServicios',
          lista: 'Realizados',
          datos: {
            modulo: 'mkServicios',
            relations: ['materiales', 'qa'],
            filtros: [
              ['usuarios_id_3', '=', user],
              ['fecha_3', '>', fecha],
              ['orden_servicios_id', '>', 0],
            ],
          },
          each: (e) => {
            if (this.lOrdenes[e.orden_servicios_id]) {
              this.lOrdenes[e.orden_servicios_id].lista[e.id] = e
            }
          },
        },
      ]
    },
    beforeSave(me) {
      let servicios = []
      for (const obj in me.lServices) {
        if (me.lServices[obj].selected === true) {
          let service = {
            id: me.lServices[obj].id,
            //cant: me.lServices[obj].cantidad,
            sol_id: me.lServices[obj].sol_id,
          }

          if (me.item.accion == 'realizar') {
            //if (me.item.estado == 2) {
            service.realizado = me.lServices[obj].realizado
            service.obs = me.lServices[obj].obs_sol
            if (service.realizado) {
              service.materiales = me.lServices[obj].materiales
            }
          }

          servicios.push(service)
        }
      }
      me.item.servicios = servicios
      me.item.beneficiario_id = servicios
      //me.item.estado = (me.item.estado * 1) + 1
      me.item.estado++
    },
    async afterSave(me, isError = 0) {
      //console.log('aftersve', isError)
      if (isError > -1) {
        this.lDispon = {}
        this.lAsignada = {}
        this.lOrdenes = {}
        this.lAsignadaD = []
        //let filtros = [['OR', ['estado', '=', '1'], ['estado', '=', '2']]]s
        let listas = await this.getDatasBackend(
          this.urlModulo,
          this.getSolicitudServicios()
        )
        this.nAceptadas = listas.Asignado.length
        this.coordenadas = {}
        this.getPosition()
      } else {
        me.item.estado--
      }
      return true
    },
    async beforeOpen(accion, data = {}) {
      data._noData = 1
      data.lat = this.coordenadas.latitude
      data.lng = this.coordenadas.longitude
      if (accion == 'show') {
        data.accion = accion
      }
      this.lServices = []
      if (accion == 'add') {
        this.bTitulo = ''
        //this.itemData.epsa = ''
        data.estado = -1
        data.foto = 0
        data.accion = 'add'

        this.lServicios.forEach((e) => {
          this.lServices.push({
            cantidad: 1,
            estado: -1,
            selected: null,
            ...e,
          })
        })
      } else {
        let sel = null
        let lSol = Object.keys(data.lista)
        lSol.forEach((el) => {
          let e = data.lista[el]
          let serv = this.getDataLista(
            this.lServicios,
            e.servicios_id,
            'id',
            '*'
          )
          //aqui empeiza lo mismo que recolector
          if (serv) {
            let serv_ = {}
            if (e.estado == 2) {
              serv_ = {
                realizado: false,
                obs_sol: e.obs || '',
                obs_verif: e.obs_verif || '',
                materiales: [],
              }
            }
            let qa = {}
            if (e.estado > 2 || data.estado > 3) {
              this.lControl_calidades.forEach((el) => {
                qa[el.id] = { selected: false, puntos: '' }
              })
              if (e.estado >= 4 && e.estado <= 7) {
                e.qa.forEach((el) => {
                  qa[el.id] = { selected: true, puntos: el.puntos }
                })
              }
              sel = 1
              e.estado = e.estado * 1
              serv_ = {
                realizado: e.estado != 9 && e.estado != 8 && e.estado != 1,
                verificado:
                  (e.estado > 3 && e.estado != 9) || data.estado > 3
                    ? data.estado >= 5 && e.estado < 8 && e.estado > 3
                      ? 4
                      : e.estado
                    : null,
                obs_sol: e.obs,
                obs_verif: e.obs_verif,
                materiales: e.materiales, //aqui
                qa: qa,
              }
            }
            this.lServices.push({
              sol_id: e.id,
              cantidad: e.cant,
              fecha: e.created_at,
              estado: e.estado,
              evaluaciones_id: e.evaluaciones_id,
              monitor: this.getDataLista(
                this.lUsuarios,
                e.created_by,
                'id',
                'name',
                ''
              ),
              ...serv,
              ...serv_,
              selected: sel,
            })
            //console.log('service', this.lServices)
          }
          //hasta aqui
          //  if (serv) {
          //           let serv_ = {}
          //           if (e.estado == 2) {
          //             serv_ = {
          //               realizado: false,
          //               obs_sol: '',
          //               obs_verif: '',
          //               materiales: [],
          //             }
          //           }
          //           let qa={}
          //           if (e.estado == 3 || e.estado == 9 || e.estado == 8|| e.estado == 4) {

          //             this.lControl_calidades.forEach(el => {
          //                 qa[el.id]={selected:false,puntos:''}
          //             });
          //             if (e.estado == 4 ) {
          //               e.qa.forEach(el => {
          //                 qa[el.id]={selected:true,puntos:el.puntos}
          //             });
          //              }
          //             sel = 1
          //             e.estado=e.estado*1
          //             serv_ = {
          //               realizado: e.estado != 9 && e.estado != 8,
          //               verificado: e.estado>3 && e.estado !=9 ?e.estado:null,
          //               obs_sol: e.obs,
          //               obs_verif: e.obs_verif,
          //               materiales: e.materiales, //aqui
          //               qa:qa,
          //             }
          //           }
          //           this.lServices.push({
          //             sol_id: e.id,
          //             cantidad: e.cant,
          //             fecha: e.created_at,
          //             estado: e.estado,
          //             evaluaciones_id: e.evaluaciones_id,
          //             monitor: this.getDataLista(
          //               this.lUsuarios,
          //               e.created_by,
          //               'id',
          //               'name',
          //               ''
          //             ),
          //             ...serv,
          //             ...serv_,
          //             selected: sel,
          //           })
          //           //console.log('service', this.lServices)
          //         }
        })
        data.noImage = !!!data.foto
        //data.estado =(data.estado*1);
      }
    },
    afterOpen(accion, data) {
      if (data.accion == 'aceptar') {
        this.tituloModal = 'Aceptar Solicitudes'
        this.bTitulo = 'Aceptar'
      }
      if (data.accion == 'realizar') {
        this.tituloModal = 'Crear Nota de Servicio'
        this.bTitulo = 'Realizar'
      }
      if (data.accion == 'show') {
        this.tituloModal = 'Nota de Servicio ' + data.id
        this.accion = 'show'
      }
    },
    verMapaBene(bene, google = false) {
      this.getPosition()
      let benef = this.getDataLista(this.lBeneficiarios, bene, 'id', '*')
      if (!benef) {
        return false
      }
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
        //        console.log('mapa',this.markers,this.jsonData,bene,benef);
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
        console.log('Localizado', this.callBack)
        this.lAsignadaD = this.ordBeneficiarios(this.lAsignada)
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
      //console.log('marker:',marker,id,item,index);
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
    ordBeneficiarios(lista) {
      let r = []
      for (const index in lista) {
        if (Object.hasOwnProperty.call(lista, index)) {
          r.push({
            id: index,
            distancia: this.distancia(
              getDataLista(this.lBeneficiarios, index, 'id', '*')
            ),
          })
        }
      }
      r.sort(function (a, b) {
        return a.distancia - b.distancia
      })
      return r
    },
  },
  async mounted() {
    setTimeout(() => {
      this.getPosition()
    }, 3000)

    let listas = await this.getDatasBackend(this.urlModulo, [
      { mod: 'Usuarios', campos: 'id,name' },
      {
        mod: 'Beneficiarios',
        campos: 'id,name,epsa',
        datos: { _customFields: 1 },
      },
      {
        mod: 'Rutas',
        datos: { rel: 1 },
        campos: 'id,name,usuarios_id,descrip',
      },
      {
        mod: 'Materiales',
        datos: { modulo: 'mkServicios', filtros:[['lnota','=','1']] },
        campos: 'id,name,medida_id',
      },
      {
        mod: 'Medidas',
        datos: { modulo: 'mkServicios' },
        campos: 'id,simbolo',
      },
      {
        mod: 'Forma_pagos',
        datos: { modulo: 'mkServicios' },
        campos: 'id,name',
      },
      {
        mod: 'Servicios',
        each: (e) => {
          e.cantidad = 1
          e.selected = false
        },
      },
      {
        mod: 'Control_calidades',
        datos: { modulo: 'mkServicios' },
        campos: 'id,name,orden',
        orden: 'orden',
      },
      ...this.getSolicitudServicios(),
    ])

    this.nAceptadas = listas.Asignado.length

    //TODO: aqui otra formula para calcular habra que primero calcular elmas cercano del inicio y de ahi calcular todo de nuevo las distancias espaciales recursivamente hasta tener todo ordenado por distancia espacial..
    // let camino='';
    // ruta.beneficiarios.map(e=>{
    //   camino=camino+getDataLista(this.lBeneficiarios, e,'id','lat')+','+getDataLista(this.lBeneficiarios, e,'id','lng')+'/'
    // })
    // camino='https://www.google.com/maps/dir/'+camino+'/@'+this.coordenadas.latitude+','+this.coordenadas.longitude+',13z/data=!4m2!4m1!3e0'
    // console.log('camino',camino)
  },
}
</script>
<style scoped>
</style>
