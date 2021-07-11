<template>
  <div id="text-box">Text Box</div>
</template>

<script>
export default {
  name: "TextBox",
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/constants.scss";

#text-box {
  width: 100%;
  height: $text-box-height;
}
</style>