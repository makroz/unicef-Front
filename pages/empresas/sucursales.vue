<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <mk-head :titulo="titModulo"></mk-head>
        <v-flex lg12>
          <mk-data-table
            :lista="lista"
            :busquedas="busquedas"
            :search_campos="search_campos"
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
          label="Empresa"
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
  name: 'Sucursales',
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
          value: "empresas_id",
          align: 'left',
          headers: true,
          type: 'text',
          search: true,
          lista:this.lEmpresas,
        }
                      ],
      lEmpresas:[]
    }
  },
  methods: {

  },
async mounted() {
  let me=this;
  me.lEmpresas = await me.$store.dispatch('auth/loadData',{url:'Empresas',campos:'id,name'})
  me.updateListCol('empresas_id', me.lEmpresas)
}
}
</script>


