<template>
    <v-app>
      <v-navigation-drawer v-model="drawer" app clipped>
        <v-list dense>
          <v-list-item v-for="item in menuItems" :key="JSON.stringify(item)" @click="$router.push(item.route)">
            <v-list-item-action>
              <v-icon>{{item.icon}}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{item.text}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar app clipped-left>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-flex xs8>
          <v-toolbar-title>[Rifai Tech] Dashboard</v-toolbar-title>
        </v-flex>
        <v-flex xs4>
                Sydney: <v-icon class="ml-2 mr-2">mdi-clock</v-icon> {{time}}
                <v-icon class="ml-5 mr-2">mdi-cloud</v-icon> {{weather.feelslike}}<sup>o</sup>C
        </v-flex>
      </v-app-bar>

      <v-content>
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
            <router-view></router-view>
          </v-layout>
        </v-container>
      </v-content>

      <v-footer app>
        <span>&copy; 2019</span>
      </v-footer>
    </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",
  components: {
    HelloWorld
  },
  async beforeMount() {
    this.weather = await this.getWeatherData('sydney');
    this.time = new Date().toLocaleTimeString();
    var timeKeeper = setInterval(() => {
        this.time = new Date().toLocaleTimeString()
    },1000)
  },
  data: () => ({
    drawer: null,
    weather: {
        feelslike: '',
        imageUrl: ''

    },
    time: "",
    menuItems: [{
        text: 'Home',
        route: '/',
        icon: 'mdi-home'
    },{
        text: 'Devices',
        route: '/',
        icon: 'mdi-desk-lamp'
    },
    {
        text: 'Tasks',
        route: '/',
        icon: 'mdi-ballot-outline'
    },
    {
        text: 'People',
        route: '/',
        icon: 'mdi-account'
    }]
  }), methods:{
      async getWeatherData(city){
         var res = await this.$axios.get(`http://localhost:3000/weather?city=${city}`)
          return res.data.current;
      }
  }
};
</script>
