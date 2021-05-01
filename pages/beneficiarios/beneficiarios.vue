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
      <!-- formulario principal -->
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
          <v-layout row wrap>
            <v-flex>
              <v-text-field
                label="Código EPSA"
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
          <v-layout row wrap>
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
          <v-layout row wrap>
            <v-flex>
              <v-text-field
                label="Latitud2"
                v-model="item.lat"
                @change="updateLatLng"
                :readonly="accion == 'show'"
              >
              </v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                label="Longitud"
                v-model="item.lng"
                @change="updateLatLng"
                :readonly="accion == 'show'"
              >
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
                @dblclick="dblMapa"
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
      <!-- formularioFull Familia -->
      <mk-form-full-screen
        ref="mkFormFam"
        :modal="modalFam"
        :tit="tituloModal"
        :accion="accion"
        @closeDialog="modalFam = false"
        @grabarItem="grabarItem"
      >
        <v-container grid-list-md fluid class="white">
          <v-flex md12>
            <v-text-field
              label="Nombre Beneficiario"
              v-model="item.name"
              :rules="[rules.required]"
              validate-on-blur
              :readonly="accion == 'show'"
            >
            </v-text-field>
          </v-flex>
          <v-layout row wrap>
            <v-flex xs12 sm5>
              <v-select
                :items="lEntidades"
                item-text="name"
                item-value="id"
                label="Entidad"
                v-model="item.entidades_id"
                :rules="[rules.num]"
                validate-on-blur
                :readonly="accion == 'show'"
              >
              </v-select>
            </v-flex>
            <v-flex xs12 sm5>
              <v-select
                :items="lEpsas"
                item-text="name"
                item-value="id"
                label="EPSA"
                v-model="item.epsa_id"
                :rules="[rules.num]"
                validate-on-blur
                :readonly="accion == 'show'"
              >
              </v-select>
            </v-flex>
            <v-flex xs12 sm2>
              <v-text-field
                type="number"
                label="Codigo EPSA"
                v-model="item.epsa"
                :rules="[rules.num, rules.required]"
                validate-on-blur
                :readonly="accion == 'show'"
              >
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12 sm4>
              <v-select
                :items="lDescoms"
                item-text="name"
                item-value="id"
                label="Descom"
                v-model="item.descom_id"
                :rules="[rules.num]"
                validate-on-blur
                :readonly="accion == 'show'"
              >
              </v-select>
            </v-flex>
            <v-flex xs12 sm4>
              <v-checkbox
                v-model="item.autoriza"
                value="1"
                label="Autoriza"
                :readonly="accion == 'show'"
              >
              </v-checkbox>
            </v-flex>
            <v-flex xs12 sm4>
              <v-checkbox
                v-model="item.protec"
                value="1"
                label="Protec"
                :readonly="accion == 'show'"
              >
              </v-checkbox>
            </v-flex>
          </v-layout>
          <v-card class="pa-2">
            <v-toolbar color="indigo" dark dense>
              <v-toolbar-title class="body-1"
                >Datos de Dirección</v-toolbar-title
              >
            </v-toolbar>

            <v-layout row wrap>
              <v-flex xs12 sm6 md4>
                <v-select
                  :items="lDptos"
                  item-text="name"
                  item-value="id"
                  label="Dpto"
                  v-model="item.dpto_id"
                  :rules="[rules.num]"
                  validate-on-blur
                  :readonly="accion == 'show'"
                >
                </v-select>
              </v-flex>

              <v-flex xs12 sm6 md4>
                <v-select
                  :items="lMunicipios"
                  item-text="name"
                  item-value="id"
                  label="Municipio"
                  v-model="item.municipio_id"
                  :rules="[rules.num]"
                  validate-on-blur
                  :readonly="accion == 'show'"
                >
                </v-select>
              </v-flex>
              <v-flex xs12 sm6 md2>
                <v-select
                  :items="lDistritos"
                  item-text="name"
                  item-value="id"
                  label="Distritos"
                  v-model="item.distritos_id"
                  :rules="[rules.num]"
                  validate-on-blur
                  :readonly="accion == 'show'"
                >
                </v-select>
              </v-flex>

              <v-flex xs12 sm6 md2>
                <v-select
                  :items="lZonas"
                  item-text="name"
                  item-value="id"
                  label="Zona"
                  v-model="item.zona_id"
                  :rules="[rules.num]"
                  validate-on-blur
                  :readonly="accion == 'show'"
                >
                </v-select>
              </v-flex>
            </v-layout>

            <v-flex>
              <v-text-field
                label="Dir"
                v-model="item.dir"
                validate-on-blur
                :readonly="accion == 'show'"
              >
              </v-text-field>
            </v-flex>
            <v-layout row wrap>
              <v-flex xs12 sm4>
                <v-text-field
                  label="Manzano"
                  v-model="item.manzano"
                  validate-on-blur
                  :readonly="accion == 'show'"
                >
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm4>
                <v-text-field
                  label="Lote"
                  v-model="item.lote"
                  validate-on-blur
                  :readonly="accion == 'show'"
                >
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm4>
                <v-text-field
                  label="Safsi"
                  v-model="item.safsi"
                  validate-on-blur
                  :readonly="accion == 'show'"
                >
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-card>
          <v-layout row wrap>
            <v-flex xs12 sm6>
              <v-text-field
                type="number"
                label="Nfamilias"
                v-model="item.nfamilias"
                :rules="[rules.num, rules.required]"
                validate-on-blur
                :readonly="accion == 'show'"
              >
              </v-text-field>
            </v-flex>

            <v-flex xs12 sm6>
              <v-text-field
                type="number"
                label="Npersonas"
                v-model="item.npersonas"
                :rules="[rules.num, rules.required]"
                validate-on-blur
                :readonly="accion == 'show'"
              >
              </v-text-field>
            </v-flex>
          </v-layout>

          <v-card class="pa-2">
            <v-toolbar color="indigo" dark dense>
              <v-toolbar-title class="body-1">Contrapartes</v-toolbar-title>
            </v-toolbar>

            <v-layout row wrap>
              <v-flex xs12 sm6 md3>
                <v-card class="pa-2">
                  <v-toolbar color="green" dark dense card>
                    <v-toolbar-title class="caption"
                      >Gobierno Municipal</v-toolbar-title
                    >
                  </v-toolbar>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-text-field
                        type="number"
                        label="Bs."
                        v-model="item.c_gob_municipal"
                        :rules="[rules.num]"
                        validate-on-blur
                        :readonly="accion == 'show'"
                      >
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field
                        type="number"
                        label="%"
                        v-model="item.c_gob_municipal_p"
                        :rules="[rules.num]"
                        validate-on-blur
                        :readonly="accion == 'show'"
                      >
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-flex>

              <v-flex xs12 sm6 md3>
                <v-card class="pa-2">
                  <v-toolbar color="green" dark dense card>
                    <v-toolbar-title class="caption"
                      >Cooperación Internacional / ONG</v-toolbar-title
                    >
                  </v-toolbar>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-text-field
                        type="number"
                        label="Bs."
                        v-model="item.c_ong"
                        :rules="[rules.num]"
                        validate-on-blur
                        :readonly="accion == 'show'"
                      >
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field
                        type="number"
                        label="%"
                        v-model="item.c_ong_p"
                        :rules="[rules.num]"
                        validate-on-blur
                        :readonly="accion == 'show'"
                      >
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-flex>

              <v-flex xs12 sm6 md3>
                <v-card class="pa-2">
                  <v-toolbar color="green" dark dense card>
                    <v-toolbar-title class="caption">Familias</v-toolbar-title>
                  </v-toolbar>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-text-field
                        type="number"
                        label="Bs."
                        v-model="item.c_familias"
                        :rules="[rules.num]"
                        validate-on-blur
                        :readonly="accion == 'show'"
                      >
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field
                        type="number"
                        label="%"
                        v-model="item.c_familias_p"
                        :rules="[rules.num]"
                        validate-on-blur
                        :readonly="accion == 'show'"
                      >
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-flex>

              <v-flex xs12 sm6 md3>
                <v-card class="pa-2">
                  <v-toolbar color="green" dark dense card>
                    <v-toolbar-title class="caption">Otra</v-toolbar-title>
                  </v-toolbar>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-text-field
                        type="number"
                        label="Bs."
                        v-model="item.c_otra"
                        :rules="[rules.num]"
                        validate-on-blur
                        :readonly="accion == 'show'"
                      >
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field
                        type="number"
                        label="%"
                        v-model="item.c_otra_p"
                        :rules="[rules.num]"
                        validate-on-blur
                        :readonly="accion == 'show'"
                      >
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-flex>
            </v-layout>
          </v-card>

          <v-flex>
            <v-select
              :items="lTipo_banos"
              item-text="name"
              item-value="id"
              label="¿Qué tipo de solución en saneamiento utiliza la familia antes de su participación en el proyecto?"
              v-model="item.tipo_bano_id"
              :rules="[rules.num]"
              validate-on-blur
              :readonly="accion == 'show'"
            >
            </v-select>
          </v-flex>

          <v-card class="pa-2">
            <v-toolbar color="indigo" dark dense>
              <v-toolbar-title class="body-1"
                >Documentos firmados</v-toolbar-title
              >
            </v-toolbar>
            <v-layout
              row
              fill-height
              v-for="doc in lDoc_firmados"
              :key="doc.id"
              style="border-bottom: 1px dotted gray"
            >
              <v-flex pa-4 class="my-auto" grow>
                {{ doc.orden }} - {{ doc.name }}
              </v-flex>
              <v-flex shrink>
                <v-radio-group
                  v-model="doc.resp"
                  row
                  :rules="[rules.required]"
                  validate-on-blur
                >
                  <v-radio color="green" label="Si" value="1"></v-radio>
                  <v-radio color="red" label="No" value="0"></v-radio>
                </v-radio-group>
              </v-flex>
            </v-layout>
            <!-- <v-flex>
            <v-select
              :items="lDoc_firmados"
              item-text="name"
              item-value="id"
              label="Doc_firmado"
              v-model="item.doc_firmado_id"
              :rules="[rules.num]"
              validate-on-blur
              :readonly="accion == 'show'"
            >
            </v-select>
          </v-flex> -->
          </v-card>
          <v-flex>
            <v-select
              :items="lInfo_metodos"
              item-text="name"
              item-value="id"
              label="¿Cómo obtuvo información del proyecto?"
              v-model="item.info_metodo_id"
              :rules="[rules.required]"
              validate-on-blur
              multiple
              chips
              :readonly="accion == 'show'"
            >
            </v-select>
          </v-flex>
          <v-flex>
            <v-select
              :items="lProb_sol_existentes"
              item-text="name"
              item-value="id"
              label="Prob_sol_existente"
              v-model="item.prob_sol_existente_id"
              :rules="[rules.num]"
              validate-on-blur
              :readonly="accion == 'show'"
            >
            </v-select>
          </v-flex>
        </v-container>
      </mk-form-full-screen>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'
