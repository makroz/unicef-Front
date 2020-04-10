<template>
  <div>
    <table width="100%" class="tabla_permisos">
      <tr class="success white--text">
        <th>
          <h4>Permisos</h4>
        </th>
        <th width="70px" @dblclick="selPermisos(1)">Ver</th>
        <th width="70px" @dblclick="selPermisos(2)">Modificar</th>
        <th width="70px" @dblclick="selPermisos(4)">Crear</th>
        <th width="70px" @dblclick="selPermisos(8)">Eliminar</th>
      </tr>
      <mk-permiso
        v-for="(permiso, index) in permisos"
        :permisoGrupos="permisoGrupos?permisoGrupos[index]:null"
        :key="index"
        :permiso="permiso"
        :index="index"
        @onChangePermiso="onChangePermiso"
        class
      ></mk-permiso>
    </table>
  </div>
</template>

<script>
import MkPermiso from "@/components/mkComponentes/mkPermisos/MkPermiso";
export default {
  name: "mkPermisos",
  components: {
    MkPermiso
  },
  props: {
    permisos: null,
    permisoGrupos: null
  },
  data() {
    return {
      curPermisos: []
    };
  },
  computed: {},
  methods: {
    selPermisos(permiso) {
      this.curPermisos = Object.assign([], this.permisos);
      const sel = (this.curPermisos[0].valor & permiso) == permiso;
      this.curPermisos.forEach(element => {
        if (!sel) {
          element.valor = element.valor | permiso;
        } else {
          element.valor = (element.valor | permiso) ^ permiso;
        }
      });
      this.$emit("onChangePermisos", this.curPermisos);
    },
    onChangePermiso(permiso, id = -1) {
      if (id > -1) {
        this.curPermisos = Object.assign([], this.permisos);
        this.curPermisos[id].valor = permiso;
        this.$emit("onChangePermisos", this.curPermisos);
      }
    }
  }
};
</script>
<style >
table.tabla_permisos th {
  border: 0;
  padding: 0 10px 0 10px;
  text-align: left;
}
table.tabla_permisos td {
  border: 0;
  font-weight: bold;
}
</style>
