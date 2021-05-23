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
          :accion="item.accion"
          :lBeneficiarios="lBeneficiarios"
          :lForma_pagos="lForma_pagos"
          :lEstadosSol="lEstadosSol"
          :lMateriales="lMateriales"
          :lServices="lServices"
          :lMedidas="lMedidas"
          :lControl_calidades="lControl_calidades"
          :mkImgData="mkImgData"
        >
        </mk-show-solicitud>
        
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'
import MkEstadosMix from '@/components/mkComponentes/mixins/MkEstadosMix'
import MkImgMix from '@/components/mkComponentes/mixins/MkImgMix'
import MkShowSolicitud from '@/components/mkComponentes/MkShowSolicitud'


export default {
  middleware: ['authAccess'],
  mixins: [MkModuloMix,MkEstadosMix, MkImgMix],
  components: { MkShowSolicitud },
  name: 'Orden_servicios',
  data() {
    return {
      //urlModulo: '',
      titModulo: 'Ordenes de Servicios',
      campos: [
        {
          text: 'Id',
          value: 'id',
          align: 'right',
          width: '100px',
          headers: true,
          type: 'num',
          search: true,
        },
        {
          text: 'Ref',
          value: 'ref',
          align: 'left',

          headers: true,
          type: 'text',
          search: true,
        },
        {
          text: 'Fecha',
          value: 'created_at',
          align: 'center',

          headers: true,
          type: 'date',
          search: true,
        },
        {
          text: 'Foto',
          value: 'foto',
          align: 'left',

          headers: true,
          type: 'text',
          search: true,
        },
        {
          text: 'Observaciones',
          value: 'obs',
          align: 'left',

          headers: true,
          type: 'text',
          search: true,
        },
        {
          text: 'Estado',
          value: 'estado',
          align: 'left',

          headers: true,
          type: 'text',
          search: true,
          lista: 'lEstadosSol',
          lColor: 'lColorSol',
        },
        {
          text: 'Recolector',
          value: 'recolector_id',
          align: 'left',

          headers: true,
          type: 'num',
          search: true,
          lista: this.lUsuarios,
        },
        {
          text: 'Forma de pago',
          value: 'forma_pago_id',
          align: 'left',

          headers: true,
          type: 'num',
          search: true,
          lista: this.lForma_pagos,
        },
        {
          text: 'Beneficiario',
          value: 'beneficiario_id',
          align: 'left',

          headers: true,
          type: 'num',
          search: true,
          lista: this.lBeneficiarios,
        },
      ],
      lUsuarios: [],
      lForma_pagos: [],
      lBeneficiarios: [],
      lServicios: [],
      lSolicitudServicios: [],
      lDispon: {},
      lAsignada: {},
      lAsignadaD: [],
      lServices: [],
      lUsuarios: [],
      lMateriales: [],
      lMedidas: [],
      lForma_pagos: [],
      lControl_calidades:[],
      lOrdenes: {},
      nAceptadas: 0,
      imgPrefix: 'solicitud_servicios',
      bTitulo:'',
      //grabarDebug:true,
      }
  },
  methods: {
    revNota(accion, data) {
      data.accion = 'verificar'
      this.openDialog('edit', data)
    },
  async beforeOpen(accion, data = {}) {
      //data._noData = 1
      data.noImage = !!!data.foto
      if (accion=='show'){
        data.accion=accion
      }

      this.lServices = []
        let sel = null

        let listas = await this.getDatasBackend(
          'SolicitudServicios',
          this.getSolicitudServicios(data.id)
        )
        //data.lista=listas.Realizados
        let lSol = Object.keys(listas.Realizados)
        lSol.forEach((el) => {
          let e = listas.Realizados[el]
          let serv = this.getDataLista(
            this.lServicios,
            e.servicios_id,
            'id',
            '*'
          )

          if (serv) {
            let serv_ = {}
            if (e.estado == 2) {
              serv_ = {
                realizado: false,
                obs_sol: '',
                obs_verif: '',
                materiales: [],
              }
            }
            let qa={}
            if (e.estado == 3 || e.estado == 9 || e.estado == 8|| e.estado == 4) {
              
              this.lControl_calidades.forEach(el => {
                  qa[el.id]={selected:false,puntos:''}
              });
              if (e.estado == 4 ) {
                e.qa.forEach(el => {
                  qa[el.id]={selected:true,puntos:el.puntos}
              });
               }
              sel = 1
              e.estado=e.estado*1
              serv_ = {
                realizado: e.estado != 9 && e.estado != 8,
                verificado: e.estado>3 && e.estado !=9 ?e.estado:null,
                obs_sol: e.obs,
                obs_verif: e.obs_verif,
                materiales: e.materiales, //aqui
                qa:qa,
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
        })
        
        //data.estado =(data.estado*1);
      
    },
    afterOpen(accion, data) {
      if (data.accion == 'verificar') {
        this.tituloModal = 'Verificar Nota '+data.id
        this.bTitulo = 'Verificar'
      }
      if (data.accion == 'show') {
        this.tituloModal = 'Nota de Servicio ' + data.id
      }
    },
      beforeSave(me) {
      let servicios = []
      //console.log('services',me.lServices);
      for (const obj in me.lServices) {
        let serv=me.lServices[obj]
        //console.log('serv',serv);
        let qa=[]
        Object.keys(serv.qa).forEach((i) => {
          if (serv.qa[i].selected==true){
            qa.push({id:i,puntos:serv.qa[i].puntos})
          }
        });
        if (serv.selected == true) {
          servicios.push({
            id: serv.id,
            verificado: serv.verificado,
            sol_id: serv.sol_id,
            obs_verif:serv.obs_verif,
            qa:qa
          })
        }
      }
      //console.log('serv',servicios);
      me.item.servicios = servicios
//      me.item.accion = me.item.accion+'.'
      me.item.act = me.item.accion
      //console.log('iteserv',me.item.servicios);
      //me.item.estado = (me.item.estado * 1) + 1
    },
     getSolicitudServicios(id) {
      //fecha.setDate(fecha.getDate() - 7)
      return [
        {
          mod: 'SolicitudServicios',
          lista: 'Realizados',
          datos: {
            modulo: 'mkServicios',
            relations: ['materiales','qa'],
            filtros: [
              ['orden_servicios_id', '=', id],
            ],
          },
        },
      ]
    },
    filtrar(accion){
      let crit=3
      if (accion=='autorizar'){
          crit=4
      }
      let lista = []
            this.lEstadosSol.map((e, index) =>
              lista.push({ id: index, name: e })
            )

      let busqueda=[{
      campo: 'estado',
      cond:"20",
      criterio:crit,
      type: 'num',
      union: 'and',
      lista: lista
      }]
      //console.log('filtrar',crit,busqueda)
      this.onBuscar(busqueda)
    },
  },
  async mounted() {
    this.lColorSol[3]='red--text'
    this.setOptionTable('add').visible = false
    let rev = this.addOptionTable({
      id: 'rev',
      color: 'red',
      icon: 'thumb_up',
      visible: this.can('edit'),
      action: 'revNota',
      grupos: ['action'],
      orden: 10,
      visibleRow: function (e) {
        return e.estado < 4 ? true : false
      },
    })
    this.addOptionTable({
        id: 'autorizar',
        color: 'success',
        icon: 'assignment_turned_in',
        text: 'Autorizar',
        visible: this.can('edit'),
        action: 'filtrar',
        grupos: ['filtros'],
        orden: 2,
      })
    this.addOptionTable({
        id: 'verificar',
        color: 'red',
        icon: 'thumb_up',
        text: 'Verificar',
        visible: this.can('edit'),
        action: 'filtrar',
        grupos: ['filtros'],
        orden: 1,
      })

    this.setOptionTable('del').visible = false
    this.setOptionTable('edit').visible = false
    // this.setOptionTable('edit').visibleRow = function (e) {
    //   return e.estado == 0 ? true : false
    // }


    let listas = await this.getDatasBackend(this.urlModulo, [
      { mod: 'Usuarios', campos: 'id,name', item: 'recolector_id' },
      {
        mod: 'Beneficiarios',
        campos: 'id,name,epsa',
        datos: { _customFields: 1 },
        item: 'beneficiario_id',
      },
      {
        mod: 'Forma_pagos',
        campos: 'id,name',
        item: 'forma_pago_id',
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
        each: (e) => {
          e.cantidad = 1
          e.selected = false
        },
      },
      {
        mod: 'Control_calidades',
        datos: { modulo: 'mkServicios' },
        campos: 'id,name,orden',
        orden:'orden',
      },
    ])
  },
}
</script>

<style lang="stylus"></style>
