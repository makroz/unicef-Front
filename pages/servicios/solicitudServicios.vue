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
        :bTitulo="bTitulo"
      >
        <v-container grid-list-md fluid>
          <v-layout row wrap>
            <v-flex xs12 sm8 md10>
              <v-autocomplete
                v-model="item.beneficiarios_id"
                :items="lBeneficiarios"
                :filter="customFilter"
                @change="change"
                color="primary"
                item-text="name"
                label="Beneficiario"
                item-value="id"
                :rules="[rules.required]"
                ref="focus"
                :readonly="accion != 'add'"
              >
              </v-autocomplete>
            </v-flex>
            <v-flex xs12 sm-4 md2>
              <v-text-field
                label="Cod.EPSA"
                v-model="itemData.epsa"
                disabled
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-card>
            <v-toolbar color="primary" dark dense>
              <v-toolbar-title
                >Servicios {{ lEstadosSol[item.estado] }}
              </v-toolbar-title>
            </v-toolbar>

            <div dark v-if="item.estado > -1" class="grey" style="height: 20px">
              <v-list-tile-content>
                <v-list-tile-title>
                  <span v-if="item.estado > -1" style="font-size: 10px">
                    <div style="width: 48px; display: inline-block"></div>

                    <div style="width: 25px; display: inline-block">Id</div>
                    <div style="width: 60px; display: inline-block">Fecha</div>
                    <div style="width: 30px; display: inline-block">Eval</div>
                    <div style="width: 85px; display: inline-block">
                      Creado X
                    </div>
                  </span>
                  Servicio
                  <span style="font-size: 10px; width: 130px">
                    Observaciones
                  </span>
                </v-list-tile-title>
              </v-list-tile-content>
            </div>
            <v-list style="max-height: 300px; overflow-y: scroll" dense>
              <template v-for="(servicio, index) in lServices">
                <v-list-tile
                  :key="index"
                  :class="
                    servicio.selected
                      ? 'deep-purple lighten-5 deep-purple--text text--accent-4'
                      : ''
                  "
                >
                  <v-list-tile-action pa-0 ma-0 style="min-width: 34px">
                    <v-checkbox
                      v-model="servicio.selected"
                      color="deep-purple accent-4"
                      :readonly="accion == 'show'"
                      hide-details
                    ></v-checkbox>
                  </v-list-tile-action>

                  <v-list-tile-content>
                    <v-list-tile-title>
                      <span v-if="servicio.estado > -1" style="font-size: 10px">
                        <div style="width: 25px; display: inline-block">
                          {{ servicio.sol_id }}
                        </div>
                        <div style="width: 60px; display: inline-block">
                          {{ formatDT(servicio.fecha, false) }}
                        </div>
                        <div style="width: 30px; display: inline-block">
                          {{ servicio.evaluaciones_id?servicio.evaluaciones_id:'--' }}
                        </div>
                        <div style="width: 85px; display: inline-block">
                          {{ servicio.monitor.split(" ")[0] }}
                        </div>
                      </span>
                      {{ servicio.name }}
                      <span style="font-size: 10px; width: 130px">
                        {{ servicio.obs }}
                      </span>
                    </v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-avatar
                    v-if="servicio.selected || servicio.estado > -1"
                  >
                    <v-text-field
                      v-model="servicio.cantidad"
                      :disabled="
                        servicio.selected && accion == 'add'
                          ? servicio.cant
                            ? false
                            : true
                          : true
                      "
                      :rules="[rules.required, rules.num, rules.minVal(1)]"
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
                      :readonly="accion == 'show'"
                    ></v-text-field>
                  </v-list-tile-avatar>
                </v-list-tile>
              </template>
            </v-list>
          </v-card>
        </v-container>
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'
import MkEstadosMix from '@/components/mkComponentes/mixins/MkEstadosMix'

