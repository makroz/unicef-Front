<template>
  <div>
    <v-dialog
      v-if="!readonly"
      ref="dialogTime"
      v-model="modalTime"
      :return-value.sync="time"
      persistent
      lazy
      full-width
      width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          ref="time"
          v-model="value"
          :label="label"
          prepend-icon="access_time"
          :rules="rules"
          validate-on-blur
          v-on="on"
        ></v-text-field>
      </template>
      <v-time-picker v-if="modalTime" v-model="time" full-width format="24hr"
        scrollable 
        >
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="modalTime = false">Cancel</v-btn>
        <v-btn
          flat
          color="primary"
          @click="
            $refs.dialogTime.save(time)
            $emit('input', time)
            $nextTick($refs.time.validate)
          "
          >OK</v-btn>
      </v-time-picker>
    </v-dialog>
    <v-text-field
      v-else
      v-model="value"
      :label="label"
      prepend-icon="access_time"
      readonly
    ></v-text-field>
  </div>
</template>

<script>
export default {
  name: 'MkTime',
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      modalTime: false,
      time:this.value,
    }
  },
  methods: {},
  watch: {
    value(n,o){
      //console.log('wathc', n,o);
      this.time=n
    }
  }
}
</script>