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
        <v-layout row wrap>
          <v-flex sm6 v-if="accion != 'show'">
            <v-card class="pa-2">
              <v-toolbar color="indigo" dark dense>
                <v-toolbar-title class="body-1"
                  >Beneficiarios Disponibles</v-toolbar-title
                >
              </v-toolbar>
              <v-list style="height: 300px;overflow-y: scroll">
                <v-list-tile v-for="benef in lDisponibles" :key="benef.id">
                  <v-list-tile-content>
                    <v-list-tile-title>{{ benef.name }}</v-list-tile-title>
                  </v-list-tile-content>

                  <v-list-tile-action>
                    <v-icon color="green" @click="addBenef(item, benef.id)"
                      >add_circle</v-icon
                    >
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
          <v-flex :class="accion != 'show' ? 'sm6' : 'sm12'">
            <v-card class="pa-2">
              <v-toolbar color="indigo" dark dense>
                <v-toolbar-title class="body-1"
                  >Beneficiarios de la Ruta</v-toolbar-title
                >
              </v-toolbar>
              <v-list style="height: 300px;overflow-y: scroll">
                <draggable
                  v-model="item.beneficiarios"
                  @change="onChangeSort"
                  :disabled="accion == 'show'"
                >
                  <v-list-tile
                    v-for="(benefSel, index) in item.beneficiarios"
                    :key="index"
                  >
                    <v-list-tile-action>
                      <v-icon color="blue">more_vert</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                      <v-list-tile-title>{{
                        getDataLista(lBeneficiarios, benefSel)
                      }}</v-list-tile-title>
                    </v-list-tile-content>

                    <v-list-tile-action v-if="accion != 'show'">
                      <v-icon
                        color="red"
                        @click="item.beneficiarios.splice(index, 1)"
                        >backspace</v-icon
                      >
                    </v-list-tile-action>
                  </v-list-tile>
                </draggable>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout wrap>
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
                  <div v-if="this.lBeneficiarios.length > 0">
                    <l-marker
                      v-for="(marker, index) in item.beneficiarios"
                      :key="index"
                      :lat-lng="getMarker(marker, item, index)"
                      :draggable="false"
                      :visible="true"
                    >
                      <l-tooltip>
                        {{ getNameBene(marker) }}
                      </l-tooltip>
                    </l-marker>
                  </div>
                </l-map>
              </client-only>
            </div>
          </v-flex>
        </v-layout>
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'
import draggable from 'vuedraggable'

export default {
  middleware: ['authAccess'],
  mixins: [MkModuloMix],
  components: { draggable },
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
          search: true
        },
        {
          text: 'Nombre',
          value: 'name',
          width: '250px',
          headers: true,
          type: 'text',
          search: true
        },
        {
          text: 'Descripcion',
          value: 'descrip',
          headers: true,
          type: 'text',
          search: true
        },
        {
          text: 'Monitor',
          value: 'usuarios_id',
          align: 'left',
          width: '150px',
          headers: true,
          type: 'num',
          search: true,
          lista: this.lUsuarios
        },
        {
          text: 'Beneficiarios',
          value: 'beneficiarios',
          sortBy: 'nBene',
          width: '50px',
          headers: true,
          type: 'count',
          search: false
        }
      ],
      lUsuarios: [],
      lBeneficiarios: [],
      center: [-17.783373986957255, -63.18209478792436],
      zoom: 13,
      item: {
        beneficiarios: []
      }
    }
  },
  computed: {
    lDisponibles() {
      if (!this.item.beneficiarios) {
        return this.lBeneficiarios
      }
      return this.lBeneficiarios.filter(
        (e) => this.item.beneficiarios.indexOf(e.id) == -1
      )
    }
  },
  methods: {
    onChangeSort(a, b, c) {
      console.log('change', a, b, c)
    },
    addBenef(item, benef) {
      if (item.beneficiarios) {
        item.beneficiarios.push(benef)
      } else {
        item.beneficiarios = [benef]
      }
    },
    getNameBene(marker) {
      let name = this.lBeneficiarios.filter((e) => e.id == marker)
      if (name && name.length > 0) {
        return name[0].name
      }
      return ''
    },
    getMarker(id, item, index) {
      //let marker={ lng: lat, lat: lng };
      let lmarker = this.lBeneficiarios.filter((e) => e.id == id)
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
      this.lBeneficiarios = await this.getListaBackend(
        'Rutas/beneficiarios/' + data.id
      )
      //      console.log(this.lBeneficiarios);
      setTimeout(() => {
        this.initMap()
      }, 300)
      return true
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
    }
  },

  async mounted() {
    let listas = await this.getDatasBackend(this.urlModulo, [
      {
        mod: 'Usuarios',
        campos: 'id,name',
        datos: { filtros: [['roles_slug', '=', 'monitor']] },
        item: 'usuarios_id'
      }
    ])
  }
}
</script>
<style scoped>
</style>
