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

       <mk-form
        ref="mkFormExport"
        :modal="modalExport"
        tit="Exportacion a Comercial"
        :accion="accion"
        @closeDialog="modalExport = false"
        @grabarItem="expCsv"
        bTitulo="Exportar"
      >
      <table>
        <template v-for="(fila,i) in item.exportar" >
        <tr v-if="i==0" :key="i"  >
          <th v-for="(col,index) in fila" :key="index" style="" nowrap="nowrap" class="primary white--text pa-2">
            {{ col }}
          </th>
        </tr>
        <tr v-else :key="i" :class="i % 2==1?'grey lighten-2':''">
          <td v-for="(col,index) in fila" :key="index">
            {{ col }}
          </td>
        </tr>
        </template>
      </table>
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
  mixins: [MkModuloMix, MkEstadosMix, MkImgMix],
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
      lControl_calidades: [],
      lOrdenes: {},
      nAceptadas: 0,
      imgPrefix: 'solicitud_servicios',
      bTitulo: '',
      modalExport:false,
      //grabarDebug: true,
    }
  },
  methods: {
    expCsv(){
      let csv=''
      this.item.exportar.forEach(fila => {
        csv=csv+fila.join(';')+'\n';  
      });
      var element = document.createElement('a');
      let filename=new Date().toISOString()+'-comercial'+'.csv'
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);

    },
    expNota() {
      let campos = [
        {
          id: 'id-nota',
          campo: 'nota.id',
          name: 'id Nota',
          type: 'num',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },
        {
          id: 'ref-nota',
          campo: 'nota.ref',
          name: 'Referencia Nota',
          type: 'text',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },
        {
          id: 'fecha-nota',
          campo: 'nota.created_at',
          name: 'Fecha de la Nota',
          type: 'datetime',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },
        {
          id: 'estado-nota',
          campo: 'nota.estado',
          name: 'Estado Nota',
          type: 'lista',
          lista:'lEstadosSol',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },
        {
          id: 'obs-nota',
          campo: 'nota.obs',
          name: 'Observacion Nota',
          type: 'text',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },
        {
          id: 'metodo-nota',
          campo: 'nota.forma_pago_id',
          name: 'Forma de Pago',
          type: 'lista',
          lista:'lForma_pagos',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },
        {
          id: 'beneficiario',
          campo: 'beneficiarios_id',
          name: 'Beneficiario',
          type: 'lista',
          lista:'lBeneficiarios',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },
        {
          id: 'epsa-beneficiario',
          campo: 'beneficiarios_id',
          name: 'Codigo EPSA',
          type: 'lista',
          lista:'lBeneficiarios:epsa',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: 0,
          orden: 1,
        },
        {
          id: 'id',
          campo: 'id',
          name: 'id Solicitud',
          type: 'num',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },
        {
          id: 'fecha-creacion',
          campo: 'created_at',
          name: 'Fecha Creacion',
          type: 'datetime',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },
        {
          id: 'user-creacion',
          campo: 'created_by',
          name: 'Quien lo Creo',
          type: 'lista',
          lista:'lUsuarios',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },{
          id: 'fecha-reviso',
          campo: 'fecha_1',
          name: 'Fecha Revisado',
          type: 'datetime',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },
        {
          id: 'user-revisado',
          campo: 'usuarios_id_1',
          name: 'Quien lo Reviso',
          type: 'lista',
          lista:'lUsuarios',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },{
          id: 'fecha-asigno',
          campo: 'fecha_2',
          name: 'Fecha Asignado',
          type: 'datetime',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },
        {
          id: 'user-asignado',
          campo: 'usuarios_id_2',
          name: 'Quien lo Asigno',
          type: 'lista',
          lista:'lUsuarios',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },{
          id: 'fecha-realizo',
          campo: 'fecha_3',
          name: 'Fecha Realizado',
          type: 'datetime',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },
        {
          id: 'user-realizado',
          campo: 'usuarios_id_3',
          name: 'Quien lo Realizo',
          type: 'lista',
          lista:'lUsuarios',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },{
          id: 'fecha-verificado',
          campo: 'fecha_4',
          name: 'Fecha Verificado',
          type: 'datetime',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },
        {
          id: 'user-verificado',
          campo: 'usuarios_id_4',
          name: 'Quien lo Verifico',
          type: 'lista',
          lista:'lUsuarios',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },{
          id: 'fecha-autorizado',
          campo: 'fecha_5',
          name: 'Fecha Autorizado',
          type: 'datetime',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },
        {
          id: 'user-autorizado',
          campo: 'usuarios_id_5',
          name: 'Quien lo Autorizo',
          type: 'lista',
          lista:'lUsuarios',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },
        {
          id: 'id-servicio',
          campo: 'servicios_id',
          name: 'Servicio',
          type: 'lista',
          lista:'lServicios',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },
        {
          id: 'obs-servicio',
          campo: 'sercicios_id',
          name: 'Obs. Servicio',
          type: 'lista',
          lista:'lServicios:obs',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: 0,
          orden: 1,
        },
        {
          id: 'cant',
          campo: 'cant',
          name: 'Cantidad',
          type: 'num',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: 0,
          orden: 1,
        },
        {
          id: 'estado-solicitud',
          campo: 'estado',
          name: 'Estado Solicitud',
          type: 'lista',
          lista:'lEstadosSol',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },
        {
          id: 'obs-realizado',
          campo: 'obs',
          name: 'Obs. Realizado',
          type: 'text',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },
        {
          id: 'obs-verificado',
          campo: 'obs_verif',
          name: 'Obs. Verificado',
          type: 'text',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },
        {
          id: 'id-eval',
          campo: 'evaluaciones_id',
          name: 'id Evaluacion',
          type: 'num',
          width: '',
          oblig: false,
          selected: true,
          depende: '',
          ligado: '',
          orden: 1,
        },
      ]
      campos.sort(function (a, b) {
            return a.orden - b.orden
      })

      let datos=[]

        let dato=[]
        campos.forEach(campo => {
          if (campo.selected){
            let field=(campo.campo+'.').split('.')
            let i=0;
            let valor=campo.name
            if (campo.type=='lista'){
              field=(campo.lista+':').split(':')
              let lista=field[0]
              if(field[1]==''){
                field='name'
              }else{
                field==field[1]
              }
              if (campo.ligado!==0){
                dato.push('id '+valor)    
              }
              valor=valor
            }
            dato.push(valor)
          }
          
        });
      datos.push(dato)
      this.lSolicitudServicios.forEach(sol => {
        let dato=[]
        campos.forEach(campo => {
          if (campo.selected){
            let field=(campo.campo+'.').split('.')
            let i=0;
            let valor=sol[field[0]]
            if (field[1]!=''){
              valor=valor[field[1]]
            }
            if (campo.type=='lista'){
              field=(campo.lista+':').split(':')
              let lista=field[0]
              if(field[1]==''){
                field='name'
              }else{
                field==field[1]
              }
              if (campo.ligado!==0){
                dato.push(valor)    
                //console.log('lista campos',lista,valor,'id',field,this.getDataLista(this[lista],valor,'id',field,this[lista][valor]));
              }
                valor=this.getDataLista(this[lista],valor,'id',field,this[lista][valor])
            }
            dato.push(valor)
          }
        });
        datos.push(dato)
      });

      this.item.exportar=datos;
      this.modalExport=true
    },
    revNota(accion, data) {
      data.accion = 'verificar'
      this.openDialog('edit', data)
    },
    autNota(accion, data) {
      data.accion = 'autorizar'
      this.openDialog('edit', data)
    },
    async beforeOpen(accion, data = {}) {
      //data._noData = 1
      data.noImage = !!!data.foto
      if (accion == 'show') {
        data.accion = accion
      }

      this.lServices = []
      let sel = null

      let listas = await this.getDatasBackend(
        'SolicitudServicios',
        this.getSolicitudServicios(data.id, data.accion)
      )
      let lSol = Object.keys(listas.Realizados)
      if (lSol.length == 0) {
        return false
      }

      lSol.forEach((el) => {
        let e = listas.Realizados[el]
        let serv = this.getDataLista(this.lServicios, e.servicios_id, 'id', '*')

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
          if (
            e.estado == 3 ||
            e.estado == 9 ||
            e.estado == 8 ||
            e.estado == 4 ||
            data.estado > 3
          ) {
            this.lControl_calidades.forEach((el) => {
              qa[el.id] = { selected: false, puntos: '' }
            })
            if (e.estado == 4) {
              e.qa.forEach((el) => {
                qa[el.id] = { selected: true, puntos: el.puntos }
              })
            }
            sel = 1
            e.estado = e.estado * 1
            serv_ = {
              realizado: e.estado != 9 && e.estado != 8 && e.estado != 1,
              verificado:
                (e.estado > 3 && e.estado != 9) || data.estado > 3
                  ? data.estado == 5
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
      })

      //data.estado =(data.estado*1);
    },
    afterOpen(accion, data) {
      if (data.accion == 'verificar') {
        this.tituloModal = 'Verificar Nota ' + data.id
        this.bTitulo = 'Verificar'
      }

      if (data.accion == 'autorizar') {
        this.tituloModal = 'Autorizar Nota ' + data.id
        this.bTitulo = 'Autorizar'
      }

      if (data.accion == 'show') {
        this.tituloModal = 'Ver Nota de Servicio ' + data.id
      }
    },
    beforeSave(me) {
      let servicios = []
      //console.log('services',me.lServices);
      for (const obj in me.lServices) {
        let serv = me.lServices[obj]
        //console.log('serv',serv);
        let qa = []
        Object.keys(serv.qa).forEach((i) => {
          if (serv.qa[i].selected == true) {
            qa.push({ id: i, puntos: serv.qa[i].puntos })
          }
        })
        if (serv.selected == true) {
          servicios.push({
            id: serv.id,
            verificado: serv.verificado,
            sol_id: serv.sol_id,
            obs_verif: serv.obs_verif,
            qa: qa,
          })
        }
      }
      //console.log('serv',servicios);
      me.paramsExtra = []
      me.item.servicios = servicios
      //      me.item.accion = me.item.accion+'.'
      me.item.act = me.item.accion
      //console.log('iteserv',me.item.servicios);
      //me.item.estado = (me.item.estado * 1) + 1
    },
    getSolicitudServicios(id, act) {
      //fecha.setDate(fecha.getDate() - 7)
      let filtros = [['orden_servicios_id', '=', id]]
      if (act == 'autorizar') {
        filtros.push(['estado', '=', 4])
      }
      return [
        {
          mod: 'SolicitudServicios',
          lista: 'Realizados',
          datos: {
            modulo: 'mkServicios',
            relations: ['materiales', 'qa'],
            filtros: filtros,
          },
        },
      ]
    },
    filtrar(accion) {
      let crit = 3
      if (accion == 'autorizar') {
        crit = 4
      }
      if (accion == 'exportar') {
        crit = 5
      }
      let lista = []
      this.lEstadosSol.map((e, index) => lista.push({ id: index, name: e }))

      let busqueda = [
        {
          campo: 'estado',
          cond: '20',
          criterio: crit,
          type: 'num',
          union: 'and',
          lista: lista,
        },
      ]
      //console.log('filtrar',crit,busqueda)
      this.onBuscar(busqueda)
    },
  },
  async mounted() {
    this.lColorSol[3] = 'red--text'
    this.setOptionTable('add').visible = false
    this.setOptionTable('status').visible = false

    this.addOptionTable({
      id: 'verif',
      color: 'red',
      icon: 'thumb_up',
      visible: this.can('edit', 'estado-verificar'),
      action: 'revNota',
      grupos: ['action'],
      orden: 10,
      visibleRow: function (e) {
        return e.estado < 5 ? true : false
      },
    })
    this.addOptionTable({
      id: 'aut',
      color: 'green',
      icon: 'assignment_turned_in',
      visible: this.can('edit', 'estado-autorizar'),
      action: 'autNota',
      grupos: ['action'],
      orden: 11,
      visibleRow: function (e) {
        return e.estado == 4 ? true : false
      },
    })
    this.addOptionTable({
      id: 'com',
      color: 'primary',
      icon: 'download_for_offline',
      visible: this.can('edit', 'estado-comercial'),
      action: 'expNota',
      grupos: ['action'],
      orden: 12,
      visibleRow: function (e) {
        return e.estado > 4 ? true : false
      },
    })

    this.addOptionTable({
      id: 'exportar',
      color: 'primary',
      icon: 'download_for_offline',
      text: 'Comercial',
      visible: this.can('show'),
      action: 'filtrar',
      grupos: ['filtros'],
      orden: 3,
    })
    this.addOptionTable({
      id: 'autorizar',
      color: 'success',
      icon: 'assignment_turned_in',
      text: 'Autorizar',
      visible: this.can('show'),
      action: 'filtrar',
      grupos: ['filtros'],
      orden: 2,
    })
    this.addOptionTable({
      id: 'verificar',
      color: 'red',
      icon: 'thumb_up',
      text: 'Verificar',
      visible: this.can('show'),
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
        orden: 'orden',
      },
      {
        mod: 'SolicitudServicios',
        datos: { modulo: 'mkServicios',filtros:[['estado','=',5]], relations:['materiales','qa','servicios','nota']},
        campos: '*',
      },
    ])
  },
}
</script>

<style lang="stylus"></style>
