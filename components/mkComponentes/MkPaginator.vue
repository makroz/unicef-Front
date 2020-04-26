<template>
  <v-card class="d-flex justify-space-between">
    <v-card flat center>
      <v-pagination
        class="ma-3"
        @input="onPageChange"
        v-model="paginator.page"
        :length="paginator.n_page"
        :total-visible="paginator.offset"
      ></v-pagination>
    </v-card>
    <v-card class="width-min">
      <v-select
        class="ma-2"
        v-model="paginator.perPage"
        :items="paginator.perPageList"
        @change="onChange"
        densed
        :hideDetails="true"
        :suffix="'/'+paginator.total"
        style="flex: 1 1 15px "
        label="items x pag:"
      ></v-select>
    </v-card>
  </v-card>
</template>
<script>
export default {
  name: "paginator",
  props: {
    paginator: {
      type: [Array,Object],
      default: () => ({
        perPage: 2,
        perPageList: [2, 5, 10, 25, 50, { value: "-1", text: "Todos" }],
        n_page: 1,
        page: 1,
        offset: 3,
        total: 0
      })
    }
  },
  data() {
    return {};
  },
  methods: {
    onPageChange(page) {
      this.$emit("input", page);
    },
    onChange(perPage) {
      this.$emit("change", perPage);
    }
  }
};
</script>
<style>
.width-min {
  flex: 0 0 5% !important;
}
</style>
