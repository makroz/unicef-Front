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
            <v-flex sm6>
              <v-text-field
                type="text"
                label="Fecha"
                :value="item.created_at || formatDT(new Date(), false)"
                disabled
                hideDetails
              >
              </v-text-field>
            </v-flex>
            <v-flex sm6>
              <v-text-field
                label="Ref"
                v-model="item.ref"
                validate-on-blur
                :readonly="accion == 'show'"
                hideDetails
              >
              </v-text-field>
            </v-flex>

            <v-flex sm6>
              <v-select
                :items="lTipos"
                item-text="name"
                item-value="id"
                label="Tipo Movimiento"
                v-model="item.tipo"
                :readonly="true"
                :hideDetails="accion == 'show'"
              >
              </v-select>
            </v-flex>
            <v-flex sm6>
              <v-select
                :items="lSub"
                item-text="name"
                item-value="id"
                label="Subtipo"
                v-model="item.subtipo_id"
                :rules="[rules.num,rules.required]"
                validate-on-blur
                :readonly="accion == 'show'"
                :hideDetails="accion == 'show'"
              >
              </v-select>
            </v-flex>

            <v-flex sm12>
              <v-text-field
                label="Observaciones"
                v-model="item.obs"
                :readonly="accion == 'show'"
                hideDetails
              >
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-card class="pa-2">
            <v-toolbar color="indigo" dark dense>
              <v-toolbar-title class="body-1"
                >Productos detallados</v-toolbar-title
              >
              <v-spacer></v-spacer>
              <v-btn  v-if="accion!='show'"
              icon color="green" @click="addProd()" small>
                <v-icon>add</v-icon>
              </v-btn>
            </v-toolbar>
            <v-layout
              row
              fill-height
              v-for="(prod, index) in item.productos"
              :key="index"
              style="border-bottom: 1px dotted gray"
            >
              <v-flex grow>
                <v-select
                  :items="lMateriales"
                  item-text="name"
                  item-value="id"
                  label="Producto"
                  v-model="prod.material_id"
                  :rules="[rules.num, rules.required]"
                  validate-on-blur
                  :readonly="accion == 'show'"
                  :hideDetails="accion == 'show'"
                >
                </v-select>
              </v-flex>
              <v-flex shrink>
                <v-text-field
                  style="width: 70px"
                  v-if="item.tipo != 2"
                  type="number"
                  label="Ingreso"
                  v-model="prod.ingreso"
                  :rules="
                    item.tipo == 1
                      ? [rules.num, rules.minVal(1), rules.required]
                      : item.tipo == 2
                      ? []
                      : [rules.num, rules.minVal(0)]
                  "
                  min="0"
                  validate-on-blur
                  :readonly="accion == 'show'"
                  :hideDetails="accion == 'show'"
                  :suffix="getSuffix(prod.material_id)"
                  placeholder=' '
                >
                </v-text-field>
              </v-flex>
              <v-flex shrink>
                <v-text-field
                  style="width: 70px"
                  v-if="item.tipo != 1"
                  type="number"
                  label="Egreso"
                  v-model="prod.egreso"
                  :rules="
                    item.tipo == 2
                      ? [rules.num, rules.minVal(1), rules.required]
                      : item.tipo == 1
                      ? []
                      : [rules.num, rules.minVal(0)]
                  "
                  min="0"
                  validate-on-blur
                  :readonly="accion == 'show'"
                  :hideDetails="accion == 'show'"
                  :suffix="getSuffix(prod.material_id)"
                  placeholder=' '
                >
                </v-text-field>
              </v-flex>

              <v-flex shrink v-if="accion!='show'">
                <v-btn icon color="red" @click="delProd(index)" small dark>
                  <v-icon>remove</v-icon>
                </v-btn>
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
  name: 'Movimientos',
  data() {
    return {
      //urlModulo: '',
      titModulo: 'Movimientos',
      campos: [
        {
          text: 'Id',
          value: 'id',
          align: 'right',
          width: '70px',
          headers: true,
          type: 'num',
          search: true,
        },
        {
          text: 'Tipo',
          value: 'tipo',
          align: 'left',
          width: '80px',
          headers: true,
          type: 'num',
          search: true,
          lista:'lTipos',
          lColor: 'lColor',
        },
        {
          text: 'Subtipo',
          value: 'subtipo_id',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'num',
          search: true,
          lista: this.lSubtipos,
          class:"small-text"
        },
        {
          text: 'Ref',
          value: 'ref',
          align: 'left',
          width: '100px',
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
        
      ],
      lSubtipos: [],
      lMateriales: [],
      lMedidas: [],
      lTipos: [
        { id: 1, name: 'Ingresos' },
        { id: 2, name: 'Egresos' },
        { id: 3, name: 'Ajustes' },
      ],
      lColor: ['grey--text', 'green--text', 'red--text', 'orange--text'],
      //grabarDebug: true,
    }
  },
  methods: {
    // lSub(tipo){
    //   console.log('lsub',this.lSubtipos,this.lSubtipos.filter(e => e.tipo == tipo));
    //   return this.lSubtipos.filter(e => e.tipo == tipo)
    // },
    ingresos() {
      this.item = {}
      this.item.tipo = 1
      this.item.productos = []
      this.tituloModal = 'Ingresos a Almacen'
      this.filtrar()
      this.openDialog('ingresos', this.item)
    },
    egresos() {
      this.item = {}
      this.item.tipo = 2
      this.item.productos = []
      this.tituloModal = 'Egresos de Almacen'
      this.filtrar()
      this.openDialog('egresos', this.item)
    },

    ajustes() {
      this.item = {}
      this.item.tipo = 3
      this.item.productos = []
      this.tituloModal = 'Ajustes del Almacen'
      this.filtrar()
      this.openDialog('ajustes', this.item)
    },

    delProd(index) {
      this.item.productos.splice(index, 1)
    },
    addProd() {
      this.item.productos.push({ id: null })
    },
    getSuffix(id) {
      return this.getDataLista(
        this.lMedidas,
        this.getDataLista(this.lMateriales, id, 'id', 'medida_id'),
        'id',
        'simbolo',
        ''
      )
    },
    beforeSave(me) {
      //console.log('id',me.item)
      if (me.item.productos.length==0){
        alert('No hay Productos')
        return false
      }
    },
    filtrar() {
      //let lista = []
      //this.lTipos.map((e, index) => lista.push({ id: index, name: e }))

      let busqueda = [
        {
          campo: 'tipo',
          cond: '20',
          criterio: this.item.tipo,
          type: 'num',
          union: 'and',
          lista: this.lTipos,
        },
      ]
      this.onBuscar(busqueda)
    },
  },
  computed: {
    lSub: function () {
      return this.lSubtipos.filter((e) => e.tipo == this.item.tipo)
    },
  },
  async mounted() {
    this.setOptionTable('del').visible = false
    this.setOptionTable('edit').visible = false
    this.setOptionTable('add').visible = false
    this.addOptionTable({
      id: 'ingresos',
      color: 'green',
      icon: 'add_circle_outline',
      text: 'Ingresos',
      visible: this.can('edit', 'almacen-ingresos'),
      action: 'ingresos',
      grupos: ['filtros'],
      orden: 4,
    })
    this.addOptionTable({
      id: 'egresos',
      color: 'red',
      icon: 'remove_circle_outline',
      text: 'Egresos',
      visible: this.can('edit', 'almacen-egresos'),
      action: 'egresos',
      grupos: ['filtros'],
      orden: 5,
    })
    this.addOptionTable({
      id: 'ajustes',
      color: 'orange',
      icon: 'compare_arrows',
      text: 'Ajustes',
      visible: this.can('edit', 'almacen-ajustes'),
      action: 'ajustes',
      grupos: ['filtros'],
      orden: 6,
    })

    let listas = await this.getDatasBackend(this.urlModulo, [
      {
        mod: 'Subtipos',
        campos: 'id,name,tipo',
        datos: { modulo: 'mkAlmacenes' },
        item: 'subtipo_id',
      },
      {
        mod: 'Materiales',
        campos: 'id,name,medida_id',
        datos: { modulo: 'mkServicios' },
      },
      {
        mod: 'Medidas',
        datos: { modulo: 'mkServicios' },
        campos: 'id,simbolo',
      },
    ])
  },
}
</script>

<style scope>
.small-text {
  font-size:9px !important;
}
</style>
