<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <mk-head :titulo="titModulo"></mk-head>
        <v-flex lg12>
          <mk-data-table
            v-bind="dataTable"
            :campos="campos"
            @openDialog="openDialog"
            @deleteItem="deleteItem"
            @setStatus="setStatus"
            @listar="listar"
            @onPerPageChange="onPerPageChange"
            @column:change="onColChange"
            @onBuscar="onBuscar"
          ></mk-data-table>
        </v-flex>
      </v-layout>

      <mk-form
        ref="mkForm"
        :modal="modal"
        :tit="tituloModal"
        :accion="item.id"
        @closeDialog="closeDialog"
        @grabarItem="grabarItem"
      >
        <v-text-field
          label="Nombre"
          name="nom"
          id="nom"
          v-model="item.nom"
          :rules="[rules.required]"
          validate-on-blur
          ref="focus"
        ></v-text-field>
        <v-layout row>
          <v-text-field
            class="sep"
            label="Epsa"
            id="epsa"
            v-model="item.epsa"
            :rules="[rules.required]"
            validate-on-blur
          ></v-text-field>

          <v-select
            class="sep"
            v-model="item.entidades_id"
            :items="lEntidades"
            :rules="[rules.required]"
            item-text="name"
            item-value="id"
            label="Entidad"
          ></v-select>

          <v-select
            v-model="item.distritos_id"
            :items="lDistritos"
            :rules="[rules.required]"
            item-text="name"
            item-value="id"
            label="Distrito"
          ></v-select>
        </v-layout>
        <v-layout row>
          <v-checkbox
            class="sep"
            v-model="item.protec"
            value="1"
            label="Programa de Protección"
          ></v-checkbox>
          <v-checkbox
            v-model="item.autoriza"
            value="1"
            label="Autoriza Monitoreo"
          ></v-checkbox>
        </v-layout>

        <v-text-field label="Direccion" v-model="item.dir"></v-text-field>
        <v-layout row>
          <v-text-field
            class="sep"
            label="Latitud"
            v-model="item.lat"
            :rules="[rules.num]"
            validate-on-blur
          ></v-text-field>
          <v-text-field
            label="Longitud"
            v-model="item.long"
            :rules="[rules.num]"
            validate-on-blur
          ></v-text-field>
        </v-layout>
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'

export default {
  //middleware: ['authAccess'],
  mixins: [MkModuloMix],
  components: {},
  name: 'Beneficiarios',
  data() {
    return {
      //urlModulo: '',
      //titModulo: '',
      tabs: 0,
      campos: [
        {
          text: 'Id',
          value: 'id',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'num',
          search: true,
        },
        {
          text: 'Nombre',
          value: 'nom',
          width: '250px',
          headers: true,
          type: 'text',
          search: true,
        },
        {
          text: 'Email',
          value: 'email',
          align: 'left',
          headers: true,
          type: 'text',
          search: true,
        },
      ],
    }
  },
  methods: {
    beforeSave(me) {},
  },

  async asyncData({ store }) {
    let lEntidades = await store.dispatch('auth/loadData', {
      url: 'Entidades',
      campos: 'id,name',
    })
    let lDistritos = await store.dispatch('auth/loadData', {
      url: 'Distritos',
      campos: 'id,name',
    })
    return {
      lEntidades: lEntidades,
      lDistritos: lDistritos,
    }
  },
  mounted() {},
}
</script>
<style scoped>
.sep {
  margin-right: 10px;
}
</style>