<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex sm12>
          <h3>tit: {{ titModulo }}</h3>
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
          autofocus
          validate-on-blur
          ref="focus"
        ></v-text-field>

        <v-text-field label="Descripcion" v-model="item.descrip"></v-text-field>
        <mk-permisos :permisos="permisos" @onChangePermisos="onChangePermisos"></mk-permisos>
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from "@/components/mkComponentes/mixins/MkModuloMix";
import MkPermisos from "@/components/mkComponentes/mkPermisos/MkPermisos";

export default {
  mixins: [MkModuloMix],
  components: {
    MkPermisos
  },
  name: "Grupos",
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
          text: "Grupo",
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
          type: "num",
          search: true
        }
      ],
      permisos: []
    };
  },
  methods: {
    onChangePermisos(newPermisos) {
      this.permisos = Object.assign([], newPermisos);
    },
    beforeSave(me) {
      let permiso = [];
      for (const obj in me.permisos) {
        permiso[obj] = {
          id: me.permisos[obj].id,
          valor: me.permisos[obj].valor
        };
      }
      me.paramsExtra.permisos = permiso;
    },
    beforeOpen(accion, data = {}) {
      let me = this;
      me.$axios
        .post(me.urlModulo + "/permisos/" + me.item.id, [])
        .then(function(response) {
          me.permisos = response.data.data;
        })
        .catch(function(error) {
          console.log(error);
        })
        .finally(function() {
          me.loading = false;
        });
    }
  }
};
</script>
