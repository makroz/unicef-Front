<template>
  <tr @dblclick="onEdit(datos.item)">
    <td width="50px">
      <v-checkbox primary hide-details v-model="datos.selected"></v-checkbox>
    </td>
    <slot>
      <td class="text-xs-left">datos</td>
    </slot>
    <td class="text-xs-center">
      <mk-status :status="datos.item.status" :id="datos.item.id" @onStatus="setStatus"></mk-status>
    </td>
    <td class="text-xs-left" v-if="can('edit')||can('del')">
      <v-btn
      v-if="can('edit')"
        depressed
        outline
        icon
        fab
        dark
        color="primary"
        small
        @click="$emit('openDialog','edit', datos.item)"
      >
        <v-icon>edit</v-icon>
      </v-btn>
      <v-btn
      v-if="can('del')"
        depressed
        outline
        icon
        fab
        dark
        color="pink"
        small
        @click="$emit('deleteItem',datos.item.id)"
      >
        <v-icon>delete</v-icon>
      </v-btn>
    </td>
  </tr>
</template>

<script>
import MkStatus from "@/components/mkComponentes/MkStatus";
export default {
  name: "mkTableRow",
  components: { MkStatus },
  props: {
    datos: {}
  },
  inject: ['authAccess','can','proteger'],
  methods: {
    setStatus(id, estado) {
      this.$emit("onStatus", id, estado);
    },
  onEdit(item){
    if (this.can('edit')){
      this.$emit('openDialog','edit', item)
    }
  }

  }
};
</script>

