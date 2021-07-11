<template>
    <div id="home-panel">
      <side-bar></side-bar>
      <chat-panel></chat-panel>
    </div>
</template>

<script>
import Vue from "vue";
import SideBar from "./SideBar";
import ChatPanel from "./ChatPanel";

export default Vue.extend({
  name: "Home",
  components: {
    SideBar,
    ChatPanel,
  },
  data() {
    return {};
  },
  methods: {},
});
</script>

<style scoped>
#home-panel {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
}
</style>