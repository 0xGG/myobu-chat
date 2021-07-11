<template>
  <div id="chat-panel">
    <chat-messages></chat-messages>
    <text-box></text-box>
  </div>
</template>

<script>
import ChatMessages from "./ChatMessages";
import TextBox from "./TextBox";

export default {
  name: "ChatPanel",
  components: {
    ChatMessages,
    TextBox,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/constants.scss";

#chat-panel {
  height: 100%;
  width: calc(100% - #{$side-bar-width});
  display: flex;
  flex-direction: column;
}
</style>