<template>
  <div>
    <v-toolbar card color="white" class="hidden-print-only">
      <v-btn
        round
        color="primary"
        @click.stop="$emit('callAction', getAction('add', 'topbar'))"
        v-if="can('add') && getAction('add', 'topbar').visible"
      >
        <v-icon>{{ getAction('add', 'topbar').icon }}</v-icon
        >{{ getAction('add', 'topbar').text }}
      </v-btn>
      <v-btn
        v-if="
          sel.length == 1 && can('edit') && getAction('edit', 'topbar').visible
        "
        icon
        fab
        small
        :color="getAction('edit', 'topbar').color"
        @click="$emit('callAction', getAction('edit', 'topbar'), sel[0])"
      >
        <v-icon>{{ getAction('edit', 'topbar').icon }}</v-icon>
      </v-btn>
      <v-btn
        v-if="
          sel.length > 0 && can('del') && getAction('del', 'topbar').visible
        "
        icon
        fab
        :color="getAction('del', 'topbar').color"
        small
        @click.prevent="$emit('callAction', getAction('del', 'topbar'))"
      >
        <v-icon>{{ getAction('del', 'topbar').icon }}</v-icon>
      </v-btn>
      <v-btn
        v-if="
          sel.length > 0 &&
            can('del') &&
            Auth.recycled &&
            getAction('restore', 'recycled').visible
        "
        icon
        fab
        color="green"
        small
        @click.prevent="$emit('callAction', getAction('restore', 'topbar'))"
      >
        <v-icon>{{ getAction('restore', 'topbar').icon }}</v-icon>
      </v-btn>
      <template v-for="opt in acciones.orden ? acciones.orden.lista(acciones) : {}">
        <v-btn
          v-if="
            acciones[opt].visible &&
              acciones[opt].grupos.includes('filtros') &&
              (!acciones[opt].type || acciones[opt].type == 'btn')
          "
          :key="acciones[opt].id"
          :round="!!acciones[opt].text"
          :icon="!acciones[opt].text"
          :fab="!acciones[opt].text"
          small
          :color="acciones[opt].color"
          @click.stop="$emit('callAction', acciones[opt])"
        >
          <v-icon>{{ acciones[opt].icon }}</v-icon
          >{{ acciones[opt].text }}
        </v-btn>
        <div
          v-if="
            acciones[opt].visible &&
              acciones[opt].grupos.includes('filtros') &&
              acciones[opt].type &&
              acciones[opt].type == 'select'
          "
          :key="acciones[opt].id"
          :style="
            acciones[opt].width ? 'width:' + acciones[opt].width : 'width:150px'
          "
        >
          <v-select
            v-model="acciones[opt].value"
            :items="getLista(acciones[opt].lista)"
            item-text="name"
            item-value="id"
            :label="acciones[opt].text"
            @change="$emit('callAction', acciones[opt])"
            hideDetails
          ></v-select>
        </div>
        <div
          v-if="
            acciones[opt].visible &&
              acciones[opt].grupos.includes('filtros') &&
              acciones[opt].type &&
              acciones[opt].type == 'date'
          "
          :key="acciones[opt].id"
          :style="
            acciones[opt].width ? 'width:' + acciones[opt].width : 'width:150px'
          "
        >
          <mk-date hideDetails :key="acciones[opt].id+acciones[opt].value" v-model="acciones[opt].value" :label="acciones[opt].text" @change="$emit('callAction', acciones[opt])">
          </mk-date>
        </div>
      </template>
      <v-spacer></v-spacer>
      <div v-if="busquedas">
        <v-chip v-for="(busqueda, key) in busquedas" :key="key" outline small>
          {{
            typeof headers.find((ele) => ele.value == busqueda.campo) !==
            'undefined'
              ? headers.find((ele) => ele.value == busqueda.campo).text
              : ''
          }}
          (
          {{
            typeof lCond.find((el) => el.value == busqueda.cond) !== 'undefined'
              ? lCond.find((el) => el.value == busqueda.cond).text
              : ''
          }}
          )
          {{
            busqueda && busqueda.lista && busqueda.lista.length > 0
              ? busqueda.lista.find((campo) => campo.id == busqueda.criterio)
                ? busqueda.lista.find((campo) => campo.id == busqueda.criterio)
                    .name
                : busqueda.criterio
              : busqueda.criterio
          }}
          <v-icon
            v-if="key < busquedas.length - 1 && busqueda.union == 'and'"
            right
            color="red"
            >linear_scale</v-icon
          >
          <v-icon
            v-if="key < busquedas.length - 1 && busqueda.union == 'or'"
            right
            color="blue"
            >merge_type</v-icon
          >
        </v-chip>
      </div>
      <mk-busquedas
        v-if="acciones.search ? acciones.search.visible : true"
        :busquedas="busquedas"
        @busqueda:avanzada="onBuscar"
        :campos="headers"
      ></mk-busquedas>

      <v-btn
        v-if="
          can('del', false, 'reciclaje') &&
            getAction('restore', 'topbar').visible
        "
        icon
        fab
        color="blue"
        small
        @click="onRecycled"
        title="Papelera"
      >
        <v-icon v-if="Auth.recycled">undo</v-icon>
        <v-icon v-else>restore_from_trash</v-icon>
      </v-btn>

      <mk-menu-columns
        :items="headers"
        @column:change="onColChange"
      ></mk-menu-columns>
    </v-toolbar>
    <div v-if="busquedas" class="hidden-screen-only">
      <v-chip v-for="(busqueda, key) in busquedas" :key="key" outline small>
        {{
          typeof headers.find((ele) => ele.value == busqueda.campo) !==
          'undefined'
            ? headers.find((ele) => ele.value == busqueda.campo).text
            : ''
        }}
        (
        {{
          typeof lCond.find((el) => el.value == busqueda.cond) !== 'undefined'
            ? lCond.find((el) => el.value == busqueda.cond).text
            : ''
        }}
        )
        {{
          busqueda && busqueda.lista && busqueda.lista.length > 0
            ? busqueda.lista.find((campo) => campo.id == busqueda.criterio)
              ? busqueda.lista.find((campo) => campo.id == busqueda.criterio)
                  .name
              : busqueda.criterio
            : busqueda.criterio
        }}
        <v-icon
          v-if="key < busquedas.length - 1 && busqueda.union == 'and'"
          right
          color="red"
          >linear_scale</v-icon
        >
        <v-icon
          v-if="key < busquedas.length - 1 && busqueda.union == 'or'"
          right
          color="blue"
          >merge_type</v-icon
        >
      </v-chip>
    </div>
  </div>
