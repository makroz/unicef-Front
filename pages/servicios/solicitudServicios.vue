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
            :readonly="!!item.id"
          >
          </v-autocomplete>

          <v-text-field
            label="Cod.EPSA"
            v-model="itemData.epsa"
            disabled
          :readonly="accion=='show'" ></v-text-field>

          <v-card v-if="!!!item.id">
            <v-toolbar color="primary" dark dense>
              <v-toolbar-title>Servicios Disponibles</v-toolbar-title>
            </v-toolbar>

            <v-list style="max-height: 300px; overflow-y: scroll">
              <template v-for="item in lServicios">
                <v-list-tile
                  :key="item.id"
                  :class="
                    item.selected
                      ? 'deep-purple lighten-5 deep-purple--text text--accent-4'
                      : ''
                  "
                >
                  <v-list-tile-action>
                    <v-checkbox
                      v-model="item.selected"
                      color="deep-purple accent-4"
                    :readonly="accion=='show'" 
></v-checkbox>
                  </v-list-tile-action>

                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{ item.name }}
                      <span style="font-size: 10px">{{ item.obs }}</span>
                    </v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-avatar v-if="item.selected">
                    <v-text-field
                      v-model="item.cantidad"
                      :disabled="
                        item.selected ? (item.cant ? false : true) : true
                      "
                      :rules="[rules.required, rules.num, rules.minVal(1)]"
                      validate-on-blur
                      color="primary"
                      :class="item.selectded ? 'secondary' : ''"
                      type="number"
                      min="1"
                      style="
                        font-size: 12px;
                        padding-bottom: 0;
                        padding-top: 12px;
                      "
                    :readonly="accion=='show'" ></v-text-field>
                  </v-list-tile-avatar>
                </v-list-tile>
              </template>
            </v-list>
          </v-card>
          <v-card v-else>
            <v-toolbar color="primary" dark dense>

              <v-toolbar-title v-if="accion!='show'">
                Cambiar Estado Actual de
                <span :class="lColor[item.estado]">
                  {{ lEstados[item.estado]  }}
                </span>
                <span class="red--text">>>></span
                ><span :class="lColor[item.estado * 1 + 1]">
                  {{ lEstados[item.estado*1 +1 ] }}
                </span>
              </v-toolbar-title>
              <v-toolbar-title v-else>
                Estado Actual
                <span :class="lColor[item.estado]">
                  {{ lEstados[item.estado]  }}
                </span>
              </v-toolbar-title>

            </v-toolbar>
            <v-layout row pa-2>
              <v-flex md10>
                <v-text-field
                  label="Servicio"
                  :value="getNameLista(item.servicios_id, lServicios)"
                :readonly=true ></v-text-field>
              </v-flex>
              <v-flex md2>
                <v-text-field
                  label="Cantidad"
                  :value="item.cant"
                :readonly=true ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card>
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
          value: 'fecha_1',
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
          text: 'Monitor',
          value: 'usuarios_id_1',
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
          lista: 'lEstados',
          lColor: 'lColor',
        },
      ],
      lUsuarios: [],
      lBeneficiarios: [],
      lServicios: [],
      lEstados: [
        'Pendiente',
        'Realizado',
        'Verificado',
        'Autorizado',
        'Comercial',
        'Completado',
      ],
      lColor: [
        'grey--text',
        'green--text text--lighten-3',
        'green--text text--lighten-1',
        'green--text',
        'green--text text--darken-2',
        'green--text text--darken-4',
      ],
      itemData: {
        epsa: '',
      },
    }
  },
  methods: {
    change(e) {
      this.itemData = this.lBeneficiarios.find((el) => el.id == e)
      //console.log('cange',e,this.itemData,this.lBeneficiarios);
      if (!this.itemData){
        this.itemData= {
        epsa: '',
      }
      }
    },
    getNameLista(e, lista) {
      let valor = lista.find((el) => el.id == e)
      return valor ? valor.name : e
    },
    beforeOpen(accion, data = {}) {
      if (accion == 'add') {
        this.itemData.epsa = ''
        this.lServicios.forEach((e) => {
          e.cantidad = 1
          if (e.selected) {
            e.selected = null
          }
        })
      } else {
        this.change(data.beneficiarios_id)
        if (data.estado >= 5) {
          return false
        }
        //data.estado =(data.estado*1)+1;
      }
    },
    beforeSave(me) {
      //console.log('id',me.item.id)
      if (!me.item.id) {
        let servicios = []
        for (const obj in me.lServicios) {
          if (me.lServicios[obj].selected === true) {
            servicios.push({
              id: me.lServicios[obj].id,
              cant: me.lServicios[obj].cantidad,
            })
          }
        }
        me.paramsExtra.servicios = servicios
      } else {
        // delete me.paramsExtra.servicios
        // delete me.items.paramsExtra.servicios
        me.item.estado = me.item.estado * 1 + 1
      }
    },
    customFilter(item, queryText, itemText) {
      const textOne = ('' + item.name).toLowerCase()
      const textTwo = ('' + item.id).toLowerCase()
      const searchText = ('' + queryText).toLowerCase()

      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      )
    },
  },

  async mounted() {
    let edit = this.getOptionTable('edit')
    edit.dblClic =false

 let filtros=[
            ['roles_id','=','2',],
            ['status','<>',0]
        ];
    let listas= await this.getDatasBackend(this.urlModulo,[
      {mod:'Usuarios',campos:'id,name,email',datos:{filtros:filtros},item:'usuarios_id_1'},
      {mod:'Beneficiarios',campos:'id,name,epsa',item:'beneficiarios_id'},
      {mod:'Servicios',item:'servicios_id'},
    ])
 },
}
</script>
<style scope >
</style>
