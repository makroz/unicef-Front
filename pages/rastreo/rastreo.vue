<template>
  <div id="pageReportes">
    <v-container grid-list-xs fluid style="padding:10px">
      <v-layout row wrap style="z-index:10000">
        <v-flex grow>
          <h2 class="font-weight-bold ">Rastreo</h2>
          <div style="width:160px;display: inline-block;vertical-align:top">
            <v-select
              v-model="fechaSel"
              :items="lFechas"
              label="Periodo de Fecha:"
              hideDetails
              dense
              @change="changeFecha()"
            ></v-select>
          </div>
          <mk-date
            hideDetails
            v-model="desde"
            label="Desde"
            class="date"
            v-if="fechaSel == 'Personalizada'"
          >
          </mk-date>
          <mk-date
            hideDetails
            v-model="hasta"
            label="Hasta"
            class="date"
            v-if="fechaSel == 'Personalizada'"
          >
          </mk-date>
          <div style="width:250px;display: inline-block;vertical-align:top">
            <v-select
              v-model="usuario"
              :items="lUsuarios"
              item-text="name"
              item-value="id"
              label="Usuario"
              hideDetails
              dense
            ></v-select>
          </div>
          <v-btn
            color="green"
            round
            small
            @click="reCalculo()"
            title="Actualizar"
          >
            <v-icon>published_with_changes</v-icon>
            &nbsp;Actualizar
          </v-btn>
        </v-flex>
      </v-layout>

      <v-card class="pa-2">
        <v-toolbar color="indigo" dark dense>
          <v-toolbar-title class="body-2"
            >Seguimiento Usuarios
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            v-if="reportes.rastreo"
            icon
            color="green"
            small
            title="actualizar solo Este Grafico"
            @click="reCalculo('rastreo')"
          >
            <v-icon>refresh</v-icon>
          </v-btn>
          <v-btn
            icon
            color="red"
            small
            @click="reportes.rastreo = !reportes.rastreo"
          >
            <v-icon v-if="reportes.rastreo" title="Ocultar"
              >visibility_off</v-icon
            >
            <v-icon v-else title="Mostrar">visibility</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout column v-if="reportes.rastreo">
          <v-flex>
            <!-- mapa de ruteo -->
            <v-card style="margin-top: 5px">
              <div
                id="map-wrap"
                style="height: calc(100vh - 310px); width: 100%;z-index:0"
              >
                <client-only>
                  <l-map
                    :zoom="zoom"
                    :center="center"
                    style="height: 100%; width: 100%;z-index:0"
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
                    <div v-if="markers && markers.length > 0">
                      <l-marker
                        v-for="(marker, index) in markers"
                        :key="index"
                        :lat-lng="getMarker(marker)"
                        :draggable="false"
                        :visible="true"
                        :icon="getIcon(marker)"
                      >
                        <l-tooltip>
                          {{ marker.name || 'Tu ubicacion Actual' }}
                        </l-tooltip>
                      </l-marker>
                    </div>
                  </l-map>
                </client-only>
              </div>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import Material from 'vuetify/es5/util/colors'
import MkDate from '@/components/mkComponentes/MkDate'
import {
  c,
  getDataLista,
  formatDT
} from '@/components/mkComponentes/lib/MkUtils.js'
import { icon, featureGroup } from 'leaflet'

