<template>
  <div id="pageReportes">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex grow>
          <h2 class="font-weight-bold ">Reportes – Sistema BES</h2>
          <div style="width:160px;display: inline-block;vertical-align:top">
            <v-select
              v-model="fechaSel"
              :items="lFechas"
              label="Periodo de Fecha:"
              hideDetails
              dense
              @change="changeFecha()"
            ></v-select>
          </div>
          <mk-date
            hideDetails
            v-model="desde"
            label="Desde"
            class="date"
            v-if="fechaSel == 'Personalizada'"
          >
          </mk-date>
          <mk-date
            hideDetails
            v-model="hasta"
            label="Hasta"
            class="date"
            v-if="fechaSel == 'Personalizada'"
          >
          </mk-date>
          <div style="width:180px;display: inline-block;vertical-align:top">
            <v-select
              v-model="ruta"
              :items="lRutas"
              item-text="name"
              item-value="id"
              label="Ruta"
              hideDetails
              dense
            ></v-select>
          </div>
          <v-btn
            color="green"
            round
            small
            @click="reCalculo()"
            title="Actualizar"
          >
            <v-icon>published_with_changes</v-icon>
            &nbsp;Actualizar
          </v-btn>
        </v-flex>
      </v-layout>

      <v-card class="pa-2">
        <v-toolbar color="indigo" dark dense>
          <v-toolbar-title class="body-2"
            >Evaluación - Monitoreo
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            v-if="reportes.evalMon"
            icon
            color="green"
            small
            title="actualizar solo Este Grafico"
            @click="reCalculo('evalMon')"
          >
            <v-icon>refresh</v-icon>
          </v-btn>
          <v-btn
            icon
            color="red"
            small
            @click="reportes.evalMon = !reportes.evalMon"
          >
            <v-icon v-if="reportes.evalMon" title="Ocultar"
              >visibility_off</v-icon
            >
            <v-icon v-else title="Mostrar">visibility</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout row wrap v-if="reportes.evalMon">
          <v-flex>
            <e-chart
              :key="cont"
              :path-option="getOptionsEvalMon()"
              height="350px"
              width="100%"
            >
            </e-chart>
          </v-flex>
        </v-layout>
      </v-card>
      <br />
      <v-card class="pa-2">
        <v-toolbar color="indigo" dark dense>
          <v-toolbar-title class="body-2"
            >Solicitudes de Servicios
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            v-if="reportes.solicitudes"
            icon
            color="green"
            small
            title="actualizar solo Este Grafico"
            @click="reCalculo('solicitudes')"
          >
            <v-icon>refresh</v-icon>
          </v-btn>
          <v-btn
            icon
            color="red"
            small
            @click="reportes.solicitudes = !reportes.solicitudes"
          >
            <v-icon v-if="reportes.solicitudes" title="Ocultar"
              >visibility_off</v-icon
            >
            <v-icon v-else title="Mostrar">visibility</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout row wrap v-if="reportes.solicitudes">
          <v-flex>
            <e-chart
              :key="cont"
              :path-option="getOptionsSolicitudes()"
              height="350px"
              width="100%"
            >
            </e-chart>
          </v-flex>
        </v-layout>
      </v-card>
      <br />
      <v-card class="pa-2">
        <v-toolbar color="indigo" dark dense>
          <v-toolbar-title class="body-2"
            >Servicios Realizados
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            v-if="reportes.servicios"
            icon
            color="green"
            small
            title="actualizar solo Este Grafico"
            @click="reCalculo('servicios')"
          >
            <v-icon>refresh</v-icon>
          </v-btn>
          <v-btn
            icon
            color="red"
            small
            @click="reportes.servicios = !reportes.servicios"
          >
            <v-icon v-if="reportes.servicios" title="Ocultar"
              >visibility_off</v-icon
            >
            <v-icon v-else title="Mostrar">visibility</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout row wrap v-if="reportes.servicios">
          <v-flex>
            <e-chart
              :key="cont"
              :path-option="getOptionsServicios()"
              height="350px"
              width="100%"
            >
            </e-chart>
          </v-flex>
        </v-layout>
      </v-card>
      <br />
      <v-card class="pa-2">
        <v-toolbar color="indigo" dark dense>
          <v-toolbar-title class="body-2"
            >Ordenes de Servicios
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            v-if="reportes.ordenes"
            icon
            color="green"
            small
            title="actualizar solo Este Grafico"
            @click="reCalculo('ordenes')"
          >
            <v-icon>refresh</v-icon>
          </v-btn>
          <v-btn
            icon
            color="red"
            small
            @click="reportes.ordenes = !reportes.ordenes"
          >
            <v-icon v-if="reportes.ordenes" title="Ocultar"
              >visibility_off</v-icon
            >
            <v-icon v-else title="Mostrar">visibility</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout row wrap v-if="reportes.ordenes">
          <v-flex>
            <e-chart
              :key="cont"
              :path-option="getOptionsOrdenes()"
              height="350px"
              width="100%"
            >
            </e-chart>
          </v-flex>
        </v-layout>
      </v-card>
      <br />
      <v-card class="pa-2">
        <v-toolbar color="red" dark dense>
          <v-toolbar-title class="body-2"
            >Materiales Stock Mínimo
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            v-if="reportes.materiales"
            icon
            color="green"
            small
            title="actualizar solo Este Grafico"
            @click="reCalculo('materiales')"
          >
            <v-icon>refresh</v-icon>
          </v-btn>
          <v-btn
            icon
            color="red"
            small
            @click="reportes.materiales = !reportes.materiales"
          >
            <v-icon v-if="reportes.materiales" title="Ocultar"
              >visibility_off</v-icon
            >
            <v-icon v-else title="Mostrar">visibility</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout row wrap v-if="reportes.materiales">
          <v-flex>
            <e-chart
              :key="cont"
              :path-option="getOptionsMateriales()"
              height="350px"
              width="100%"
            >
            </e-chart>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import EChart from '@/components/chart/echart'
