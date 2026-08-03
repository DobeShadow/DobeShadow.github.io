import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"My Journey Building Minecraft Plugins","description":"","frontmatter":{"title":"My Journey Building Minecraft Plugins","date":"2026-07-28T00:00:00.000Z","tags":["Minecraft","Java","Development"]},"headers":[],"relativePath":"posts/minecraft-plugin-development.md","filePath":"posts/minecraft-plugin-development.md"}');
const _sfc_main = { name: "posts/minecraft-plugin-development.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><p>It started with a simple question: <em>&quot;What if the server had a configurable boss that spawns at 8 PM?&quot;</em> That question became <a href="https://github.com/DobeShadow/CustomBoss" target="_blank" rel="noreferrer">CustomBoss</a>.</p><h2 id="how-i-got-started" tabindex="-1">How I got started <a class="header-anchor" href="#how-i-got-started" aria-label="Permalink to &quot;How I got started&quot;">​</a></h2><p>I run a survival server called MINEMC, and I kept hitting the same wall: public plugins never did <em>exactly</em> what I wanted. So I learned to write my own. The Bukkit/Paper API is surprisingly approachable once you get past the event system.</p><h2 id="what-i-ve-built-so-far" tabindex="-1">What I&#39;ve built so far <a class="header-anchor" href="#what-i-ve-built-so-far" aria-label="Permalink to &quot;What I&#39;ve built so far&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Plugin</th><th>What it does</th></tr></thead><tbody><tr><td><a href="https://github.com/DobeShadow/CustomBoss" target="_blank" rel="noreferrer">CustomBoss</a></td><td>Timed boss spawns, custom stats, broadcasts</td></tr><tr><td><a href="https://github.com/DobeShadow/ItemBank" target="_blank" rel="noreferrer">ItemBank</a></td><td>Deposit items, earn daily points, redeem in shop</td></tr><tr><td><a href="https://github.com/DobeShadow/TeamPlugin" target="_blank" rel="noreferrer">TeamPlugin</a></td><td>Lightweight teams with PvP protection &amp; summon</td></tr><tr><td><a href="https://github.com/DobeShadow/FreeResidence" target="_blank" rel="noreferrer">FreeResidence</a></td><td>One free land claim for new players</td></tr><tr><td><a href="https://github.com/DobeShadow/AtPlayer" target="_blank" rel="noreferrer">AtPlayer</a></td><td><code>@mention</code> players with title + sound alerts</td></tr></tbody></table><h2 id="lessons-learned" tabindex="-1">Lessons learned <a class="header-anchor" href="#lessons-learned" aria-label="Permalink to &quot;Lessons learned&quot;">​</a></h2><ol><li><strong>Config files are the API.</strong> A good plugin is 80% well-designed config.</li><li><strong>Async everything.</strong> Never block the main thread on I/O.</li><li><strong>Ship small, iterate fast.</strong> v1 is never perfect, and that&#39;s fine.</li></ol><h2 id="what-s-next" tabindex="-1">What&#39;s next <a class="header-anchor" href="#what-s-next" aria-label="Permalink to &quot;What&#39;s next&quot;">​</a></h2><p>I&#39;m experimenting with Nukkit (Bedrock) and thinking about a loot-generation system. More dev logs coming soon.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/minecraft-plugin-development.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const minecraftPluginDevelopment = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  minecraftPluginDevelopment as default
};
