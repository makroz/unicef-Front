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
        <v-container grid-list-md fluid class="white">
          <v-layout row wrap>
            <v-flex xs8 md6 lg3>
              <v-dialog
                v-if="accion != 'show'"
                ref="fecha_dialog"
                v-model="item.fecha_modal_temp_"
                :return-value.sync="item.fecha"
                persistent
                lazy
                full-width
                width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    ref="fecha"
                    v-model="item.fecha_temp_"
                    label="Fecha"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="item.fecha" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn
                    flat
                    color="primary"
                    @click="item.fecha_modal_temp_ = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    flat
                    color="primary"
                    @click="
                      $refs.fecha_dialog.save(item.fecha)
                      item.fecha_temp_ = formatDate(item.fecha)
                    "
                    >OK</v-btn
                  >
                </v-date-picker>
              </v-dialog>
              <v-text-field
                v-else
                ref="fecha"
                v-model="item.fecha_temp_"
                label="Fecha"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </v-flex>
            <v-flex xs4 md6 lg2>
              <v-text-field
                type="number"
                label="No.Personas"
                v-model="item.nparticipantes"
                :rules="[rules.num, rules.required]"
                validate-on-blur
                :readonly="accion == 'show'"
              >
              </v-text-field>
            </v-flex>
            <v-flex xs12 lg7>
              <v-select
                :items="lBeneficiarios"
                item-text="name"
                item-value="id"
                label="Beneficiario"
                v-model="item.beneficiario_id"
                :rules="[rules.num, rules.required]"
                validate-on-blur
                :readonly="accion != 'add'"
              >
              </v-select>
            </v-flex>
            <v-flex xs12>
              <v-card class="pa-2">
                <v-layout row wrap>
                  <v-flex xs12 md6>
                    <v-textarea
                      label="Contenido"
                      v-model="item.contenido"
                      :rules="[rules.required]"
                      validate-on-blur
                      rows="4"
                      :readonly="accion == 'show'"
                    >
                    </v-textarea>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-textarea
                      label="Hallazgos importantes (dudas y/o debilidades)"
                      v-model="item.hallazgos"
                      :rules="[rules.required]"
                      validate-on-blur
                      rows="4"
                      :readonly="accion == 'show'"
                    >
                    </v-textarea>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-textarea
                      label="Alertas identificadas"
                      v-model="item.alertas"
                      :rules="[rules.required]"
                      validate-on-blur
                      rows="4"
                      :readonly="accion == 'show'"
                    >
                    </v-textarea>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-textarea
                      label="Acciones tomadas"
                      v-model="item.acciones"
                      :rules="[rules.required]"
                      validate-on-blur
                      rows="4"
                      :readonly="accion == 'show'"
                    >
                    </v-textarea>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'
import { formatDT } from '@/components/mkComponentes/lib/MkUtils.js'

export default {
  middleware: ['authAccess'],

  mixins: [MkModuloMix],
  name: 'Sesion_familiares',
  data() {
    return {
      //urlModulo: '',
      titModulo: 'Sesiones Familiares',
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
          value: 'fecha',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'date',
          search: true,
        },
        {
          text: 'Beneficiario',
          value: 'beneficiario_id',
          align: 'left',
          width: '250px',
          headers: true,
          type: 'num',
          search: true,
          lista: this.lBeneficiarios,
        },
        {
          text: 'No.Part.',
          value: 'nparticipantes',
          align: 'right',
          width: '100px',
          headers: true,
          type: 'num',
          search: true,
        },
        {
          text: 'Contenido',
          value: 'contenido',
          align: 'left',
          headers: true,
          type: 'textarea',
          search: true,
        },
        {
          text: 'Hallazgos',
          value: 'hallazgos',
          align: 'left',

          headers: false,
          type: 'textarea',
          search: true,
        },
        {
          text: 'Alertas',
          value: 'alertas',
          align: 'left',

          headers: false,
          type: 'textarea',
          search: true,
        },
        {
          text: 'Acciones',
          value: 'acciones',
          align: 'left',

          headers: false,
          type: 'textarea',
          search: true,
        },
      ],
      fecha_modal: false,
      lBeneficiarios: [],
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return null
      let fecha = (date + ' ').split(' ')[0]
      const [year, month, day] = fecha.split('-')
      return `${year}/${month}/${day}`
    },
    formatDT(fecha, time = true) {
      return formatDT(fecha, time)
    },
    beforeOpen(accion, data = {}) {
      if (accion == 'add') {
        //data.fecha=new Date().toISOString().substr(0, 10)
      }
      data.fecha_temp_ = this.formatDate(data.fecha)
    },
  },
  async mounted() {
    this.lBeneficiarios = await this.getListaBackend(
      'Beneficiarios',
      'id,name',
      'beneficiario_id'
    )
  },
}
</script>

<style lang="stylus"></style>