import Material from 'vuetify/es5/util/colors'
import MkDate from '@/components/mkComponentes/MkDate'
import MkEstadosMix from '@/components/mkComponentes/mixins/MkEstadosMix'
import {
  c,
  getDataLista,
  formatDT
} from '@/components/mkComponentes/lib/MkUtils.js'

export default {
  middleware: ['auth'],
  layout: 'dashboard',
  components: { EChart, MkDate },
  mixins: [MkEstadosMix],
  data: () => ({
    cont: 0,
    color: Material,
    desde: '',
    hasta: '',
    ruta: 0,
    lMedidas: [],
    lServicios: [],
    lForma_pagos: [],
    lRutas: [],
    lFechas: [
      'Hoy',
      'Ayer',
      'Esta Semana',
      'Semana Pasada',
      'Este Mes',
      'Mes Anterior',
      'Este Año',
      'Personalizada'
    ],
    fechaSel: 'Esta Semana',
    reportes: {
      evalMon: true,
      servicios: true,
      solicitudes: true,
      materiales: true,
      ordenes: true
    },
    lReportes: {
      evalMon: {},
      servicios: [],
      solicitudes: [],
      materiales: [],
      ordenes: []
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    }
  }),
  methods: {
    changeFecha() {
      const fecha = new Date()
      let primerDia = new Date()
      let ultimoDia = new Date()
      if (this.fechaSel == 'Hoy') {
      }
      if (this.fechaSel == 'Ayer') {
        primerDia = new Date(
          fecha.getFullYear(),
          fecha.getMonth(),
          fecha.getDate() - 1
        )
        ultimoDia = new Date(
          fecha.getFullYear(),
          fecha.getMonth(),
          fecha.getDate() - 1
        )
      }
      if (this.fechaSel == 'Esta Semana') {
        let day = fecha.getDay() == 0 ? 6 : fecha.getDay() -1
        primerDia = new Date(
          fecha.getFullYear(),
          fecha.getMonth(),
          fecha.getDate() - day
        )
        ultimoDia = new Date(
          primerDia.getFullYear(),
          primerDia.getMonth(),
          primerDia.getDate() + 6
        )
      }
      if (this.fechaSel == 'Semana Pasada') {
        let day = fecha.getDay() == 0 ? 6 : fecha.getDay() - 1
        day = day + 7
        primerDia = new Date(
          fecha.getFullYear(),
          fecha.getMonth() ,
          fecha.getDate() - day
        )
        ultimoDia = new Date(
          primerDia.getFullYear(),
          primerDia.getMonth() ,
          primerDia.getDate() + 6
        )
      }
      if (this.fechaSel == 'Este Mes') {
        primerDia = new Date(fecha.getFullYear(), fecha.getMonth() , 1)
        ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0)
      }
      if (this.fechaSel == 'Mes Anterior') {
        primerDia = new Date(fecha.getFullYear(), fecha.getMonth()-1, 1)
        ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth(), 0)
      }
      if (this.fechaSel == 'Este Año') {
        primerDia = new Date(fecha.getFullYear(), 0, 1)
        ultimoDia = new Date(fecha.getFullYear() + 1, 0, 0)
      }

      this.desde =
        primerDia.getFullYear() +
        '-' +
        (primerDia.getMonth() + 1) +
        '-' +
        primerDia.getDate()
      this.hasta =
        ultimoDia.getFullYear() +
        '-' +
        (ultimoDia.getMonth() + 1) +
        '-' +
        ultimoDia.getDate()
      console.log('fecha', this.desde, this.hasta, this.fechaSel)
    },
    formatDT(d = '', time = true) {
      return formatDT(d, time)
    },
    getDataLista(lista, valor, busco = 'id', devuelvo = 'name', defa = false) {
      return getDataLista(lista, valor, busco, devuelvo, defa)
    },
    async getDatasBackend(mod, listas) {
      let data = await this.$store.dispatch('auth/loadDatas', {
        mod: mod,
        listas: listas
      })
      listas.forEach((el) => {
        let datos = {}
        if (el.lista && el.lista != '') {
          datos = data[el.lista]
        } else {
          datos = data[el.mod]
          el.lista = 'l' + el.mod
        }

        if (el.item) {
          //console.log('el item is array',el.item);
          if (Array.isArray(el.item)) {
            el.item.forEach((e) => this.updateListCol(e, datos))
          } else {
            this.updateListCol(el.item, datos)
          }
        }

        if (typeof el.each === 'function') {
          datos.forEach(el.each)
        }

        let sort = el.sort || false
        if (sort && Array.isArray(datos)) {
          datos.sort(function(a, b) {
            if (typeof a[sort] === 'string') {
              if (a[sort] > b[sort]) {
                return 1
              }
              if (a[sort] < b[sort]) {
                return -1
              }
              return 0
            } else {
              return a[sort] - b[sort]
            }
          })
        }

        let sortAsc = el.sortAsc || false
        if (sortAsc && Array.isArray(datos)) {
          datos.sort(function(a, b) {
            return b[sortAsc] - a[sortAsc]
          })
        }

        if (el.lista != '') {
          if (this[el.lista]) {
            this[el.lista] = datos
          }
        }
      })
      return data
    },
    async getDataBackend(url, campos = '', datos = null, method = '') {
      let data = await this.$store.dispatch('auth/loadData', {
        url: url,
        campos: campos,
        datos: datos,
        method: method
      })
      return data
    },
    async reCalculo(modulo = '') {
      let reportes = {}
      if (modulo != '') {
        reportes[modulo] = true
      } else {
        reportes = this.reportes
      }
      //console.log('Fecha:', this.desde, this.hasta)
      let lReportes = await this.getDataBackend(
        'Reportes',
        '',
        {
          desde: this.desde,
          hasta: this.hasta,
          reportes: reportes,
          ruta: this.ruta
        },
        'post'
      )

      if (modulo != '') {
        this.lReportes[modulo] = lReportes[modulo]
      } else {
        this.lReportes = lReportes
      }

      this.cont++
    },
    getOptionsEvalMon() {
      let nRuta =
        this.ruta > 0
          ? ' de la Ruta: ' + this.getDataLista(this.lRutas, this.ruta)
          : ''
      let title = 'Evaluación - Monitoreo' + nRuta
      let subtitle =
        'rango real estimado: ' +
        this.lReportes.evalMon.fechaIni +
        ' >>> ' +
        this.lReportes.evalMon.fechaFin +
        ' : ' +
        this.lReportes.evalMon.semanas +
        ' semanas'
      let data = this.lReportes.evalMon
      let seriesLabel = {
        show: true
      }
      let datos = [
        {
          name: 'Ruteos',
          type: 'bar',
          barGap: 0,
          label: seriesLabel,
          data: [data.ruteosE, data.ruteos]
        },
        {
          name: 'Evaluaciones',
          type: 'bar',
          barGap: 0,
          label: seriesLabel,
          data: [data.evalE, data.eval]
        },
        {
          name: 'Evaluaciones Respondidas',
          type: 'bar',
          barGap: 0,
          label: seriesLabel,
          data: [data.evalE, data.evalComp]
        },
        {
          name: 'Evaluaciones NO Respondieron',
          type: 'bar',
          barGap: 0,
          label: seriesLabel,
          data: [0, data.eval - data.evalComp]
        }
      ]
      let r = [
        ['title', { text: title, subtext: subtitle, top: 10, left: 10 }],
        ['xAxis', [{ type: 'category', data: ['Esperadas', 'Ejecutadas'] }]],
        ['series', datos],
        ['toolbox', this.toolbox],
        [
          'color',
          [
            this.color.indigo.base,
            this.color.pink.base,
            this.color.green.base,
            this.color.grey.base,
            this.color.purple.base,
            this.color.amber.base
          ]
        ],
        [
          'legend',
          {
            orient: 'horizontal',
            show: true,
            x: 'left',
            fontSize: 10,
            type: 'plain',
            bottom: 2
          }
        ],
        ['xAxis.show', true],
        ['yAxis.show', true]
      ]
      return r
    },
    getOptionsServicios() {
      let nRuta =
        this.ruta > 0
          ? ' de la Ruta: ' + this.getDataLista(this.lRutas, this.ruta)
          : ''
      let title = 'Servicios Realizados' + nRuta
      let subtitle =
        this.desde +
        ' >>> ' +
        this.hasta +
        ' : ' +
        this.totalServicios +
        ' Servicios en Total'
      let datos = []
      this.lReportes.servicios.map((e, index) => {
        datos.push({
          name:
            this.getDataLista(this.lServicios, e.servicios_id) + ': ' + e.cant,
          type: 'bar',
          //          stack: 'total',
          label: {
            show: true,
            position: 'bottom',
            distance: 10,
            align: 'right',
            verticalAlign: 'middle',
            rotate: 10,
            formatter: '{a}',
            fontSize: 10,
            color: 'black',
            rich: {
              name: {}
            }
          },
          data: [e.cant]
        })
      })
      let r = [
        ['title', { text: title, subtext: subtitle, top: 10, left: 10 }],
        ['xAxis', [{ type: 'category', data: ['servicios'], show: false }]],
        ['series', datos],
        ['toolbox', this.toolbox],
        [
          'legend',
          {
            orient: 'horizontal',
            show: true,
            x: 'left',
            fontSize: 10,
            type: 'plain',
            bottom: 2
          }
        ],
        ['yAxis.show', true]
      ]
      return r
    },
    getOptionsSolicitudes() {
      let nRuta =
        this.ruta > 0
          ? ' de la Ruta: ' + this.getDataLista(this.lRutas, this.ruta)
          : ''
      let title = 'Solicitudes de Servicios' + nRuta
      let subtitle =
        this.desde +
        ' >>> ' +
        this.hasta +
        ' : ' +
        this.totalSolicitudes +
        ' Solicitudes en Total'

      let datos = []
      this.lReportes.solicitudes.map((e, index) => {
        datos.push({
          name: this.lEstadosSol[e.estado] + ': ' + e.cant,
          type: 'bar',
          label: {
            show: true,
            position: 'bottom',
            distance: 10,
            align: 'right',
            verticalAlign: 'middle',
            rotate: 10,
            formatter: '{a}',
            fontSize: 10,
            color: 'black',
            rich: {
              name: {}
            }
          },
          data: [e.cant]
        })
      })
      let r = [
        ['title', { text: title, subtext: subtitle, top: 10, left: 10 }],
        ['xAxis', [{ type: 'category', data: ['Solicitudes'], show: false }]],
        ['series', datos],
        ['toolbox', this.toolbox],
        [
          'legend',
          {
            orient: 'horizontal',
            show: true,
            x: 'left',
            fontSize: 10,
            type: 'plain',
            bottom: 2
          }
        ],
        ['yAxis.show', true]
      ]
      return r
    },
    getOptionsOrdenes() {
      let nRuta =
        this.ruta > 0
          ? ' de la Ruta: ' + this.getDataLista(this.lRutas, this.ruta)
          : ''
      let title = 'Forma de Pago Ordenes de Servicios' + nRuta
      let subtitle =
        this.desde +
        ' >>> ' +
        this.hasta +
        ' : ' +
        this.totalOrdenes +
        ' Ordenes en Total'

      let datos = []
      this.lReportes.ordenes.map((e, index) => {
        datos.push({
          name:
            this.getDataLista(this.lForma_pagos, e.forma_pago_id) +
            ': ' +
            e.cant,
          type: 'bar',
          label: {
            show: true,
            position: 'bottom',
            distance: 10,
            align: 'right',
            verticalAlign: 'middle',
            rotate: 10,
            formatter: '{a}',
            fontSize: 10,
            color: 'black',
            rich: {
              name: {}
            }
          },
          data: [e.cant]
        })
      })
      let r = [
        ['title', { text: title, subtext: subtitle, top: 10, left: 10 }],
        ['xAxis', [{ type: 'category', data: ['Ordenes'], show: false }]],
        ['series', datos],
        ['toolbox', this.toolbox],
        [
          'legend',
          {
            orient: 'horizontal',
            show: true,
            x: 'left',
            fontSize: 10,
            type: 'plain',
            bottom: 2
          }
        ],
        ['yAxis.show', true]
      ]
      return r
    },
    getOptionsMateriales() {
      let title = 'Materiales Stock Mínimo'
      let subtitle = ''
      let datos = []

      this.lReportes.materiales.map((e, index) => {
        datos.push({
          name: e.name + '- stock: ' + e.stock,
          type: 'bar',
          label: {
            show: true,
            position: 'insideBottom',
            distance: 5,
            align: 'left',
            verticalAlign: 'middle',
            rotate: 90,
            formatter: '{a}',
            fontSize: 12,
            rich: {
              name: {}
            }
          },
          data: [e.min_stock]
        })
      })
      let r = [
        ['title', { text: title, subtext: subtitle, top: 10, left: 10 }],
        ['xAxis', [{ type: 'category', data: ['Stock Minimo'], show: true }]],
        ['series', datos],
        ['toolbox', this.toolbox],
        [
          'legend',
          {
            orient: 'horizontal',
            bottom: 2,
            show: true,
            x: 'left',
            fontSize: 10,
            type: 'scroll'
          }
        ],
        ['yAxis.show', true]
      ]
      return r
    }
  },
  computed: {
    totalServicios() {
      let c = 0
      this.lReportes.servicios.map((e) => (c = c + e.cant * 1))
      return c
    },
    totalSolicitudes() {
      let c = 0
      this.lReportes.solicitudes.map((e) => (c = c + e.cant * 1))
      return c
    },
    totalOrdenes() {
      let c = 0
      this.lReportes.ordenes.map((e) => (c = c + e.cant * 1))
      return c
    }
  },
  async mounted() {
    this.changeFecha()
    await this.reCalculo()
    let listas = await this.getDatasBackend('Ruteos', [
      {
        mod: 'Medidas',
        datos: { modulo: 'mkServicios' },
        campos: 'id,simbolo'
      },
      {
        mod: 'Servicios',
        campos: 'id,name'
      },
      {
        mod: 'Rutas',
        campos: 'id,name'
      },
      {
        mod: 'Forma_pagos',
        datos: { modulo: 'mkServicios' },
        campos: 'id,name'
      }
    ])
    this.lRutas = [{ id: 0, name: 'Todos las Rutas...' }, ...this.lRutas]
    this.cont++
  }
}
</script>
<style scoped>
.date {
  width: 130px;
  display: inline-block;
}
</style>