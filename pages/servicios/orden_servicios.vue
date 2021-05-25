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
        :tit="titModulo"
        :accion="accion"
        @closeDialog="modalExport = false"
        @grabarItem="expCsv"
        :bTitulo="bTitulo"
      >
        <table v-if="item.accion == 'comercial'">
          <template v-for="(fila, i) in item.exportar">
            <tr v-if="i == 0" :key="i">
              <th
                v-for="(col, index) in fila"
                :key="index"
                style=""
                nowrap="nowrap"
                class="primary white--text pa-2"
              >
                {{ col }}
              </th>
            </tr>
            <tr v-else :key="i" :class="i % 2 == 1 ? 'grey lighten-2' : ''">
              <td v-for="(col, index) in fila" :key="index">
                {{ col }}
              </td>
            </tr>
          </template>
        </table>

        <v-list dense v-if="item.act == 'finalizar'">
          <v-list-tile class="primary white--text elevation-5">
            <v-list-tile-action style="min-width: 54px"> </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>
                <div style="width: 50px; display: inline-block">ID</div>
                <div style="width: 140px; display: inline-block">FECHA</div>
                QUIEN EXPORTO
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            v-for="servicio in item.comercial"
            :key="servicio.id"
            :class="
              servicio.selected
                ? 'deep-purple lighten-5 deep-purple--text text--accent-4 elevation-3'
                : 'elevation-3'
            "
          >
            <v-list-tile-action style="min-width: 54px">
              <v-checkbox
                v-model="servicio.selected"
                color="deep-purple accent-4"
                :readonly="accion == 'show'"
                hide-details
              ></v-checkbox>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>
                <div style="width: 50px; display: inline-block">
                  {{ servicio.id }}
                </div>
                <div style="width: 140px; display: inline-block">
                  {{ formatDT(servicio.created_at, true) }}
                </div>
                {{ getDataLista(lUsuarios, servicio.created_by) }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'
import MkEstadosMix from '@/components/mkComponentes/mixins/MkEstadosMix'
import MkImgMix from '@/components/mkComponentes/mixins/MkImgMix'
import MkShowSolicitud from '@/components/mkComponentes/MkShowSolicitud'
import camposExportComercial from '@/api/camposExportComercial'
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
      lComercial: [],
      lOrdenes: {},
      nAceptadas: 0,
      imgPrefix: 'solicitud_servicios',
      bTitulo: '',
      modalExport: false,
      //grabarDebug: true,
    }
  },
  methods: {
    expCsv() {
      //console.log(this.item);
      if (this.item.act == 'finalizar') {
        let servicios = []
        this.item.comercial.forEach((e) => {
          if (e.selected) {
            servicios.push(e.id)
          }
        })
        if (servicios.length == 0) {
          this.modalExport = false
          return true
        }

        this.item = {}
        this.item.id = 1
        this.item.act = 'finalizar'
        this.accion = 'finalizar'
        this.item.servicios = servicios

        this.formVerif = this.$refs.mkFormExport.$refs.form
        this.grabarItem(this.item.act, this.item)
        this.modalExport = false
      }

      if (this.item.act == 'comercial') {
        let csv = ''
        this.item.exportar.forEach((fila) => {
          csv = csv + fila.join(';') + '\n'
        })
        var element = document.createElement('a')
        let filename = this.formatDT(new Date()) + '-comercial' + '.csv'
        element.setAttribute(
          'href',
          'data:text/plain;charset=utf-8,' + encodeURIComponent(csv)
        )
        element.setAttribute('download', filename)

        element.style.display = 'none'
        document.body.appendChild(element)

        element.click()

        document.body.removeChild(element)

        this.item = {}
        this.item.id = 1
        this.item.act = 'comercial'
        this.accion = 'comercial'

        this.formVerif = this.$refs.mkFormExport.$refs.form
        this.grabarItem(this.item.act, this.item)
        this.modalExport = false
      }
    },
    async finNota() {
      let listas = await this.getDatasBackend(this.urlModulo, [
        {
          mod: 'Comercial',
          datos: {
            modulo: 'mkServicios',
            filtros: [['estado', '=', 6]],
            orden: 'created_at',
          },
          campos: '*',
          each: (e) => {
            e.selected = false
          },
        },
      ])
      if (this.lComercial.length == 0) {
        alert('No hay por Finalizar !!!')
        return false
      }

      this.item.comercial = this.lComercial
      //this.item.comercial = JSON.parse(JSON.stringify(listas.comercial))
      this.item.act = 'finalizar'
      this.titModulo = 'Finalizar Solicitudes Exportadas '

      this.bTitulo = 'Finalizar'
      this.accion = 'finalizar'
      this.modalExport = true
    },
    async expNota() {
      let listas = await this.getDatasBackend(this.urlModulo, [
        {
          mod: 'SolicitudServicios',
          datos: {
            modulo: 'mkServicios',
            filtros: [['estado', '=', 5]],
            relations: ['materiales', 'qa', 'servicios', 'nota'],
          },
          campos: '*',
        },
      ])
      if (listas.SolicitudServicios.length == 0) {
        alert('No hay solicitudes por Autorizadas por Exportar!!!')
        return false
      }
      let campos = camposExportComercial
      campos.sort(function (a, b) {
        return a.orden - b.orden
      })

      let datos = []

      let dato = []
      campos.forEach((campo) => {
        if (campo.selected) {
          let field = (campo.campo + '.').split('.')
          let i = 0
          let valor = campo.name
          if (campo.type == 'lista') {
            field = (campo.lista + ':').split(':')
            let lista = field[0]
            if (field[1] == '') {
              field = 'name'
            } else {
              field == field[1]
            }
            if (campo.ligado !== 0) {
              dato.push('id ' + valor)
            }
            valor = valor
          }
          dato.push(valor)
        }
      })
      datos.push(dato)
      listas.SolicitudServicios.forEach((sol) => {
        let dato = []
        campos.forEach((campo) => {
          if (campo.selected) {
            let field = (campo.campo + '.').split('.')
            let i = 0
            let valor = sol[field[0]]
            if (field[1] != '') {
              valor = valor[field[1]]
            }
            if (campo.type == 'lista') {
              field = (campo.lista + ':').split(':')
              let lista = field[0]
              if (field[1] == '') {
                field = 'name'
              } else {
                field == field[1]
              }
              if (campo.ligado !== 0) {
                dato.push(valor)
                //console.log('lista campos',lista,valor,'id',field,this.getDataLista(this[lista],valor,'id',field,this[lista][valor]));
              }
              valor = this.getDataLista(
                this[lista],
                valor,
                'id',
                field,
                this[lista][valor]
              )
            }
            dato.push(valor)
          }
        })
        datos.push(dato)
      })

      this.item.exportar = datos
      this.item.act = 'comercial'
      this.accion = 'comercial'
      this.bTitulo = 'Exportar'
      this.titModulo = 'Exportar Solicitudes Autorizadas '
      this.modalExport = true
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
      if (me.item.act == 'comercial' || me.item.act == 'finalizar') {
        return true
      } else {
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
      }
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
      icon: 'done_all',
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
      color: 'orange',
      icon: 'assignment_turned_in',
      visible: this.can('edit', 'estado-autorizar'),
      action: 'autNota',
      grupos: ['action'],
      orden: 11,
      visibleRow: function (e) {
        return e.estado == 4 ? true : false
      },
    })
    // this.addOptionTable({
    //   id: 'com',
    //   color: 'primary',
    //   icon: 'download_for_offline',
    //   visible: this.can('edit', 'estado-comercial'),
    //   action: 'expNota',
    //   grupos: ['action'],
    //   orden: 12,
    //   visibleRow: function (e) {
    //     return e.estado > 4 ? true : false
    //   },
    // })

    this.addOptionTable({
      id: 'finalizar',
      color: 'green',
      icon: 'thumb_up',
      text: 'Finalizar',
      visible: this.can('edit', 'estado-terminado'),
      action: 'finNota',
      grupos: ['filtros'],
      orden: 4,
    })
    this.addOptionTable({
      id: 'exportar',
      color: 'primary',
      icon: 'download_for_offline',
      text: 'Comercial',
      visible: this.can('edit', 'estado-comercial'),
      action: 'expNota',
      grupos: ['filtros'],
      orden: 3,
    })
    this.addOptionTable({
      id: 'autorizar',
      color: 'orange',
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
      icon: 'done_all',
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
    ])
  },
}
</script>

<style lang="stylus"></style>
