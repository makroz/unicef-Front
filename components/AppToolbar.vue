<template>
  <v-toolbar
    color="primary"
    fixed
    dark
    app
  >
    <v-toolbar-title class="ml-0 pl-3">
      <v-toolbar-side-icon @click.stop="toggleDrawer()"></v-toolbar-side-icon>Sistema de Saneamiento
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="handleFullScreen()">
      <v-icon>fullscreen</v-icon>
    </v-btn>
    <v-menu offset-y origin="center center" class="elelvation-1" :nudge-right="140" :nudge-bottom="14" transition="scale-transition">
      <v-btn icon flat slot="activator">
        <v-badge color="red" overlap>
          <span slot="badge">3</span>
          <v-icon medium>notifications</v-icon>
        </v-badge>
      </v-btn>
      <notification-list></notification-list>
    </v-menu>
    <v-menu offset-y origin="center center" :nudge-right="140" :nudge-bottom="10" transition="scale-transition">
      <v-btn icon large flat slot="activator">
        <v-avatar size="30px">
          <img src="../static/avatar/man_4.jpg" alt="Nombre de Usuario"/>
        </v-avatar>
      </v-btn>
      <v-list class="pa-0">
        <v-list-tile v-for="(item,index) in items" :to="!item.href ? { name: item.name } : null" :href="item.href"
                     @click="item.click" ripple="ripple" :disabled="item.disabled" :target="item.target" rel="noopener"
                     :key="index">
          <v-list-tile-action v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>
<script>
  import NotificationList from '@/components/widgets/list/NotificationList';
  import Util from '@/util';

  export default {
    name: 'app-toolbar',
    components: {
      NotificationList
    },
    data:  function () {
      return {
        items: [
          {
            icon: 'account_circle',
            href: '#',
            title: 'Profile',
            click: (e) => {
              console.log(e);
            }
          },
          {
            icon: 'settings',
            href: '#',
            title: 'Settings',
            click: (e) => {
              console.log(e);
            }
          },
          {
            icon: 'fullscreen_exit',
            href: '#',
            title: 'Logout',
            click: this.handleLogout
          }
        ],
      }
    },
    computed: {
      toolbarColor() {
        return this.$vuetify.options.extra.mainNav;
      }
    },
    methods: {
      toggleDrawer() {
        this.$store.commit('toggleDrawer')
      },
      handleFullScreen() {
        Util.toggleFullScreen();
      },
      handleLogout() {
        this.$store.dispatch('auth/logout');
      }
    }
  };
</script>