export default {
  middleware: ['authAccess'],
  mixins: [MkModuloMix,MkEstadosMix],
  components: {},
  name: 'SolicitudServicios',
  data() {
    return {
      //urlModulo: '',
      titModulo: 'Solicitud de Servicios',
      tabs: 0,
      campos: [
        {
          text: 'Id',
          value: 'id',
          align: 'left',
          width: '80px',
          headers: true,
          type: 'num',
          search: true,
        },
        {
          text: 'Fecha',
          value: 'created_at',
          width: '100px',
          headers: true,
          type: 'date',
          search: true,
        },
        {
          text: 'Evaluacion',
          value: 'evaluaciones_id',
          width: '50px',
          headers: true,
          type: 'num',
          search: true,
        },
        {
          text: 'Servicio',
          value: 'servicios_id',
          align: 'left',
          headers: true,
          type: 'num',
          search: true,
          lista: 'lServicios',
        },
        {
          text: 'Beneficiario',
          value: 'beneficiarios_id',
          align: 'left',
          width: '80px',
          headers: true,
          type: 'num',
          search: true,
          lista: 'lBeneficiarios',
        },

        {
          text: 'Creado X',
          value: 'created_by',
          align: 'left',
          width: '80px',
          headers: true,
          type: 'num',
          search: true,
          lista: 'lUsuarios',
        },
        {
          text: 'Cant',
          value: 'cant',
          width: '50px',
          headers: true,
          type: 'num',
          search: true,
          align: 'right',
        },
        {
          text: 'Estado',
          value: 'estado',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'num',
          search: true,
          lista: 'lEstadosSol',
          lColor: 'lColorSol',
        },
      ],
      lUsuarios: [],
      lBeneficiarios: [],
      lServicios: [],
      itemData: {
        epsa: '',
      },
      bTitulo: '',
      lServices: [],
    }
  },
  methods: {
    change(e) {
      this.itemData = this.lBeneficiarios.find((el) => el.id == e)
      //console.log('cange',e,this.itemData,this.lBeneficiarios);
      if (!this.itemData) {
        this.itemData = {
          epsa: '',
        }
      }
    },
    getNameLista(e, lista) {
      let valor = lista.find((el) => el.id == e)
      return valor ? valor.name : e
    },
    async beforeOpen(accion, data = {}) {
      this.lServices = []
      if (accion == 'add') {
        this.bTitulo = ''
        this.itemData.epsa = ''
        data.estado = -1

        this.lServicios.forEach((e) => {
          this.lServices.push({
            cantidad: 1,
            estado: -1,
            selected: null,
            ...e,
          })
        })
      } else {
        if (data.estado >= 5) {
          return false
        }
        data.id=1

        this.bTitulo = 'Revisados'
        let filtros = [
          ['beneficiarios_id', '=', data.beneficiarios_id],
          ['estado', '=', data.estado],
        ]
        let lSol = await this.getDatasBackend(this.urlModulo, [
          {
            mod: this.urlModulo,
            datos: { filtros: filtros, modulo: 'mkServicios' },
          },
        ])
        lSol.SolicitudServicios.forEach((e) => {
          
          let serv = this.getDataLista(
            this.lServicios,
            e.servicios_id,
            'id',
            '*'
          )

          if (serv) {
            this.lServices.push({
              sol_id: e.id,
              cantidad: e.cant,
              fecha: e.created_at,
              estado: e.estado,
              evaluaciones_id: e.evaluaciones_id,
              selected: null,
              monitor: this.getDataLista(
                this.lUsuarios,
                e.created_by,
                'id',
                'name'
              ),
              ...serv,
            })
          }
        })

        this.change(data.beneficiarios_id)
        //data.estado =(data.estado*1);
      }
    },
    // listServicios(estado) {
    //   if (estado == -1) {
    //     return this.lServicios
    //   }
    //   return this.lServicios.filter((e) => e.estado == estado)
    // },
    afterOpen(accion, data) {
      if (accion != 'add') {
        this.tituloModal = 'Procesar ' + this.titModulo
      }
    },
    beforeSave(me) {
      //console.log('id',me.item)
      let servicios = []
      for (const obj in me.lServices) {
        if (me.lServices[obj].selected === true) {
          servicios.push({
            id: me.lServices[obj].id,
            cant: me.lServices[obj].cantidad,
            sol_id: me.lServices[obj].sol_id,
          })
        }
      }
      me.item.servicios = servicios
      me.item.estado = (me.item.estado * 1) + 1
      // if (!me.item.id) {

      // } else {
      //   me.item.estado = me.item.estado * 1 + 1
      // }
    },
    customFilter(item, queryText, itemText) {
      const textOne = ('' + item.name).toLowerCase()
      const textTwo = ('' + item.epsa).toLowerCase()
      const searchText = ('' + queryText).toLowerCase()

      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      )
    },
  },

  async mounted() {
    let edit = this.getOptionTable('edit')
    edit.dblClic = false
    edit.icon = 'fact_check'
    edit.orden = 10
    this.setOptionTable('del').visibleRow = function (e) {
      return e.estado == 0 ? true : false
    }

    // let filtros = [
    //   ['status', '<>', 0],
    // ]
    let listas = await this.getDatasBackend(this.urlModulo, [
      {
        mod: 'Usuarios',
        campos: 'id,name',
        //        datos: { filtros: filtros },
        item: 'created_by',
      },
      {
        mod: 'Beneficiarios',
        campos: 'id,name,epsa',
        item: 'beneficiarios_id',
      },
      { mod: 'Servicios', item: 'servicios_id' },
    ])
  },
}
</script>
<style scope >
</style>
