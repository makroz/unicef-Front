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
          <v-text-field
            label='Ref'
            v-model='item.ref'
            :rules='[rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
      <v-checkbox
        v-model='item.foto'
        value='1'
        label='Foto'
        :readonly="accion == 'show'"
      >
      </v-checkbox>
        </v-flex>
        <v-flex>
          <v-text-field
            label='Observaciones'
            v-model='item.obs'
            :rules='[rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
      <v-checkbox
        v-model='item.estado'
        value='1'
        label='Estado'
        :readonly="accion == 'show'"
      >
      </v-checkbox>
        </v-flex>
        <v-flex>
          <v-select
            :items='lUsuarios'
            item-text='name'
            item-value='id'
            label='Recolector'
            v-model='item.recolector_id'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-select
            :items='lForma_pagos'
            item-text='name'
            item-value='id'
            label='Forma de pago'
            v-model='item.forma_pago_id'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-select
            :items='lBeneficiarios'
            item-text='name'
            item-value='id'
            label='Beneficiario'
            v-model='item.beneficiario_id'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
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
  name: "Orden_servicios",
  data() {
    return {
      //urlModulo: '',
      titModulo: "Ordenes de Servicios",
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
          text: 'Ref',
          value: 'ref',
          align: 'left',
          
          headers: true,
          type: 'text',
          search: true,
          
        },
        {
          text: 'Foto',
          value: 'foto',
          align: 'left',
          
          headers: true,
          type: 'text',
          search: true,
          
        },
        {
          text: 'Observaciones',
          value: 'obs',
          align: 'left',
          
          headers: true,
          type: 'text',
          search: true,
          
        },
        {
          text: 'Estado',
          value: 'estado',
          align: 'left',
          
          headers: true,
          type: 'text',
          search: true,
          
        },
        {
          text: 'Recolector',
          value: 'recolector_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lUsuarios,
        },
        {
          text: 'Forma de pago',
          value: 'forma_pago_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lForma_pagos,
        },
        {
          text: 'Beneficiario',
          value: 'beneficiario_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lBeneficiarios,
        },
      ],
      lUsuarios: [],

      lForma_pagos: [],

      lBeneficiarios: [],

    };
  },
  methods: {},
  async mounted() {
    this.lUsuarios = await this.getListaBackend('Usuarios', 'id,name', 'recolector_id')

    this.lForma_pagos = await this.getListaBackend('Forma_pagos', 'id,name', 'forma_pago_id')

    this.lBeneficiarios = await this.getListaBackend('Beneficiarios', 'id,name', 'beneficiario_id')

  },
};
</script>

<style lang="stylus"></style>
