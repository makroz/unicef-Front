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
        <mk-show-solicitud
          :item="item"
          :accion="accion"
          :lBeneficiarios="lBeneficiarios"
          :lForma_pagos="lForma_pagos"
          :lEstadosSol="lEstadosSol"
          :lMateriales="lMateriales"
          :lServices="lServices"
          :lMedidas="lMedidas"
          :lControl_calidades="lControl_calidades"
        >
        </mk-show-solicitud>
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'
import MkEstadosMix from '@/components/mkComponentes/mixins/MkEstadosMix'
//import MkImgMix from '@/components/mkComponentes/mixins/MkImgMix'
import MkShowSolicitud from '@/components/mkComponentes/MkShowSolicitud'

export default {
  middleware: ['authAccess'],
  mixins: [MkModuloMix, MkEstadosMix],
  components: { MkShowSolicitud },
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
          width: '50px',
          headers: true,
          type: 'num',
          search: true,
        },
        {
          text: 'Fecha',
          value: 'created_at',
          width: '80px',
          headers: true,
          type: 'date',
          search: true,
        },
        {
          text: 'Eval',
          value: 'evaluaciones_id',
          width: '30px',
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
          width: '40px',
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
        {
          text: 'Nota#',
          value: 'orden_servicios_id',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'num',
          search: true,
        },
      ],
      // lUsuarios: [],
      // lBeneficiarios: [],
      // lServicios: [],
      // itemData: {
      //   epsa: '',
      // },
      bTitulo: '',
      //lServices: [],

      lForma_pagos: [],
      lBeneficiarios: [],
      lServicios: [],
      lSolicitudServicios: [],
      lServices: [],
      lUsuarios: [],
      lMateriales: [],
      lMedidas: [],
      lForma_pagos: [],
      lControl_calidades: [],
      //imgPrefix: 'solicitud_servicios',
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
        //this.itemData.epsa = ''
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
        data.id = 1

        this.bTitulo = 'Revisar'
        let filtros = [
          ['beneficiarios_id', '=', data.beneficiarios_id],
          ['estado', '=', data.estado],
        ]
        let lSol = await this.getDatasBackend(this.urlModulo, [
          {
            mod: this.urlModulo,
            datos: {
              filtros: filtros,
              modulo: 'mkServicios',
              relations: ['materiales', 'qa'],
            },
          },
        ])
        lSol.SolicitudServicios.forEach((e) => {
          let serv = this.getDataLista(
            this.lServicios,
            e.servicios_id,
            'id',
            '*'
          )

          let sel = null
          //aqui empeiza lo mismo que recolector
          if (serv) {
            let serv_ = {}
            if (e.estado == 2) {
              serv_ = {
                realizado: false,
                obs_sol: e.obs || '',
                obs_verif: e.obs_verif || '',
                materiales: [],
              }
            }
            let qa = {}
            if (e.estado > 2 || data.estado > 3) {
              this.lControl_calidades.forEach((el) => {
                qa[el.id] = { selected: false, puntos: '' }
              })
              if (e.estado >= 4 && e.estado <= 7) {
                if (e.qa) {
                  e.qa.forEach((el) => {
                    qa[el.id] = { selected: true, puntos: el.puntos }
                  })
                }
              }
              sel = 1
              e.estado = e.estado * 1
              serv_ = {
                realizado: e.estado != 9 && e.estado != 8 && e.estado != 1,
                verificado:
                  (e.estado > 3 && e.estado != 9) || data.estado > 3
                    ? data.estado >= 5 && e.estado < 8 && e.estado > 3
                      ? 4
                      : e.estado
                    : null,
                obs_sol: e.obs,
                obs_verif: e.obs_verif,
                materiales: e.materiales, //aqui
                qa: qa,
              }
            }
            this.lServices.push({
              sol_id: e.id,
              cantidad: e.cant,
              fecha: e.created_at,
              estado: e.estado,
              evaluaciones_id: e.evaluaciones_id,
              monitor: this.getDataLista(
                this.lUsuarios,
                e.created_by,
                'id',
                'name',
                ''
              ),
              ...serv,
              ...serv_,
              selected: sel,
            })
            //console.log('service', this.lServices)
          }
          //hasta aqui
        })

        this.change(data.beneficiarios_id)
        //data.estado =(data.estado*1);
      }
    },
    async afterSave(me, isError = 0) {
      //console.log('aftersve', isError)
      if (isError > -1) {
      } else {
        me.item.estado--
      }
      return true
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
        if (me.lServices[obj].selected == true) {
          servicios.push({
            id: me.lServices[obj].id,
            cant: me.lServices[obj].cantidad,
            sol_id: me.lServices[obj].sol_id,
          })
        }
      }
      me.item.servicios = servicios
      me.item.estado = me.item.estado * 1 + 1
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
    edit.visibleRow = function (e) {
      return e.estado == 0 ? true : false
    }
    this.setOptionTable('del').visibleRow = function (e) {
      return e.estado == 0 ? true : false
    }

    let listas = await this.getDatasBackend(this.urlModulo, [
      { mod: 'Usuarios', campos: 'id,name', item: 'created_by' },
      {
        mod: 'Beneficiarios',
        campos: 'id,name,epsa',
        datos: { _customFields: 1 },
        item: 'beneficiarios_id',
      },
      {
        mod: 'Forma_pagos',
        campos: 'id,name',
        datos: { modulo: 'mkServicios' },
      },
      {
        mod: 'Materiales',
        datos: { modulo: 'mkServicios' },
        campos: 'id,name,medida_id',
      },
      {
        mod: 'Medidas',
        datos: { modulo: 'mkServicios' },
        campos: 'id,simbolo',
      },
      {
        mod: 'Servicios',
        item: 'servicios_id',
        each: (e) => {
          e.cantidad = 1
          e.selected = false
        },
      },
      {
        mod: 'Control_calidades',
        datos: { modulo: 'mkServicios' },
        campos: 'id,name,orden',
        orden: 'orden',
      },
    ])

    // let listas = await this.getDatasBackend(this.urlModulo, [
    //       {
    //         mod: 'Usuarios',
    //         campos: 'id,name',
    //         //        datos: { filtros: filtros },
    //         item: 'created_by',
    //       },
    //       {
    //         mod: 'Beneficiarios',
    //         campos: 'id,name,epsa',
    //         item: 'beneficiarios_id',
    //       },
    //       { mod: 'Servicios', item: 'servicios_id' },
    //     ])
  },
}
</script>
<style scope >
</style>
