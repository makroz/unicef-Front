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
        <v-text-field
          label="Fecha"
          name="name"
          id="name"
          v-model="item.name"
          :rules="[rules.required]"
          validate-on-blur
          ref="focus"
          :readonly="accion == 'show'"
        ></v-text-field>
        <!-- <v-layout wrap>
          <v-flex md12>
            <div id="map-wrap" style="height: 350px; width: 100%">
              <client-only>
                <l-map
                  :zoom="zoom"
                  :center="center"
                  style="height: 350px; width: 100%"
                  ref="mymap"
                >
                  <l-tile-layer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="<a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
                    :useCors="false"
                  ></l-tile-layer>
                  <div v-if="this.lRastreo.length > 0">
                    <l-marker
                      v-for="(marker, index) in item.beneficiarios"
                      :key="index"
                      :lat-lng="getMarker(marker, item, index)"
                      :draggable="false"
                      :visible="true"
                    >
                      <l-tooltip>
                        {{ getNameUsuario(marker) }}
                      </l-tooltip>
                    </l-marker>
                  </div>
                </l-map>
              </client-only>
            </div>
          </v-flex>
        </v-layout> -->
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'

export default {
  middleware: ['authAccess'],
  mixins: [MkModuloMix],
  name: 'Rastreo',
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
          search: true
        },
        {
          text: 'Fecha',
          value: 'fecha',
          width: '250px',
          headers: true,
          type: 'text',
          search: true
        },
        {
          text: 'Latitud',
          value: 'lat',
          headers: true,
          type: 'text',
          search: false
        },
        {
          text: 'Longitud',
          value: 'lng',
          headers: true,
          type: 'text',
          search: false
        },
        {
          text: 'Usuario',
          value: 'usuarios_id',
          align: 'left',
          width: '150px',
          headers: true,
          type: 'num',
          search: true,
          lista: 'lUsuarios'
        }
      ],
      lUsuarios: [],
      center: [-17.783373986957255, -63.18209478792436],
      zoom: 13,
    }
  },
  computed: {
  },
  methods: {
    getNameUsuario(marker) {
      return this.getDataLista(this.lUsuarios,marker,id,name,'')
    },
    getMarker(id, item, index) {
      let lmarker = this.lUsuarios.filter((e) => e.id == id)
      let marker = this.center
      //console.log('lmarker',lmarker,id,this.lBeneficiarios)
      if (
        lmarker.length > 0 &&
        lmarker[0].lat != '' &&
        lmarker[0].lat != null &&
        lmarker[0].lng != '' &&
        lmarker[0].lng != null
      ) {
        marker = [lmarker[0].lat, lmarker[0].lng]
      }

      if (index == item.beneficiarios.length - 1) {
        //console.log('recalculo de mapa');
        setTimeout(() => {
          this.fitMapBounds()
        }, 300)
      }
      return marker
    },
    initMap() {
      //this.center = [this.item.lat, this.item.lng]
      this.zoom = 13
      this.$refs.mymap.mapObject.invalidateSize().setView(this.center, 13)
      this.fitMapBounds()
    },
    fitMapBounds() {
      // Get all visible Markers
      let map = this.$refs.mymap.mapObject
      const visibleMarkers = []
      map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
          visibleMarkers.push(layer)
        }
      })

      // Ensure there's at least one visible Marker
      //console.log(visibleMarkers.length)
      if (visibleMarkers.length > 0) {
        // Create bounds from first Marker then extend it with the rest
        const markersBounds = L.latLngBounds([visibleMarkers[0].getLatLng()])
        visibleMarkers.forEach((marker) => {
          markersBounds.extend(marker.getLatLng())
        })

        // Fit the map with the visible markers bounds
        map.flyToBounds(markersBounds, {
          padding: L.point(36, 36),
          animate: true
        })
      }
    },

    async beforeOpen(accion, data = {}) {
      if (accion == 'add') {
        data.beneficiarios = []
      }
      this.lUsuarios = await this.getListaBackend(
        'Rutas/beneficiarios/' + data.id
      )
      //      console.log(this.lBeneficiarios);
      setTimeout(() => {
        this.initMap()
      }, 300)
      return true
    },
  },

  async mounted() {
        this.setOptionTable('show').visible = false
    this.setOptionTable('add').visible = false
    this.setOptionTable('edit').visible = false
    this.setOptionTable('del').visible = false
    this.setOptionTable('status').visible = false
    this.setOptionTable('restore').visible = false
    let listas = await this.getDatasBackend(this.urlModulo, [
      {
        mod: 'Usuarios',
        campos: 'id,name',
        item: 'usuarios_id'
      }
    ])
  }
}
</script>
<style scoped>
</style>
