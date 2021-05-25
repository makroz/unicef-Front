<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    prepend-icon="person"
                    name="login"
                    label="Login"
                    type="text"
                    v-model="auth.username"
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="lock"
                    name="password"
                    label="Password"
                    type="password"
                    v-model="auth.password"
                  ></v-text-field>
                </v-form>
                .{{errorMsg}}
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="onLogin">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { c } from '@/components/mkComponentes/lib/MkUtils.js'
export default {
  name: "Login",
  data() {
    return {
      auth: {
        username: "",
        password: ""
      },
      errorMsg: ""
    };
  },
  methods: {
    async onLogin(v) {
      try {
        await this.$store.dispatch("auth/login", this.auth);
        this.auth.username = "";
        this.auth.password = "";
        this.errorMsg = null;
      } catch (e) {
        c(e.message,'LOGING','error','error')
        this.errorMsg = e.message;
      }
    },
    async logout() {
//      console.log('onLogout');
      try {
        await this.$store.dispatch("auth/logout");
      } catch (e) {
        this.errorMsg = e.message;
      }
    }
  },
  mounted() {
     console.log('mounted login:',this.$route);
    // console.log('mounted 2 login:',window.history.length);
  }
};
</script>
