<template>
  <div id="text-box">
    <nav>
      <ul class="nav nav-tabs align-items-center" id="nav-tabs" role="tablist">
        <li class="nav-item">
          <a
            v-bind:class="{
              'nav-link': true,
              active: selectedTab === 'MARKDOWN',
            }"
            data-toggle="tab"
            role="tab"
            aria-controls="markdown"
            v-on:click="selectedTab = 'MARKDOWN'"
            >Markdown</a
          >
        </li>
        <li class="nav-item">
          <a
            v-bind:class="{
              'nav-link': true,
              active: selectedTab === 'PREVIEW',
            }"
            data-toggle="tab"
            role="tab"
            aria-controls="preview"
            v-on:click="selectedTab = 'PREVIEW'"
            >Preview</a
          >
        </li>
        <li id="send-btn">
          <button
            class="btn btn-primary"
            v-on:click="$emit('send-markdown', markdown) && (markdown = '')"
          >
            Send
          </button>
        </li>
      </ul>
    </nav>
    <div v-if="selectedTab === 'MARKDOWN'" class="form-group">
      <textarea
        class="form-control"
        id="markdown-input"
        rows="6"
        v-model="markdown"
        placeholder="Write your chat message here"
      ></textarea>
    </div>
    <div class="preview text-box-markdown-preview" v-html="html" v-else>
      {{ markdown }}
    </div>
  </div>
</template>

<script>
import md from "../lib/markdown";

export default {
  name: "TextBox",
  data() {
    return {
      selectedTab: "MARKDOWN",
      markdown: "",
    };
  },
  methods: {},
  computed: {
    html() {
      return md.render(this.markdown);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/constants.scss";

#text-box {
  width: 100%;
  height: $text-box-height;
  display: flex;
  flex-direction: column;
  text-align: left;
}

#nav-tabs {
  position: relative;

  .nav-link {
    cursor: pointer;
  }
}

#send-btn {
  position: absolute;
  right: 2px;
}

#markdown-input {
  resize: none;
}

.text-box-markdown-preview {
  height: 100%;
  overflow: auto !important;
  padding: 8px;
  box-sizing: border-box !important;
}
</style>