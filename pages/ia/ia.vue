<template>
  <div id="pageTable">
    <div class="pa-2">
      <mk-head :titulo="titModulo"></mk-head>
    </div>
    <v-container grid-list-md fluid v-if="lDatos.tablas && !lTabla.name" pa-1>
      <h4 class="mb-2 font-weight-black">
        Bienvenidos al IA CRUD - Seleccione la Tabla a Trabajar
      </h4>
      <v-layout align-center justify-center row fill-height wrap>
        <v-flex shrink v-for="tabla in lDatos.tablas.data" :key="tabla.name">
          <v-widget :title="tabla.name">
            <template slot="widget-header-action" slot-scope="props">
              <v-btn icon color="green" @click="selTabla(tabla)">
                <v-icon>check</v-icon>
              </v-btn>
            </template>
            Campos: {{ tabla.cols.length }}
          </v-widget>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container grid-list-md fluid v-if="lTabla.name" pa-1>
      <h4 class="mb-2 font-weight-black">
        Trabajando con {{ lTabla.name.toUpperCase() }}
      </h4>
      <v-btn icon color="red" @click="procesar()">
        <v-icon>settings</v-icon>
      </v-btn>
      <v-layout align-center justify-center row fill-height wrap>
        <v-flex>
          <v-select
            v-model="lTabla.moduloB"
            :items="lDatos.modulos.data"
            label="Modulo BackEnd"
          ></v-select>
        </v-flex>
        <v-flex>
          <v-select
            v-model="lTabla.moduloF"
            :items="lDatos.modulosFront.data"
            label="Modulo FrontEnd"
          ></v-select>
        </v-flex>
        <v-flex md-4>
          <v-text-field label="Id Modulo" v-model="lTabla.nameMod">
          </v-text-field>
        </v-flex>
        <v-flex md-4>
          <v-text-field v-model="lTabla.titMod" label="Titulo del Modulo">
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout align-center justify-center row fill-height wrap>
        <v-flex
          xs-12
          md-6
          lg-4
          v-for="col in lTabla.cols"
          :key="col.COLUMN_NAME"
        >
          <v-widget
            :title="col.COLUMN_NAME"
            :color="col.list ? (col.form ? 'primary' : 'green') : 'grey'"
          >
            <template slot="widget-header-action" slot-scope="props">
              <v-btn icon color="green" @click="selCol(col)">
                <v-icon>settings</v-icon>
              </v-btn>
            </template>
            Tipo: {{ col.COLUMN_TYPE }} <br />
            Extra: {{ col.EXTRA }} <br />
            Nulo?: {{ col.IS_NULLABLE }} <br />
            Indice: {{ col.COLUMN_KEY }} <br />
            <v-divider></v-divider>
            Label listado: {{ col.list ? col.lList : false }}<br />
            Label Formulario: {{ col.form ? col.lForm : false }}<br />
          </v-widget>
        </v-flex>
      </v-layout>
    </v-container>

    <mk-form
      ref="mkForm"
      :modal="modal"
      :tit="tituloModal"
      :accion="accion"
      @closeDialog="closeDialog"
      @grabarItem="grabarSetting"
    >
      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <v-flex md-2>
            <v-checkbox v-model="item.list" label="Listado"></v-checkbox>
          </v-flex>
          <v-flex md-4>
            <v-text-field
              v-show="item.list"
              label="Label Listado"
              v-model="item.lList"
            >
            </v-text-field>
          </v-flex>
          <v-flex md-2>
            <v-checkbox v-model="item.form" label="Formulario"></v-checkbox>
          </v-flex>
          <v-flex md-4>
            <v-text-field
              v-show="item.form"
              label="Label Formulario"
              v-model="item.lForm"
            >
            </v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex md-6>
            <v-select
              v-model="item.rulesF"
              :items="lRulesF"
              item-text="text"
              item-value="value"
              label="Validaciones Front"
              multiple
              chips
            ></v-select>
          </v-flex>
          <v-flex md-6>
            <v-select
              v-model="item.rulesB"
              :items="lRulesB"
              item-text="text"
              item-value="value"
              label="Validaciones Back"
              multiple
              chips
            ></v-select>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex md-3>
            <v-checkbox v-model="item.search" label="Busqueda?"></v-checkbox>
          </v-flex>
          <v-flex md-6>
            <v-select
              v-show="item.list || item.form"
              v-model="item.align"
              :items="lAlign"
              item-text="text"
              item-value="value"
              label="Alineacion"
            ></v-select>
          </v-flex>
          <v-flex md-3>
            <v-text-field
              v-show="item.list"
              label="Ancho en la Lista"
              v-model="item.ancho"
            >
            </v-text-field>
          </v-flex>
          <v-flex md-6>
            <v-select
              v-model="item.typeF"
              :items="lTypeF"
              item-text="text"
              item-value="value"
              label="Tipo de Campo en Formulario"
            ></v-select>
          </v-flex>
        </v-layout>
        <v-layout row wrap v-if="item.typeF=='selDB'">
          <v-flex md-6>
            <v-select
              v-model="item.relTable"
              item-text="name"
              item-value="name"
              :items="lDatos.tablas.data"
              label="Tabla Relacionada"
            ></v-select>
          </v-flex>
          <v-flex md-6>
            <v-select
              v-model="item.relField"
              item-text="COLUMN_NAME"
              item-value="COLUMN_NAME"
              :items="getRelFields()"
              label="Campo a Mostrar"
            ></v-select>
          </v-flex>
        </v-layout>
      </v-container>
    </mk-form>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'
