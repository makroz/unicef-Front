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
        <v-container grid-list-md fluid>
          <v-text-field
            label="Nombre"
            name="name"
            id="name"
            v-model="item.name"
            :rules="[rules.required]"
            validate-on-blur
            ref="focus"
            :readonly="accion == 'show'"
          ></v-text-field>

          <v-text-field
            label="Descripcion"
            v-model="item.descrip"
            :readonly="accion == 'show'"
          ></v-text-field>
          <v-select
            v-model="item.usuarios_id"
            :items="lUsuarios"
            :rules="[rules.required]"
            item-text="name"
            item-value="id"
            label="Monitor Asignado"
            :readonly="accion == 'show'"
          ></v-select>
          <v-layout wrap>
            <v-flex sx12 sm12 md6>
              <v-autocomplete
                v-model="item.beneficiarios"
                :items="lBeneficiarios"
                :filter="customFilter"
                color="primary"
                item-text="name"
                label="Beneficiarios"
                item-value="id"
                item-avatar="id"
                multiple
                :clearable="item.id >= 0"
                chips
                deletable-chips
                solo-inverted
                counter
                :readonly="accion == 'show'"
              >
              </v-autocomplete>
            </v-flex>
            <v-flex md6>
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
                    <div v-if="this.lBeneficiarios.length > 0">
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
            </v-flex>
          </v-layout>
        </v-container>
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'

export default {
  middleware: ['authAccess'],
  mixins: [MkModuloMix],
  components: {},
  name: 'Rutas',
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
          text: 'Nombre',
          value: 'name',
          width: '250px',
          headers: true,
          type: 'text',
          search: true,
        },
        {
          text: 'Descripcion',
          value: 'descrip',
          headers: true,
          type: 'text',
          search: true,
        },
        {
          text: 'Monitor',
          value: 'usuarios_id',
          align: 'left',
          width: '150px',
          headers: true,
          type: 'num',
          search: true,
          lista: this.lUsuarios,
        },
        {
          text: 'Beneficiarios',
          value: 'beneficiarios',
          sortBy: 'nBene',
          width: '50px',
          headers: true,
          type: 'count',
          search: false,

        },
      ],
      lUsuarios: [],
      lBeneficiarios: [],
      center: [-17.783373986957255, -63.18209478792436],
      zoom: 13,
    }
  },
  methods: {
    getMarker(id, item, index) {
      //let marker={ lng: lat, lat: lng };
      let lmarker = this.lBeneficiarios.filter((e) => e.id == id)
      let marker = this.center
      //console.log('lmarker',lmarker,id,this.lBeneficiarios)
      if (lmarker.length > 0) {
        //console.log('lmarker2',lmarker)
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
      map.eachLayer(function (layer) {
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
          animate: true,
        })
      }
    },

    async beforeOpen(accion, data = {}) {
      let me = this
      me.lBeneficiarios = await me.getListaBackend(
        'Rutas/beneficiarios/' + data.id
      )

      setTimeout(() => {
        me.initMap()
      }, 300)
    },
    customFilter(item, queryText, itemText) {
      const textOne = ('' + item.name).toLowerCase()
      const textTwo = ('' + item.id).toLowerCase()
      const searchText = ('' + queryText).toLowerCase()
      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      )
    },
    remove(item) {
      const index = this.item.beneficiarios.indexOf(item.name)
      if (index >= 0) this.item.beneficiarios.splice(index, 1)
    },
  },

  async mounted() {
    this.lUsuarios = await this.getListaBackend('monitores', '', 'usuarios_id') //ver si se uede sacr los parametros del headers o campos
  },
}
</script>
<style scoped>
</style>
