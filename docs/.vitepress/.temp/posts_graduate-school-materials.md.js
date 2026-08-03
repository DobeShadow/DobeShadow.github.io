import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Preparing for Graduate School in Materials Science","description":"","frontmatter":{"title":"Preparing for Graduate School in Materials Science","date":"2026-07-15T00:00:00.000Z","tags":["Academics","Materials"]},"headers":[],"relativePath":"posts/graduate-school-materials.md","filePath":"posts/graduate-school-materials.md"}');
const _sfc_main = { name: "posts/graduate-school-materials.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><p>After months of preparation, I&#39;m on my way to graduate school for <strong>Materials &amp; Chemical Engineering</strong>. Here&#39;s a quick reflection on the journey and my plans.</p><h2 id="why-materials-science" tabindex="-1">Why materials science <a class="header-anchor" href="#why-materials-science" aria-label="Permalink to &quot;Why materials science&quot;">​</a></h2><p>Materials are everywhere — the chip in your phone, the alloy in a turbine blade, the polymer in a water bottle. Understanding <em>why</em> materials behave the way they do is like learning the hidden language of the physical world. I want to research that, hands-on, in a lab.</p><h2 id="what-i-m-looking-forward-to" tabindex="-1">What I&#39;m looking forward to <a class="header-anchor" href="#what-i-m-looking-forward-to" aria-label="Permalink to &quot;What I&#39;m looking forward to&quot;">​</a></h2><ul><li><strong>Crystallography &amp; phase transitions</strong> — how atoms arrange themselves</li><li><strong>Characterization techniques</strong> — XRD, SEM, and the rest</li><li><strong>Hands-on experiments</strong> — turning theory into data</li></ul><h2 id="balancing-code-and-chemistry" tabindex="-1">Balancing code and chemistry <a class="header-anchor" href="#balancing-code-and-chemistry" aria-label="Permalink to &quot;Balancing code and chemistry&quot;">​</a></h2><p>Programming turned out to be a surprisingly useful skill for a materials student:</p><ul><li><strong>Data analysis</strong> — processing experimental results with Python</li><li><strong>Automation</strong> — writing scripts for lab equipment workflows</li><li><strong>Visualization</strong> — making sense of complex datasets</li></ul><p>And when I need a break from textbooks, I go back to writing Minecraft plugins. It&#39;s the best of both worlds.</p><h2 id="onward" tabindex="-1">Onward <a class="header-anchor" href="#onward" aria-label="Permalink to &quot;Onward&quot;">​</a></h2><p>Graduate school will be demanding, but I&#39;m excited. I&#39;ll use this blog to document what I learn along the way — partly for myself, partly for anyone who finds it useful.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/graduate-school-materials.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const graduateSchoolMaterials = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  graduateSchoolMaterials as default
};
