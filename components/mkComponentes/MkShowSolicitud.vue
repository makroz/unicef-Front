<template>
  <v-container grid-list-md fluid v-if="item">
    <v-layout row wrap>
      <v-flex xs10 sm8 md10>
        <v-text-field
          label="Beneficiario"
          :value="
            getDataLista(
              lBeneficiarios,
              accion == 'show' ? item.beneficiario_id : item.id,
              'id',
              'name',
              'Desconocido'
            )
          "
          readonly
          hide-details
          dense
        ></v-text-field>
      </v-flex>
      <v-flex xs2 sm4 md2>
        <v-text-field
          label="Cod.EPSA"
          :value="
            getDataLista(
              lBeneficiarios,
              accion == 'show' ? item.beneficiario_id : item.id,
              'id',
              'epsa',
              '---'
            )
          "
          readonly
          hide-details
          dense
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-if="accion != 'aceptar'">
      <v-flex xs4 v-if="accion != 'realizar'">
        <v-text-field
          label="Fecha"
          :value="formatDT(item.created_at)"
          disabled
          dense
        ></v-text-field>
      </v-flex>

      <v-flex :xs4="accion != 'realizar'" :xs6="accion == 'realizar'">
        <v-text-field
          label="Ref.Orden de Servicio"
          v-model="item.ref"
          :rules="[rules.required]"
          validate-on-blur
          :readonly="accion != 'realizar'"
          dense
        ></v-text-field>
      </v-flex>

      <v-flex :xs4="accion != 'realizar'" :xs6="accion == 'realizar'">
        <v-select
          :items="lForma_pagos"
          item-text="name"
          item-value="id"
          label="Metodo de Pago"
          v-model="item.forma_pago_id"
          :rules="[rules.required]"
          validate-on-blur
          :readonly="accion != 'realizar'"
        >
        </v-select>
      </v-flex>

      <v-flex xs12>
        <v-layout row>
          <v-flex grow>
            <v-textarea
              label="Observaciones"
              v-model="item.obs"
              :readonly="accion != 'realizar'"
              rows="4"
              hide-details
              dense
            ></v-textarea>
          </v-flex>

          <v-flex shrink pa-1 v-if="accion == 'realizar' || item.foto == 1">
            <mk-img
              :onlyShow="accion != 'realizar'"
              v-model="mkImgData"
              :w="180"
              :h="100"
            ></mk-img>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-card>
      <v-toolbar color="primary" dark dense>
        <v-toolbar-title
          >  Servicios {{ lEstadosSol[item.estado] }} 
        </v-toolbar-title>
      </v-toolbar>

      <div dark v-if="accion != 'add'" class="grey" style="height: 20px">
        <v-list-tile-content>
          <v-list-tile-title>
            <span v-if="accion != 'add'" style="font-size: 10px">
              <div
                v-if="accion != 'show' && accion != 'verificar'"
                style="width: 48px; display: inline-block"
              ></div>
              <div v-else style="width: 14px; display: inline-block"></div>

              <div style="width: 25px; display: inline-block">Id</div>
              <div style="width: 60px; display: inline-block">Fecha</div>
              <div
                style="width: 30px; display: inline-block"
                class="hidden-xs-only"
              >
                Eval
              </div>
              <div
                style="width: 85px; display: inline-block"
                class="hidden-xs-only"
              >
                Creado X
              </div>
            </span>
            Servicio
            <span style="font-size: 10px"> Observaciones </span>
            <div style="float: right; width: 70px">Cant.</div>
          </v-list-tile-title>
        </v-list-tile-content>
      </div>
      <v-list dense>
        <template v-for="(servicio, index) in lServices">
          <v-list-tile
            :key="index"
            :class="
              servicio.selected
                ? 'deep-purple lighten-5 deep-purple--text text--accent-4 elevation-3'
                : ''
            "
          >
            <v-list-tile-action
              v-show="accion != 'show' && accion != 'verificar'"
              style="min-width: 34px"
            >
              <v-checkbox
                v-model="servicio.selected"
                color="deep-purple accent-4"
                :readonly="accion == 'show'"
                hide-details
              ></v-checkbox>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>
                <span v-if="accion != 'add'" style="font-size: 10px">
                  <div style="width: 25px; display: inline-block">
                    {{ servicio.sol_id }}-{{ servicio.estado }}
                  </div>
                  <div style="width: 63px; display: inline-block">
                    {{ formatDT(servicio.fecha, false) }}
                  </div>
                  <div
                    style="width: 30px; display: inline-block"
                    class="hidden-xs-only"
                  >
                    {{
                      servicio.evaluaciones_id ? servicio.evaluaciones_id : '--'
                    }}
                  </div>
                  <div
                    style="width: 85px; display: inline-block"
                    class="hidden-xs-only"
                  >
                    {{ servicio.monitor.split(' ')[0] }}
                  </div>
                </span>
                {{ servicio.name }}
                <span style="font-size: 10px; width: 130px">
                  {{ servicio.obs }}
                </span>
              </v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-avatar>
              {{ servicio.cantidad }}
            </v-list-tile-avatar>
          </v-list-tile>
          <div
            :key="index + '_'"
            v-if="servicio.selected && accion != 'aceptar'"
            style="border-bottom: 1px solid #f1f1f1"
            class="pa-2"
          >

            <v-layout
              wrap
              row
              v-if="accion == 'verificar' || (servicio.estado > 3 && servicio.estado < 9)"
            >
              <v-flex shrink>
                <v-select
                  style="width: 150px"
                  dense
                  box
                  color="red accent-4"
                  :items="servicio.estado > 7?lOpciones['st9']:lOpciones['st3']"
                  item-text="name"
                  item-value="id"
                  label="Verificar"
                  v-model="servicio.verificado"
                  :rules="[rules.required]"
                  validate-on-blur
                  :readonly="accion != 'verificar'"
                  hide-details
                >
                </v-select>
              </v-flex>
              <v-flex grow>
                <v-text-field
                  label="Obs. de Verificado"
                  box
                  v-model="servicio.obs_verif"
                  :rules="servicio.verificado == 4 ? [] : [rules.required]"
                  validate-on-blur
                  :readonly="accion != 'verificar'"
                  hide-details
                ></v-text-field>
              </v-flex>
              <v-flex shrink>
                <v-btn icon class="error" @click="openQA(servicio)"> QA </v-btn>
              </v-flex>
            </v-layout>
            <v-layout wrap row>
              <v-flex inline style="font-size: 10px" shrink>
                <div style="width: 75px; display: inline-block">
                  Se Realizo?
                  <v-switch
                    dense
                    hide-details
                    style="font-size: 10px"
                    height="10"
                    v-model="servicio.realizado"
                    :label="servicio.realizado ? 'Si' : 'No'"
                    color="green accent-4"
                    :readonly="accion != 'realizar'"
                  ></v-switch>
                </div>
              </v-flex>
              <v-flex grow>
                <v-text-field
                  v-if="(accion=='realizar' || servicio.obs_sol )"
                  label="Obs. de Realizado"
                  v-model="servicio.obs_sol"
                  :rules="servicio.realizado ? [] : [rules.required]"
                  validate-on-blur
                  :readonly="accion != 'realizar'"
                  dense
                  :hide-details="servicio.realizado"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-card v-if="servicio.realizado">
              <div
                class="green white--text elevation-3 pa-1"
                style="font-size: 14px"
              >
                <v-btn
                  v-if="accion == 'realizar'"
                  small
                  flat
                  icon
                  color="white"
                  @click="addMaterial(servicio)"
                >
                  <v-icon>add_circle_outline</v-icon>
                </v-btn>
                Material usado
              </div>
              <v-container grid-list-md fluid>
                <v-layout
                  v-for="(material, i) in servicio.materiales"
                  :key="i"
                  row
                  wrap
                >
                  <v-flex grow>
                    <v-select
                      shrink
                      :items="lMateriales"
                      item-text="name"
                      item-value="id"
                      label="Material"
                      v-model="material.id"
                      :rules="[rules.required]"
                      validate-on-blur
                      :readonly="accion != 'realizar'"
                    >
                    </v-select>
                  </v-flex>
                  <v-flex shrink>
                    <v-text-field
                      label="Cant"
                      v-model="material.cant"
                      type="number"
                      style="width: 80px"
                      :rules="[rules.num, rules.required]"
                      validate-on-blur
                      :readonly="accion != 'realizar'"
                      :suffix="
                        getDataLista(
                          lMedidas,
                          getDataLista(
                            lMateriales,
                            material.id,
                            'id',
                            'medida_id'
                          ),
                          'id',
                          'simbolo',
                          ''
                        )
                      "
                    ></v-text-field>
                  </v-flex>
                  <v-flex shrink>
                    <v-btn
                      v-if="accion == 'realizar'"
                      small
                      flat
                      icon
                      color="red"
                      @click="delMaterial(servicio, i)"
                    >
                      <v-icon>remove_circle_outline</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </div>
        </template>
      </v-list>
    </v-card>
    <mk-formulario
      ref="mkForm"
      :modal="modal"
      tit="Control de Calidad"
      :accion="accion"
      @closeDialog="modal = false"
      @grabarItem="saveQA"
    >
      <template v-for="qa in lControl_calidades">
      <v-list-tile
        v-if="qaItem.qa"
        :key="qa.id"
        :class="
            qaItem.qa[qa.id]?qaItem.qa[qa.id].selected
            ? 'blue lighten-5 blue--text text--accent-4 elevation-3'
            : '':''
        "
      >
        <v-list-tile-action style="min-width: 34px">
          <v-checkbox
            v-model="qaItem.qa[qa.id].selected"
            color="blue accent-4"
            :readonly="accion == 'show'"
            hide-details
          ></v-checkbox>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>
            {{ qa.name }}
          </v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-text-field
            label="Puntos"
            style="width: 80px"
            v-model="qaItem.qa[qa.id].puntos"
            type="number"
            :rules="[]"
            validate-on-blur
            :readonly="accion != 'verificar'"
          >
          </v-text-field>
        </v-list-tile-action>
      </v-list-tile>
      </template>
    </mk-formulario>
  </v-container>
