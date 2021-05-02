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
            label='Nombre'
            v-model='item.name'
            :rules='[rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            type='number'
            label='Edad'
            v-model='item.edad'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
      <v-checkbox
        v-model='item.genero'
        value='1'
        label='Genero'
        :readonly="accion == 'show'"
      >
      </v-checkbox>
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
        <v-flex>
          <v-select
            :items='lParentescos'
            item-text='name'
            item-value='id'
            label='Parentesco'
            v-model='item.parentesco_id'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-select
            :items='lEst_civiles'
            item-text='name'
            item-value='id'
            label='Est_civil'
            v-model='item.est_civil_id'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-select
            :items='lNiv_educativos'
            item-text='name'
            item-value='id'
            label='Niv_educativo'
            v-model='item.niv_educativo_id'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-select
            :items='lOcupaciones'
            item-text='name'
            item-value='id'
            label='Ocupacion'
            v-model='item.ocupacion_id'
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
  name: "Familiares",
  data() {
    return {
      //urlModulo: '',
      titModulo: "Familiares",
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
          text: 'Nombre',
          value: 'name',
          align: 'left',
          
          headers: true,
          type: 'text',
          search: true,
          
        },
        {
          text: 'Edad',
          value: 'edad',
          align: 'right',
          
          headers: true,
          type: 'num',
          search: true,
          
        },
        {
          text: 'Genero',
          value: 'genero',
          align: 'left',
          
          headers: true,
          type: 'check',
          search: true,
          
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
        {
          text: 'Parentesco',
          value: 'parentesco_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lParentescos,
        },
        {
          text: 'Est_civil',
          value: 'est_civil_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lEst_civiles,
        },
        {
          text: 'Niv_educativo',
          value: 'niv_educativo_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lNiv_educativos,
        },
        {
          text: 'Ocupacion',
          value: 'ocupacion_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lOcupaciones,
        },
      ],
      lBeneficiarios: [],

      lParentescos: [],

      lEst_civiles: [],

      lNiv_educativos: [],

      lOcupaciones: [],

    };
  },
  methods: {},
  async mounted() {
    this.lBeneficiarios = await this.getListaBackend('Beneficiarios', 'id,name', 'beneficiario_id')

    this.lParentescos = await this.getListaBackend('Parentescos', 'id,name', 'parentesco_id')

    this.lEst_civiles = await this.getListaBackend('Est_civiles', 'id,name', 'est_civil_id')

    this.lNiv_educativos = await this.getListaBackend('Niv_educativos', 'id,name', 'niv_educativo_id')

    this.lOcupaciones = await this.getListaBackend('Ocupaciones', 'id,name', 'ocupacion_id')

  },
};
</script>

<style lang="stylus"></style>
