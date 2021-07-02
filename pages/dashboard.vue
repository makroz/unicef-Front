<template>
  <div id="pageDashboard">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex grow>
          <h2 class="font-weight-bold ">DASHBOARD – Bienvenido Al Sistema</h2>
          <h4 class=" ">Qué tenemos para Hoy?</h4>
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
              height="250px"
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
            >Situacion Actual Rutas y Ruteos
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            v-if="reportes.ruteos"
            icon
            color="green"
            small
            title="actualizar solo Este Grafico"
            @click="reCalculo('ruteos')"
          >
            <v-icon>refresh</v-icon>
          </v-btn>
          <v-btn
            icon
            color="red"
            small
            @click="reportes.ruteos = !reportes.ruteos"
          >
            <v-icon v-if="reportes.ruteos" title="Ocultar"
              >visibility_off</v-icon
            >
            <v-icon v-else title="Mostrar">visibility</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout row wrap v-if="reportes.ruteos">
          <v-flex>
            <e-chart
              :key="cont"
              :path-option="getOptionsRuteos()"
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
          <v-toolbar-title class="body-2">Evaluaciones </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            v-if="reportes.evaluaciones"
            icon
            color="green"
            small
            title="actualizar solo Este Grafico"
            @click="reCalculo('evaluaciones')"
          >
            <v-icon>refresh</v-icon>
          </v-btn>
          <v-btn
            icon
            color="red"
            small
            @click="reportes.evaluaciones = !reportes.evaluaciones"
          >
            <v-icon v-if="reportes.evaluaciones" title="Ocultar"
              >visibility_off</v-icon
            >
            <v-icon v-else title="Mostrar">visibility</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout row wrap v-if="reportes.evaluaciones">
          <v-flex>
            <e-chart
              :key="cont"
              :path-option="getOptionsEvaluaciones()"
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
            >Solicitud de Servicios
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
          <v-toolbar-title class="body-2">Servicios </v-toolbar-title>
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
    fecha:
      new Date().getFullYear() +
      '-' +
      (new Date().getMonth() + 1) +
      '-' +
      new Date().getDate(),
    lMedidas: [],
    lServicios: [],
    lForma_pagos: [],
    lRutas: [],
    reportes: {
      ruteos: true,
      servicios: true,
      solicitudes: true,
      materiales: true,
      evaluaciones: true
    },
    lReportes: {
      ruteos: {},
      servicios: [],
      solicitudes: [],
      materiales: [],
      evaluaciones: []
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
        'Dashboard',
        '',
        {
          reportes: reportes
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
    getOptionsRuteos() {
      let title = 'Situacion Actual Ruteos'
      let subtitle = 'a la Fecha: ' + formatDT(this.fecha, false)
      let data = this.lReportes.ruteos
      let seriesLabel = {
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
      }
      let datos = [
        {
          name: 'Rutas Disponibles: ' + data.dispon,
          type: 'bar',
          barGap: 10,
          label: seriesLabel,
          data: [data.dispon]
        },
        {
          name: 'Rutas Abiertas: ' + data.open,
          type: 'bar',
          barGap: 0,
          label: seriesLabel,
          data: [data.open]
        },
        {
          name: 'Rutas Retrasadas: ' + data.retrased,
          type: 'bar',
          barGap: 5,
          label: seriesLabel,
          data: [data.retrased]
        },
        {
          name: 'Abiertas Hoy: ' + data.openHoy,
          type: 'bar',
          barGap: 0,
          label: seriesLabel,
          data: [data.openHoy]
        },
        {
          name: 'Cerradas Hoy: ' + data.closed,
          type: 'bar',
          barGap: 0,
          label: seriesLabel,
          data: [data.closed]
        }
      ]
      // let xAxis = {
      //   type: 'category',
      //   splitLine: { show: false },
      //   data: [
      //     'Rutas Disponibles',
      //     'Rutas Abiertas',
      //     'Rutas Retrasadas',
      //     'Abiertas Hoy',
      //     'Cerradas Hoy'
      //   ]
      // }
      let r = [
        ['title', { text: title, subtext: subtitle, top: 10, left: 10 }],
        //['xAxis', [{ type: 'category', data: ['Ruteos'] }]],
        ['series', datos],
        ['toolbox', this.toolbox],
        [
          'color',
          [
            this.color.indigo.base,
            this.color.green.base,
            this.color.red.base,
            this.color.purple.base,
            this.color.grey.base,
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
        ['xAxis.show', false],
        ['yAxis.show', true]
      ]
      return r
    },
    getOptionsServicios() {
      let title = 'Servicios'
      let subtitle = 'a la Fecha: ' + formatDT(this.fecha, false)
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
      let title = 'Solicitud de Servicios'
      let subtitle = 'a la Fecha: ' + formatDT(this.fecha, false)

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
    getOptionsEvaluaciones() {
      let title = 'Evaluaciones'
      let subtitle = 'a la Fecha: ' + formatDT(this.fecha, false)

      let datos = []
      this.lReportes.evaluaciones.map((e, index) => {
        datos.push({
          name: (e.estado==2?'Completadas':'No Respondidas') + ': ' + e.cant,
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
        ['xAxis', [{ type: 'category', data: ['Evaluaciones'], show: false }]],
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
      let subtitle = 'a la Fecha: ' + formatDT(this.fecha, false)
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
      }
    ])
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