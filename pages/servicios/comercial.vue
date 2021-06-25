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
        @closeDialog="modal = false"
        @grabarItem="expCsv"
        :bTitulo="bTitulo"
      >
        <table>
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
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'
import MkEstadosMix from '@/components/mkComponentes/mixins/MkEstadosMix'
import camposExportComercial from '@/api/camposExportComercial'

export default {
  middleware: ['authAccess'],
  mixins: [MkModuloMix, MkEstadosMix],
  name: 'Comercial',
  data() {
    return {
      //urlModulo: '',
      titModulo: 'Comercial',
      campos: [
        {
          text: 'Id',
          value: 'id',
          align: 'right',
          width: '100px',
          headers: true,
          type: 'num',
          search: true
        },
        {
          text: 'Fecha',
          value: 'created_at',
          align: 'center',

          headers: true,
          type: 'datetime',
          search: true
        },
        {
          text: 'Estado',
          value: 'estado',
          align: 'left',

          headers: true,
          type: 'num',
          search: true,
          lista: 'lEstadosSol',
          lColor: 'lColorSol'
        },
        {
          text: 'Exporto',
          value: 'created_by',
          align: 'left',

          headers: true,
          type: 'num',
          search: true,
          lista: 'lUsuarios'
        }
      ],
      bTitulo: '',
      lUsuarios: [],
      lForma_pagos: [],
      lBeneficiarios: [],
      lServicios: [],
      lSolicitudServicios: []
    }
  },
  methods: {
    async expNota(accion, data) {
      console.log('data', data)
      this.item = Object.assign({}, data)
      let listas = await this.getDatasBackend(this.urlModulo, [
        {
          mod: 'SolicitudServicios',
          datos: {
            modulo: 'mkServicios',
            filtros: [['comercial_id', '=', data.id]],
            relations: ['materiales', 'qa', 'servicios', 'nota']
          },
          campos: '*'
        }
      ])
      if (listas.SolicitudServicios.length == 0) {
        alert('No hay solicitudes por Autorizadas por Exportar!!!')
        return false
      }
      let campos = camposExportComercial

      campos.sort(function(a, b) {
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
      this.tituloModal = 'Exportar Solicitudes # ' + data.id
      this.modal = true
    },
    expCsv() {
      let csv = ''
      this.item.exportar.forEach((fila) => {
        csv = csv + fila.join(';') + '\n'
      })
      var element = document.createElement('a')
      let filename = this.formatDT(this.item.created_at) + '-comercial' + '.csv'
      element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(csv)
      )
      element.setAttribute('download', filename)

      element.style.display = 'none'
      document.body.appendChild(element)

      element.click()

      document.body.removeChild(element)
      this.modalExport = false
    }
  },
  async mounted() {
    this.addOptionTable({
      id: 'exportar',
      color: 'primary',
      icon: 'download_for_offline',
      text: 'Comercial',
      visible: true,
      action: 'expNota',
      grupos: ['action'],
      orden: 3
    })
    this.setOptionTable('show').visible = false
    this.setOptionTable('add').visible = false
    this.setOptionTable('edit').visible = false
    this.setOptionTable('del').visible = false
    this.setOptionTable('status').visible = false
    this.setOptionTable('restore').visible = false

    let listas = await this.getDatasBackend(this.urlModulo, [
      { mod: 'Usuarios', campos: 'id,name', item: 'recolector_id' },
      {
        mod: 'Beneficiarios',
        campos: 'id,name,epsa',
        datos: { _customFields: 1 },
        item: 'beneficiario_id',
        sort: 'name'
      },
      {
        mod: 'Forma_pagos',
        campos: 'id,name',
        item: 'forma_pago_id',
        datos: { modulo: 'mkServicios' }
      },
      {
        mod: 'Materiales',
        datos: { modulo: 'mkServicios' },
        campos: 'id,name,medida_id'
      },
      {
        mod: 'Medidas',
        datos: { modulo: 'mkServicios' },
        campos: 'id,simbolo'
      },
      {
        mod: 'Servicios',
        each: (e) => {
          e.cantidad = 1
          e.selected = false
        }
      },
      {
        mod: 'Control_calidades',
        datos: { modulo: 'mkServicios' },
        campos: 'id,name,orden',
        sort: 'orden'
      }
    ])
  }
}
</script>

<style lang="stylus"></style>
