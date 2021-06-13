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
        <v-layout row wrap>
          <v-flex xs8 md6 lg3>
            <mk-date
              v-model="item.fecha"
              label="Fecha"
              :rules="[rules.required]"
              :accion="accion"
            >
            </mk-date>
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
              <v-toolbar color="indigo" dark dense>
                <v-toolbar-title class="body-1"
                  >Desarrollo de habilidades en SSD
                </v-toolbar-title>
              </v-toolbar>

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

        <br />
        <v-card class="pa-2">
          <v-toolbar color="indigo" dark dense>
            <v-toolbar-title class="body-1">
              La familia requiere apoyo en:
            </v-toolbar-title>
          </v-toolbar>

          <v-layout row wrap>
            <v-flex xs12>
              <v-select
                v-if="item.apoyos"
                :items="lApoyos"
                item-text="name"
                item-value="id"
                label="Apoyos Disponibles"
                v-model="item.apoyos.apoyos"
                multiple
                chips
                :readonly="accion == 'show'"
              >
              </v-select>
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
          search: true
        },
        {
          text: 'Fecha',
          value: 'fecha',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'date',
          search: true
        },
        {
          text: 'Beneficiario',
          value: 'beneficiario_id',
          align: 'left',
          width: '250px',
          headers: true,
          type: 'num',
          search: true,
          lista: this.lBeneficiarios
        },
        {
          text: 'No.Part.',
          value: 'nparticipantes',
          align: 'right',
          width: '100px',
          headers: true,
          type: 'num',
          search: true
        },
        {
          text: 'Contenido',
          value: 'contenido',
          align: 'left',
          headers: true,
          type: 'textarea',
          search: true
        },
        {
          text: 'Hallazgos',
          value: 'hallazgos',
          align: 'left',

          headers: false,
          type: 'textarea',
          search: true
        },
        {
          text: 'Alertas',
          value: 'alertas',
          align: 'left',

          headers: false,
          type: 'textarea',
          search: true
        },
        {
          text: 'Acciones',
          value: 'acciones',
          align: 'left',

          headers: false,
          type: 'textarea',
          search: true
        }
      ],
      fecha_modal: false,
      lBeneficiarios: [],
      lApoyos: []
    }
  },
  methods: {
    beforeOpen(accion, data = {}) {
      if (accion != 'add') {
        //data.apoyos = Object.assign([],data.apoyos.apoyos)
      } else {
        //        data.apoyos=[]
        data.apoyos = { apoyos: [] }
      }
    },

    beforeSave(me) {
      if (
        JSON.stringify(me.dirty.item['apoyos']) !=
        JSON.stringify(me.item['apoyos'])
      ) {
        me.item.beneficiario_id_ = me.item.beneficiario_id
      }
    }
  },
  async mounted() {
    let listas = await this.getDatasBackend(this.urlModulo, [
      { mod: 'Beneficiarios', campos: 'id,name', item: 'beneficiario_id' },
      {
        mod: 'Lista_apoyos',
        campos: 'id,name',
        datos: { modulo: 'mkCapacitaciones' },
        lista: 'lApoyos'
      }
    ])
  }
}
</script>

<style lang="stylus"></style>