import VWidget from '@/components/VWidget'
import Swal from 'sweetalert2'
import {
  c,
  getDataLista,
  getTitFromName,
  getFirstUpperCase,
} from '@/components/mkComponentes/lib/MkUtils.js'

export default {
  middleware: ['authAccess'],
  mixins: [MkModuloMix],
  components: { VWidget },
  name: 'IA',
  data() {
    return {
      tabs: 0,
      lDatos: [],
      lTabla: {},
      itemAct: {},
      lRulesFront: {
        global: [
          { text: 'Ninguna', value: '-1' },
          { text: 'Requerido', value: 'required' },
        ],
        int: [
          { text: 'Numerico', value: 'num' },
          { text: 'Maximo', value: 'max' },
          { text: 'Minimo', value: 'min' },
        ],
      },
      lRulesBack: {
        global: [
          { text: 'Ninguna', value: '-1' },
          { text: 'Requerido', value: 'required' },
        ],
        int: [
          { text: 'Numerico', value: 'num' },
          { text: 'Maximo', value: 'max' },
          { text: 'Minimo', value: 'min' },
        ],

        status: [{ text: 'Status', value: 'status' }],
      },
      lRulesF: [],
      lRulesB: [],
      lAlign: [
        { text: 'ninguna', value: '-1' },
        { text: 'Derecha', value: 'r' },
        { text: 'Izquierda', value: 'l' },
        { text: 'Centro', value: 'c' },
      ],
      lTypeF: [
        { text: 'Texto', value: 'text' },
        { text: 'Numero', value: 'num' },
        { text: 'Numero Decimal', value: 'dec' },
        { text: 'Seleccion', value: 'sel' },
        { text: 'Seleccion Multiple', value: 'selMul' },
        { text: 'Seleccion DB', value: 'selDB' },
        { text: 'Seleccion DB Multiple', value: 'selDBMul' },
        { text: 'Check', value: 'check' },
        { text: 'Radio', value: 'radio' },
      ],
    }
  },
  methods: {
      getRelFields(){
          console.log('relField:',this.item.relTable);
          return getDataLista(this.lDatos.tablas.data, this.item.relTable, 'name', 'cols', [])
      },
    addRules(regla, reglas) {
      if (reglas.indexOf(regla) == -1) {
        reglas.push(regla)
      }
      return reglas
    },
    selTabla(tabla) {
      this.lTabla = tabla
      this.lTabla.nameMod = this.lTabla.name
      this.lTabla.titMod = getFirstUpperCase(getTitFromName(this.lTabla.name))
      this.lTabla.cols.forEach((c) => {
        if (!c.lList || c.lList == '') {
          c.lList = getFirstUpperCase(c.COLUMN_NAME)
        }

        if (!c.lForm || c.lForm == '') {
          c.lForm = '' + c.lList
        }
        c.form = true
        c.list = true
        c.rules = true
        c.align = '-1'
        c.rulesF = []
        c.rulesB = []
        c.typeF = 'text'
        if (
          ['created_at', 'updated_at', 'deleted_at'].indexOf(c.COLUMN_NAME) > -1
        ) {
          c.form = false
          c.list = false
          c.rulesF = ['ninguna']
          c.rulesB = ['ninguna']
        }
        if (['id', 'status'].indexOf(c.COLUMN_NAME) > -1) {
          c.form = false
          c.rulesF = ['ninguna']
          if (c.COLUMN_NAME == 'id') {
            c.rulesB = ['required']
            c.ancho = '100px'
          }
          if (c.COLUMN_NAME == 'status') {
            c.rulesB = ['status']
          }
        }
        //c.lList=c.DATA_TYPE
        if (['int', 'tinyint'].indexOf(c.DATA_TYPE) > -1) {
          this.addRules('num', c.rulesF)
          this.addRules('num', c.rulesB)

          c.typeF = 'num'
          c.typeB = 'num'
          c.align = 'r'
        }
        if (['char', 'varchar'].indexOf(c.DATA_TYPE) > -1) {
          c.typeF = 'text'
          c.align = 'l'
        }
       
        if (c.list || c.form) {
          c.search = true
        }

        if (c.IS_NULLABLE == 'NO') {
          this.addRules('required', c.rulesF)
          this.addRules('required', c.rulesB)
          //   if (c.rulesF.indexOf('required')==-1){
          //       c.rulesF.push('required')
          //   }
          //   if (c.rulesB.indexOf('required')==-1){
          //       c.rulesB.push('required')
          //   }
        }

        if (c.COLUMN_NAME == 'name') {
          c.lList = 'Nombre'
          c.lForm = 'Nombre'
        }

        if (c.COLUMN_NAME.includes('_id')) {
          c.lList = getFirstUpperCase(c.COLUMN_NAME.replace('_id',''))
          c.lForm = c.lList
        }

        if (c.COLUMN_KEY == 'MUL') {
          c.typeF = 'selDB'
          c.relTable=getDataLista(this.lTabla.rels, c.COLUMN_NAME, 'COLUMN_NAME', 'REFERENCED_TABLE_NAME')
          c.relField='name'
          c.align = 'l'
        }

      })
    },
    selCol(col) {
      this.itemAct = col
      this.item = Object.assign({}, col)

      if (this.lRulesFront[col.COLUMN_NAME]) {
        this.lRulesF = this.lRulesFront[col.COLUMN_NAME]
      }

      if (this.lRulesBack[col.COLUMN_NAME]) {
        this.lRulesB = this.lRulesBack[col.COLUMN_NAME]
      }

      this.lRulesF = this.lRulesF.concat(this.lRulesFront.global)
      this.lRulesB = this.lRulesB.concat(this.lRulesBack.global)

      if (['int', 'tinyint'].indexOf(col.DATA_TYPE) > -1) {
        this.lRulesF = this.lRulesF.concat(this.lRulesFront.int)
        this.lRulesB = this.lRulesB.concat(this.lRulesBack.int)
      }

      if (c.typeF == 'selDB'){

      }

      this.tituloModal = 'Configurar Campo: ' + col.COLUMN_NAME
      this.modal = true
    },
    grabarSetting() {
      //this.item=col
      for (const el in this.item) {
        if (this.item[el] !== undefined) {
          this.itemAct[el] = this.item[el]
        }
      }
      this.modal = false
    },
    async procesar() {
      let respuesta = await this.getDataBackend(
        'IA',
        '*',
        { tabla: this.lTabla },
        'post'
      )
      console.log('Respuesta:', respuesta)
    },
  },

  async mounted() {
    this.lDatos = await this.getDataBackend('IA', '*')
  },
}
</script>
<style scoped></style>
