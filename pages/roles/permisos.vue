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
            :headers="headers"
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
          autofocus
          validate-on-blur
          ref="focus"
        ></v-text-field>
        <v-text-field
          label="Slug"
          v-model="item.slug"
          :rules="[rules.required, rules.noSpaces,rules.unique('slug')]"
          validate-on-blur
          ref='slug'
          counter
          maxlength="20"
        ></v-text-field>
        <v-text-field label="Descripcion" v-model="item.descrip"></v-text-field>
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from "@/components/mkComponentes/mixins/MkModuloMix";
import MkDataTable from '@/components/mkComponentes/MkDataTable'

export default {
  mixins: [MkModuloMix],
  name: "Permisos",
  components: {
    MkDataTable,
  },
  data() {
    return {
      //urlModulo: '',
      //titModulo: '',
      campos: [
        {
          text: "Id",
          value: "id",
          align: "left",
          width: "50px",
          headers: true,
          type: "num",
          search: true
        },
        {
          text: "Slug",
          value: "slug",
          width: "150px",
          headers: true,
          type: "text",
          search: true
        },
        {
          text: "Permiso",
          value: "name",
          width: "250px",
          headers: true,
          type: "text",
          search: true
        },
        {
          text: "Descripcion",
          value: "descrip",
          align: "left",
          headers: true,
          type: "text",
          search: true
        }
      ]
    };
  },
  methods: {}
};
</script>


