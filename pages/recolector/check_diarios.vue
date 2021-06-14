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
          <v-flex sm6>
            <mk-date
              v-model="item.fecha"
              label="Fecha"
              :rules="[rules.required]"
              :accion="accion"
              :readonly="accion == 'show' || accion== 'llegada'"
            >
            </mk-date>
          </v-flex>
          <v-flex sm6>
            <v-select
              :items="lUsuarios"
              item-text="name"
              item-value="id"
              label="Recolector"
              v-model="item.recolector_id"
              :rules="[rules.num, rules.required]"
              validate-on-blur
              :readonly="accion == 'show' || accion== 'llegada'"
            >
            </v-select>
          </v-flex>
        </v-layout>
        <v-flex>
          <v-textarea
            label="Obs"
            v-model="item.obs"
            validate-on-blur
            rows="2"
            :readonly="accion == 'show'"
          >
          </v-textarea>
        </v-flex>
        <v-layout row wrap>
          <v-flex sm6>
            <v-select
              :items="lVehiculos"
              item-text="placa"
              item-value="id"
              label="Vehiculo"
              v-model="item.vehiculo_id"
              :rules="[rules.num, rules.required]"
              validate-on-blur
              :readonly="accion == 'show' || accion== 'llegada'"
            >
            </v-select>
          </v-flex>
          <v-flex sm6>
            <v-select
              :items="lChoferes"
              item-text="name"
              item-value="id"
              label="Chofer"
              v-model="item.chofer_id"
              :rules="[rules.num, rules.required]"
              validate-on-blur
              :readonly="accion == 'show' || accion== 'llegada'"
            >
            </v-select>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex sm4>
            <mk-time
              v-model="item.salida"
              label="Hora Salida"
              :rules="[rules.required]"
              :readonly="accion == 'show' || accion== 'llegada'"
            >
            </mk-time>
          </v-flex>
          <v-flex sm4>
            <v-text-field
              type="number"
              label="Kms. en la Salida"
              v-model="item.km_salida"
              :rules="[rules.num]"
              validate-on-blur
              :readonly="accion == 'show' || accion== 'llegada'"
            >
            </v-text-field>
          </v-flex>
          <v-flex sm4>
            <v-select
              :items="lUsuarios"
              item-text="name"
              item-value="id"
              label="Verifico Salida"
              v-model="item.salida_id"
              readonly
            >
            </v-select>
          </v-flex>
        </v-layout>
        <v-layout row wrap v-if="accion == 'llegada' || item.llegada_id">
          <v-flex sm4>
            <mk-time
              v-model="item.regreso"
              label="Hora Regreso"
              :rules="[rules.required]"
              :readonly="accion == 'show'"
            >
            </mk-time>
          </v-flex>
          <v-flex sm4>
            <v-text-field
              type="number"
              label="Kms. al Regresar"
              v-model="item.km_regreso"
              :rules="[rules.num]"
              validate-on-blur
              :readonly="accion == 'show'"
            >
            </v-text-field>
          </v-flex>
          <v-flex sm4>
            <v-select
              :items="lUsuarios"
              item-text="name"
              item-value="id"
              label="Verifico Regreso"
              v-model="item.llegada_id"
              readonly
            >
            </v-select>
          </v-flex>
        </v-layout>

        <mk-detalle
          v-if="accion!='llegada'"
          v-model="item.materiales"
          titulo="Materiales"
          :accion="accion"
        >
          <template slot-name="default" slot-scope="props">
            <v-flex sm10 md10>
              <v-select
                :items="lMateriales"
                item-text="name"
                item-value="id"
                label="Material"
                v-model="props.det.id"
                :rules="[rules.required]"
                validate-on-blur
                :readonly="accion == 'show'"
              >
              </v-select>
            </v-flex>
            <v-flex sm2 md2>
              <v-text-field
                type="number"
                label="Cantidad"
                v-model="props.det.cant"
                :rules="[rules.num, rules.required]"
                validate-on-blur
                :readonly="accion == 'show'"
              >
              </v-text-field>
            </v-flex>
          </template>
        </mk-detalle>

        <mk-panel titulo="Check List" :accion="accion"
         v-if="accion!='llegada'"
        >
          <v-flex sm12 v-for="categ in lCheck_categ" :key="categ.id" pa-2>
            <div class="grey white--text title text-capitalize pa-2">
              {{ categ.name }}
            </div>
            <template v-for="(check, index) in item.checks">
              <v-layout
                row
                wrap
                :key="check.id"
                v-if="lChecks[index].categ_id == categ.id"
                mx-3
                style="border-bottom: 1px dotted grey"
              >
                <v-flex grow>
                  {{ lChecks[index].name }}
                </v-flex>
                <v-flex shrink>
                  <v-text-field
                    style="margin:0;margin-top:10px;padding:0;width:100px"
                    v-if="lChecks[index].tipo == 'n'"
                    type="number"
                    label="Cantidad"
                    v-model="check.resp"
                    :rules="[rules.num, rules.required]"
                    validate-on-blur
                    :readonly="accion == 'show'"
                  >
                  </v-text-field>
                  <v-text-field
                    style="margin:0;margin-top:10px;padding:0;width:100px"
                    v-if="lChecks[index].tipo == 't'"
                    label="Respuesta"
                    v-model="check.resp"
                    :rules="[rules.required]"
                    validate-on-blur
                    :readonly="accion == 'show'"
                  >
                  </v-text-field>

                  <v-radio-group
                    style="margin:0;margin-top:10px;padding:0;"
                    v-if="lChecks[index].tipo == 'c'"
                    row
                    v-model="check.resp"
                    :rules="[rules.required]"
                    validate-on-blur
                    :readonly="accion == 'show'"
                  >
                    <v-radio color="green" label="Si" value="1"></v-radio>
                    <v-radio color="red" label="No" value="0"></v-radio>
                  </v-radio-group>
                </v-flex>
              </v-layout>
            </template>
          </v-flex>
        </mk-panel>

        <mk-detalle
          v-if="accion == 'llegada' || item.llegada_id"
          v-model="item.eventos"
          titulo="Eventos"
          :accion="accion"
        >
          <template slot-name="default" slot-scope="props">
            <v-flex sm12>
              <v-select
                :items="lEventos"
                item-text="name"
                item-value="id"
                label="Evento"
                v-model="props.det.id"
                :rules="[rules.required]"
                validate-on-blur
                :readonly="accion == 'show'"
              >
              </v-select>
            </v-flex>
            <v-flex sm12>
              <v-textarea
                label="Detalle"
                v-model="props.det.detalle"
                :rules="[rules.required]"
                validate-on-blur
                auto-grow
                rows="2"
                :readonly="accion == 'show'"
              >
              </v-textarea>
            </v-flex>
          </template>
        </mk-detalle>
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'
import MkDetalle from '@/components/mkComponentes/MkDetalle'
import MkPanel from '@/components/mkComponentes/MkPanel'

