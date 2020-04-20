<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <mk-head :titulo="titModulo" ></mk-head>
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
                    :datos="props"
                    @openDialog="openDialog"
                    @deleteItem="deleteItem"
                    @onStatus="setStatus"
                  >
                    <td class="text-xs-left">{{ props.item.id }}</td>
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.email }}</td>
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
        <v-tabs grow v-model="tabs" color="primary" dark slider-color="yellow">
          <v-tab>Datos Personales</v-tab>
          <v-tab>Permisos</v-tab>
        </v-tabs>

        <v-tabs-items grow v-model="tabs">
          <v-tab-item>
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
              ref='email'
              validate-on-blur
            ></v-text-field>
            <v-text-field
              v-if="!item.id>0"
              :append-icon="showPass ? 'visibility' : 'visibility_off'"
              :rules="[rules.required, rules.min(8)]"
              :type="showPass ? 'text' : 'password'"
              v-model="item.pass"
              label="Password"
              validate-on-blur
              @click:append="showPass = !showPass"
            ></v-text-field>
            <v-select
              v-model="item.roles_id"
              :items="lRoles"
              :rules="[rules.required]"
              item-text="name"
              item-value="id"
              label="Rol"
            ></v-select>
          </v-tab-item>
          <v-tab-item>
            <v-select
              v-model="paramsExtra.grupos"
              :items="lGrupos"
              item-text="name"
              item-value="id"
              box
              chips
              label="Grupos de Permisos"
              multiple
              @change="onChange"
            ></v-select>

            <mk-permisos
              style="max-height:170px; overflow-y:auto"
              :permisos="permisos"
              :permisoGrupos="permisoGrupos"
              @onChangePermisos="onChangePermisos"
            ></mk-permisos>
          </v-tab-item>
        </v-tabs-items>

      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from "@/components/mkComponentes/mixins/MkModuloMix";
import MkPermisos from "@/components/mkComponentes/mkPermisos/MkPermisos";

export default {
  middleware: ["authAccess"],
  mixins: [MkModuloMix],
  components: {
    MkPermisos
  },
  name: "Usuarios",
  data() {
    return {
      //urlModulo: '',
      //titModulo: '',
      tabs: 0,
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
          width: "250px",
          headers: true,
          type: "text",
          search: true
        },
        {
          text: "Email",
          value: "email",
          align: "left",
          headers: true,
          type: "text",
          search: true
        }
      ],

      showPass: false,
      permisos: [],
      permisoGrupos: null,
      lGrupos: [],
      lRoles: []
    };
  },
  methods: {
    onChange(v) {
      let me = this;
      me.$axios
        .post(me.urlModulo + "/permisosGrupos/0", { grupos: v })
        .then(function(response) {
          me.permisoGrupos = response.data.data;
        })
        .catch(function(error) {
          console.log(error);
        })
        .finally(function() {
          me.loading = false;
        });
    },

    onChangePermisos(newPermisos) {
      this.permisos = Object.assign({}, newPermisos);
    },
    beforeSave(me) {
      delete me.item.grupos;
      if (me.item.id > 0) {
        delete me.item.pass;
      }
      let permiso = [];
      for (const obj in me.permisos) {
        if (me.permisos[obj].valor>0){
          permiso.push({
          id: me.permisos[obj].id,
          valor: me.permisos[obj].valor
        });
        }
      }

      me.paramsExtra.permisos = permiso;
    },
    beforeOpen(accion, data = {}) {
      let me = this;
      me.tabs = 0;

      me.item.pass = "";
      me.paramsExtra.grupos = [];
      if (me.item.grupos) {
        me.paramsExtra.grupos = me.item.grupos;
      }
      me.$axios
        .post(me.urlModulo + "/permisos/" + me.item.id, me.paramsExtra)
        .then(function(response) {
          me.permisos = response.data.data;
          me.permisoGrupos = response.data.msg.data;
        })
        .catch(function(error) {
          console.log(error);
        })
        .finally(function() {
          me.loading = false;
        });
    }
  },
  computed: {},
  mounted() {
    let me = this;
    let url = "Grupos?page=1&per_page=-1&cols=id,name&disabled=1";

    me.$axios
      .get(url)
      .then(function(response) {
        me.lGrupos = response.data.data;
      })
      .catch(function(error) {
        console.log(error);
      })
      .finally(function() {
        me.loading = false;
      });

    url = "Roles?page=1&per_page=-1&cols=id,name&disabled=1";
    me.$axios
      .get(url)
      .then(function(response) {
        me.lRoles = response.data.data;
      })
      .catch(function(error) {
        console.log(error);
      })
      .finally(function() {
        me.loading = false;
      });
  }
};
</script>
<style lang="css">
.tab-items-row >>> .v-window__container,
.tab-items-row >>> .v-window-item {
  height: 100%;
}
</style>
