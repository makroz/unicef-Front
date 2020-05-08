<template>
  <tr @dblclick="onEdit(datos.item)">
    <td width="50px">
      <v-checkbox primary hide-details v-model="datos.selected"></v-checkbox>
    </td>
    <template v-for="header in headers">
      <td
        v-if="(!header.hidden)&&(header.noRow!==true)"
        :class="[header.align?'text-xs-'+header.align:'text-xs-left']"
        :key="header.value"
      >{{ header.lista?colLista(header.lista,datos.item[header.value]):datos.item[header.value] }}</td>
      <!-- <td v-if="(!header.hidden)&&(header.noRow!=true)" :class="['text-xs-'+header.align]" :key="header.value" >{{ header.lista }}</td> -->
    </template>
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
      <v-btn
        v-if="Auth.recycled"
        depressed
        outline
        icon
        fab
        dark
        color="green"
        small
        @click="$emit('deleteItem',datos.item.id,true)"
      >
        <v-icon>restore</v-icon>
      </v-btn>
    </td>
  </tr>
</template>

<script>
import MkStatus from '@/components/mkComponentes/MkDataTable/MkStatus'
export default {
  name: 'mkTableRow',
  components: { MkStatus },
  props: {
    datos: {
      type: [Array, Object],
      default: []
    },
    headers: {
      type: [Array, Object],
      default: []
    }
  },
  inject: ['Auth', 'can'],
  methods: {
    setStatus(id, estado) {
      this.$emit('onStatus', id, estado)
    },
    onEdit(item) {
      if (this.can('edit')) {
        this.$emit('openDialog', 'edit', item)
      }
    },
    colLista(lista, v) {
      //console.log('llego1:',lista,v)
      let valor = lista.find((el) => el.id == v)
      return valor ? valor.name : ''
    }
  },
  mounted() {
    //console.log('rowmounted')
  }
}
</script>

