<template>
  <div id="chat-messages">Chat Messages</div>
</template>

<script>
export default {
  name: "ChatMessages",
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/constants.scss";

#chat-messages {
  width: 100%;
  height: calc(100% - #{$text-box-height});
  background-color: #fff;
}
</style>