<template>
  <v-container grid-list-md fluid v-if="item">
    <v-layout row wrap>
      <v-flex xs10 sm8 md10>
        <v-text-field
          label="Beneficiario"
          :value="item.name"
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
              item.estado == 3 ? item.beneficiario_id : item.id,
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
    <v-layout row wrap v-if="item.estado > 1">
      <v-flex xs6>
        <v-text-field
          label="Ref.Orden de Servicio"
          v-model="item.ref"
          :rules="[rules.required]"
          validate-on-blur
          :readonly="accion == 'show'"
          dense
        ></v-text-field>
      </v-flex>
      <v-flex xs6>
        <v-select
          :items="lForma_pagos"
          item-text="name"
          item-value="id"
          label="Metodo de Pago"
          v-model="item.forma_pago_id"
          :rules="[rules.required]"
          validate-on-blur
          :readonly="accion == 'show'"
        >
        </v-select>
      </v-flex>

      <v-flex xs12>
        <v-layout row>
          <v-flex grow>
            <v-textarea
              label="Observaciones"
              v-model="item.obs"
              :readonly="accion == 'show'"
              rows="4"
              hide-details
              dense
            ></v-textarea>
          </v-flex>

          <v-flex shrink pa-1 v-if="!(item.estado == 3 && item.foto == 0)">
            <mk-img
              :onlyShow="accion == 'show'"
              v-model="mkImgData"
              :w="180"
              :h="100"
            ></mk-img>
          </v-flex>
        </v-layout>
      </v-flex>
      {{ $vuetify.breakpoint.name }}
    </v-layout>
    <v-card>
      <v-toolbar color="primary" dark dense>
        <v-toolbar-title
          >Servicios {{ lEstadosSol[item.estado] }}
        </v-toolbar-title>
      </v-toolbar>

      <div dark v-if="item.estado > -1" class="grey" style="height: 20px">
        <v-list-tile-content>
          <v-list-tile-title>
            <span v-if="item.estado > -1" style="font-size: 10px">
              <div
                v-if="accion != 'show'"
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
              v-show="accion != 'show'"
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
                <span v-if="servicio.estado > -1" style="font-size: 10px">
                  <div style="width: 25px; display: inline-block">
                    {{ servicio.sol_id }}
                  </div>
                  <div style="width: 63px; display: inline-block">
                    {{ servicio.estado }}
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
            v-if="
              (servicio.selected || accion == 'show') && servicio.estado > 1
            "
            style="border-bottom: 1px solid #f1f1f1"
            class="pa-2"
          >
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
                    :readonly="accion == 'show'"
                  ></v-switch>
                </div>
              </v-flex>
              <v-flex grow>
                <v-text-field
                  label="Observaciones"
                  v-model="servicio.obs_sol"
                  :rules="servicio.realizado ? [] : [rules.required]"
                  validate-on-blur
                  :readonly="accion == 'show'"
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
                  v-if="accion != 'show'"
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
                      :readonly="accion == 'show'"
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
                      :readonly="accion == 'show'"
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
                      v-if="accion != 'show'"
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

export default {
  name: 'mkHead',
  props: [
    'item',
    'lBeneficiarios',
    'accion',
    'lForma_pagos',
    'lEstadosSol',
    'lMateriales',
    'lServices',
    'lMedidas',
    'mkImgData',
  ],
  mixins: [MkRulesMix],
  components: { MkImg },
  data() {
    return {}
  },
  methods: {
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
}
</script>