</template>

<script>
import MkBusquedas from '@/components/mkComponentes/MkDataTable/MkBusquedas'
import MkMenuColumns from '@/components/mkComponentes/MkDataTable/MkMenuColumns'
import MkCondBusquedasMix from '@/components/mkComponentes/mixins/MkCondBusquedasMix'
import MkDate from '@/components/mkComponentes/MkDate'
import MkTime from '@/components/mkComponentes/MkTime'

export default {
  name: 'mkTableHead',
  mixins: [MkCondBusquedasMix],
  components: {
    MkBusquedas,
    MkMenuColumns,
    MkDate,
    MkTime
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
      default: {}
    }
  },
  data() {
    return {
      curPermisos: [],
      lCond: []
    }
  },
  watch: {
    // acciones: {
    //   deep: true,
    //   handler: function(v, old) {
    //     this.$forceUpdate()
    //   }
    // }
  },
  computed: {
    textoBusqueda: () => {}
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
    onColChange(headers, visible = false) {
      this.$emit('column:change', headers, visible)
    },
    getAction(id, grupo = 'action') {
      //let v = this.acciones.find((e) => e.id == id && e.grupos.includes(grupo))
      let v = this.acciones[id]
      if (v && v.grupos.includes(grupo)) {
        return v
      }
      return { visible: false }
    },
    getLista(lista) {
      return [{ id: 0, name: '[[ Todos los Usuarios ]]' }, ...lista]
    }
  },
  mounted() {
    this.lCond = this.condiciones.text.concat(
      this.condiciones.num,
      this.condiciones.date
    )
  }
}
</script>

