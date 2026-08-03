import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Hello, World!","description":"","frontmatter":{"title":"Hello, World!","date":"2026-08-03T00:00:00.000Z","tags":["Life","Blog"]},"headers":[],"relativePath":"posts/hello-world.md","filePath":"posts/hello-world.md"}');
const _sfc_main = { name: "posts/hello-world.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><p>This is my first post on the new blog. Welcome!</p><h2 id="why-this-blog" tabindex="-1">Why this blog <a class="header-anchor" href="#why-this-blog" aria-label="Permalink to &quot;Why this blog&quot;">​</a></h2><p>For a long time I wanted a place to write things down — study notes, code snippets, and the occasional thought. I&#39;ve finally set it up with <a href="https://vitepress.dev/" target="_blank" rel="noreferrer">VitePress</a>, which I also use for my server&#39;s player guide and plugin wiki.</p><h2 id="what-you-ll-find-here" tabindex="-1">What you&#39;ll find here <a class="header-anchor" href="#what-you-ll-find-here" aria-label="Permalink to &quot;What you&#39;ll find here&quot;">​</a></h2><ul><li><strong>Study notes</strong> on materials &amp; chemical engineering</li><li><strong>Dev logs</strong> from my Minecraft plugin projects</li><li><strong>Life updates</strong> and whatever else crosses my mind</li></ul><h2 id="let-s-go" tabindex="-1">Let&#39;s go <a class="header-anchor" href="#let-s-go" aria-label="Permalink to &quot;Let&#39;s go&quot;">​</a></h2><p>I&#39;m not sure how often I&#39;ll write, but I&#39;ll try to keep it real. See you in the next post.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/hello-world.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const helloWorld = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  helloWorld as default
};
