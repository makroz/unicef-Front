<template>
  <div id="pageDashboard">
    <v-container grid-list-xl text-xs-center >
      <v-layout row wrap>
         <v-flex xs10 offset-xs1>
        <h1 >Bienvenidos al Sistema</h1><br>
      </v-flex>
      <v-flex xs10 offset-xs1>
      <h3>No se rian aun esta sin diseño ...</h3>
      </v-flex>
       <v-flex xs10 offset-xs1>
            <logo></logo><logo></logo>
      </v-flex>
      <v-flex xs10 offset-xs1>
            <logo></logo>
      </v-flex>

     </v-layout>
    </v-container>

  </div>
</template>

<script>
  import API from '@/api';
  import logo from '@/components/logo.vue';
  import Material from 'vuetify/es5/util/colors';

  export default {
    layout: 'dashboard',
    components: {
      logo
    },
    data: () => ({
      color: Material,
      selectedTab: 'tab-1',
    }),
    computed: {
      activity () {
        return API.getActivity();
      },
    },

  };
</script>
