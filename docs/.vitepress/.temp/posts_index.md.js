import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Posts","description":"All blog posts","frontmatter":{"title":"Posts","description":"All blog posts"},"headers":[],"relativePath":"posts/index.md","filePath":"posts/index.md"}');
const _sfc_main = { name: "posts/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_PostList = resolveComponent("PostList");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="posts" tabindex="-1">Posts <a class="header-anchor" href="#posts" aria-label="Permalink to &quot;Posts&quot;">​</a></h1>`);
  _push(ssrRenderComponent(_component_PostList, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
