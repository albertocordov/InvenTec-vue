<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img alt="Vuetify Logo" class="shrink mr-2" contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png" transition="scale-transition" width="40" />

        <v-img alt="Vuetify Name" class="shrink mt-1 hidden-sm-and-down" contain min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png" width="100" />
      </div>

      <v-spacer></v-spacer>

      <router-link to="/users">
        <v-btn text>
          <span class="mr-2">Usuarios</span>
        </v-btn>
      </router-link>

      <router-link to="/inventory">
        <v-btn text>
          <span class="mr-2">Inventarios</span>
        </v-btn>
      </router-link>

      <router-link to="/departments">
        <v-btn text>
          <span class="mr-2">Departamentos</span>
        </v-btn>
      </router-link>

      <router-link to="/reports">
        <v-btn text>
          <span class="mr-2">Reportes</span>
        </v-btn>
      </router-link>

      <router-link to="/valesResguardo">
        <v-btn text>
          <span class="mr-2">Vales de resguardo</span>
        </v-btn>
      </router-link>

      <router-link to="/">
        <v-btn text>
          <v-icon size="x-large">mdi-home</v-icon>
        </v-btn>
      </router-link>

      <router-link to="/login">
        <v-btn text>
          <span class="mr-2">Cerrar sesión</span>
        </v-btn>
      </router-link>

    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import router from './router';

export default {
  name: 'App',
  data: () => ({
    //
  }),
  components: { router }
};
</script>