export default {
  middleware: ['authAccess'],
  components: { MkDetalle, MkPanel },
  mixins: [MkModuloMix],
  name: 'Check_diarios',
  data() {
    return {
      //urlModulo: '',
      titModulo: 'Checks Diarios',
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

          headers: true,
          type: 'date',
          search: true
        },
        {
          text: 'Salida',
          value: 'salida',
          align: 'center',

          headers: true,
          type: 'time',
          search: true
        },
        {
          text: 'Regreso',
          value: 'regreso',
          align: 'center',

          headers: true,
          type: 'time',
          search: true
        },
        {
          text: 'Kms.Salida',
          value: 'km_salida',
          align: 'right',

          headers: true,
          type: 'num',
          search: true
        },
        {
          text: 'Kms.Regreso',
          value: 'km_regreso',
          align: 'right',

          headers: true,
          type: 'num',
          search: true
        },
        {
          text: 'Recolector',
          value: 'recolector_id',
          align: 'left',

          headers: true,
          type: 'num',
          search: true,

          lista: 'lUsuarios'
        },
        {
          text: 'Vehiculo',
          value: 'vehiculo_id',
          align: 'left',

          headers: true,
          type: 'num',
          search: true,

          lista: 'lVehiculos',
          field: 'placa'
        },
        {
          text: 'Chofer',
          value: 'chofer_id',
          align: 'left',

          headers: true,
          type: 'num',
          search: true,

          lista: 'lChoferes'
        },
        {
          text: 'Verif.Salida',
          value: 'salida_id',
          align: 'left',

          headers: true,
          type: 'num',
          search: true,

          lista: 'lUsuarios'
        },
        {
          text: 'Verif.Llegada',
          value: 'llegada_id',
          align: 'left',

          headers: true,
          type: 'num',
          search: true,

          lista: 'lUsuarios'
        }
      ],
      lUsuarios: [],
      lVehiculos: [],
      lChoferes: [],
      lMateriales: [],
      lCheck_categ: [],
      lChecks: [],
      lEventos: []
      //grabarDebug: true,
    }
  },
  methods: {
    // llegada(accion,data){
    //   accion='llegada'
    //   openDialog('llegada',data)
    // },
    async beforeOpen(accion, data) {
      if (accion == 'add') {
        this.saveDirty.push('salida_id')
        data.salida_id = this.$store.getters['auth/getUser'].id
        data.materiales = []
        data.eventos = []
        data.checks = []
        this.lChecks.forEach((e) => {
          data.checks.push({ resp: '', id: e.id })
        })
        //data.checks = JSON.parse(Json.stringify(lChecks))
      } else {
        let checks = []
        this.lChecks.forEach((e) => {
          let resp = this.getDataLista(data.checks, e.id, 'id', 'resp', '')
          checks.push({ resp: resp, id: e.id })
        })
        data.checks = checks
        if (accion == 'llegada') {
          this.saveDirty.push('llegada_id')
          data.llegada_id = this.$store.getters['auth/getUser'].id
          this.tituloModal='Registrar Regreso'
        }
      }
    }
  },
  async mounted() {
    this.addOptionTable({
      id: 'llegada',
      color: 'red',
      icon: 'local_shipping',
      visible: this.can('edit'),
      action: 'openDialog',
      grupos: ['action'],
      orden: 11,
      visibleRow: function (e) {
        return !e.llegada_id
      },
    })

    let listas = await this.getDatasBackend(this.urlModulo, [
      {
        mod: 'Usuarios',
        campos: 'id,name',
        datos: { modulo: 'mkUsuarios' },
        item: ['recolector_id', 'salida_id', 'llegada_id']
      },
      {
        mod: 'Vehiculos',
        campos: 'id,placa',
        datos: { modulo: 'mkRecolector' },
        item: 'vehiculo_id'
      },
      {
        mod: 'Choferes',
        campos: 'id,name',
        datos: { modulo: 'mkRecolector' },
        item: 'chofer_id'
      },
      {
        mod: 'Materiales',
        campos: 'id,name',
        datos: { modulo: 'mkServicios' }
      },
      {
        mod: 'Check_categ',
        campos: 'id,name,orden',
        datos: { modulo: 'mkRecolector' },
        sort: 'orden'
      },
      {
        mod: 'Checks',
        campos: 'id,name,orden,tipo,categ_id',
        datos: { modulo: 'mkRecolector' },
        sort: 'orden'
      },
      {
        mod: 'Eventos',
        campos: 'id,name,orden',
        datos: { modulo: 'mkRecolector' },
        sort: 'orden'
      }
    ])
  }
}
</script>

<style lang="stylus"></style>
