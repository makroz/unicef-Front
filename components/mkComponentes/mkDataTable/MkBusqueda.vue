<template>
  <div>
    <v-select class="width-min" :items="lcriterio" box label="Campo" v-model="criterio":readonly="accion=='show'" 
></v-select>
    <v-text-field
      flat
      solo
      placeholder="Escriba su busqueda"
      v-model="buscar"
      hide-details
      @change="onBuscar"
      @click:clear="onBuscar"
      clearable
    ></v-text-field>
  </div>
</template>
<script>
export default {
  name: "busqueda",

  props: {
    busquedas: {
      type: Array,
      default: () => [
        {
          campo: "",
          cond: "0",
          criterio: "",
          union: "and",
          items: [],
          type: "text",
          prepend: ""
        }
      ]
    },
    criterios: {
      type: Array,
      default: () => [
        { value: "name", text: "Nombre" },
        { value: "id", text: "Codigo" }
      ]
    },
    criterio: "name",
    buscar: ""
  },
  data() {
    return {
      curBuscar: "",
      oldBuscar: ""
    };
  },
  methods: {
    onBuscar(buscar = true) {
      console.log("Buscando basico....",this.curBuscar);
      if (this.buscar == this.oldBuscar) {
        return false;
      }

      if (buscar == false) {
        this.curBuscar = "";
      }
      this.$emit("busqueda", this.curBuscar);
    }
  },
  mounted() {
    this.curBuscar = this.Buscar;
  }
};
</script>
