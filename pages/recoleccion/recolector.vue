<template>
  <div id="pageTable">
    <v-container grid-list-md fluid v-if="lRuteos.dispon">
      <v-layout row wrap>
        <v-flex xs12>
          <v-card>
            <!-- presentacion -->
            <v-layout>
              <v-flex pa-4 class="text-xs-center">
                <img
                  style="max-width: 100%; max-height: 250px; height: auto"
                  src="~/static/img/recolector.jpg"
                />
              </v-flex>
              <v-flex>
                <v-card-title primary-title>
                  <div>
                    <div class="font-weight-medium">Bienvenido Recolector</div>
                    <div class="headline primary--text text-uppercase">
                      {{
                        $store.state.auth.authUser
                          ? $store.state.auth.authUser.name
                          : 'Guess'
                      }}
                    </div>
                    <div v-show="$store.state.auth.pwa">
                      <v-btn id="buttonInstall" large class="error">
                        Instalar APPLICACION
                      </v-btn>
                    </div>
                    <span>
                      Este es tu panel de control, donde podras visualizar todas
                      tus Recolecciones Disponibles y Activas, ademas de otros
                      datos importantes.</span
                    >
                  </div>
                </v-card-title>
              </v-flex>
            </v-layout>
            <v-divider light></v-divider>
            <!-- cuadritos informativos -->
            <v-card-actions class="pa-3">
              <v-layout align-space-around justify-space-around row fill-height>
                <mk-simple-card
                  title="Solicitudes Disponibles"
                  :text="lSolicitudServicios.length + ''"
                  color="red darken-4 grey--text"
                ></mk-simple-card>

                <mk-simple-card
                  title="Solicitudes Aceptadas"
                  :text="nAceptadas"
                  color="yellow darken-4"
                ></mk-simple-card>

                <mk-simple-card
                  title="Rutas Cerradas"
                  :text="lRuteos.closed ? lRuteos.closed.ok + '' : '0'"
                  color="green darken-4 grey--text"
                ></mk-simple-card>

                <v-icon :color="location ? 'green' : 'grey'"
                  >my_location</v-icon
                >
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
      <!-- Solicitudes Disponibles -->
      <v-card>
        <v-toolbar color="green darken-4" dark>
          <v-icon>add_location_alt</v-icon>
          <v-toolbar-title>Solicitudes Disponibles</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list two-line>
          <v-list-tile v-for="(sol, index) in lDispon" :key="index" href="#">
            <v-list-tile-avatar>
              <v-btn
                icon
                flat
                color="success"
                @click="verMapaBene(index, false)"
              >
                <!-- <v-badge
                  :value="true"
                  color="cyan"
                  overlap
                >
                  <template v-slot:badge>
                    <span>
                      {{ Object.keys(sol.lista).length }}
                      </span>
                  </template> -->
                <v-icon large>map</v-icon>
                <!-- </v-badge> -->
              </v-btn>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                <v-layout row wrap>
                  <v-flex>
                    <span class="title text-capitalize">
                      {{ sol.name ? sol.name : 'Desconicido' }}
                    </span>
                  </v-flex>
                </v-layout>
              </v-list-tile-title>
              <v-list-tile-sub-title class="caption">
                Cant. Solicitudes:
                {{ Object.keys(sol.lista).length }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon color="primary" @click="aceptarSol(sol, index)">
                <v-icon>add</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
      <br />
      <!-- Solicitudes Aceptadas -->
      <v-card>
        <v-toolbar color="yellow darken-4" dark>
          <v-icon>add_location_alt</v-icon>
          <v-toolbar-title>Solicitudes Aceptadas</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list two-line>
          <v-list-tile v-for="(sol, index) in lAsignadaD" :key="index" href="#">
            <v-list-tile-avatar>
              <v-btn
                icon
                flat
                color="success"
                @click="verMapaBene(sol.id, false)"
              >
                <!-- <v-badge
                  :value="true"
                  color="cyan"
                  overlap
                >
                  <template v-slot:badge>
                    <span>
                      {{ Object.keys(sol.lista).length }}
                      </span>
                  </template> -->
                <v-icon large>map</v-icon>
                <!-- </v-badge> -->
              </v-btn>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                <v-layout row wrap>
                  <v-flex>
                    <span class="title text-capitalize">
                      {{ lAsignada[sol.id].name ? lAsignada[sol.id].name : 'Desconicido' }}
                    </span>
                  </v-flex>
                </v-layout>
              </v-list-tile-title>
              <v-list-tile-sub-title class="caption">
                Cant. Solicitudes:
                {{ Object.keys(lAsignada[sol.id].lista).length }} 
                Distancia: {{ (sol.distancia * 1.0).toFixed(2)  }} Km
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon color="primary" @click="realizarSol(lAsignada[sol.id], sol.id)">
                <v-icon>add</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
      <!-- <v-card>
        <v-toolbar color="yellow darken-4" dark>
          <v-icon>pin_drop</v-icon>
          <v-toolbar-title>Solicitudes Aceptadas</v-toolbar-title>
        </v-toolbar>
        <v-list two-line dense>
          <v-list-group
            v-model="aceptada.active"
            v-for="(aceptada,index) in lAsignada"
            :key="index"
            active-class="grey"
          >
            <v-list-tile slot="activator">
              <v-list-tile-avatar>
                <v-btn
                  icon
                  flat
                  color="success"
                  @click.stop="
                    verMapa(
                      getDataLista(lRutas, ruteo.rutas_id, 'id', '*'),
                      true
                    )
                  "
                >
                  <v-badge :value="true" color="cyan" overlap>
                    <template v-slot:badge>
                      <span>
                        {{
                          getDataLista(
                            lRutas,
                            ruteo.rutas_id,
                            'id',
                            'beneficiarios'
                          ).length
                        }}
                      </span>
                    </template>
                    <v-icon large>map</v-icon>
                  </v-badge>
                </v-btn>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>
                  <v-layout row wrap>
                    <v-flex>
                      <span class="caption">
                        {{ ruteo.id }}
                      </span>
                      <span class="title text-capitalize">
                        {{ getDataLista(lRutas, ruteo.rutas_id) }}
                      </span>
                    </v-flex>
                  </v-layout>
                </v-list-tile-title>
                <v-list-tile-sub-title class="caption">
                  Abierto: {{ formatDT(ruteo['created_at']) }}
                  {{
                    getDataLista(lRutas, ruteo.rutas_id, 'id', 'beneficiarios')
                      .length
                  }}
                  -
                  {{ ruteo.evaluaciones.length }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn
                  icon
                  color="primary"
                  @click.stop=""
                  large
                  v-if="
                    getDataLista(lRutas, ruteo.rutas_id, 'id', 'beneficiarios')
                      .length -
                      ruteo.evaluaciones.length >
                    0
                  "
                >
                  <v-badge :value="true" color="green" overlap>
                    <template v-slot:badge>
                      <span>
                        {{
                          getDataLista(
                            lRutas,
                            ruteo.rutas_id,
                            'id',
                            'beneficiarios'
                          ).length - ruteo.evaluaciones.length
                        }}
                      </span>
                    </template>
                    <v-icon large>groups</v-icon>
                  </v-badge>
                </v-btn>
                <v-btn
                  v-else
                  icon
                  color="primary"
                  @click.stop="getPosition(setClose, ruteo.id)"
                  large
                  title="Cerrar Ruteo"
                >
                  <v-icon large>fact_check</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-tile
              v-for="bene in getDataLista(
                lRutas,
                ruteo.rutas_id,
                'id',
                'beneficiariosD'
              )"
              :key="bene.id"
              href="#"
            >
              <v-list-tile-avatar class="pa-0 pm-0">
                <v-btn
                  icon
                  color="green"
                  @click="verMapaBene(bene.id)"
                  small
                  style="margin: 0; margin-right: 3px"
                >
                  <v-icon>person_pin_circle</v-icon>
                </v-btn>
                <v-btn
                  icon
                  color="blue"
                  @click="verMapaBene(bene.id, true)"
                  small
                  style="margin: 0; margin-left: 3px"
                >
                  <v-icon>directions_car</v-icon>
                </v-btn>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>
                  <span class="caption"> {{ ruteo.id }}</span>
                  {{ getDataLista(lBeneficiarios, bene.id) }}
                </v-list-tile-title>
                <v-list-tile-sub-title class="caption">
                  {{ (bene.distancia * 1.0).toFixed(2) }} Km
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action> </v-list-tile-action>

              <v-list-tile-action>
                <v-btn
                  icon
                  :color="getColorEval(ruteo, bene.id)"
                  @click="openEval(ruteo, bene.id)"
                >
                  <v-icon>assignment</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
        </v-list>
      </v-card> -->
      <br />
      <!-- Rutas Atrasadas  -->
      <v-card>
        <v-toolbar color="red darken-4" dark>
          <v-icon>fmd_bad</v-icon>
          <v-toolbar-title>Rutas Atrasadas </v-toolbar-title>
        </v-toolbar>
        <v-list two-line dense>
          <v-list-group
            v-model="ruteo1.active"
            v-for="ruteo1 in lRuteos.retrased.data"
            :key="ruteo1.id"
            active-class="grey"
          >
            <v-list-tile slot="activator">
              <v-list-tile-avatar>
                <v-btn
                  icon
                  flat
                  color="success"
                  @click.stop="
                    verMapa(
                      getDataLista(lRutas, ruteo1.rutas_id, 'id', '*'),
                      true
                    )
                  "
                >
                  <v-badge :value="true" color="cyan" overlap>
                    <template v-slot:badge>
                      <span>
                        {{
                          getDataLista(
                            lRutas,
                            ruteo1.rutas_id,
                            'id',
                            'beneficiarios'
                          ).length
                        }}
                      </span>
                    </template>
                    <v-icon large>map</v-icon>
                  </v-badge>
                </v-btn>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>
                  <v-layout row wrap>
                    <v-flex>
                      <span class="caption">
                        {{ ruteo1.id }}
                      </span>
                      <span class="title text-capitalize">
                        {{ getDataLista(lRutas, ruteo1.rutas_id) }}
                      </span>
                    </v-flex>
                  </v-layout>
                </v-list-tile-title>
                <v-list-tile-sub-title class="caption">
                  {{ getSubHeader(ruteo1) }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon color="primary" @click.stop="" large>
                  <v-badge :value="true" color="green" overlap>
                    <template v-slot:badge>
                      <span>
                        {{
                          getDataLista(
                            lRutas,
                            ruteo1.rutas_id,
                            'id',
                            'beneficiarios'
                          ).length - ruteo1.evaluaciones.length
                        }}
                      </span>
                    </template>
                    <v-icon large>groups</v-icon>
                  </v-badge>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-tile
              v-for="bene in getDataLista(
                lRutas,
                ruteo1.rutas_id,
                'id',
                'beneficiariosD'
              )"
              :key="bene.id"
              href="#"
            >
              <v-list-tile-avatar class="pa-0 pm-0">
                <v-btn
                  icon
                  color="green"
                  @click="verMapaBene(bene.id)"
                  small
                  style="margin: 0; margin-right: 3px"
                >
                  <v-icon>person_pin_circle</v-icon>
                </v-btn>
                <v-btn
                  icon
                  color="blue"
                  @click="verMapaBene(bene.id, true)"
                  small
                  style="margin: 0; margin-left: 3px"
                >
                  <v-icon>directions_car</v-icon>
                </v-btn>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>
                  {{ getDataLista(lBeneficiarios, bene.id) }}
                </v-list-tile-title>
                <v-list-tile-sub-title class="caption">
                  {{ (bene.distancia * 1.0).toFixed(2) }} Km
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action> </v-list-tile-action>

              <v-list-tile-action>
                <v-btn
                  icon
                  :color="getColorEval(ruteo1, bene.id)"
                  @click="openEval(ruteo1, bene.id)"
                >
                  <v-icon>assignment</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
        </v-list>
      </v-card>
      <br />
      <!-- Rutas Cerradas -->
      <v-card>
        <v-toolbar color="blue darken-4" dark>
          <v-icon>where_to_vote</v-icon>
          <v-toolbar-title>Rutas Cerradas en estas 2 semanas</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list tree-line>
          <v-list-tile
            v-for="rutaC in lRuteos.closed.data"
            :key="rutaC.id"
            href="#"
          >
            <v-list-tile-content>
              <v-list-tile-title>
                <v-layout row wrap>
                  <v-flex>
                    <span class="caption">
                      {{ rutaC.id }}
                    </span>
                    <span class="title text-capitalize">
                      {{ getDataLista(lRutas, rutaC.rutas_id) }}
                    </span>
                    <span class="caption">
                      {{
                        getDataLista(lRutas, rutaC.rutas_id, 'id', 'descrip')
                      }}
                    </span>
                  </v-flex>
                </v-layout>
              </v-list-tile-title>
              <v-list-tile-sub-title class="caption">
                Abierto el:
                {{ formatDT(rutaC.created_at) }}
              </v-list-tile-sub-title>
              <v-list-tile-sub-title class="caption">
                Cerrado el:
                {{ formatDT(rutaC.fec_cerrado) }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
      <br />
      <!-- formulario Principal -->
      <mk-form
        ref="mkForm"
        :modal="modal"
        :tit="tituloModal"
        :accion="accion"
        @closeDialog="closeDialog"
        @grabarItem="grabarItem"
        bTitulo="Aceptar"
      >
        <v-container grid-list-md fluid>
          <v-layout row wrap>
            <v-flex xs12 sm8 md10>
              <v-text-field
                label="Beneficiario"
                :value="item.name"
                disabled
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm-4 md2>
              <v-text-field
                label="Cod.EPSA"
                :value="
                  getDataLista(lBeneficiarios, item.id, 'id', 'epsa', item.id)
                "
                disabled
              ></v-text-field>
            </v-flex>
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
                    <div style="width: 48px; display: inline-block"></div>

                    <div style="width: 25px; display: inline-block">Id</div>
                    <div style="width: 60px; display: inline-block">Fecha</div>
                    <div style="width: 30px; display: inline-block">Eval</div>
                    <div style="width: 85px; display: inline-block">
                      Creado X
                    </div>
                  </span>
                  Servicio
                  <span style="font-size: 10px; width: 130px">
                    Observaciones
                  </span>
                </v-list-tile-title>
              </v-list-tile-content>
            </div>
            <v-list style="max-height: 300px; overflow-y: scroll" dense>
              <template v-for="(servicio, index) in lServices">
                <v-list-tile
                  :key="index"
                  :class="
                    servicio.selected
                      ? 'deep-purple lighten-5 deep-purple--text text--accent-4'
                      : ''
                  "
                >
                  <v-list-tile-action pa-0 ma-0 style="min-width: 34px">
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
                        <div style="width: 60px; display: inline-block">
                          {{ formatDT(servicio.fecha, false) }}
                        </div>
                        <div style="width: 30px; display: inline-block">
                          {{
                            servicio.evaluaciones_id
                              ? servicio.evaluaciones_id
                              : '--'
                          }}
                        </div>
                        <div style="width: 85px; display: inline-block">
                          {{ servicio.monitor.split(' ')[0] }}
                        </div>
                      </span>
                      {{ servicio.name }}
                      <span style="font-size: 10px; width: 130px">
                        {{ servicio.obs }}
                      </span>
                    </v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-avatar
                    v-if="servicio.selected || servicio.estado > -1"
                  >
                    <v-text-field
                      v-model="servicio.cantidad"
                      :disabled="
                        servicio.selected && accion == 'add'
                          ? servicio.cant
                            ? false
                            : true
                          : true
                      "
                      :rules="[rules.required, rules.num, rules.minVal(1)]"
                      validate-on-blur
                      color="primary"
                      :class="servicio.selectded ? 'secondary' : ''"
                      type="number"
                      min="1"
                      style="
                        font-size: 12px;
                        padding-bottom: 0;
                        padding-top: 12px;
                      "
                      :readonly="accion == 'show'"
                    ></v-text-field>
                  </v-list-tile-avatar>
                </v-list-tile>
              </template>
            </v-list>
          </v-card>
        </v-container>
      </mk-form>
      <!-- formulario Mapa FullScreen -->
      <mk-form-full-screen
        ref="mkFormMap"
        :modal="modalMap"
        :tit="tituloModal"
        accion="show"
        @closeDialog="modalMap = false"
      >
        <v-container grid-list-md fluid ma-o pa-0>
          <div id="map-wrap" style="height: 100%; width: 100%">
            <client-only>
              <l-map
                :zoom="zoom"
                :center="center"
                style="height: 100%; width: 100%"
                ref="mymap"
              >
                <l-tile-layer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="<a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
                  :useCors="false"
                ></l-tile-layer>
                <l-polyline
                  v-if="jsonLine"
                  :lat-lngs="jsonLine"
                  color="blue"
                ></l-polyline>
                <l-geo-json
                  v-if="jsonData"
                  :geojson="jsonData"
                  :options-style="styleFunction"
                />
                <div v-if="modalMap && markers && markers.length > 0">
                  <l-marker
                    v-for="(marker, index) in markers"
                    :key="index"
                    :lat-lng="getMarker(marker, item, index)"
                    :draggable="false"
                    :visible="true"
                    :icon="getIcon(marker)"
                  >
                    <l-tooltip>{{
                      getDataLista(lBeneficiarios, marker, 'id', 'name') ||
                      'Tu ubicacion Actual'
                    }}</l-tooltip>
                  </l-marker>
                </div>
              </l-map>
            </client-only>
          </div>
        </v-container>
      </mk-form-full-screen>
      <!-- formulario Evaluaciones FullScreen -->
      <mk-form-full-screen
        ref="mkFormEval"
        :modal="modalEval"
        :tit="tituloModal"
        :accion="accion"
        @closeDialog="modalEval = false"
        @grabarItem="grabarItem"
      >
        <v-container grid-list-md fluid class="white">
          <v-switch
            v-model="estado"
            label="Se puede realizar la Evaluación?"
            color="indigo"
          >
          </v-switch>
          <v-text-field
            label="Notas de la Evaluación"
            v-model="item.obs"
            ref="focusEval"
            :rules="this.estado ? [] : [this.rules.required]"
            validate-on-blur
          ></v-text-field>

          <template v-if="estado && modalEval">
            <v-tabs centered color="indigo" dark icons-and-text>
              <v-tabs-slider color="yellow"></v-tabs-slider>

              <v-tab href="#tab-1" elevation-10>
                Encuesta
                <v-icon>content_paste</v-icon>
              </v-tab>

              <v-tab href="#tab-2" elevation-10>
                Servicios
                <v-icon>plumbing</v-icon>
              </v-tab>

              <v-tab-item value="tab-1">
                <v-card v-for="categ in lCateg" :key="categ.id" elevation-5>
                  <v-toolbar color="secondary" dark dense>
                    <v-toolbar-side-icon></v-toolbar-side-icon>
                    <v-toolbar-title> {{ categ.name }}</v-toolbar-title>
                  </v-toolbar>

                  <div
                    v-for="pregunta in lPregCateg(categ.id)"
                    :key="pregunta.pregunta"
                  >
                    <v-layout row wrap pa-2>
                      <v-flex grow>
                        <span class="title text-capitalize">
                          {{ pregunta.pregunta }}
                        </span>
                      </v-flex>
                      <v-flex shrink>
                        <v-text-field
                          v-if="pregunta.tipo == 2"
                          label="valor"
                          v-model="item.respuestas[pregunta.id]"
                          :rules="[rules.required, rules.num]"
                          validate-on-blur
                          type="number"
                          style="width: 80px"
                        ></v-text-field>

                        <v-radio-group
                          v-if="pregunta.tipo == 1"
                          v-model="item.respuestas[pregunta.id]"
                          row
                          :rules="[rules.required]"
                          validate-on-blur
                        >
                          <v-radio color="green" label="Si" value="1"></v-radio>
                          <v-radio color="red" label="No" value="0"></v-radio>
                        </v-radio-group>
                      </v-flex>
                    </v-layout>
                    <v-divider></v-divider>
                  </div>
                </v-card>
              </v-tab-item>
              <v-tab-item value="tab-2">
                <v-card>
                  <v-list>
                    <template v-for="servicio in lServicios">
                      <v-list-tile
                        :key="servicio.id"
                        :class="
                          servicio.selected
                            ? 'deep-purple lighten-5 deep-purple--text text--accent-4'
                            : ''
                        "
                      >
                        <v-list-tile-action>
                          <v-checkbox
                            v-if="servicio.estado == 0"
                            v-model="servicio.selected"
                            color="deep-purple accent-4"
                          ></v-checkbox>
                        </v-list-tile-action>

                        <v-list-tile-content>
                          <v-list-tile-title>
                            {{ servicio.name }}
                            <span style="font-size: 10px">
                              {{ servicio.obs }}
                              {{ servicio.estado }}
                            </span>
                          </v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-avatar v-if="servicio.selected">
                          <v-text-field
                            v-model="servicio.cantidad"
                            :disabled="
                              servicio.estado == 0
                                ? servicio.cant
                                  ? false
                                  : true
                                : true
                            "
                            :rules="[
                              rules.required,
                              rules.num,
                              rules.minVal(1),
                            ]"
                            validate-on-blur
                            color="primary"
                            :class="servicio.selectded ? 'secondary' : ''"
                            type="number"
                            min="1"
                            style="
                              font-size: 12px;
                              padding-bottom: 0;
                              padding-top: 12px;
                            "
                          ></v-text-field>
                        </v-list-tile-avatar>
                      </v-list-tile>
                    </template>
                  </v-list>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </template>
        </v-container>
      </mk-form-full-screen>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'
import MkEstadosMix from '@/components/mkComponentes/mixins/MkEstadosMix'
import VWidget from '@/components/VWidget'
import MkSimpleCard from '~/components/mkComponentes/mkCards/mkSimpleCard.vue'
import { TargomoClient } from '@targomo/core'
import {
  getDataLista,
  getDistancia,
  formatDT,
} from '@/components/mkComponentes/lib/MkUtils.js'
import { icon } from 'leaflet'
import Swal from 'sweetalert2'

import {
  getCache,
  setCache,
  getCacheKey,
} from '@/components/mkComponentes/lib/MkCache.js'
import MkFormFullScreen from '~/components/mkComponentes/MkFormFullScreen.vue'

//const _dirty = process.env.mkConfig.dirty

export default {
  middleware: ['authAccess'],
  mixins: [MkModuloMix,MkEstadosMix],
  components: { VWidget, MkSimpleCard, MkFormFullScreen },
  name: 'Recolector',
  disModTable: true,
  data() {
    return {
      urlModulo: 'SolicitudServicios',
      //titModulo: '',
      location: false,
      lRuteos: {
        dispon: {
          ok: 0,
          data: [],
        },
        open: {
          ok: 0,
          data: [],
        },
        closed: {
          ok: 0,
          data: [],
        },
        retrased: {
          ok: 0,
          data: [],
        },
      },
      // lRutas: [],
       estado: false,
      lBeneficiarios: [],
      lServicios: [],
      lCateg: [],
      lPreguntas: [],
      modalMap: false,
      modalEval: false,
      center: [-17.332269, -63.252798],
      zoom: 13,
      coordenadas: {},
      markers: [],
      icon1: icon({
        iconUrl: require('~/static/img/icon1.png'),
        iconSize: [32, 32],
        iconAnchor: [16, 30],
        tooltipAnchor: [16, -22],
      }),
      icon2: icon({
        iconUrl: require('~/static/img/icon2.png'),
        iconSize: [32, 32],
        iconAnchor: [16, 30],
        tooltipAnchor: [16, -22],
      }),
      styleFunction: { color: '#000', weight: 5, opacity: 0.5 },
      jsonData: [],
      jsonLine: [],
      item: { respuestas: {} },
      callBack: false,
      
      lSolicitudServicios: [],
      lDispon: {},
      lAsignada: {},
      lAsignadaD: [],
      lServices: [],
      lUsuarios: [],
      nAceptadas:0,
    }
  },
  methods: {
    
    setClose(id) {
      if (!this.can('edit', true)) {
        return false
      }
      Swal.fire({
        title: 'Desea Cerrar este Ruteo',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'red',
        reverseButtons: true,
        confirmButtonText: 'Si deseo Cerrarlo!',
      }).then((action) => {
        if (!action.value) {
          return false
        }
        let me = this
        let url = 'RuteosMonitor/setClose'
        //me.dataTable.loading = true
        me.$axios
          .post(url + this.getCt(url), {
            id: id,
            lat: this.coordenadas.latitude,
            lng: this.coordenadas.longitude,
          })
          .then(function (response) {
            if (me.isOk(response.data)) {
              me.afterSave(me, 0)
            } else {
              //con error
            }
          })
          .catch(function (error) {
            console.error(error)
          })
          .finally(function () {
            //me.dataTable.loading = false
          })
      })
    },
    getColorEval(ruteo, bene) {
      return !getDataLista(
        ruteo.evaluaciones,
        bene,
        'beneficiarios_id',
        'estado'
      )
        ? 'red'
        : getDataLista(ruteo.evaluaciones, bene, 'beneficiarios_id', 'verif')
        ? 'green'
        : 'yellow'
    },
    openEval(data, bene) {
      if (this.initOnce('openEval')) {
        return false
      }
      if (!this.can('add', true)) {
        return false
      }
      this.getPosition()
      this.item = Object.assign({}, data)
      this.item._noData = 1
      this.item.lat = this.coordenadas.latitude
      this.item.beneficiarios_id = bene
      this.item.lng = this.coordenadas.longitude
      this.item.usuarios_id = this.$store.state.auth.authUser.id
      this.item.ruteos_id = data.id
      this.item.obs = ''
      this.item.id = null
      this.item.estado = 0
      let evaluacion = getDataLista(
        this.item.evaluaciones,
        bene,
        'beneficiarios_id',
        '*'
      )
      this.item.servicios = {}
      this.lServicios.forEach((e) => {
        e.cantidad = 1
        e.selected = false
        e.estado = 0

        if (evaluacion) {
          let existe = getDataLista(
            evaluacion.servicios,
            e.id,
            'servicios_id',
            '*'
          )
          if (existe) {
            e.cantidad = existe.cant
            e.selected = true
            e.estado = existe.estado
            if (existe.estado == 0) {
              this.item.servicios[e.id] = existe.cant
            }
          }
        }
      })

      this.item.respuestas = {}
      this.lPreguntas.forEach((e) => {
        if (evaluacion) {
          this.item.respuestas[e.id] = getDataLista(
            evaluacion.respuestas,
            e.id,
            'preguntas_id',
            'r_s',
            ''
          )
        } else {
          this.item.respuestas[e.id] = ''
        }
      })

      this.dirty.item = null
      if (evaluacion) {
        this.item.id = evaluacion.id
        this.item.estado = 1 * evaluacion.estado
        this.item.obs = evaluacion.obs
        if (this.$config.dirty) {
          this.dirty.item = JSON.parse(JSON.stringify(this.item))
        }
      }
      this.estado = this.item.estado <= 1 ? false : true

      this.$refs.mkFormEval.$refs.form.resetValidation()
      this.tituloModal =
        'Evaluacion de ' + getDataLista(this.lBeneficiarios, bene) //colocar computada de acuerdo al tamano
      if (!this.modalEval) this.modalEval = true
      //this.$nextTick(this.$refs.focus.focus)
    },
    getSubHeader(data) {
      return 'Abierto:' + this.formatDT(data.created_at)
    },
    async getRutasOptimizada(ruta) {
      let store = [
        {
          uuid: 'inicio',
          address: {
            lat: this.coordenadas.latitude,
            lng: this.coordenadas.longitude,
          },
        },
      ]
      let orders = []
      ruta.beneficiarios.forEach((f) => {
        let lat = getDataLista(this.lBeneficiarios, f, 'id', 'lat')
        let lng = getDataLista(this.lBeneficiarios, f, 'id', 'lng')
        if (lat && lng) {
          orders.push({
            uuid: getDataLista(this.lBeneficiarios, f),
            storeUuid: 'inicio',
            priority: 1,
            address: {
              lat: getDataLista(this.lBeneficiarios, f, 'id', 'lat'),
              lng: getDataLista(this.lBeneficiarios, f, 'id', 'lng'),
              avgHandlingTime: 1,
            },
          })
        }
      })

      let cacheKey = 'rutasCached_' + getCacheKey([store, orders])

      let cached = getCache(cacheKey)
      console.log('consultando cacheado:', cacheKey, cached)
      if (cached) {
        this.jsonLine = null
        this.jsonData = cached
        console.log('rutas recuperadas del cache')
        //TODO: aqui otra formula para calcular habra que primero calcular elmas cercano del inicio y de ahi calcular todo de nuevo las distancias espaciales recursivamente hasta tener todo ordenado por distancia espacial..
        // let camino='';
        // ruta.beneficiarios.map(e=>{
        //   camino=camino+getDataLista(this.lBeneficiarios, e,'id','lat')+','+getDataLista(this.lBeneficiarios, e,'id','lng')+'/'
        // })
        // camino='https://www.google.com/maps/dir/'+camino+'/@'+this.coordenadas.latitude+','+this.coordenadas.longitude+',13z/data=!4m2!4m1!3e0'
        // console.log('camino',camino)

        return true
      }

      if (this.$nuxt.isOffline) {
        return false
      }

      const client = new TargomoClient('south_america', 'DF6SNYWF3ENCGQGGWEKU')
      const routingConfig = {
        optimizationAlgorithm: 'GREEDY_TSP',
        optimizationTime: 1,
        stores: store,
        orders: orders,
        transports: [
          {
            vehicle: {
              uuid: 'v1',
              storeUuid: 'inicio',
              priority: 1,
            },
          },
        ],
        optimizationMetadata: {
          geojsonCreation: 'ROUTING_SERVICE',
          travelOptions: {
            travelType: 'car',
            maxEdgeWeight: 1800,
            serviceUrl: 'https://api.targomo.com/south_america/',
            serviceKey: client.serviceKey,
          },
        },
      }

      //TODO: aqui otra formula para calcular habra que primero calcular elmas cercano del inicio y de ahi calcular todo de nuevo las distancias espaciales recursivamente hasta tener todo ordenado por distancia espacial..
      // let camino='';
      // ruta.beneficiarios.map(e=>{
      //   camino=camino+getDataLista(this.lBeneficiarios, e,'id','lat')+','+getDataLista(this.lBeneficiarios, e,'id','lng')+'/'
      // })
      // camino='https://www.google.com/maps/dir/'+camino+'/@'+this.coordenadas.latitude+','+this.coordenadas.longitude+',13z/data=!4m2!4m1!3e0'
      // console.log('camino',camino)

      const url = `https://api.targomo.com/fleetplanner/v1/api/key-auth/optimizations?key=${client.serviceKey}`
      try {
        const data = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(routingConfig),
        })
        const r = await data.json()
        //  console.log(r)

        let dd = [] //assign.Object([],r.tours[0].featureCollection.features)
        r.tours[0].featureCollection.features.forEach((d) => {
          if (d.geometry.type != 'Point') {
            dd.push(d)
          }
        })
        r.tours[0].featureCollection.features = dd
        this.jsonLine = null
        this.jsonData = r.tours[0].featureCollection
        setCache(cacheKey, this.jsonData)
      } catch (error) {
        console.error(error)
      }
    },
    distancia(d) {
      if (!d) {
        return -1
      }
      return getDistancia(
        this.coordenadas.latitude,
        this.coordenadas.longitude,
        d.lat,
        d.lng
      )
    },
    getSolicitudServicios(){
    let user = this.$store.state.auth.authUser.id
    return [
        {
        mod: 'SolicitudServicios',
        datos: {
          modulo: 'mkServicios',
          rel: 1,
          filtros: [['estado', '=', '1']],
        },
        each: (e) => {
          if (e.estado == 1) {
            if (this.lDispon[e.beneficiarios_id]) {
              this.lDispon[e.beneficiarios_id].lista[e.id] = e
            } else {
              this.lDispon[e.beneficiarios_id] = {
                name: this.getDataLista(
                  this.lBeneficiarios,
                  e.beneficiarios_id,
                  'id',
                  'name',
                  'Desconocido'
                ),
                lista: {},
              }
              this.lDispon[e.beneficiarios_id].lista[e.id] = e
            }
          }
        },
      },
      {
        mod: 'SolicitudServicios',
        lista: 'Asignado',
        datos: {
          modulo: 'mkServicios',
          rel: 1,
          filtros: [
            ['estado', '=', '2'],
            ['usuarios_id_2', '=', user],
          ],
        },
        each: (e) => {
          if (e.estado == 2) {
            if (this.lAsignada[e.beneficiarios_id]) {
              this.lAsignada[e.beneficiarios_id].lista[e.id] = e
            } else {
              this.lAsignada[e.beneficiarios_id] = {
                name: this.getDataLista(
                  this.lBeneficiarios,
                  e.beneficiarios_id,
                  'id',
                  'name',
                  'Desconocido'
                ),
                lista: {},
              }
              this.lAsignada[e.beneficiarios_id].lista[e.id] = e
              this.lAsignadaD.push({
                id:e.beneficiarios_id,
                distancia:0
              })
            }
          }
        },
      },
      ]
    },
    async afterSave(me, isError = 0) {
      console.log('aftersve', isError)
      if (isError>-1){
        
      this.lDispon = {}
      this.lAsignada = {}
      //let filtros = [['OR', ['estado', '=', '1'], ['estado', '=', '2']]]s
      let listas = await this.getDatasBackend(this.urlModulo, this.getSolicitudServicios())
      this.nAceptadas=listas.Asignado.length
console.log('entro aftersve', listas)
      //   if (isError != 1) {
      //     me.lRuteos = await this.getListaBackend('RuteosMonitor')
      //   }
      //   if (isError >= 0) {
      //     this.modalEval = false
      //     //modalMap=false;
      //   }
      //   return true
      }
      return true
    },
    afterOpen(accion, data) {
      if (accion != 'add') {
        this.tituloModal = 'Aceptar Solicitudes'
      }
    },
    beforeSave(me) {
      //console.log('id',me.item)
      let servicios = []
      for (const obj in me.lServices) {
        if (me.lServices[obj].selected === true) {
          servicios.push({
            id: me.lServices[obj].id,
            //cant: me.lServices[obj].cantidad,
            sol_id: me.lServices[obj].sol_id,
          })
        }
      }
      me.item.servicios = servicios
      //me.item.estado = (me.item.estado * 1) + 1
      me.item.estado = 2
    },
    aceptarSol(data, id) {
      // if (!this.can('add', true)) {
      //   return false
      // }
      data.id = id
      data.estado = 1
      //this.item = Object.assign({}, data)
      this.openDialog('edit', data)
    },
    realizarSol(data, id) {
      // if (!this.can('add', true)) {
      //   return false
      // }
      console.log('realizarSol',data,id);
      return true
      data.id = id
      data.estado = 1
      //this.item = Object.assign({}, data)
      this.openDialog('edit', data)
    },
    vermapaGoogle() {
      //
    },
    verMapaBene(bene, google = false) {
      this.getPosition()
      let benef = this.getDataLista(this.lBeneficiarios, bene, 'id', '*')
      if (!benef) {
        return false
      }
      if (!google) {
        this.markers = [0, bene]
        this.jsonData = [
          {
            type: 'LineString',
            coordinates: [
              [this.coordenadas.longitude, this.coordenadas.latitude],
              [benef.lng, benef.lat],
            ],
          },
        ]
        //        console.log('mapa',this.markers,this.jsonData,bene,benef);
        this.tituloModal = 'Ubicacion de ' + benef.name
        //this.jsonData = null
        this.modalMap = true
        setTimeout(() => {
          this.initMap()
        }, 300)
      } else {
        let url =
          'https://www.google.com/maps/dir/?api=1&origion=' +
          this.coordenadas.latitude +
          ',' +
          this.coordenadas.longitude +
          '&destination=' +
          benef.lat +
          ',' +
          benef.lng +
          '&dir_action=navigate'
        window.open(url)
      }
    },
    verMapa(data, posAct = false) {
      this.jsonData = []
      this.jsonLine = null
      this.markers = Object.assign([], data.beneficiarios)
      this.getRutasOptimizada(data)
      if (posAct) {
        this.markers.push(0)
      }
      this.item = Object.assign({}, data) //TODO:verificar porque da error al cargar mapa despues cargar evaluacion y volver a cargar mapa en esta sentencia

      this.item.lat = this.coordenadas.latitude
      this.item.lng = this.coordenadas.longitude
      this.item.usuarios_id = this.$store.state.auth.authUser.id
      this.item.rutas_id = data.id
      this.item._noData = 1
      this.item.obs = ''
      this.item.id = null
      this.tituloModal =
        'Mapa Ruteo de ' + getDataLista(this.lRutas, this.item.rutas_id)
      this.modalMap = true
      setTimeout(() => {
        this.initMap()
      }, 300)
    },
    // getDataLista(lista, valor, busco = 'id', devuelvo = 'name') {
    //   return getDataLista(lista, valor, busco, devuelvo)
    // },
    change(e) {
      this.item.usuarios_id = this.lRutas.find((el) => el.id === e).usuarios_id
    },
    getPosition(callBack = false, id = -1) {
      let options = {
        enableHighAccuracy: true,
        timeout: 6000,
        maximumAge: 10,
      }
      this.callBack = callBack
      this.location = id
      navigator.geolocation.getCurrentPosition(
        this.successGps,
        this.errorGps,
        options
      )
    },
    successGps(position) {
      if (
        this.coordenadas.latitude != position.coords.latitude ||
        this.coordenadas.longitude != position.coords.longitude
      ) {
        this.coordenadas = position.coords
        this.item.lat = this.coordenadas.latitude
        this.item.lng = this.coordenadas.longitude
        console.log('Localizado', this.callBack)
        this.lAsignadaD=this.ordBeneficiarios(this.lAsignada)
      }
      if (this.callBack != false) {
        this.callBack(this.location)
      }
      this.location = true
      this.callBack = false
    },
    errorGps(error) {
      this.location = false
      console.warn('ERROR(' + error.code + '): ' + error.message)
    },
    async beforeOpen(accion, data = {}) {
      data._noData = 1
      data.lat = this.coordenadas.latitude
      data.lng = this.coordenadas.longitude
      this.lServices = []
      if (accion == 'add') {
        this.bTitulo = ''
        this.itemData.epsa = ''
        data.estado = -1

        this.lServicios.forEach((e) => {
          this.lServices.push({
            cantidad: 1,
            estado: -1,
            selected: null,
            ...e,
          })
        })
      } else {
        if (data.estado >= 5) {
          return false
        }
        //data.id=1

        this.bTitulo = 'Revisados'
        let lSol = Object.keys(data.lista)
        //console.log('item', data, this.item)
        lSol.forEach((el) => {
          let e = data.lista[el]
          let serv = this.getDataLista(
            this.lServicios,
            e.servicios_id,
            'id',
            '*'
          )

          if (serv) {
            this.lServices.push({
              sol_id: e.id,
              cantidad: e.cant,
              fecha: e.created_at,
              estado: e.estado,
              evaluaciones_id: e.evaluaciones_id,
              selected: null,
              monitor: this.getDataLista(
                this.lUsuarios,
                e.created_by,
                'id',
                'name',
                ''
              ),
              ...serv,
            })
          }
        })

        // this.change(data.beneficiarios_id)
        //data.estado =(data.estado*1);
      }
    },
    getIcon(id) {
      if (id == 0) {
        return this.icon1
      } else {
        return this.icon2
      }
    },
    getMarker(id, item, index) {
      let marker = this.center
      if (id > 0) {
        let lmarker = this.lBeneficiarios.filter((e) => e.id == id)
        if (lmarker.length > 0) {
          marker = [lmarker[0].lat, lmarker[0].lng]
        }
      } else {
        marker = [this.coordenadas.latitude, this.coordenadas.longitude]
      }
      //console.log('marker:',marker,id,item,index);
      if (!item.beneficiarios) {
        return marker
      }

      if (index == item.beneficiarios.length - 1) {
        setTimeout(() => {
          this.fitMapBounds()
        }, 300)
      }
      return marker
    },
    initMap() {
      this.zoom = 13
      this.$refs.mymap.mapObject.invalidateSize().setView(this.center)
      this.fitMapBounds()
    },
    fitMapBounds() {
      let map = this.$refs.mymap.mapObject
      const visibleMarkers = []
      map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
          visibleMarkers.push(layer)
        }
      })

      if (visibleMarkers.length > 0) {
        const markersBounds = L.latLngBounds([visibleMarkers[0].getLatLng()])
        visibleMarkers.forEach((marker) => {
          markersBounds.extend(marker.getLatLng())
        })

        map.flyToBounds(markersBounds, {
          padding: L.point(36, 36),
          animate: true,
        })
      }
    },
    getL(ruta) {
      return false
      const client = new TargomoClient('south_america', 'DF6SNYWF3ENCGQGGWEKU')
      let targets = ruta.beneficiarios.map((el) => {
        let marker = {
          id: el,
          lat: this.coordenadas.latitude,
          lng: this.coordenadas.longitude,
        }
        if (el > 0) {
          let lmarker = this.lBeneficiarios.filter((e) => e.id == el)
          if (lmarker.length > 0) {
            marker = { id: el, lat: lmarker[0].lat, lng: lmarker[0].lng }
          }
          return marker
        }
      })

      let source = {
        id: 0,
        lat: this.coordenadas.latitude,
        lng: this.coordenadas.longitude,
      }
      console.log('targets', targets)
      // The travel options used to determine which routes should be searched for
      const options = {
        travelType: 'car',
        maxEdgeWeight: 900,
        edgeWeight: 'time',
        pathSerializer: 'geojson',
        // yes, "polygon"... this comes from a legacy implementation when polygons were the only service.
        // Will be changing in the future to a more generalized approach.
        polygon: {
          srid: 4326,
        },
      }

      // Requesting routes from the Targomo API.
      client.routes.fetch([source], targets, options).then((result) => {
        console.log('rrrr:', result)
        this.jsonData = result
      })
    },
    async getRutas(ruta) {
      return false
      if (this.$nuxt.isOffline) {
        return false
      }
      //TODO: hacer cache de peticiones
      const client = new TargomoClient('south_america', 'DF6SNYWF3ENCGQGGWEKU')
      const routingConfig = {
        optimizationAlgorithm: 'GREEDY_TSP',
        optimizationTime: 1,
        stores: [
          {
            uuid: 'inicio',
            address: {
              lat: this.coordenadas.latitude,
              lng: this.coordenadas.longitude,
            },
          },
        ],
        orders: ruta.beneficiarios.map((f) => {
          return {
            uuid: getDataLista(this.lBeneficiarios, f),
            storeUuid: 'inicio',
            priority: 1,
            address: {
              lat: getDataLista(this.lBeneficiarios, f, 'id', 'lat'),
              lng: getDataLista(this.lBeneficiarios, f, 'id', 'lng'),
              avgHandlingTime: 1,
            },
          }
        }),
        transports: [
          {
            vehicle: {
              uuid: 'v1',
              storeUuid: 'inicio',
              priority: 1,
            },
          },
        ],
        optimizationMetadata: {
          geojsonCreation: 'ROUTING_SERVICE',
          travelOptions: {
            travelType: 'car',
            maxEdgeWeight: 1800,
            serviceUrl: 'https://api.targomo.com/south_america/',
            serviceKey: client.serviceKey,
          },
        },
      }

      //TODO: aqui otra formula para calcular habra que primero calcular elmas cercano del inicio y de ahi calcular todo de nuevo las distancias espaciales recursivamente hasta tener todo ordenado por distancia espacial..
      // let camino='';
      // ruta.beneficiarios.map(e=>{
      //   camino=camino+getDataLista(this.lBeneficiarios, e,'id','lat')+','+getDataLista(this.lBeneficiarios, e,'id','lng')+'/'
      // })
      // camino='https://www.google.com/maps/dir/'+camino+'/@'+this.coordenadas.latitude+','+this.coordenadas.longitude+',13z/data=!4m2!4m1!3e0'
      // console.log('camino',camino)

      const url = `https://api.targomo.com/fleetplanner/v1/api/key-auth/optimizations?key=${client.serviceKey}`
      try {
        const data = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(routingConfig),
        })
        const r = await data.json()
        //  console.log(r)

        let dd = [] //assign.Object([],r.tours[0].featureCollection.features)
        r.tours[0].featureCollection.features.forEach((d) => {
          if (d.geometry.type != 'Point') {
            dd.push(d)
          }
        })
        r.tours[0].featureCollection.features = dd

        this.jsonData = r.tours[0].featureCollection
      } catch (error) {
        console.error(error)
      }
    },
    ordBeneficiarios(lista) {
      let r=[]
      for (const index in lista) {
        if (Object.hasOwnProperty.call(lista, index)) {
          r.push({id:index,distancia: this.distancia(
              getDataLista(this.lBeneficiarios, index, 'id', '*')
          )})
        }
      }
//      console.log('distancia',lista);
        // lista.forEach((el,index) => {
        //     el.distancia= this.distancia(
        //       getDataLista(this.lBeneficiarios, index, 'id', '*')
        //   )
        // })
        
        r.sort(function (a, b) {
          return a.distancia - b.distancia
        })
      return r
    },
  },
  computed: {
    binding() {
      const binding = {}
      if (this.$vuetify.breakpoint.xs) binding.column = true
      return binding
    },
    lPregCateg: (app) => (categ) => {
      let l = app.lPreguntas.filter((e) => e.categ_id == categ)

      //console.log('categ:', categ, l)
      return l
    },
  },
  watch: {},
  async mounted() {
    setTimeout(() => {
      this.getPosition()
    }, 3000)
    // this.lRuteos = await this.getListaBackend('RuteosMonitor')
    this.lDispon = {}
    this.lAsignada = {}
    
    let listas = await this.getDatasBackend(this.urlModulo, [
      { mod: 'Usuarios', campos: 'id,name' },
      {
        mod: 'Beneficiarios',
        campos: 'id,name,epsa',
        datos: { _customFields: 1 },
      },
      {
        mod: 'Rutas',
        datos: { rel: 1 },
        campos: 'id,name,usuarios_id,descrip',
      },
      {
        mod: 'Categ',
        sort: 'orden',
        datos: { modulo: 'mkPreguntas' },
        campos: 'id,name,orden',
      },
      { mod: 'Preguntas', sort: 'orden' },
      {
        mod: 'Servicios',
        each: (e) => {
          e.cantidad = 1
          e.selected = false
        },
      },
      ...this.getSolicitudServicios()
    ])
    //console.log('lista:',this.lDispon);
    this.nAceptadas=listas.Asignado.length
  },
}
</script>
<style scoped>
</style>
