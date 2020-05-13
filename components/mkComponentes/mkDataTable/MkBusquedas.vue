<template>
  <div>
    <v-btn v-if="busquedas.length > 0" icon @click.native="onBuscar(true)">
      <v-icon color="red">delete</v-icon>
    </v-btn>
    <v-btn icon @click="open()">
      <v-icon>search</v-icon>
    </v-btn>
    <v-dialog v-model="modal" scrollable persistent max-width="90%">
      <v-card>
        <v-card-title>{{tituloModal}}</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-card v-for="(item, index) in curBusquedas" :key="index" class="d-flex flex-start">

            <v-select
              class="ma-2"
              v-model="item.campo"
              :items="campos"
              densed
              label="Campo"
              @input="onChangeCampo(item)"
            ></v-select>
            <v-select
              class="ma-2"
              v-model="item.cond"
              :items="item.items"
              densed
              :hideDetails="true"
              label="Condicion"
            ></v-select>
            <v-select
              v-if="(item.lista)&&(item.lista.length>0)"
              class="ma-2"
              v-model="item.criterio"
              :items="item.lista"
              item-text="name"
              item-value="id"
              densed
              :hideDetails="true"
              label="Criterio"
            ></v-select>

            <v-text-field
              v-else
              class="ma-2"
              densed
              label="Criterio"
              v-model="item.criterio"
              validate-on-blur
              :type="item.type"
              :readonly="item.readonly"
              :prepend-icon="item.prepend"
              @click:prepend="onPrepend(item)"
            ></v-text-field>

            <v-btn
              icon
              fab
              dark
              color="primary"
              small
              @click="add()"
              class="width-icon"
              v-if="index == curBusquedas.length - 1"
            >
              <v-icon>add</v-icon>
            </v-btn>
            <v-select
              class="ma-2 width-min"
              v-model="item.union"
              :items="uniones"
              densed
              :hideDetails="true"
              label="Union"
              v-if="index != curBusquedas.length - 1"
            ></v-select>

            <v-btn
              icon
              fab
              dark
              color="red"
              small
              @click="del(index)"
              class="width-icon"
              v-if="index > 0"
            >
              <v-icon>delete</v-icon>
            </v-btn>
          </v-card>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="red darken-1" flat @click="onBuscar(true)">Quitar Busqueda</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="modal = false">volver</v-btn>
          <v-btn color="green darken-1" flat @click="onBuscar()">Buscar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog ref="dialogDate" v-model="modalDate" persistent lazy full-width width="290px">
      <v-date-picker v-model="dateSearch" scrollable>
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="modalDate = false">Cancel</v-btn>
        <v-btn flat color="primary" @click="saveDate">OK</v-btn>
      </v-date-picker>
    </v-dialog>
  </div>
</template>
<script>
import MkCondBusquedasMix from '@/components/mkComponentes/mixins/MkCondBusquedasMix'
export default {
  mixins: [MkCondBusquedasMix],
  name: 'busquedas',

  props: {
    busquedas: {
      type: Array,
      default: () => [
        {
          campo: '',
          cond: '0',
          criterio: '',
          union: 'and',
          items: [],
          lista: false,
          type: 'text',
          prepend: ''
        }
      ]
    },
    campos: {
      type: Array,
      default: () => [{ value: 'name', text: 'Nombre', type: 'text' }] //type: date/num/text
    }
  },
  data() {
    return {
      modal: false,
      dateSearch: new Date().toISOString().substr(0, 10),
      modalDate: false,
      itemDate: null,
      tituloModal: 'Busqueda Avanzada',
      lCriterios: false,
      uniones: [
        { value: 'and', text: 'y' },
        { value: 'or', text: 'o' }
      ],
      curBusquedas: [],
      mask: {
        text: '',
        num: '#'
      }
    }
  },
  methods: {
    saveDate() {
      this.$refs.dialogDate.save(this.dateSearch)
      this.itemDate.criterio = this.dateSearch
    },
    onPrepend(item) {
      this.dateSearch = item.criterio
      this.modalDate = true
      this.itemDate = item
    },
    del(index) {
      this.curBusquedas.splice(index, 1)
    },
    add() {
      this.curBusquedas.push({
        campo: '',
        cond: '1',
        criterio: '',
        union: 'and',
        items: [],
        lista: false
      })
    },
    onBuscar(quitarbuscar = false) {
      //console.log("Buscando....");
      if (quitarbuscar) {
        this.curBusquedas = []
      }
      this.curBusquedas = this.curBusquedas.filter((e) => e.criterio != '')
      this.$emit(
        'busqueda:avanzada',
        this.curBusquedas,
        quitarbuscar
      )
      this.modal = false
    },
    onChangeCampo(item) {
      if (item) {
        const campo = this.campos.find((campo) => campo.value === item.campo)
        const tipo = campo.type
        //console.log('change campo:',tipo, this.condiciones,this.condiciones[tipo],)
        item.items = this.condiciones[tipo]
        item.readonly = false
        item.prepend = ''
        switch (tipo) {
          case 'date':
            item.criterio = ''
            item.type = 'text'
            item.readonly = true
            item.prepend = 'event'
            break
          case 'num':
            if (!isNaN(item.criterio)) {
              item.criterio = ''
            }
            item.type = 'number'

            break
          default:
            item.type = 'text'

            break
        }
        //console.log('changeCampos',campo)
        if (campo.lista) {
          item.lista = campo.lista
          item.items = this.condiciones['lista']
        } else {
          item.lista = false
        }
      }
    },
    open(reload = true) {
      if (reload) {
        if (this.busquedas.length == 0) {
          this.curBusquedas = [
            {
              campo: '',
              cond: '1',
              criterio: '',
              union: 'and',
              items: [],
              type: 'text',
              prepend: ''
            }
          ]
        } else {
          this.curBusquedas = Object.assign([], this.busquedas)
        }
      }
      this.modal = true
    }
  }
}
</script>
<style>
.width-min {
  flex: 0 0 5% !important;
}
.width-icon {
  flex: 0 0 38px !important;
}
</style>
