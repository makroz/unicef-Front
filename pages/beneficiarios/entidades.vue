<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
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
          ref="focus"
          validate-on-blur
          autofocus
          counter
          maxlength="20"
        :readonly="accion=='show'" ></v-text-field>

        <!-- <v-text-field label="Descripcion" v-model="item.descrip":readonly="accion=='show'" ></v-text-field> -->
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'

export default {
  //middleware: ['authAccess'],

  mixins: [MkModuloMix],
  name: 'Entidades',
  data() {
    return {
      //urlModulo: '',
      titModulo: 'Entidades',
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
          headers: true,
          type: 'text',
          search: true
        },
        // {
        //   text: 'Descripcion',
        //   value: 'descrip',
        //   align: 'left',
        //   headers: true,
        //   type: 'text',
        //   search: true
        // }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="stylus"></style>
