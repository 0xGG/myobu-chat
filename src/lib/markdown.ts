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

export default md;
