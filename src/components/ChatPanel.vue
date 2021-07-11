<template>
  <div id="chat-panel">
    <div class="top-bar">
      <h4 class="channel-name"># {{ selectedChannel }}</h4>
    </div>
    <chat-messages></chat-messages>
    <text-box v-on:send-markdown="onSendMarkdown"></text-box>
  </div>
</template>

<script>
import ChatMessages from "./ChatMessages";
import TextBox from "./TextBox";

export default {
  name: "ChatPanel",
  props: {
    workspaceId: String,
    selectedChannel: String,
    ipfs: Object,
  },
  components: {
    ChatMessages,
    TextBox,
  },
  data() {
    return {
      messages: [],
    };
  },
  mounted() {},
  computed: {
    chatChannel() {
      return "global";
      // return this.workspaceId + "-channel-" + this.selectedChannel;
    },
  },
  methods: {
    async onSendMarkdown(markdown) {
      if (!this.ipfs) {
        return;
      }
      await this.ipfs.pubsub.publish(this.chatChannel, markdown);
      console.log("sendMarkdown; ", this.chatChannel, markdown);
    },
  },
  watch: {
    async chatChannel(newChannel, oldChannel) {
      if (!this.ipfs) {
        return;
      }
      this.messages = [];
      if (oldChannel) {
        await this.ipfs.pubsub.unsubscribe(oldChannel);
        console.log("Unsubscribed from: ", oldChannel);
      }
      // join selected channel
      await this.ipfs.pubsub.subscribe(newChannel, this.receiveChatMessage);
      console.log("Subscribed to 2: ", this.chatChannel);
    },

    async ipfs() {
      if (!this.ipfs) {
        return;
      }
      this.messages = [];
      await this.ipfs.pubsub.subscribe(
        this.chatChannel,
        this.receiveChatMessage
      );
      console.log("Subscribed to 1: ", this.chatChannel);
    },

    // receiveChatMessage is used for processing recieved messages and outputting them both to console and the message box.
    receiveChatMessage(message) {
      const markdown = new TextDecoder().decode(message.data);
      console.log("receiveChatMessage: ", message.from, markdown);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/constants.scss";

#chat-panel {
  height: 100%;
  width: calc(100% - #{$side-bar-width});
  display: flex;
  flex-direction: column;

  .top-bar {
    height: $chat-panel-top-bar-height;
    display: flex;
    align-items: center;
    padding: 0 24px;
    background-color: #fff;
    border-bottom: 2px solid #f3f5f7;
  }

  .channel-name {
    margin: 0;
  }
}
</style>