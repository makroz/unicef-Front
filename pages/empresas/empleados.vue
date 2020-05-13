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
          label="Nombre"
          v-model="item.name"
          :rules="[rules.required]"
          validate-on-blur
          ref="focus"
        ></v-text-field>
        <v-text-field
          label="Doc. de Identidad"
          v-model="item.ci"
          :rules="[rules.required,rules.num,rules.unique('ci')]"
          ref="ci"
          validate-on-blur
        ></v-text-field>
        <v-text-field
          label="eMail"
          v-model="item.email"
          :rules="[rules.required,rules.email,rules.unique('email')]"
          ref="email"
          validate-on-blur
        ></v-text-field>
        <v-text-field label="Direccion" v-model="item.dir" validate-on-blur></v-text-field>
        <v-text-field label="Telefonos" v-model="item.tel" validate-on-blur></v-text-field>
        <v-select
          v-model="item.empresas_id"
          :items="lEmpresas"
          :rules="[rules.required]"
          label="Empresa donde Trabaja"
          item-text="name"
          item-value="id"
        ></v-select>
        <v-select
          v-model="item.sucursales_id"
          :items="lSucursales.filter(e=>e.empresas_id==item.empresas_id)"
          :rules="[rules.required]"
          label="Sucursal donde Trabaja"
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
  name: 'Empleados',
  components: {},
  data() {
    return {
      //urlModulo: '',
      //titModulo: '',
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
          text: 'Nombre',
          value: 'name',
          width: '250px',
          headers: true,
          type: 'text',
          search: true
        },
        {
          text: 'Email',
          value: 'email',
          align: 'left',
          headers: true,
          type: 'text',
          search: true
        },
        {
          text: 'Empresa',
          value: 'empresas_id',
          align: 'left',
          headers: true,
          type: 'num',
          search: true,
          lista: this.lEmpresas,
          fromList: 'sucursales_id',
          listField: 'empresas_id'
        },
        {
          text: 'Sucursal',
          value: 'sucursales_id',
          align: 'left',
          headers: true,
          type: 'num',
          search: true,
          lista: this.lSucursales
        }
      ],
      lEmpresas: [],
      lSucursales: []
    }
  },
  methods: {
    getNameEmpresa(item) {
      return this.lEmpresas.find((e) => (e.id = item.empresas_id)).name
    },
    beforeOpen(accion, data = {}) {
      const me = this
      if (accion != 'add') {
        me.item.empresas_id = me.lSucursales.find(
          (e) => e.id == me.item.sucursales_id
        ).empresas_id
      }
    }
  },
  async mounted() {
    let me = this
    me.lEmpresas = await me.$store.dispatch('auth/loadData', {
      url: 'Empresas',
      campos: 'id,name'
    })
    me.lSucursales = await me.$store.dispatch('auth/loadData', {
      url: 'Sucursales',
      campos: 'id,name,empresas_id'
    })
    //me.lSucursales = me.setParentGroup(me.lSucursales,me.lEmpresas,'empresas_id')
    //    me.lSucursales = me.setParentinChildName(me.lSucursales,me.lEmpresas,'empresas_id')
    me.updateListCol('sucursales_id', me.lSucursales)
    me.updateListCol('empresas_id', me.lEmpresas)
  }
}
</script>


