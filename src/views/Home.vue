<template>
  <div>
    <v-layout class="headline" align-center justify-center>Welcome Back Hani</v-layout>
      <v-container grid-list-md row wrap>
          <v-flex xs4>
              <v-container grid-list-md row wrap>
                  Tasks
                  <v-layout row wrap>
                      <v-flex xs12 v-for="i in [1,2,3]" :key="i">
                          <v-container>
                              <v-card outlined>
                                  <v-card-title>Test</v-card-title>
                                  <v-card-actions>
                                      <v-btn large>Test</v-btn>
                                  </v-card-actions>
                              </v-card>
                          </v-container>
                      </v-flex>
                  </v-layout>
              </v-container>
          </v-flex>
          <v-flex xs4>
              <v-container grid-list-md>
                  Tasks
                  <v-layout row wrap>
                      <v-flex xs12 v-for="task in tasks" :key="JSON.stringify(task)">
                          <v-container grid-list-md>
                              <v-card outlined>
                                  <v-flex xs12>
                                      <v-card-title>{{task.name}}</v-card-title>
                                      <v-card-text class="pl-4">{{task.description}}</v-card-text>
                                      <v-card-actions>
                                          <v-flex xs6>
                                              <v-select
                                                      :items="['To Do', 'In Progress', 'Done']"
                                                      label="Status"
                                              ></v-select>
                                          </v-flex>
                                      </v-card-actions>
                                  </v-flex>
                              </v-card>
                          </v-container>
                      </v-flex>
                  </v-layout>
              </v-container>
          </v-flex>
          <v-flex xs4>
              <v-container grid-list-md>
                  Local Devices
                  <v-layout row wrap>
                      <v-flex xs12 v-for="device in devices" :key="device.ip">
                          <v-container>
                              <v-card outlined loader-height="2" :loading="device.loading">
                                <v-layout row>
                                  <v-flex xs8>
                                      <v-card-title>{{device.alias}}<v-icon class="ml-5">{{device.icon}}</v-icon></v-card-title>
                                  </v-flex>
                                  <v-flex xs4>
                                      <v-chip v-if='device.lastState !== null' class="text-center ma-4" :color="device.lastState === true ? 'green' : 'red'">{{device.lastState === true ? "On" : "Off" }}</v-chip>
                                  </v-flex>
                                </v-layout>
                                  <v-card-actions>
                                      <v-btn depressed fab small @click="toggleDevice(device)"><v-icon>mdi-power</v-icon></v-btn>
                                  </v-card-actions>
                              </v-card>
                          </v-container>
                      </v-flex>
                  </v-layout>
              </v-container>
          </v-flex>
      </v-container>
  </div>
</template>

<script>

export default {
  name: 'home',
  beforeMount(){
      this.getAllDevices();
  },
  components: {

  },
  methods:{
      toggleDevice(device){
          device.loading = true;
        this.$axios.get(`http://localhost:3000/toggle?ip=${device.ip}`).then((res)=> {
            device.loading = false;
            device.lastState = res.data.currentState;
        })
      },
      async getAllDevices(){
          var res = await this.$axios.get(`http://localhost:3000/get-all-devices`);
          res.data.forEach(dev => {
              dev.loading = false
          });
          this.devices = res.data;
      }
  },
  data: () => ({
      devices: [],
      tasks: [{
          name: "Sig Generator",
          description: "Create and deploy a signature generator",
          due: new Date(new Date().toTimeString() + 5000),
          status: 0
        },{
          name: "Love and Deuce Weater",
          description: "Create weater widget ",
          due: new Date(new Date().toTimeString() + 5000),
          status: 0
      }
      ],
      endPoint: "http://localhost:3000"
  }),

}
</script>