export default {
  middleware: ['auth'],
  layout: 'dashboard',
  components: { MkDate },
  data: () => ({
    cont: 0,
    color: Material,
    desde: '',
    hasta: '',
    usuario: 0,
    lUsuarios: [],
    lFechas: [
      'Hoy',
      'Ayer',
      'Esta Semana',
      'Semana Pasada',
      'Este Mes',
      'Mes Anterior',
      'Este Año',
      'Personalizada'
    ],
    fechaSel: 'Este Mes',
    reportes: {
      rastreo: true
    },
    lReportes: {
      rastreo: {}
    },
    center: [-17.783373986957255, -63.18209478792436],
    zoom: 13,
    coordenadas: {},
    markers: [],
    // icon1: icon({
    //   iconUrl: require('~/static/img/icon1.png'),
    //   iconSize: [32, 32],
    //   iconAnchor: [16, 30],
    //   tooltipAnchor: [16, -22]
    // }),
    // icon2: icon({
    //   iconUrl: require('~/static/img/icon2.png'),
    //   iconSize: [16, 16],
    //   iconAnchor: [8, 14],
    //   tooltipAnchor: [16, -12]
    // }),
    // icon0: icon({
    //   iconUrl: require('~/static/img/icon0.png'),
    //   iconSize: [32, 32],
    //   iconAnchor: [16, 30],
    //   tooltipAnchor: [16, -22]
    // }),
    lIcon: [
      'blue',
      'gold',
      'red',
      'green',
      'orange',
      'yellow',
      'violet',
      'grey',
      'black'
    ],
    jsonData: [],
    jsonLine: []
  }),
  methods: {
    changeFecha() {
      const fecha = new Date()
      let primerDia = new Date()
      let ultimoDia = new Date()
      if (this.fechaSel == 'Hoy') {
      }
      if (this.fechaSel == 'Ayer') {
        primerDia = new Date(
          fecha.getFullYear(),
          fecha.getMonth(),
          fecha.getDate() - 1
        )
        ultimoDia = new Date(
          fecha.getFullYear(),
          fecha.getMonth(),
          fecha.getDate() - 1
        )
      }
      if (this.fechaSel == 'Esta Semana') {
        let day = fecha.getDay() == 0 ? 6 : fecha.getDay() -1
        primerDia = new Date(
          fecha.getFullYear(),
          fecha.getMonth(),
          fecha.getDate() - day
        )
        ultimoDia = new Date(
          primerDia.getFullYear(),
          primerDia.getMonth(),
          primerDia.getDate() + 6
        )
      }
      if (this.fechaSel == 'Semana Pasada') {
        let day = fecha.getDay() == 0 ? 6 : fecha.getDay() - 1
        day = day + 7
        primerDia = new Date(
          fecha.getFullYear(),
          fecha.getMonth() ,
          fecha.getDate() - day
        )
        ultimoDia = new Date(
          primerDia.getFullYear(),
          primerDia.getMonth() ,
          primerDia.getDate() + 6
        )
      }
      if (this.fechaSel == 'Este Mes') {
        primerDia = new Date(fecha.getFullYear(), fecha.getMonth() , 1)
        ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0)
      }
      if (this.fechaSel == 'Mes Anterior') {
        primerDia = new Date(fecha.getFullYear(), fecha.getMonth()-1, 1)
        ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth(), 0)
      }
      if (this.fechaSel == 'Este Año') {
        primerDia = new Date(fecha.getFullYear(), 0, 1)
        ultimoDia = new Date(fecha.getFullYear() + 1, 0, 0)
      }

      this.desde =
        primerDia.getFullYear() +
        '-' +
        (primerDia.getMonth() + 1) +
        '-' +
        primerDia.getDate()
      this.hasta =
        ultimoDia.getFullYear() +
        '-' +
        (ultimoDia.getMonth() + 1) +
        '-' +
        ultimoDia.getDate()
      console.log('fecha', this.desde, this.hasta, this.fechaSel)
    },
    formatDT(d = '', time = true) {
      return formatDT(d, time)
    },
    getDataLista(lista, valor, busco = 'id', devuelvo = 'name', defa = false) {
      return getDataLista(lista, valor, busco, devuelvo, defa)
    },
    async getDatasBackend(mod, listas) {
      let data = await this.$store.dispatch('auth/loadDatas', {
        mod: mod,
        listas: listas
      })
      listas.forEach((el) => {
        let datos = {}
        if (el.lista && el.lista != '') {
          datos = data[el.lista]
        } else {
          datos = data[el.mod]
          el.lista = 'l' + el.mod
        }

        if (el.item) {
          //console.log('el item is array',el.item);
          if (Array.isArray(el.item)) {
            el.item.forEach((e) => this.updateListCol(e, datos))
          } else {
            this.updateListCol(el.item, datos)
          }
        }

        if (typeof el.each === 'function') {
          datos.forEach(el.each)
        }

        let sort = el.sort || false
        if (sort && Array.isArray(datos)) {
          datos.sort(function(a, b) {
            if (typeof a[sort] === 'string') {
              if (a[sort] > b[sort]) {
                return 1
              }
              if (a[sort] < b[sort]) {
                return -1
              }
              return 0
            } else {
              return a[sort] - b[sort]
            }
          })
        }

        let sortAsc = el.sortAsc || false
        if (sortAsc && Array.isArray(datos)) {
          datos.sort(function(a, b) {
            return b[sortAsc] - a[sortAsc]
          })
        }

        if (el.lista != '') {
          if (this[el.lista]) {
            this[el.lista] = datos
          }
        }
      })
      return data
    },
    async getDataBackend(url, campos = '', datos = null, method = '') {
      let data = await this.$store.dispatch('auth/loadData', {
        url: url,
        campos: campos,
        datos: datos,
        method: method
      })
      return data
    },
    async reCalculo(modulo = '') {
      let reportes = {}
      if (modulo != '') {
        reportes[modulo] = true
      } else {
        reportes = this.reportes
      }
      //console.log('Fecha:', this.desde, this.hasta)
      let lReportes = await this.getDataBackend(
        'Rastreomap',
        '',
        {
          desde: this.desde,
          hasta: this.hasta,
          reportes: reportes,
          usuario: this.usuario
        },
        'post'
      )

      if (modulo != '') {
        this.lReportes[modulo] = lReportes[modulo]
      } else {
        this.lReportes = lReportes
      }

      let lrutaUsuario = {}
      let nusuario = 1
      this.lReportes.rastreo.forEach((e) => {
        if (e.lat != -1) {
          if (lrutaUsuario[e.usuarios_id]) {
            lrutaUsuario[e.usuarios_id].push({
              lat: e.lat,
              lng: e.lng,
              fecha: e.fecha
            })
          } else {
            lrutaUsuario[e.usuarios_id] = [
              { lat: e.lat, lng: e.lng, fecha: e.fecha }
            ]
          }
        }
      })
      this.jsonData = []
      this.markers = []
      nusuario = Object.keys(lrutaUsuario)
      let orig = []
      nusuario.forEach((e, index) => {
        orig = lrutaUsuario[e][0]
        lrutaUsuario[e].forEach((el) => {
          this.jsonData.push({
            type: 'LineString',
            coordinates: [
              [orig.lng, orig.lat],
              [el.lng, el.lat]
            ],
            color: index
          })
          orig = el
        })
        this.markers.push({
          id: e,
          name: this.getDataLista(this.lUsuarios, e),
          lat: orig.lat,
          lng: orig.lng,
          icon: index
        })
      })
      console.log(lrutaUsuario)
      setTimeout(() => {
        this.fitMapBounds()
      }, 500)

      //   gps = e.coord.split(' ')
      //   this.markers.push({ ...e.beneficiario_coord, icon: 0, posi: posi })
      //   this.markers.push({
      //     id: e.beneficiario_coord.id,
      //     name: e.beneficiario_coord.name,
      //     lat: gps[0],
      //     lng: gps[1],
      //     icon: 1,
      //     posi: posi
      //   })
      //   this.jsonData.push({
      //     type: 'LineString',
      //     coordinates: [
      //       [e.beneficiario_coord.lng, e.beneficiario_coord.lat],
      //       [gps[1], gps[0]]
      //     ],
      //     color: 0
      //   })

      //   this.jsonData.push({
      //     type: 'LineString',
      //     coordinates: [orig, [gps[1], gps[0]]],
      //     color: 1
      //   })
      //   posi++
      //   orig = [gps[1], gps[0]]
      // })

      this.cont++
    },
    //metodos del mapa
    getIcon(item) {
      let n = item.icon % 9
      return icon({
        iconUrl:
          'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-' +
          this.lIcon[n] +
          '.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    },
    getStyles(features) {
      let n = features.geometry.color % 9
      return { color: this.lIcon[n], weight: 2, opacity: 0.6 }
      // if (features.geometry.color == 1) {
      //   return { color: 'blue', weight: 2, opacity: 0.6 }
      // }
      // return { color: 'red', weight: 5, opacity: 0.3 }
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
      if (this.lReportes.rastreo.length == 0) return true
      let map = this.$refs.mymap.mapObject
      //const visibleMarkers = []

      let group = new featureGroup()
      map.eachLayer(function(layer) {
        if (layer.feature != undefined) group.addLayer(layer)
        // if (layer instanceof L.Marker) {
        //   visibleMarkers.push(layer)
        // }
      })
      map.flyToBounds(group.getBounds(), {
        padding: L.point(36, 36),
        animate: true
      })

      // if (visibleMarkers.length > 0) {
      //   const markersBounds = L.latLngBounds([visibleMarkers[0].getLatLng()])
      //   visibleMarkers.forEach((marker) => {
      //     markersBounds.extend(marker.getLatLng())
      //   })

      //   map.flyToBounds(markersBounds, {
      //     padding: L.point(36, 36),
      //     animate: true
      //   })
      // }
    }
  },
  computed: {
    totalServicios() {
      let c = 0
      this.lReportes.servicios.map((e) => (c = c + e.cant * 1))
      return c
    }
  },
  async mounted() {
    this.changeFecha()
    await this.reCalculo()
    let listas = await this.getDatasBackend('Ruteos', [
      {
        mod: 'Usuarios',
        campos: 'id,name'
      }
    ])
    this.lUsuarios = [
      { id: 0, name: 'Todos las Usuarios...' },
      ...this.lUsuarios
    ]
    this.cont++
  }
}
</script>
<style scoped>
.date {
  width: 130px;
  display: inline-block;
}
</style>