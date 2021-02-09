<template>
  <div id="pageTable">
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card>
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

              <v-icon :color="location?'green':'grey'">my_location</v-icon>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>

      <v-card>
        <v-toolbar color="red darken-4" dark>
          <v-icon>add_location_alt</v-icon>
          <v-toolbar-title>Rutas Disponibles</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list>
          <v-list-tile
            v-for="ruta in lRuteos.dispon.data"
            :key="ruta.id"
            href="#"
          >
            <v-list-tile-avatar>
              <v-btn icon flat color="success" @click="verMapa(ruta)">
                <v-icon>map</v-icon>
              </v-btn>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                <v-layout row wrap>
                  <v-flex>
                    <span class="caption"> ({{ ruta.rutas_id }}) </span>
                    <span class="title text-capitalize"> {{ getDataLista(lRutas, ruta.rutas_id) }}</span>
                    <span class="caption text--grey"> {{ getDataLista(lRutas, ruta.rutas_id,'id','descrip') }}</span>
                  </v-flex>
                  <v-flex shrink>
                    {{
                      getDataLista(lRutas, ruta.rutas_id, 'id', 'beneficiarios')
                        .length
                    }}
                    Beneficiarios
                  </v-flex>
                </v-layout>
              </v-list-tile-title>
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
      <v-card>
        <v-toolbar color="yellow darken-4" dark>
          <v-icon>pin_drop</v-icon>
          <v-toolbar-title>Rutas Abiertas</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>visibility</v-icon>
          </v-btn>
        </v-toolbar>
        <v-list>
          <v-list-group
            v-model="ruteo.active"
            v-for="(ruteo, index) in lRuteos"
            :key="index"
            no-action
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>titulo del tipo ruteo</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-for="subItem in ruteo.data"
              :key="subItem.id"
              href="#"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{
                  getDataLista(lRutas, subItem.rutas_id)
                }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>add</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
        </v-list>
      </v-card>

     <mk-form
        ref="mkForm"
        :modal="modal"
        :tit="tituloModal"
        :accion="0"
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


<mk-form
        ref="mkFormMap"
        :modal="modalMap"
        :tit="tituloModal"
        :accion="-1"
        @closeDialog="modalMap=false"
        classContent="pa-0"
      >
           <div id="map-wrap" style="height: 200px; width: 100%">
                <client-only>
                  <l-map
                    :zoom="zoom"
                    :center="center"
                    style="height: 200px; width: 100%"
                    ref="mymap"
                  >
                    <l-tile-layer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="<a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
                      :useCors="false"
                    ></l-tile-layer>
                    <div v-if="item.beneficiarios && item.beneficiarios.length > 0">
                      <l-marker
                        v-for="(marker, index) in item.beneficiarios"
                        :key="index"
                        :lat-lng="getMarker(marker, item, index)"
                        :draggable="false"
                        :visible="true"
                      ></l-marker>
                    </div>
                  </l-map>
                </client-only>
              </div>
      </mk-form>
     
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'
import VWidget from '@/components/VWidget'
import MkSimpleCard from '~/components/mkComponentes/mkCards/mkSimpleCard.vue'
import { getDataLista } from '@/components/mkComponentes/lib/MkUtils.js'
const _dirty = process.env.mkConfig.dirty

export default {
  //middleware: ['authAccess'],
  mixins: [MkModuloMix],
  components: { VWidget, MkSimpleCard },
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
      },
      lRutas: [],
      item:{},
      lBeneficiarios:[],
      modalMap:false,
      center: [-17.783373986957255, -63.18209478792436],
      zoom: 13,
    }
  },
  methods: {
    async afterSave(me, isError = 0) {
      me.lRuteos = await this.getListaBackend('RuteosMonitor')
    },
    addRuteo(data){
      if (!this.can('add', true)) {
        return false
      }

      data.lat=this.item.lat
      data.lng= this.item.lng
      this.item = Object.assign({}, data)
      this.item.usuarios_id =  this.$store.state.auth.authUser.id
      this.item.rutas_id =  data.id
      this.item._noData =  1
      this.item.obs =  ''
      this.item.id=null

      this.$refs.mkForm.$refs.form.resetValidation()
      this.tituloModal = 'Crear Ruteo para '+getDataLista(this.lRutas,this.item.rutas_id)
      this.modal = true
      this.$nextTick(this.$refs.focus.focus)
    },
    verMapa(data){
      if (!this.can('view', true)) {
        return false
      }
      data.lat=this.item.lat
      data.lng= this.item.lng
      this.item = Object.assign({}, data)
      this.item.usuarios_id =  this.$store.state.auth.authUser.id
      this.item.rutas_id =  data.id
      this.item._noData =  1
      this.item.obs =  ''
      this.item.id=null
      this.tituloModal = 'Mapa Ruteo de '+getDataLista(this.lRutas,this.item.rutas_id)
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
      this.location=true
      console.log('LOcalizado',coordenadas);
    },

    errorGps(error) {
      this.location=false
      console.warn('ERROR(' + error.code + '): ' + error.message)
    },

    beforeOpen(accion, data = {}) {
    },
    getMarker(id, item, index) {
      let lmarker = this.lBeneficiarios.filter((e) => e.id == id)
      let marker = this.center
      if (lmarker.length > 0) {
        marker = [lmarker[0].lat, lmarker[0].lng]
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
      this.$refs.mymap.mapObject.invalidateSize().setView(this.center, 13)
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
    binding() {
      const binding = {}

      if (this.$vuetify.breakpoint.xs) binding.column = true

      return binding
    },
  },
  async mounted() {
    this.getPosition()
    
    this.lUsuarios = await this.getListaBackend('monitores')
    this.lRuteos = await this.getListaBackend('RuteosMonitor')
    this.lRutas = await this.getListaBackend(
      'Rutas',
      'id,name,usuarios_id,descrip'
    )
    this.lBeneficiarios = await this.getListaBackend('Beneficiarios','id,name')
    //this.setOptionTable('del').visible=false;
  },
}
</script>
<style scoped>
</style>
