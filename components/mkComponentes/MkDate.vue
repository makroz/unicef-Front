<template>
  <div>
    <v-dialog
      v-if="!readonly"
      ref="fecha_dialog"
      v-model="modalDate"
      :return-value.sync="date"
      persistent
      lazy
      full-width
      width="290px"
      @change="$emit('change', date)"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          ref="date"
          v-model="date_temp"
          :label="label"
          prepend-icon="event"
          :rules="rules"
          validate-on-blur
          readonly
          v-on="on"
          :hideDetails="hideDetails"
        ></v-text-field>
      </template>
      <v-date-picker v-model="date" scrollable>
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="modalDate = false">Cancel</v-btn>
        <v-btn
          flat
          color="primary"
          @click="
            $refs.fecha_dialog.save(date)
            $emit('input', date)
            $emit('change', date)
            $nextTick($refs.date.validate)
          "
          >OK</v-btn
        >
      </v-date-picker>
    </v-dialog>
    <v-text-field
      v-else
      v-model="date_temp"
      :label="label"
      prepend-icon="event"
      readonly
    ></v-text-field>
  </div>
</template>

<script>
export default {
  name: 'MkDate',
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
      default: false
    },
    hideDetails: {
      type: Boolean,
      default: false
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
      modalDate: false,
      // date_temp: this.formatDate(this.value)||'',
      date: this.value,
      cont: 0
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return null
      let fecha = (date + ' ').split(' ')[0]
      const [year, month, day] = fecha.split('-')
      return `${year}/${month}/${day}`
    }
  },
  computed: {
    date_temp() {
      return this.formatDate(this.value) || ''
    }
  }
}
</script>