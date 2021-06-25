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
          <mk-date
            v-model="item.fecha"
            label="Fecha"
            :rules="[rules.required]"
            :readonly="accion == 'show'"
          >
          </mk-date>
        </v-flex>

        <v-card class="pa-2">
          <v-toolbar color="indigo" dark dense>
            <v-toolbar-title class="body-1"
              >Desarrollo de habilidades en Saneamiento Sostenible
            </v-toolbar-title>
          </v-toolbar>

          <v-layout row wrap>
            <v-flex xs12 md6>
              <v-textarea
                label="Contenido"
                v-model="item.contenido"
                :rules="[rules.required]"
                validate-on-blur
                rows="2"
                :readonly="accion == 'show'"
              >
              </v-textarea>
            </v-flex>
            <v-flex xs12 md6>
              <v-textarea
                label="Hallazgos"
                v-model="item.hallazgos"
                :rules="[rules.required]"
                validate-on-blur
                rows="2"
                :readonly="accion == 'show'"
              >
              </v-textarea>
            </v-flex>
          </v-layout>
        </v-card>
        <br />
        <v-card class="pa-2">
          <v-toolbar color="indigo" dark dense>
            <v-toolbar-title class="body-1">
              Familias que Asistieron
            </v-toolbar-title>
          </v-toolbar>

          <v-layout row wrap>
            <v-flex xs12>
              <v-autocomplete
                v-model="item.beneficiarios"
                :items="lBeneficiarios"
                :filter="customFilter"
                color="primary"
                item-text="name"
                label="Beneficiarios de las Familias"
                item-value="id"
                item-avatar="id"
                multiple
                clearable
                chips
                deletable-chips
                solo-inverted
                counter
              >
              </v-autocomplete>
            </v-flex>
          </v-layout>
        </v-card>
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'

export default {
  middleware: ['authAccess'],

  mixins: [MkModuloMix],
  name: 'Sesion_grupales',
  data() {
    return {
      //urlModulo: '',
      titModulo: 'Sesiones Grupales',
      campos: [
        {
          text: 'Id',
          value: 'id',
          align: 'right',
          width: '100px',
          headers: true,
          type: 'num',
          search: true
        },
        {
          text: 'Fecha',
          value: 'fecha',
          align: 'center',
          width: '200px',
          headers: true,
          type: 'date',
          search: true
        },
        {
          text: 'Contenido',
          value: 'contenido',
          align: 'left',

          headers: true,
          type: 'textarea',
          search: true
        }
      ],
      lBeneficiarios: []
    }
  },
  methods: {
    beforeOpen(accion, data = {}) {
      if (accion == 'add') {
        this.$refs.mkForm.$refs.form.resetValidation()
      }
    },

    customFilter(item, queryText, itemText) {
      const textOne = ('' + item.name).toLowerCase()
      const textTwo = ('' + item.id).toLowerCase()
      const searchText = ('' + queryText).toLowerCase()
      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      )
    }
  },
  async mounted() {
    let listas = await this.getDatasBackend(this.urlModulo, [
      {
        mod: 'Beneficiarios',
        campos: 'id,name',
        item: 'beneficiario_id',
        sort: 'name'
      }
    ])
  }
}
</script>

<style lang="stylus"></style>
