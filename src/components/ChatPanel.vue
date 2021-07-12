<template>
  <div id="chat-panel">
    <div class="top-bar">
      <h4 class="channel-name"># {{ selectedChannel }}</h4>
    </div>
    <div id="chat-messages" v-chat-scroll="{ always: false, smooth: true }">
      <chat-message
        v-for="message in messages"
        v-bind:walletAddress="message.walletAddress"
        v-bind:from="message.from"
        v-bind:markdown="message.markdown"
        v-bind:createdAt="message.createdAt"
        v-bind:key="message.walletAddress + message.createdAt"
      ></chat-message>
    </div>
    <text-box v-on:send-markdown="onSendMarkdown"></text-box>
  </div>
</template>

<script>
import ChatMessage from "./ChatMessage";
import TextBox from "./TextBox";

export default {
  name: "ChatPanel",
  props: {
    workspaceId: String,
    selectedChannel: String,
    ipfs: Object,
  },
  components: {
    ChatMessage,
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
      return this.workspaceId + "-channel-" + this.selectedChannel;
    },
  },
  methods: {
    async onSendMarkdown(markdown) {
      if (!this.ipfs) {
        return;
      }
      const me = (await this.ipfs.id()).id;
      await this.ipfs.pubsub.publish(
        this.chatChannel,
        JSON.stringify({
          walletAddress: me, // TODO: Change walletAddress to wallet address
          markdown,
          createdAt: new Date(),
        })
      );
    },
    // receiveChatMessage is used for processing recieved messages and outputting them both to console and the message box.
    receiveChatMessage(message) {
      try {
        const data = JSON.parse(new TextDecoder().decode(message.data));
        const { walletAddress, markdown, createdAt } = data;
        const chatMessage = {
          walletAddress,
          markdown,
          from: message.from,
          createdAt: createdAt,
        };
        this.messages.push(chatMessage);
      } catch (error) {
        console.error(error);
      }
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

  #chat-messages {
    width: 100%;
    height: calc(100% - #{$text-box-height} - #{$chat-panel-top-bar-height});
    background-color: #fff;
    text-align: left;
    padding: 8px;
    overflow: auto;
  }
}
</style>