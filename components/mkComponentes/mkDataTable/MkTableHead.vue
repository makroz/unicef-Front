<template>
  <v-toolbar card color="white">
    <v-btn round color="primary" @click.stop="$emit('callAction',getAction('add','topbar'))" v-if="can('add') && getAction('add','topbar').visible">
      <v-icon>{{getAction('add','topbar').icon}}</v-icon>{{getAction('add','topbar').text}}
    </v-btn>
    <v-btn
      v-if="(sel.length == 1) && can('edit') && getAction('edit','topbar').visible"
      icon
      fab
      small
      color="yellow"
      @click="$emit('callAction',getAction('edit','topbar'),sel[0])"
    >
      <v-icon>edit</v-icon>
    </v-btn>
    <v-btn
      v-if="(sel.length > 0)&&can('del')&&(getAction('del','topbar').visible)"
      icon
      fab
      color="red"
      small
      @click.prevent="$emit('callAction',getAction('del','topbar'))"
    >
      <v-icon>delete</v-icon>
    </v-btn>
    <v-btn
      v-if="(sel.length > 0)&&can('del')&&(Auth.recycled)&&(getAction('restore','recycled').visible)"
      icon
      fab
      color="green"
      small
      @click.prevent="$emit('callAction',getAction('restore','topbar'))"
    >
      <v-icon>restore</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
        <div v-if="busquedas">
      <v-chip v-for="(busqueda, key) in busquedas" :key="key" outline small>
        {{(typeof(headers.find(ele=> ele.value==busqueda.campo))!=='undefined')?(headers.find(ele=> ele.value==busqueda.campo)).text:''}}
        (
        {{( typeof(lCond.find(el=> el.value==busqueda.cond))!=='undefined')?(lCond.find(el=> el.value==busqueda.cond)).text:''}}
        ) {{ ((busqueda)&&(busqueda.lista)&&(busqueda.lista.length>0))?busqueda.lista.find(campo => campo.id === busqueda.criterio)?busqueda.lista.find(campo => campo.id === busqueda.criterio).name:busqueda.criterio:busqueda.criterio}}
        <v-icon
          v-if="(key < busquedas.length-1) && (busqueda.union=='and')"
          right
          color="red"
        >linear_scale</v-icon>
        <v-icon
          v-if="(key < busquedas.length-1) && (busqueda.union=='or')"
          right
          color="blue"
        >merge_type</v-icon>
      </v-chip>
    </div>
    <mk-busquedas :busquedas="busquedas" @busqueda:avanzada="onBuscar" :campos="headers"></mk-busquedas>

    <v-btn 
     v-if="can('del')&&(getAction('restore','topbar').visible)"
    icon fab color="blue" small @click="onRecycled" title="Papelera" >
      <v-icon v-if="Auth.recycled">undo</v-icon>
      <v-icon v-else>restore_from_trash</v-icon>
    </v-btn>

    <mk-menu-columns :items="headers" @column:change="onColChange"></mk-menu-columns>
  </v-toolbar>
</template>

<script>
import MkBusquedas from '@/components/mkComponentes/MkDataTable/MkBusquedas'
import MkMenuColumns from '@/components/mkComponentes/MkDataTable/MkMenuColumns'
import MkCondBusquedasMix from '@/components/mkComponentes/mixins/MkCondBusquedasMix'
export default {
  name: 'mkTableHead',
  mixins:[MkCondBusquedasMix],
  components: {
    MkBusquedas,
    MkMenuColumns
  },
  props: {
    sel: {
      type: [String, Array, Object],
      default: null
    },
    busquedas: {
      type: [Array, Object],
      default: null
    },
    headers: {
      type: [Array, Object],
      default: null
    },
    acciones: {
      type: [Array, Object],
      default: null
    }
  },
  data() {
    return {
      curPermisos: [],
      lCond:[],
    }
  },
  computed: {
    textoBusqueda:()=>{

    }
  },
  inject: ['can', 'Auth'],
  methods: {
    onRecycled() {
      this.Auth.recycled = !this.Auth.recycled
      this.Auth._updateData('recycled', this.Auth.recycled)
    },
    onBuscar(datos, quitarbusqueda = false) {
      this.$emit('busqueda:avanzada', datos, quitarbusqueda)
    },
    onColChange(headers,visible=false) {
      this.$emit('column:change', headers,visible)
    },
    getAction(id,grupo='action'){
      let v =this.acciones.find(e=>(e.id==id && e.grupos.includes(grupo)))
      if (!v){
        v={visible:false}
      }
      return v;
    },
  },
  mounted() {
    this.lCond=this.condiciones.text.concat(
          this.condiciones.num,
          this.condiciones.date
        )
  },
}
</script>

