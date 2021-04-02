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
        <v-text-field
          label="Nombre"
          v-model="item.name"
          :rules="[rules.required]"
          autofocus
          validate-on-blur
          ref="focus"
          :readonly="accion == 'show'"
        ></v-text-field>

        <v-text-field
          label="Descripcion"
          v-model="item.descrip"
          :readonly="accion == 'show'"
        ></v-text-field>
        <mk-permisos
          :permisos="permisos"
          :accion="accion"
        ></mk-permisos>
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
    MkPermisos,
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
          search: true,
        },
        {
          text: 'Grupo',
          value: 'name',
          width: '250px',
          headers: true,
          type: 'text',
          search: true,
        },
        {
          text: 'Descripcion',
          value: 'descrip',
          align: 'left',
          headers: true,
          type: 'num',
          search: true,
        },
      ],
      permisos: [],
    }
  },
  methods: {
    beforeSave(me) {
      if (me.dirty.permisos != JSON.stringify(me.permisos)) {
        let permiso = []
        for (const obj in me.permisos) {
          permiso[obj] = {
            id: me.permisos[obj].id,
            valor: me.permisos[obj].valor,
          }
        }
        me.paramsExtra.permisos = permiso
      } else {
        delete me.paramsExtra.permisos
      }
    },
    async beforeOpen(accion, data = {}) {
      let url = this.urlModulo + '/permisos/' + data.id
      this.permisos= await this.getDataBackend(url)
      this.dirty.permisos = JSON.stringify(this.permisos)
    },
  },
}
</script>
