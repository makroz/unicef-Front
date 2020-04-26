<template>
  <tr>
    <td
      class="text-xs-left"
      @dblclick="selPermiso()"
    >{{'('+permiso.slug+') '+permiso.name}} {{permiso.valor}}</td>
    <td>
      <v-checkbox
        class="d-inline-flex"
        v-if="permisoGrupos"
        v-model="datosGrupo"
        color="cyan"
        value="1"
        hide-details
        disabled
      ></v-checkbox>
      <v-checkbox class="d-inline-flex" v-model="datos" color="cyan" value="1" hide-details></v-checkbox>
    </td>
    <td>
      <v-checkbox
        class="d-inline-flex"
        v-if="permisoGrupos"
        v-model="datosGrupo"
        color="amber"
        value="2"
        hide-details
        disabled
      ></v-checkbox>
      <v-checkbox class="d-inline-flex" v-model="datos" color="amber" value="2" hide-details></v-checkbox>
    </td>
    <td>
      <v-checkbox
        class="d-inline-flex"
        v-if="permisoGrupos"
        v-model="datosGrupo"
        color="green "
        value="4"
        hide-details
        disabled
      ></v-checkbox>
      <v-checkbox class="d-inline-flex" v-model="datos" color="green" value="4" hide-details></v-checkbox>
    </td>
    <td>
      <v-checkbox
        class="d-inline-flex"
        v-if="permisoGrupos"
        v-model="datosGrupo"
        color="red "
        value="8"
        hide-details
        disabled
      ></v-checkbox>
      <v-checkbox class="d-inline-flex" v-model="datos" color="red" value="8" hide-details></v-checkbox>
    </td>
  </tr>
</template>
<script>
export default {
  name: "mkPermiso",
  props: {
    permiso:{
      type: [Array,Object],
      default: null
    },
    permisoGrupos: {
      type: [Array,Object],
      default: null
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {};
  },
  computed: {
    datos: {
      get: function() {
        let p = [];
        if ((this.permiso.valor & 1) == 1) p.push("1");
        if ((this.permiso.valor & 2) == 2) p.push("2");
        if ((this.permiso.valor & 4) == 4) p.push("4");
        if ((this.permiso.valor & 8) == 8) p.push("8");
        return p;
      },
      set: function(v) {
        let p = 0;
        v.forEach(i => {
          p = p + parseInt(i);
        });
        this.$emit("onChangePermiso", p, this.index);
      }
    },
    datosGrupo: {
      get: function() {
        let p = [];
        if ((this.permisoGrupos.valor & 1) == 1) p.push("1");
        if ((this.permisoGrupos.valor & 2) == 2) p.push("2");
        if ((this.permisoGrupos.valor & 4) == 4) p.push("4");
        if ((this.permisoGrupos.valor & 8) == 8) p.push("8");
        return p;
      },
      set: function(v) {}
    }
  },
  methods: {
    selPermiso() {
      if (this.datos.length == 4) {
        this.datos = [];
      } else {
        this.datos = ["1", "2", "4", "8"];
      }
    }
  }
};
</script>
<style >
.v-input--selection-controls__input {
  margin-right: 0;
}
.v-input--selection-controls {
  margin-top: 0;
}
</style>
