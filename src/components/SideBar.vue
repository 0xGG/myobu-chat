<template>
  <div id="side-bar">
    <h3>Myōbu Chat</h3>
    <hr>
    <p class="section-title"><strong>Channels</strong></p>
    <div class="channels">
      <div class="channel-btn"># general</div>
      <div class="channel-btn">+ Create/Join channel</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideBar",
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss">
@import "../assets/scss/constants.scss";

#side-bar {
  background-color: $background-color;
  color: #fafafa;
  height: 100%;
  width: $side-bar-width;
  padding: 12px;
  overflow-y: auto;
  text-align: left;
}

hr {
  background-color: #e8e8e8;
}

h3 {
  color: #fff;
}

.section-title {
  margin-bottom: 8px;
  font-size: 1.2rem;
}

.channels {
  display: flex;
  flex-direction: column;
  align-items: baseline;
}

.channel-btn {
  color: #fafafa;
  padding-left: 12px;
  padding: 6px 24px;
  width: 100%;

  &:hover {
    background-color: darken($background-color, 4);
    cursor: pointer;
  }
}

</style>