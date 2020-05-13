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
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'
import MkPermisos from '@/components/mkComponentes/mkPermisos/MkPermisos'

export default {
  mixins: [MkModuloMix],
  components: {
    MkPermisos
  },
  name: 'Grupos',
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
          text: 'Grupo',
          value: 'name',
          width: '250px',
          headers: true,
          type: 'text',
          search: true
        },
        {
          text: 'Descripcion',
          value: 'descrip',
          align: 'left',
          headers: true,
          type: 'num',
          search: true
        }
      ],
      permisos: []
    }
  },
  methods: {
    onChangePermisos(newPermisos) {
      this.permisos = Object.assign([], newPermisos)
    },
    beforeSave(me) {
      let permiso = []
      for (const obj in me.permisos) {
        permiso[obj] = {
          id: me.permisos[obj].id,
          valor: me.permisos[obj].valor
        }
      }
      me.paramsExtra.permisos = permiso
    },
    beforeOpen(accion, data = {}) {
      let me = this
      let url = me.urlModulo + '/permisos/' + me.item.id
      me.loading = true
      me.$axios
        .post(url + this.getCt(url), [])
        .then(function(response) {
          me.permisos = me.getDataCache(response.data, url)
        })
        .catch(function(error) {
          console.log(error)
        })
        .finally(function() {
          me.loading = false
        })
    }
  }
}
</script>