</template>

<script>
import {
  getDataLista,
  imprimirElemento,
  formatDT,
} from '@/components/mkComponentes/lib/MkUtils.js'
import MkRulesMix from '@/components/mkComponentes/mixins/MkRulesMix'
import MkImg from '@/components/mkComponentes/mkImg/MkImg'
import MkFormulario from './MkFormulario.vue'

export default {
  name: 'mkHead',
  props: [
    'item',
    'lBeneficiarios',
    'lControl_calidades',
    'accion',
    'lForma_pagos',
    'lEstadosSol',
    'lMateriales',
    'lServices',
    'lMedidas',
    'mkImgData',
  ],
  mixins: [MkRulesMix],
  components: { MkImg, MkFormulario },
  data() {
    return {
      modal: false,
      qaItem:{},
      lOpciones: {
        st9: [
          {
            id: 8,
            name: 'Anulado',
          },
          {
            id: 1,
            name: 'Reprogramado',
          },
        ],
        st3: [
          {
            id: 1,
            name: 'Reprogramado',
          },
          {
            id: 2,
            name: 'Regresado',
          },
          {
            id: 4,
            name: 'Verificado',
          },
          {
            id: 8,
            name: 'Anulado',
          },
        ],
      },
    }
  },
  methods: {
    openQA(servicio){
      this.qaItem=servicio
      //console.log('qaitem',this.qaItem)
      this.modal=true
    },
    saveQA(servicio){
      //this.qaItem=servicio.qaItem
      this.modal=false
    },
    addMaterial(item) {
      item.materiales.push({})
    },
    delMaterial(item, index) {
      item.materiales.splice(index, 1)
    },

    formatDT(d = '', time = true) {
      return formatDT(d, time)
    },
    getDataLista(lista, valor, busco = 'id', devuelvo = 'name', defa = false) {
      return getDataLista(lista, valor, busco, devuelvo, defa)
    },
  },
  mounted() {
  }
}
</script>
