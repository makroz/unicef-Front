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
        <v-tabs grow v-model="tabs" color="primary" dark slider-color="yellow">
          <v-tab>Datos Personales</v-tab>
          <v-tab>Permisos</v-tab>
        </v-tabs>

        <v-tabs-items grow v-model="tabs">
          <v-tab-item>
            <v-text-field
              label="Nombre"
              name="name"
              id="name"
              v-model="item.name"
              :rules="[rules.required]"
              validate-on-blur
              ref="focus"
              :readonly="accion == 'show'"
            ></v-text-field>

            <v-text-field
              label="eMail"
              v-model="item.email"
              :rules="[rules.required, rules.email, rules.unique('email')]"
              ref="email"
              validate-on-blur
              :readonly="accion == 'show'"
            ></v-text-field>
            <v-layout row>
              <v-flex shrink pa-1>
                <mk-img v-model="mkImgData" :w="100" :h="100"></mk-img>
              </v-flex>
              <v-flex grow pa-1>
                <v-text-field
                  v-if="!item.id > 0"
                  :append-icon="showPass ? 'visibility' : 'visibility_off'"
                  :rules="[rules.required, rules.min(8)]"
                  :type="showPass ? 'text' : 'password'"
                  v-model="item.pass"
                  label="Password"
                  validate-on-blur
                  @click:append="showPass = !showPass"
                  :readonly="accion == 'show'"
                ></v-text-field>
                <v-select
                  v-model="item.roles_id"
                  :items="lRoles"
                  :rules="[rules.required]"
                  item-text="name"
                  item-value="id"
                  label="Rol"
                  :readonly="accion == 'show'"
                ></v-select>
              </v-flex>
            </v-layout>
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
              :readonly="accion == 'show'"
            ></v-select>

            <mk-permisos
              style="max-height: 170px; overflow-y: scroll"
              :permisos="permisos"
              :permisoGrupos="permisoGrupos"
              @onChangePermisos="onChangePermisos"
              :accion="accion"
            ></mk-permisos>
          </v-tab-item>
        </v-tabs-items>
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkImgMix from '@/components/mkComponentes/mixins/MkImgMix'
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'
import MkPermisos from '@/components/mkComponentes/mkPermisos/MkPermisos'

export default {
  //middleware: ['authAccess'],
  mixins: [MkImgMix, MkModuloMix],
  components: {
    MkPermisos,
  },
  name: 'Usuarios',
  data() {
    return {
      //urlModulo: '',
      //titModulo: '',
      tabs: 0,
      campos: [
        {
          text: 'Id',
          value: 'id',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'num',
          search: true,
        },
        {
          text: 'Nombre',
          value: 'name',
          width: '250px',
          headers: true,
          type: 'text',
          search: true,
        },
        {
          text: 'Rol',
          value: 'roles_id',
          align: 'left',
          headers: true,
          type: 'num',
          search: true,
          lista: this.lRoles,
        },
        {
          text: 'Email',
          value: 'email',
          align: 'left',
          headers: true,
          type: 'text',
          search: true,
        },
      ],

      showPass: false,
      lGrupos: [],
      lRoles: [],
      permisos: [],
      permisoGrupos: null,
    }
  },
  methods: {
    async onChange(v) {
      let url = this.urlModulo + '/permisosGrupos/0,' + v
      this.permisoGrupos= await this.getDataBackend(url,'',{ grupos: v })
    },

    onChangePermisos(newPermisos) {
      this.permisos = Object.assign({}, newPermisos)
    },
    beforeSave(me) {
      delete me.item.grupos
      if (me.item.id > 0) {
        delete me.item.pass
      }

      if (JSON.stringify(me.dirty.permisos) != JSON.stringify(me.permisos)) {
        let permiso = []
        for (const obj in me.permisos) {
          if (me.permisos[obj].valor > 0) {
            permiso.push({
              id: me.permisos[obj].id,
              valor: me.permisos[obj].valor,
            })
          }
        }
        me.paramsExtra.permisos = permiso
      } else {
        delete me.paramsExtra.permisos
      }

      if (
        JSON.stringify(me.dirty.grupos) == JSON.stringify(me.paramsExtra.grupos)
      ) {
        delete me.paramsExtra.grupos
      }
    },
    async beforeOpen(accion, data = {}) {
      let me = this
      me.tabs = 0

      me.item.pass = ''
      me.rulesUnico.old = data.email
      me.paramsExtra.grupos = []
      if (data.grupos) {
        me.paramsExtra.grupos = data.grupos
        me.dirty.grupos = me.paramsExtra.grupos
      }

      let url = me.urlModulo + '/permisos/' + data.id
      let url2 = url + JSON.stringify(me.paramsExtra)
      let response = await me.$axios.post(
        url + me.getCt(url2, false, 2),
        me.paramsExtra
      )
      me.permisos = me.getDataCache(response.data, url2, false)
      me.permisoGrupos = me.getDataCache(response.data.msg, url2, false, 2)
      me.dirty.permisos = Object.assign(me.permisos)
    },
  },

  // async asyncData({ store }) {
  //   let lGrupos = await store.dispatch('auth/loadData', {
  //     url: 'Grupos',
  //     campos: 'id,name'
  //   })
  //   let lRoles = await store.dispatch('auth/loadData', {
  //     url: 'Roles',
  //     campos: 'id,name'
  //   })
  //   return {
  //     lRoles: lRoles,
  //     lGrupos: lGrupos
  //   }
  // },
  async mounted() {
    this.lGrupos = await this.getListaBackend('Grupos', '', 'grupos_id')
    if (this.lGrupos===false){
      this.lGrupos=[]
    }
    this.lRoles = await this.getListaBackend('Roles', '', 'roles_id')
  },
}
</script>
<style lang="css">
.tab-items-row >>> .v-window__container,
.tab-items-row >>> .v-window-item {
  height: 100%;
}
</style>
