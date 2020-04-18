<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex sm12>
          <h3>{{ titModulo }}</h3>
        </v-flex>
        <v-flex lg12>
          <v-card>
            <mk-table-head
              @openDialog="openDialog"
              @deleteItem="deleteItem"
              @busqueda:avanzada="onBuscar"
              :sel="lista.selected"
              :busquedas="busquedas"
              :campos="search_campos"
            ></mk-table-head>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
              <v-data-table
                :headers="headers"
                :items="lista.items"
                class="elevation-1"
                item-key="id"
                select-all
                v-model="lista.selected"
                :loading="loading"
                :server-items-length="paginator.total"
                @update:pagination="listar"
                hide-actions
                :pagination.sync="paginator.options"
              >
                <template slot="items" slot-scope="props">
                  <mk-table-row
                    :item="props.item"
                    :datos="props"
                    @openDialog="openDialog"
                    @deleteItem="deleteItem"
                    @onStatus="setStatus"
                  >
                    <td class="text-xs-left">{{ props.item.id }}</td>
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.descrip }}</td>
                  </mk-table-row>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <mk-paginator :paginator="paginator" @input="listar" @change="onPerPageChange"></mk-paginator>
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
          ref="focus"
          validate-on-blur
          autofocus
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

export default {
  middleware: ["authAccess"],

  mixins: [MkModuloMix],
  name: "Roles",
  data() {
    return {
      //urlModulo: '',
      //titModulo: '',
      campos: [
        {
          text: "Id",
          value: "id",
          align: "left",
          width: "100px",
          headers: true,
          type: "num",
          search: true
        },
        {
          text: "Nombre",
          value: "name",
          width: "150px",
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

<style lang="stylus"></style>
