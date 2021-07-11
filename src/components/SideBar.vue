<template>
  <div id="side-bar">
    <h3>Myōbu Chat</h3>
    <!-- <p>{{workspaceId}}</p> -->
    <hr />
    <p class="section-title"><strong>Channels</strong></p>
    <div class="channels">
      <div class="channel-btn"># general</div>
      <div class="channel-btn">+ Create/Join channel</div>
    </div>
    <div class="status">
      <div
        v-bind:class="{
          'status-ball': true,
          relay: connectionStatus === 'RELAY',
          'direct-peers': connectionStatus === 'DIRECT_PEERS',
        }"
        v-bind:title="
          connectionStatus === 'RELAY'
            ? 'Relay'
            : connectionStatus === 'DIRECT_PEERS'
            ? 'Direct Peers'
            : 'No Peers'
        "
      >
        ⬤
      </div>
      <div>{{ peers.size }} peer(s) online</div>
    </div>
  </div>
</template>

<script>
import Immutable from "immutable";

export default {
  name: "SideBar",
  props: {
    workspaceId: String,
    selectedChannel: String,
    connectionStatus: String,
    peers: Immutable.Set,
  },
  mounted() {
    window.sidebar = this;
  },
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
    background-color: darken($background-color, 8);
    cursor: pointer;
  }
}

.status {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 24px;
}
.status-ball {
  color: #f44336;
  margin-right: 12px;

  &.relay {
    color: lime;
  }

  &.direct-peers {
    color: yellow;
  }
}
</style>