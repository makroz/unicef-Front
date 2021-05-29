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
        <v-container grid-list-md fluid pa-0>
          <v-layout row wrap>
            <v-flex sm9>
              <v-text-field
                label="Nombre"
                v-model="item.name"
                :rules="[rules.required]"
                validate-on-blur
                :readonly="accion == 'show'"
                :hideDetails="accion == 'show'"
              >
              </v-text-field>
            </v-flex>
            <v-flex sm3>
              <v-select
                :items="lMedidas"
                item-text="name"
                item-value="id"
                label="Medida"
                v-model="item.medida_id"
                :rules="[rules.num, rules.required]"
                validate-on-blur
                :readonly="accion == 'show'"
                :hideDetails="accion == 'show'"
              >
              </v-select>
            </v-flex>

            <v-flex sm6>
              <v-select
                :items="lMat_categ"
                item-text="name"
                item-value="id"
                label="Categoría"
                v-model="item.mat_categ_id"
                :rules="[rules.num]"
                validate-on-blur
                :readonly="accion == 'show'"
                :hideDetails="accion == 'show'"
              >
              </v-select>
            </v-flex>
            <v-flex sm6>
              <v-select
                :items="lUbicaciones"
                item-text="name"
                item-value="id"
                label="Ubicación en Almacén"
                v-model="item.ubicacion_id"
                :rules="[rules.num]"
                validate-on-blur
                :readonly="accion == 'show'"
                :hideDetails="accion == 'show'"
              >
              </v-select>
            </v-flex>
            <v-flex sm3>
              <v-text-field
                type="number"
                label="Stock"
                v-model="item.stock"
                readonly
                hideDetails
              >
              </v-text-field>
            </v-flex>
            <v-flex sm3>
              <v-text-field
                type="number"
                label="Stock Mínimo"
                v-model="item.min_stock"
                :rules="[rules.num]"
                validate-on-blur
                :hideDetails="accion == 'show'"
                min="0"
              >
              </v-text-field>
            </v-flex>
            <v-flex sm3>
              <v-text-field
                type="number"
                label="Costo"
                v-model="item.costo"
                :rules="[rules.num, rules.minVal(0)]"
                validate-on-blur
                :readonly="accion == 'show'"
                :hideDetails="accion == 'show'"
                min="0"
              >
              </v-text-field>
            </v-flex>
            <v-flex sm3>
              <v-text-field
                type="number"
                label="Precio"
                v-model="item.precio"
                :rules="[rules.num, rules.minVal(0)]"
                validate-on-blur
                :readonly="accion == 'show'"
                :hideDetails="accion == 'show'"
                min="0"
              >
              </v-text-field>
            </v-flex>

            <v-flex sm12>
              <v-checkbox
                v-model="item.lnota"
                value="1"
                label="Listado en Orden de Solicitud"
                :readonly="accion == 'show'"
                :hideDetails="accion == 'show'"
                class="mt-0"
              >
              </v-checkbox>
            </v-flex>
          </v-layout>
          <v-card class="pa-2" v-if="lMov_det.length > 0">
            <v-layout row fill-height pl-2 class="primary white--text">
              <v-flex sm3 > Fecha </v-flex>
              <v-flex sm2> Id Mov. </v-flex>
              <v-flex sm3> Tipo Mov </v-flex>
              <v-flex sm2> Ingreso </v-flex>
              <v-flex sm2> Egreso </v-flex>
              <v-flex sm2> Saldo </v-flex>
            </v-layout>

            <v-layout
              row
              fill-height
              v-for="(mov, index) in lMov_det"
              :key="index"
              style="border-bottom: 1px dotted gray"
              pl-2
            >
              <v-flex sm3>
                {{ formatDT(mov.created_at) }}
              </v-flex>
              <v-flex sm2>
                {{ mov.movimiento_id }}
              </v-flex>
              <v-flex :class="lColor[mov.tipo]" sm3>
                {{ getDataLista(lTipos, mov.tipo) }}
              </v-flex>
              <v-flex sm2>
                {{ mov.ingreso }}
              </v-flex>
              <v-flex sm2>
                {{ mov.egreso }}
              </v-flex>
               <v-flex sm2>
                {{ getSaldo(mov.ingreso,mov.egreso)}}
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
  name: 'Materiales',
  data() {
    return {
      //urlModulo: '',
      titModulo: 'Materiales',
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
          text: 'Nombre',
          value: 'name',
          align: 'left',

          headers: true,
          type: 'text',
          search: true,
        },
        {
          text: 'Medida',
          value: 'medida_id',
          align: 'left',
          width: '50px',
          headers: true,
          type: 'num',
          search: true,
          lista: this.lMedidas,
        },
        {
          text: 'Stock',
          value: 'stock',
          align: 'right',
          width: '100px',
          headers: true,
          type: 'num',
          search: true,
          class: this.colorStock,
        },
        {
          text: 'Stock Mín',
          value: 'min_stock',
          align: 'right',
          width: '100px',
          headers: true,
          type: 'num',
          search: true,
        },
        {
          text: 'Listar',
          value: 'lnota',
          align: 'left',
          width: '50px',
          headers: true,
          type: 'check',
          search: true,
          options: [1, 'Si', 'No'],
        },
        {
          text: 'Categoría',
          value: 'mat_categ_id',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'num',
          search: true,
          lista: this.lMat_categ,
        },
        {
          text: 'Ubicación',
          value: 'ubicacion_id',
          align: 'left',
          width: '150px',
          headers: true,
          type: 'num',
          search: true,
          lista: this.lUbicaciones,
        },
      ],
      lMedidas: [],
      lMat_categ: [],
      lUbicaciones: [],
      lMov_det: [],
      lTipos: [
        { id: 1, name: 'Ingresos' },
        { id: 2, name: 'Egresos' },
        { id: 3, name: 'Ajustes' },
      ],
      lColor: ['grey--text', 'green--text', 'red--text', 'orange--text'],
      lSiNo: [
        { id: '0', value: 'No' },
        { id: '1', value: 'Si' },
      ],
    }
  },
  methods: {
    beforeOpen(accion, data) {
      this.lMov_det = []

      if (accion == 'show') {
        data.saldo=0
        this.getHistorico(data.id)
      }
    },
    colorStock(item, e) {
      console.log('clorstock', item, e)
      return e.stock <= e.min_stock ? 'red--text text--darken-4' : ''
    },
    getSaldo(i,e){
      let r=this.item.saldo
      this.item.saldo=this.item.saldo+(e-i)
      return r
    },
    async getHistorico(id) {
      let listas = await this.getDatasBackend(this.urlModulo, [
        {
          mod: 'Mov_det',
          campos: '*',
          datos: { modulo: 'mkAlmacenes', filtros: [['material_id', '=', id]] },
          sortAsc:'movimiento_id',
        },
      ])
    },
  },
  async mounted() {
    this.setOptionTable('class').setClass = function (e) {
      return e.stock <= e.min_stock ? 'red lighten-5' : ''
    }
    let listas = await this.getDatasBackend(this.urlModulo, [
      {
        mod: 'Medidas',
        campos: 'id,name',
        datos: { modulo: 'mkServicios' },
        item: 'medida_id',
      },
      {
        mod: 'Mat_categ',
        campos: 'id,name',
        datos: { modulo: 'mkAlmacenes' },
        item: 'mat_categ_id',
      },
      {
        mod: 'Ubicaciones',
        campos: 'id,name',
        datos: { modulo: 'mkAlmacenes' },
        item: 'ubicacion_id',
      },
    ])
  },
}
</script>

<style lang="stylus"></style>