import MkFormFullScreen from '~/components/mkComponentes/MkFormFullScreen.vue'

export default {
  middleware: ['authAccess'],
  mixins: [MkModuloMix],
  components: { MkFormFullScreen },
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
          class: this.claseBenef,
        },
        {
          text: 'Cod.EPSA',
          value: 'epsa',
          width: '100px',
          align: 'right',
          headers: true,
          type: 'num',
          search: true,
        },
        {
          text: 'Autoriza',
          value: 'autoriza',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'check',
          options: [1, 'Si', 'No'],
          search: true,
        },
        {
          text: 'Proteccion',
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
      modalFam: true,

      lDistritos: [],

      lEntidades: [],

      lRutas: [],

      lDptos: [],

      lMunicipios: [],

      lZonas: [],

      lDescoms: [],

      lEpsas: [],

      lTipo_banos: [],

      lDoc_firmados: [],

      lInfo_metodos: [],

      lProb_sol_existentes: [],
    }
  },
  methods: {
    openFam(opt, item) {
      this.openDialog(opt, item, false)
      this.modalFam = true
    },
    claseBenef(item, datos) {
      let r = ''
      if (item.value == 'name') {
        if (!datos.lat) {
          r = 'red--text text--lighten-3'
        }
      }
      return r
    },
    dblMapa(e) {
      this.item.lat = e.latlng.lat
      this.item.lng = e.latlng.lng
      this.updateLatLng()
      return false
    },
    updateLatLng() {
      if (
        this.item.lat &&
        this.item.lng &&
        this.item.lat != '' &&
        this.item.lng != ''
      ) {
        this.marker = [this.item.lat, this.item.lng]
        let zoom = this.$refs.mymap.mapObject.getZoom()
        this.$refs.mymap.mapObject.setView(this.marker, zoom)
      }
    },
    updateMaker(e) {
      this.item.lat = e.lat
      this.item.lng = e.lng
    },
    initMap() {
      if (this.item.lat && this.item.lat != '') {
        this.marker = [this.item.lat, this.item.lng]
        this.zoom = 13
      } else {
        this.item.lat = ''
        this.item.lng = ''
        this.marker = this.center
      }
      this.$refs.mymap.mapObject.doubleClickZoom.disable()
      this.$refs.mymap.mapObject.invalidateSize().setView(this.marker, 13)
    },
    afterSave(me, isError) {
      this.modalFam = false
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
    this.addOptionTable({
      id: 'fam',
      color: 'red',
      icon: 'group',
      text: 'Familia',
      visible: this.can('edit'),
      action: 'openFam',
      grupos: ['action'],
      orden: 1,
    })

    // this.lRutas = await this.getListaBackend('Rutas', 'id,name', 'rutas_id')
    // this.lEntidades = await this.getListaBackend(
    //   'Entidades',
    //   'id,name',
    //   'entidades_id'
    // )
    // this.lDistritos = await this.getListaBackend(
    //   'Distritos',
    //   'id,name',
    //   'distritos_id'
    // )

    this.lDistritos = await this.getListaBackend(
      'Distritos',
      'id,name',
      'distritos_id'
    )

    this.lEntidades = await this.getListaBackend(
      'Entidades',
      'id,name',
      'entidades_id'
    )

    this.lRutas = await this.getListaBackend('Rutas', 'id,name', 'rutas_id')

    this.lDptos = await this.getListaBackend('Dptos', 'id,name', 'dpto_id')

    this.lMunicipios = await this.getListaBackend(
      'Municipios',
      'id,name',
      'municipio_id'
    )

    this.lZonas = await this.getListaBackend('Zonas', 'id,name', 'zona_id')

    this.lDescoms = await this.getListaBackend(
      'Descoms',
      'id,name',
      'descom_id'
    )

    this.lEpsas = await this.getListaBackend('Epsas', 'id,name', 'epsa_id')

    this.lTipo_banos = await this.getListaBackend(
      'Tipo_banos',
      'id,name',
      'tipo_bano_id'
    )

    this.lDoc_firmados = await this.getListaBackend(
      'Doc_firmados',
      'id,name,orden',
      'doc_firmado_id'
    )
    if (this.lDoc_firmados.length > 0){
    this.lDoc_firmados.sort(function (a, b) {
      return a.orden - b.orden
    })
    }
    
    this.lInfo_metodos = await this.getListaBackend(
      'Info_metodos',
      'id,name',
      'info_metodo_id'
    )

    this.lProb_sol_existentes = await this.getListaBackend(
      'Prob_sol_existentes',
      'id,name',
      'prob_sol_existente_id'
    )
  },
}
</script>
<style scoped>
</style>