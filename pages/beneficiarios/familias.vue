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
            label='Epsa'
            v-model='item.epsa'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
      <v-checkbox
        v-model='item.autoriza'
        value='1'
        label='Autoriza'
        :readonly="accion == 'show'"
      >
      </v-checkbox>
        </v-flex>
        <v-flex>
      <v-checkbox
        v-model='item.protec'
        value='1'
        label='Protec'
        :readonly="accion == 'show'"
      >
      </v-checkbox>
        </v-flex>
        <v-flex>
          <v-text-field
            label='Dir'
            v-model='item.dir'
            
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
      <v-checkbox
        v-model='item.nivel'
        value='1'
        label='Nivel'
        :readonly="accion == 'show'"
      >
      </v-checkbox>
        </v-flex>
        <v-flex>
          <v-select
            :items='lDistritos'
            item-text='name'
            item-value='id'
            label='Distritos'
            v-model='item.distritos_id'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-select
            :items='lEntidades'
            item-text='name'
            item-value='id'
            label='Entidades'
            v-model='item.entidades_id'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-select
            :items='lRutas'
            item-text='name'
            item-value='id'
            label='Rutas'
            v-model='item.rutas_id'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-text-field
            label='Manzano'
            v-model='item.manzano'
            
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            label='Lote'
            v-model='item.lote'
            
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            label='Safsi'
            v-model='item.safsi'
            
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            type='number'
            label='Nfamilias'
            v-model='item.nfamilias'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            type='number'
            label='Npersonas'
            v-model='item.npersonas'
            :rules='[rules.num,rules.required]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            type='number'
            label='C_gob_municipal'
            v-model='item.c_gob_municipal'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            type='number'
            label='C_gob_municipal_p'
            v-model='item.c_gob_municipal_p'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            type='number'
            label='C_ong'
            v-model='item.c_ong'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            type='number'
            label='C_ong_p'
            v-model='item.c_ong_p'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            type='number'
            label='C_familias'
            v-model='item.c_familias'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            type='number'
            label='C_familias_p'
            v-model='item.c_familias_p'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            type='number'
            label='C_otra'
            v-model='item.c_otra'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            type='number'
            label='C_otra_p'
            v-model='item.c_otra_p'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-select
            :items='lDptos'
            item-text='name'
            item-value='id'
            label='Dpto'
            v-model='item.dpto_id'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-select
            :items='lMunicipios'
            item-text='name'
            item-value='id'
            label='Municipio'
            v-model='item.municipio_id'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-select
            :items='lZonas'
            item-text='name'
            item-value='id'
            label='Zona'
            v-model='item.zona_id'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-select
            :items='lDescoms'
            item-text='name'
            item-value='id'
            label='Descom'
            v-model='item.descom_id'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-select
            :items='lEpsas'
            item-text='name'
            item-value='id'
            label='Epsa'
            v-model='item.epsa_id'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-select
            :items='lTipo_banos'
            item-text='name'
            item-value='id'
            label='Tipo_bano'
            v-model='item.tipo_bano_id'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-select
            :items='lDoc_firmados'
            item-text='name'
            item-value='id'
            label='Doc_firmado'
            v-model='item.doc_firmado_id'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-select
            :items='lInfo_metodos'
            item-text='name'
            item-value='id'
            label='Info_metodo'
            v-model='item.info_metodo_id'
            :rules='[rules.num]'
            validate-on-blur
            :readonly="accion == 'show'"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-select
            :items='lProb_sol_existentes'
            item-text='name'
            item-value='id'
            label='Prob_sol_existente'
            v-model='item.prob_sol_existente_id'
            :rules='[rules.num]'
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
  name: "Familias",
  data() {
    return {
      //urlModulo: '',
      titModulo: "Familias",
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
          text: 'Epsa',
          value: 'epsa',
          align: 'right',
          
          headers: true,
          type: 'num',
          search: true,
          
        },
        {
          text: 'Autoriza',
          value: 'autoriza',
          align: 'left',
          
          headers: true,
          type: 'check',
          search: true,
          
        },
        {
          text: 'Protec',
          value: 'protec',
          align: 'left',
          
          headers: true,
          type: 'check',
          search: true,
          
        },
        {
          text: 'Dir',
          value: 'dir',
          align: 'left',
          
          headers: true,
          type: 'text',
          search: true,
          
        },
        {
          text: 'Nivel',
          value: 'nivel',
          align: 'left',
          
          headers: true,
          type: 'check',
          search: true,
          
        },
        {
          text: 'Distritos',
          value: 'distritos_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lDistritos,
        },
        {
          text: 'Entidades',
          value: 'entidades_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lEntidades,
        },
        {
          text: 'Rutas',
          value: 'rutas_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lRutas,
        },
        {
          text: 'Manzano',
          value: 'manzano',
          align: 'left',
          
          headers: true,
          type: 'text',
          search: true,
          
        },
        {
          text: 'Lote',
          value: 'lote',
          align: 'left',
          
          headers: true,
          type: 'text',
          search: true,
          
        },
        {
          text: 'Safsi',
          value: 'safsi',
          align: 'left',
          
          headers: true,
          type: 'text',
          search: true,
          
        },
        {
          text: 'Nfamilias',
          value: 'nfamilias',
          align: 'right',
          
          headers: true,
          type: 'num',
          search: true,
          
        },
        {
          text: 'Npersonas',
          value: 'npersonas',
          align: 'right',
          
          headers: true,
          type: 'num',
          search: true,
          
        },
        {
          text: 'C_gob_municipal',
          value: 'c_gob_municipal',
          align: 'right',
          
          headers: true,
          type: 'num',
          search: true,
          
        },
        {
          text: 'C_gob_municipal_p',
          value: 'c_gob_municipal_p',
          align: 'right',
          
          headers: true,
          type: 'num',
          search: true,
          
        },
        {
          text: 'C_ong',
          value: 'c_ong',
          align: 'right',
          
          headers: true,
          type: 'num',
          search: true,
          
        },
        {
          text: 'C_ong_p',
          value: 'c_ong_p',
          align: 'right',
          
          headers: true,
          type: 'num',
          search: true,
          
        },
        {
          text: 'C_familias',
          value: 'c_familias',
          align: 'right',
          
          headers: true,
          type: 'num',
          search: true,
          
        },
        {
          text: 'C_familias_p',
          value: 'c_familias_p',
          align: 'right',
          
          headers: true,
          type: 'num',
          search: true,
          
        },
        {
          text: 'C_otra',
          value: 'c_otra',
          align: 'right',
          
          headers: true,
          type: 'num',
          search: true,
          
        },
        {
          text: 'C_otra_p',
          value: 'c_otra_p',
          align: 'right',
          
          headers: true,
          type: 'num',
          search: true,
          
        },
        {
          text: 'Dpto',
          value: 'dpto_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lDptos,
        },
        {
          text: 'Municipio',
          value: 'municipio_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lMunicipios,
        },
        {
          text: 'Zona',
          value: 'zona_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lZonas,
        },
        {
          text: 'Descom',
          value: 'descom_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lDescoms,
        },
        {
          text: 'Epsa',
          value: 'epsa_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lEpsas,
        },
        {
          text: 'Tipo_bano',
          value: 'tipo_bano_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lTipo_banos,
        },
        {
          text: 'Doc_firmado',
          value: 'doc_firmado_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lDoc_firmados,
        },
        {
          text: 'Info_metodo',
          value: 'info_metodo_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lInfo_metodos,
        },
        {
          text: 'Prob_sol_existente',
          value: 'prob_sol_existente_id',
          align: 'left',
          
          headers: true,
          type: 'num',
          search: true,
          lista: this.lProb_sol_existentes,
        },
      ],
      lDistritos: [],

      lEntidades: [],

      lRutas: [],

      lDptos: [],

      lMunicipios: [],

      lZonas: [],

      lDescoms: [],

      lEpsas: [],

      lTipo_banos: [],

      lDoc_firmados: [],

      lInfo_metodos: [],

      lProb_sol_existentes: [],

    };
  },
  methods: {},
  async mounted() {
    this.lDistritos = await this.getListaBackend('Distritos', 'id,name', 'distritos_id')

    this.lEntidades = await this.getListaBackend('Entidades', 'id,name', 'entidades_id')

    this.lRutas = await this.getListaBackend('Rutas', 'id,name', 'rutas_id')

    this.lDptos = await this.getListaBackend('Dptos', 'id,name', 'dpto_id')

    this.lMunicipios = await this.getListaBackend('Municipios', 'id,name', 'municipio_id')

    this.lZonas = await this.getListaBackend('Zonas', 'id,name', 'zona_id')

    this.lDescoms = await this.getListaBackend('Descoms', 'id,name', 'descom_id')

    this.lEpsas = await this.getListaBackend('Epsas', 'id,name', 'epsa_id')

    this.lTipo_banos = await this.getListaBackend('Tipo_banos', 'id,name', 'tipo_bano_id')

    this.lDoc_firmados = await this.getListaBackend('Doc_firmados', 'id,name', 'doc_firmado_id')

    this.lInfo_metodos = await this.getListaBackend('Info_metodos', 'id,name', 'info_metodo_id')

    this.lProb_sol_existentes = await this.getListaBackend('Prob_sol_existentes', 'id,name', 'prob_sol_existente_id')

  },
};
</script>

<style lang="stylus"></style>
