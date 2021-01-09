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
          validate-on-blur
          ref="focus"
        ></v-text-field>
        <v-text-field
          label="eMail"
          v-model="item.email"
          :rules="[rules.required,rules.email,rules.unique('email')]"
          ref="email"
          validate-on-blur
        ></v-text-field>
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'

export default {
  mixins: [MkModuloMix],
  name: 'ParamsHorarios',
  components: {},
  data() {
    return {
      //urlModulo: '',
      titModulo: 'Parametros de Horarios',
      campos: [
        {
          text: 'Id',
          value: 'id',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'num',
          search: false
        },
        {
          text: 'Minutos de Tolerancia',
          value: 'min_tol',
          width: '250px',
          headers: true,
          type: 'num',
          search: false
        },
        {
          text: 'Admite Horas Extras Entrada',
          value: 'he_ent',
          align: 'left',
          headers: true,
          type: 'num',
          search: false
        },
        {
          text: 'Admite Horas Extras Salida',
          value: 'he_sal',
          align: 'left',
          headers: true,
          type: 'num',
          search: false
        },
        {
          text: 'Minutos entre Marcaciones',
          value: 'min_sep',
          align: 'left',
          headers: true,
          type: 'num',
          search: false
        },
        {
          text: 'Horas Trabajadas por Defecto',
          value: 'hr_defecto',
          align: 'left',
          headers: true,
          type: 'num',
          search: false
        }


      ]
    }
  },
  methods: {}
}
</script>


