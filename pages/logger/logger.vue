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
        <v-flex>
        <v-select
          :items='lType'
          item-text='name'
          item-value='id'
          label='Tipo'
          v-model='item.type'
          :rules='[rules.num,rules.required]'
          validate-on-blur
          :readonly="accion == 'show'"
        >
        </v-select>
        </v-flex>
        <v-flex>
      <v-textarea
        label='Message'
        v-model='item.message'
        :rules='[rules.required]'
        validate-on-blur
        rows='2'
        :readonly="accion == 'show'"
      >
      </v-textarea>
        </v-flex>
        <v-flex>
          <v-select
            :items='lUsuarios'
            item-text='name'
            item-value='id'
            label='Usuario'
            v-model='item.usuario_id'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-text-field
            label='Ip'
            v-model='item.ip'
            :rules='[rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            label='Token'
            v-model='item.token'
            :rules='[rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            label='Atributo'
            v-model='item.attrib'
            
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
        <v-select
          :items='lAction'
          item-text='name'
          item-value='id'
          label='Accion'
          v-model='item.action'
          :rules='[rules.required]'
          validate-on-blur
          :readonly="accion == 'show'"
        >
        </v-select>
        </v-flex>
        <v-flex>
        <v-select
          :items='lApp_id'
          item-text='name'
          item-value='id'
          label='App'
          v-model='item.app_id'
          :rules='[rules.required]'
          validate-on-blur
          :readonly="accion == 'show'"
        >
        </v-select>
        </v-flex>
        <v-flex>
      <v-checkbox
        v-model='item.deletable'
        value='1'
        label='Borrable'
        :readonly="accion == 'show'"
      >
      </v-checkbox>
        </v-flex>
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from "@/components/mkComponentes/mixins/MkModuloMix";

export default {
  middleware: ["authAccess"],
  mixins: [MkModuloMix],
  name: "Logger",
  data() {
    return {
      //urlModulo: '',
      titModulo: "Logger",
      campos: [
        {
          text: 'Id',
          value: 'id',
          align: 'right',
          width: '100px',
          headers: true,
          type: 'num',
          search: true,
          
          
        },
         {
          text: 'Fecha',
          value: 'created_at',
          align: 'left',
          
          headers: true,
          type: 'datetime',
          search: true,
          
          
        },
        {
          text: 'Tipo',
          value: 'type',
          align: 'right',
          
          headers: true,
          type: 'num',
          search: true,
          
          lista: 'lType',
        },
        {
          text: 'Message',
          value: 'message',
          align: 'left',
          
          headers: true,
          type: 'textarea',
          search: true,
          
          
        },
        {
          text: 'Usuario',
          value: 'usuario_id',
          align: 'right',
          
          headers: true,
          type: 'num',
          search: true,
          
          lista: 'lUsuarios',
        },
        {
          text: 'Ip',
          value: 'ip',
          align: 'left',
          
          headers: true,
          type: 'text',
          search: true,
          
          
        },
        {
          text: 'Accion',
          value: 'action',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          
          lista: 'lAction',
        },
        {
          text: 'App',
          value: 'app_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          
          lista: 'lApp_id',
        },
        {
          text: 'Borrable',
          value: 'deletable',
          align: 'left',
          
          headers: true,
          type: 'check',
          search: true,
          options: [1, 'Si', 'No'],
          
        },
        {
          text: 'Token',
          value: 'token',
          align: 'left',
          
          headers: true,
          type: 'text',
          search: true,
          
          
        },
        {
          text: 'Atributo',
          value: 'attrib',
          align: 'left',
          
          headers: true,
          type: 'text',
          search: true,
          
          
        },
       
      ],
        lType: [
          { id: '0', name: 'Log' },
          { id: '1', name: 'BD' },
          { id: '2', name: 'Error' },
        ],
      lUsuarios: [],
        lAction: [
          { id: '1', name: 'Insert' },
          { id: '2', name: 'Update' },
          { id: '3', name: 'Delete' },
          { id: '0', name: 'Console' },
          { id: '4', name: 'Error' },
        ],
        lApp_id: [
          { id: '0', name: 'Backend' },
          { id: '1', name: 'Sistema' },
          { id: '2', name: 'Monitor' },
          { id: '3', name: 'Sistema Test' },
          { id: '4', name: 'Monitor Test' },
        ],
    };
  },
  methods: {},
  async mounted() {
          let listas = await this.getDatasBackend(this.urlModulo, [
                {mod: 'Usuarios',campos: 'id,name',datos: { modulo: 'mkUsuarios' },item: 'usuario_id'},
          ])
  },
};
</script>

<style lang="stylus"></style>
