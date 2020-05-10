<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <mk-head :titulo="titModulo"></mk-head>
        <v-flex lg12>
          <mk-data-table
            :lista="lista"
            :busquedas="busquedas"
            :headers="campos"
            :loading="loading"
            :paginator="paginator"
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
          v-model="item.sucursales_id"
          :items="lSucursales"
          :rules="[rules.required]"
          label="Sucursal donde Trabaja"
          item-text="name"
          item-value="id"
        ></v-select>
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
          text: 'Sucursal',
          value: 'sucursales_id',
          align: 'left',
          headers: true,
          type: 'text',
          search: true,
          lista: this.lSucursales
        }
      ],
      lEmpresas: [],
      lSucursales: []
    }
  },
  methods: {},
 async mounted() {
  let me=this;
  me.lEmpresas = await me.$store.dispatch('auth/loadData',{url:'Empresas',campos:'id,name'})
  me.lSucursales = await me.$store.dispatch('auth/loadData',{url:'Sucursales',campos:'id,name,empresas_id'})
  me.lSucursales =me.lSucursales.map((e)=>{
    e.name=(me.lEmpresas.filter(el =>el.id==e.empresas_id))[0].name+': '+e.name;
    return e});
  me.updateListCol('sucursales_id', me.lSucursales)
}
}
</script>


