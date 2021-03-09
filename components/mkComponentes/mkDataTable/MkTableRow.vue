<template>
  <tr @click="isExpanded?datos.expanded = !datos.expanded:null" @dblclick="onEdit(datos.item)">
    <td width="50px" style="padding: 0 12px">
      <v-checkbox
        class="pa-0 pm-0"
        primary
        hide-details
        v-model="datos.selected"
      ></v-checkbox>
    </td>

    <td
      v-if="!$store.state.config.tbl_opts_p && (can('edit') || can('del'))"
      class="text-xs-center pa-0 ma-0"
    >
      <mk-table-actions
        :acciones="acciones"
        :item="datos.item"
        @callAction="callAction"
      ></mk-table-actions>
    </td>
    <template v-for="header in headers">
      <td
        v-if="header.headers && !header.hidden"
        :class="[
          header.align ? 'text-xs-' + header.align : 'text-xs-left ',
          header.lColor ? header.lColor[datos.item[header.value]] : '',
        ]"
        :key="header.value"
        style="padding: 0 12px"
      >
        <!-- {{ header.lista?colLista(header,datos.item[header.value],datos):datos.item[header.value] }} -->
        {{ showItem(header, datos) }}
      </td>
    </template>
    <td class="text-xs-center" style="padding: 0 12px">
      <mk-status
        :status="datos.item.status"
        :id="datos.item.id"
        @onStatus="setStatus"
      ></mk-status>
    </td>
    <td
      v-if="$store.state.config.tbl_opts_p && (can('edit') || can('del'))"
      class="text-xs-center pa-0 ma-0"
    >
      <mk-table-actions
        :acciones="acciones"
        :item="datos.item"
        @callAction="callAction"
      ></mk-table-actions>
    </td>
  </tr>
</template>

<script>
import MkStatus from '@/components/mkComponentes/MkDataTable/MkStatus'
import MkTableActions from '@/components/mkComponentes/MkDataTable/MkTableActions'
export default {
  name: 'mkTableRow',
  components: { MkStatus, MkTableActions },
  props: {
    datos: {
      type: [Array, Object],
      default: [],
    },
    headers: {
      type: [Array, Object],
      default: [],
    },
    acciones: {
      type: [Array, Object],
    },
    isExpanded: {
      type: Boolean,
      default: false,
    },
  },
  inject: ['Auth', 'can'],
  methods: {
    setStatus(id, estado) {
      this.$emit('onStatus', id, estado)
    },
    callAction(opt, item) {
      this.$emit('callAction', opt, item)
    },
    onEdit(item) {
      if (
        this.can('edit') &&
        this.acciones.find((e) => e.id == 'edit').visible
      ) {
        this.$emit('callAction', { id: 'edit', action: 'openDialog' }, item)
      }
    },
    showItem(lista, datos) {
      let id=(lista.value+'.').split('.')
      let valor = datos.item[id[0]]
      for (let i = 1; i < id.length-1; i++) {
        valor = valor[id[i]]
      }
      

      if (lista.type == 'concat') {
        valor=''
        lista.concat.forEach((e,idx)=>{
          if (idx>0) {
            valor=valor+lista.separator;
          }
          valor=valor+this.showItem(this.headers.find(el=>el.value==e),datos)
        })
        return valor
      }
      if (lista.type == 'date') {
        valor = new Date(valor);
        return ("00" +valor.getDate()).slice(-2) + "/" + ("00" +(valor.getMonth() +1)).slice(-2) + "/" + valor.getFullYear()+ " " + valor.getHours()+ ":" + ("00" +valor.getMinutes()).slice(-2)+ ":" + ("00" +valor.getSeconds()).slice(-2);
        //return new Date(valor).toLocaleString().split(',')[0]
      }
      if (lista.type == 'check') {
        if (valor == lista.options[0]) {
          valor = lista.options[1]
        } else {
          valor = lista.options[2]
        }
        return valor
      }
      if (lista.type == 'count') {
        if (lista.fromLista) {
          let campo = lista.fromLista.field || 'name'
          let idJoin = lista.fromLista.join || 'id'
          let l2 = lista.fromLista.lista
          l2 = this.headers.find((e) => e.value == l2) || []
          idJoin = datos.item[idJoin]
          valor = l2.lista.find((el, index) => el[idJoin] == valor)
          if (!valor) {
            return 0
          }
          valor = valor[campo]
        }
        try {
          valor = valor.length
        } catch (error) {
          valor = 0
        }
        return valor
      }

      if (lista.fromList) {
        let campoUnion = lista.listField
        let hijo = this.headers.find((el) => {
          return el.value == lista.fromList
        }).lista
        valor = hijo.find((el) => el.id == datos.item[lista.fromList])[
          campoUnion
        ]
        return valor ? valor.name : ''
      }
      if (lista.lista) {
        valor = lista.lista.find((el, index) =>
          typeof el === 'string' ? index == valor : el.id == valor
        )
        return valor ? (valor.name ? valor.name : valor) : ''
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
    },
  },
  mounted() {
    //console.log('rowmounted')
  },
}
</script>

