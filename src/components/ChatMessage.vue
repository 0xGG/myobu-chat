<template>
  <div class="chat-message">
    <div class="chat-message-top">
      <strong class="wallet-address">{{ walletAddress.slice(0, 4) }}</strong> -
      {{ createdAt.toString() }}
    </div>
    <div class="preview" v-html="html">{{ markdown }}</div>
  </div>
</template>

<script>
import md from "../lib/markdown";

export default {
  name: "ChatMessage",
  props: {
    from: String,
    walletAddress: String,
    createdAt: Date,
    markdown: String,
  },
  mounted() {},
  data() {
    return {};
  },
  methods: {},
  computed: {
    html() {
      return md.render(this.markdown);
    },
  },
};
</script>

<style lang="scss">
.chat-message {
  .wallet-address {
    font-weight: 600;
  }
}
</style>