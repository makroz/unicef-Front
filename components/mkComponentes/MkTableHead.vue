<template>
  <v-toolbar card color="white">
    <v-btn round color="primary" @click="$emit('openDialog','add')">
      <v-icon>add</v-icon>Adicionar
    </v-btn>
    <v-btn
      v-if="sel.length == 1"
      icon
      fab
      small
      color="yellow"
      @click="$emit('openDialog','edit', sel[0])"
    >
      <v-icon>edit</v-icon>
    </v-btn>
    <v-btn v-if="(sel.length > 0)" icon fab color="red" small @click="$emit('deleteItem')">
      <v-icon>delete</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <div>
      <v-chip v-for="(busqueda, key) in busquedas" :key="key" outline small>
        {{(typeof(campos.find(ele=> ele.value==busqueda.campo))!=='undefined')?(campos.find(ele=> ele.value==busqueda.campo)).text:''}}
        (
        {{( typeof(lCond.find(el=> el.value==busqueda.cond))!=='undefined')?(lCond.find(el=> el.value==busqueda.cond)).text:''}}
        ) {{busqueda.criterio}}
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
    <mk-busquedas :busquedas="busquedas" @busqueda:avanzada="onBuscar" :campos="campos"></mk-busquedas>
  </v-toolbar>
</template>

<script>
import MkBusquedas from "@/components/mkComponentes/MkBusquedas";
export default {
  name: "mkTableHead",
  components: {
    MkBusquedas
  },
  props: {
    sel: null,
    busquedas: null,
    campos: null
  },
  data() {
    return {
      curPermisos: [],
      lCond: []
    };
  },
  computed: {},
  methods: {
    onBuscar(datos, quitarbusqueda = false, lCond = []) {
      this.lCond = lCond;
      this.$emit("busqueda:avanzada", datos, quitarbusqueda);
    }
  }
};
</script>

