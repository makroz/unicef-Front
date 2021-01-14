<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <mk-head :titulo="titModulo"></mk-head>
        <v-flex lg12>
          <mk-data-table
            v-bind="dataTable"
            :campos="campos"
            @openDialog="openDialog"
            @deleteItem="deleteItem"
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
        <v-text-field
          label="Nombre"
          name="nom"
          id="nom"
          v-model="item.nom"
          :rules="[rules.required]"
          validate-on-blur
          ref="focus"
        ></v-text-field>
        <v-layout row>
          <v-text-field
            class="sep"
            label="Epsa"
            id="epsa"
            v-model="item.epsa"
            :rules="[rules.required,rules.num]"
            validate-on-blur
          ></v-text-field>

          <v-select
            class="sep"
            v-model="item.entidades_id"
            :items="lEntidades"
            :rules="[rules.required]"
            item-text="name"
            item-value="id"
            label="Entidad"
          ></v-select>

          <v-select
            v-model="item.distritos_id"
            :items="lDistritos"
            :rules="[rules.required]"
            item-text="name"
            item-value="id"
            label="Distrito"
          ></v-select>
        </v-layout>
        <v-layout row>
          <v-checkbox
            class="sep"
            v-model="item.protec"
            value="1"
            label="Programa de Protección"
          ></v-checkbox>
          <v-checkbox
            v-model="item.autoriza"
            value="1"
            label="Autoriza Monitoreo"
          ></v-checkbox>
        </v-layout>

        <v-text-field label="Direccion" v-model="item.dir"></v-text-field>
        <v-layout row>
          <v-text-field
            class="sep"
            label="Latitud"
            v-model="item.lat"
            :rules="[rules.num]"
            validate-on-blur
          ></v-text-field>
          <v-text-field
            label="Longitud"
            v-model="item.long"
            :rules="[rules.num]"
            validate-on-blur
          ></v-text-field>
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
                :draggable="true"
                @update:latLng="updateMaker"
              ></l-marker>
            </l-map>
          </client-only>
        </div>
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
          value: 'nom',
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
          options:[1,'Si','No'],
          search: true,
        },
        {
          text: 'proteccion',
          value: 'protec',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'check',
          options:[1,'Si','No'],
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
          lista: this.lDistritos,
        },
        {
          text: 'Entidad',
          value: 'entidades_id',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'num',
          search: true,
          lista: this.lEntidades,
        },
      ],
      center: [-17.783373986957255, -63.18209478792436],
      marker: [-17.783373986957255, -63.18209478792436],
      zoom: 13,
      lEntidades: [],
      lDistritos: [],
    }
  },
  methods: {
    updateMaker(e) {
      //console.log(e)
      this.item.lat = e.lat
      this.item.long = e.lng
    },
    initMap() {
      if (this.item.lat) {
        this.center = [this.item.lat, this.item.long]
        this.marker = [this.item.lat, this.item.long]
        this.zoom = 13
      }
      this.$refs.mymap.mapObject.invalidateSize().setView(this.center, 13)
    },
    beforeOpen() {
      setTimeout(() => {
        this.initMap()
      }, 100)
    },
  },

  // async asyncData({ store }) {
  //   let lEntidades = await store.dispatch('auth/loadData', {
  //     url: 'Entidades',
  //     campos: 'id,name',
  //   })
  //   let lDistritos = await store.dispatch('auth/loadData', {
  //     url: 'Distritos',
  //     campos: 'id,name',
  //   })
  //   return {
  //     lEntidades: lEntidades,
  //     lDistritos: lDistritos,
  //   }
  // },
   async mounted() {
    let me = this
    me.lEntidades  = await me.$store.dispatch('auth/loadData', {
      url: 'Entidades',
      campos: 'id,name'
    })
    me.lDistritos  = await me.$store.dispatch('auth/loadData', {
      url: 'Distritos',
      campos: 'id,name'
    })

     me.updateListCol('entidades_id', me.lEntidades)
     me.updateListCol('distritos_id', me.lDistritos)
   }
}
</script>
<style scoped>
.sep {
  margin-right: 10px;
}
</style>