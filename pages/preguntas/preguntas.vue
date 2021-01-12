<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <mk-head :titulo="titModulo"></mk-head>
        <v-flex lg12>
          <mk-data-table
            v-bind="dataTable"
            :campos="campos"
            @openDialog="openDialog"
            @deleteItem="deleteItem"
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
        :accion="item.id"
        @closeDialog="closeDialog"
        @grabarItem="grabarItem"
      >
        <v-text-field
          label="Pregunta"
          v-model="item.pregunta"
          :rules="[rules.required]"
          validate-on-blur
          ref="focus"
        ></v-text-field>
        <v-text-field
          label="Orden"
          v-model="item.orden"
          :rules="[rules.required,rules.num]"
          validate-on-blur
        ></v-text-field>
        <v-select
          v-model="item.categ_id"
          :items="lCateg"
          :rules="[rules.required]"
          label="Categoria"
          item-text="name"
          item-value="id"
        ></v-select>
        <v-select
          v-model="item.tipo"
          :items="lTipos"
          :rules="[rules.required]"
          label="Tipo de Pregunta"
          item-text="name"
          item-value="id"
        >

        </v-select>
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'

export default {
  mixins: [MkModuloMix],
  name: 'Preguntas',
  components: {},
  data() {
    return {
      //urlModulo: '',
      //titModulo: '',
      lCateg:[],
      lTipos:[
        {
          name: 'si/no',
          id:'1'
        },
        {
          name: 'numerico',
          id:'2'
        }
      ],
      campos: [
        {
          text: 'Id',
          value: 'id',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'num',
          search: true
        },
        {
          text: 'Pregunta',
          value: 'pregunta',
          width: '250px',
          headers: true,
          type: 'text',
          search: true
        },
        {
          text: 'Orden',
          value: 'orden',
          align: 'left',
          headers: true,
          type: 'text',
        },
        {
          text: 'Categoria',
          value: 'categ_id',
          align: 'left',
          headers: true,
          type: 'num',
          search: true,
          lista: this.lCateg,
        },
        {
          text: 'Tipo',
          value: 'tipo',
          align: 'left',
          headers: true,
          type: 'num',
          search: true,
          lista: this.lTipos,
        }
      ],
      
    }
  },
  methods: {
    getNameEmpresa(item) {
      // return this.lEmpresas.find((e) => (e.id = item.empresas_id)).name
    },
    beforeOpen(accion, data = {}) {
      // const me = this
      // if (accion != 'add') {
      //   me.item.empresas_id = me.lSucursales.find(
      //     (e) => e.id == me.item.sucursales_id
      //   ).empresas_id
      // }
    }
  },
  
  async mounted() {
    let me = this
    me.lCateg  = await me.$store.dispatch('auth/loadData', {
      url: 'Categ',
      campos: 'id,name'
    })
     me.updateListCol('categ_id', me.lCateg)
     me.updateListCol('tipo', me.lTipos)
   }
}
</script>


