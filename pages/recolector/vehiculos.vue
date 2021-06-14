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
        <v-layout row wrap>
          <v-flex sm6>
            <v-text-field
              label="Placa"
              v-model="item.placa"
              :rules="[rules.required]"
              validate-on-blur
              :readonly="accion == 'show'"
            >
            </v-text-field>
          </v-flex>
          <v-flex sm6>
            <v-text-field
              label="Serie"
              v-model="item.serie"
              validate-on-blur
              :readonly="accion == 'show'"
            >
            </v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex sm4>
            <v-select
              :items="lVehiculos_marcas"
              item-text="name"
              item-value="id"
              label="Marca"
              v-model="item.marca_id"
              :rules="[rules.num, rules.required]"
              validate-on-blur
              :readonly="accion == 'show'"
            >
            </v-select>
          </v-flex>
          <v-flex sm4>
            <v-text-field
              label="Modelo"
              v-model="item.modelo"
              :readonly="accion == 'show'"
            >
            </v-text-field>
          </v-flex>
          <v-flex sm4>
            <v-text-field
              type="number"
              label="Año"
              v-model="item.anio"
              :readonly="accion == 'show'"
              max="3000"
              min="1500"
            >
            </v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex sm4>
            <v-text-field
              label="Color"
              v-model="item.color"
              :readonly="accion == 'show'"
            >
            </v-text-field>
          </v-flex>
          <v-flex sm4>
            <v-text-field
              label="Capacidad"
              v-model="item.capacidad"
              :readonly="accion == 'show'"
            >
            </v-text-field>
          </v-flex>
          <v-flex sm4>
            <v-text-field
              label="Cilindradas"
              v-model="item.cilindradas"
              :readonly="accion == 'show'"
              max="8000"
              min="500"
            >
            </v-text-field>
          </v-flex>
        </v-layout>
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'

export default {
  middleware: ['authAccess'],
  mixins: [MkModuloMix],
  name: 'Vehiculos',
  data() {
    return {
      //urlModulo: '',
      titModulo: 'Vehiculos',
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
          text: 'Placa',
          value: 'placa',
          align: 'left',

          headers: true,
          type: 'text',
          search: true
        },
        {
          text: 'Serie',
          value: 'serie',
          align: 'left',

          headers: true,
          type: 'text',
          search: true
        },
        {
          text: 'Modelo',
          value: 'modelo',
          align: 'left',

          headers: true,
          type: 'text',
          search: true
        },
        {
          text: 'Color',
          value: 'color',
          align: 'left',

          headers: true,
          type: 'text',
          search: true
        },
        {
          text: 'Capacidad',
          value: 'capacidad',
          align: 'left',

          headers: true,
          type: 'text',
          search: true
        },
        {
          text: 'Cilindradas',
          value: 'cilindradas',
          align: 'left',

          headers: true,
          type: 'text',
          search: true
        },
        {
          text: 'Año',
          value: 'anio',
          align: 'left',

          headers: true,
          type: 'num',
          search: true
        },
        {
          text: 'Marca',
          value: 'marca_id',
          align: 'left',

          headers: true,
          type: 'num',
          search: true,

          lista: 'lVehiculos_marcas'
        }
      ],
      lVehiculos_marcas: []
    }
  },
  methods: {},
  async mounted() {
    let listas = await this.getDatasBackend(this.urlModulo, [
      {
        mod: 'Vehiculos_marcas',
        campos: 'id,name',
        datos: { modulo: 'mkRecolector' },
        item: 'marca_id'
      }
    ])
  }
}
</script>

<style lang="stylus"></style>
