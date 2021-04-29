<template>
  <tr @click="isExpanded?datos.expanded = !datos.expanded:null" @dblclick="onEdit(datos.item)">
    <td  style="padding: 0 0 0 12px">
      <v-checkbox
        v-if="rowVisible(acciones.find((e) => e.id == 'sel'),datos.item)"
        pa-0 ma-0
        primary
        hide-details
        v-model="datos.selected"
      ></v-checkbox>
    </td>

    <td
      v-if="!$store.state.config.tbl_opts_p "
      class="text-xs-center pa-0 ma-0" 
    >
      <mk-table-actions
        :acciones="acciones"
        :item="datos.item"
        @callAction="callAction"
      ></mk-table-actions>
    </td>
    <template v-for="(header, index) in headers">
      <td
        v-if="header.headers && !header.hidden"
        :class="[
          header.align ? 'text-xs-' + header.align : 'text-xs-left ',
          header.lColor ? header.lColor[datos.item[header.value]?datos.item[header.value]:0] : '',
          getClass(header,datos.item),
          getClassItem(header,datos.item),
        ]"
        :key="header.value"
        style="padding: 0 12px"
      >
        <!-- {{ header.lista?colLista(header,datos.item[header.value],datos):datos.item[header.value] }} -->
        {{ showItem(header, datos,index) }}
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
import { formatDT, } from '@/components/mkComponentes/lib/MkUtils.js'
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
    getClassItem(item,datos) {
      if (typeof item.class === 'function') {
        return  item.class(item,datos)
      }
      if (typeof item.class === 'string') {
        return item.class
      }
      return ''
    },

    getClass(item,datos) {
      const opt=this.acciones.find((e) => e.id == 'class')
      let r = ''
      if (typeof opt.setClass === 'function') {
        r = opt.setClass(item,datos)
      }
      return r
    },
    rowVisible(opt, item) {
      let r = true
      if (typeof opt.visibleRow === 'function') {
        r = opt.visibleRow(item)
      }
      r = this.can(opt.id) && opt.visible && r
      return r
    },
    onEdit(item) {
      let opt=this.acciones.find((e) => e.id == 'edit')
     
      if (!opt.dblClic){
        return false
      }
      if (this.rowVisible(opt,item)) {
        this.$emit('callAction', { id: 'edit', action: 'openDialog' }, item)
      }
    },
    showItem(lista, datos,index) {
      let id=(lista.value+'.').split('.')
      let valor = datos.item[id[0]]

      //console.log('showitem:',lista,datos,id,valor);
      for (let i = 1; i < id.length-1; i++) {
        try {
          valor = valor[id[i]]  
        } catch (error) {
          valor='n/d'
        }
        
      }

      if (typeof lista.showItem === 'function') {
        lista.showItem(valor,lista,datos,index)
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
        return formatDT(valor,false)
        //valor = new Date(valor);
        //return ("00" +valor.getDate()).slice(-2) + "/" + ("00" +(valor.getMonth() +1)).slice(-2) + "/" + valor.getFullYear();
      }

      if (lista.type == 'datetime') {
        return formatDT(valor,true)
        // valor = new Date(valor);
        // return ("00" +valor.getDate()).slice(-2) + "/" + ("00" +(valor.getMonth() +1)).slice(-2) + "/" + valor.getFullYear()+ " " + valor.getHours()+ ":" + ("00" +valor.getMinutes()).slice(-2)+ ":" + ("00" +valor.getSeconds()).slice(-2);
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
    // colLista(lista, v, datos) {
    //   let valor = null
    //   try {
    //     if (lista.fromList) {
    //       let campoUnion = lista.listField
    //       let hijo = this.headers.find((el) => {
    //         return el.value == lista.fromList
    //       }).lista
    //       v = hijo.find((el) => el.id == datos.item[lista.fromList])[campoUnion]
    //     }
    //     valor = lista.lista.find((el) => el.id == v)
    //   } catch (error) {
    //   }
    //   return valor ? valor.name : ''
    // },
  },
  mounted() {
    //console.log('rowmounted')
  },
}
</script>

