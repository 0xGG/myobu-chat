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
      ></textarea>
    </div>
    <div id="markdown-preview" v-html="html" v-else>{{ markdown }}</div>
  </div>
</template>

<script>
import MarkdownIt from "markdown-it";
import MarkdownItEmoji from "markdown-it-emoji";
import MarkdownItFootnote from "markdown-it-footnote";
import MarkdownItIns from "markdown-it-ins";
import MarkdownItMark from "markdown-it-mark";
import MarkdownItSub from "markdown-it-sub";
import MarkdownItSup from "markdown-it-sup";
import MarkdownItTaskLists from "markdown-it-task-lists";
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: false, // The single quote will be rendered incorrectly, so disabled here.
  breaks: true,
});
md.use(MarkdownItFootnote);
md.use(MarkdownItTaskLists);
md.use(MarkdownItMark);
md.use(MarkdownItIns);
md.use(MarkdownItSub);
md.use(MarkdownItSup);
md.use(MarkdownItEmoji);

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

#markdown-preview {
  background-color: #fff;
  flex: 1;
  overflow: auto;
  text-align: left;
  padding: 4px;
}
</style>