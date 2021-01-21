<template>
  <tr @dblclick="onEdit(datos.item)">
    <td width="50px">
      <v-checkbox primary hide-details v-model="datos.selected"></v-checkbox>
    </td>
    <template v-for="header in headers">
      <td
        v-if="header.headers && !header.hidden"
        :class="[header.align?'text-xs-'+header.align:'text-xs-left']"
        :key="header.value"
      >
      <!-- {{ header.lista?colLista(header,datos.item[header.value],datos):datos.item[header.value] }} -->
      {{ showItem(header,datos) }}
      </td>
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
    showItem(lista,datos) {
      //header.lista?colLista(header,datos.item[header.value],datos):datos.item[header.value]
      //let v=datos.item[lista.value]
      let valor = datos.item[lista.value]

      if (lista.type=='check') {
          if (valor==lista.options[0]){
            valor=lista.options[1]
          }else{
            valor=lista.options[2]
          }
          return valor
      }
      if (lista.type=='count') {
            valor=valor.length
          return valor
      }

      try {
        if (lista.fromList) {
          let campoUnion = lista.listField
          let hijo = this.headers.find((el) => {
            return el.value == lista.fromList
          }).lista
          valor = hijo.find((el) => el.id == datos.item[lista.fromList])[campoUnion]
        }
        valor = lista.lista.find((el) => el.id == valor)
        return valor ? valor.name : ''
      } catch (error) {
        //console.error(error);
      }
      return valor
    },
    colLista(lista, v, datos) {
      let valor = null
      //lista.lista= JSON.parse(lista.lista) 
      try {
        //console.log('llego1:', lista.value, v, datos)

        if (lista.fromList) {
          let campoUnion = lista.listField
          let hijo = this.headers.find((el) => {
            //console.log('dentro de hijo', el.value, lista.fromList)
            return el.value == lista.fromList
          }).lista
          //console.log('llego2:', hijo)
          v = hijo.find((el) => el.id == datos.item[lista.fromList])[campoUnion]
        }
        //console.log('llego3:', lista.lista, v)
        valor = lista.lista.find((el) => el.id == v)
      } catch (error) {
        //console.error(error);
      }
      //lista.lista= JSON.stringify(lista.lista) 
      return valor ? valor.name : ''
    }
  },
  mounted() {
    //console.log('rowmounted')
  }
}
</script>

