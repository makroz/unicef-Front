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
        :accion="item.id"
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
          <v-layout row>
            <v-flex>
              <v-text-field
                label="Epsa"
                id="epsa"
                v-model="item.epsa"
                :rules="[rules.required, rules.num]"
                validate-on-blur
                :readonly="accion == 'show'"
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-select
                v-model="item.entidades_id"
                :items="lEntidades"
                :rules="[rules.required]"
                item-text="name"
                item-value="id"
                label="Entidad"
                :readonly="accion == 'show'"
              ></v-select>
            </v-flex>
            <v-flex>
              <v-select
                v-model="item.distritos_id"
                :items="lDistritos"
                :rules="[rules.required]"
                item-text="name"
                item-value="id"
                label="Distrito"
                :readonly="accion == 'show'"
              ></v-select>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex>
              <v-checkbox
                v-model="item.protec"
                value="1"
                label="Programa de Protección"
                :readonly="accion == 'show'"
              ></v-checkbox>
            </v-flex>
            <v-flex>
              <v-checkbox
                v-model="item.autoriza"
                value="1"
                label="Autoriza Monitoreo"
                :readonly="accion == 'show'"
              ></v-checkbox>
            </v-flex>
          </v-layout>
          <v-select
            v-model="item.rutas_id"
            :items="lRutas"
            item-text="name"
            item-value="id"
            label="Ruta de Monitoreo"
            :readonly="accion == 'show'"
          ></v-select>

          <v-text-field
            label="Direccion"
            v-model="item.dir"
            :readonly="accion == 'show'"
          ></v-text-field>
          <v-layout row>
            <v-flex>
              <v-text-field label="Latitud" v-model="item.lat" readonly>
              </v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field label="Longitud" v-model="item.lng" readonly>
              </v-text-field>
            </v-flex>
          </v-layout>
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
                <l-marker
                  :lat-lng="marker"
                  :draggable="accion != 'show'"
                  @update:latLng="updateMaker"
                ></l-marker>
              </l-map>
            </client-only>
          </div>
        </v-container>
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'

export default {
  //middleware: ['authAccess'],
  mixins: [MkModuloMix],
  components: {},
  name: 'Beneficiarios',
  data() {
    return {
      //urlModulo: '',
      //titModulo: '',
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
          text: 'Beneficierio',
          value: 'name',
          headers: true,
          type: 'text',
          search: true,
        },
        {
          text: 'cod.epsa',
          value: 'epsa',
          width: '100px',
          align: 'right',
          headers: true,
          type: 'num',
          search: true,
        },
        {
          text: 'autoriza',
          value: 'autoriza',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'check',
          options: [1, 'Si', 'No'],
          search: true,
        },
        {
          text: 'proteccion',
          value: 'protec',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'check',
          options: [1, 'Si', 'No'],
          search: true,
        },
        {
          text: 'Distrito',
          value: 'distritos_id',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'num',
          search: true,
          lista: 'lDistritos',
        },
        {
          text: 'Entidad',
          value: 'entidades_id',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'num',
          search: true,
          lista: 'lEntidades',
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
      ],
      center: [-17.783373986957255, -63.18209478792436],
      marker: [-17.783373986957255, -63.18209478792436],
      zoom: 13,
      lEntidades: [],
      lDistritos: [],
      lRutas: [],
    }
  },
  methods: {
    updateMaker(e) {
      this.item.lat = e.lat
      this.item.lng = e.lng
    },
    initMap() {
      if (this.item.lat && this.item.lat != '') {
        //this.center = [this.item.lat, this.item.lng]
        this.marker = [this.item.lat, this.item.lng]
        this.zoom = 13
      } else {
        this.item.lat = ''
        this.item.lng = ''
        this.marker = this.center
      }
      this.$refs.mymap.mapObject.invalidateSize().setView(this.marker, 13)
    },
    beforeOpen(accion, data = {}) {
      if (accion == 'add') {
        data.lat = ''
        data.lng = ''
      }
      setTimeout(() => {
        this.initMap()
      }, 100)
    },
  },
  async mounted() {
    this.lRutas = await this.getListaBackend('Rutas', 'id,name', 'rutas_id')
    this.lEntidades = await this.getListaBackend(
      'Entidades',
      'id,name',
      'entidades_id'
    )
    this.lDistritos = await this.getListaBackend(
      'Distritos',
      'id,name',
      'distritos_id'
    )
  },
}
</script>
<style scoped>
</style>