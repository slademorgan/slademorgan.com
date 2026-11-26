// en / de switch: swaps every text on the page using the dictionary in de.js
(function () {
  var DE = window.SLADE_DE || {};
  var orig = new WeakMap(), shown = new WeakMap();
  var lang = "en";
  function norm(s) { return s.replace(/\s+/g, " ").trim().toLowerCase(); }
  function tr(text) {
    var k = norm(text); if (!k) return null;
    if (DE[k]) return DE[k];
    var m = k.match(/^(.*?)\s*↗$/); if (m && DE[m[1]]) return DE[m[1]] + " ↗";
    if (k.indexOf("now playing:") === 0) return DE["now playing:"] + text.slice(text.toLowerCase().indexOf("now playing:") + 12);
    return null;
  }
  function apply(node) {
    if (node.nodeType === 3) {
      var p = node.parentNode; if (!p || /^(SCRIPT|STYLE)$/.test(p.nodeName)) return;
      if (!orig.has(node) || node.data !== shown.get(node)) orig.set(node, node.data);
      var en = orig.get(node), out = en;
      if (lang === "de") { var t = tr(en); if (t) out = en.match(/^\s*/)[0] + t + en.match(/\s*$/)[0]; }
      if (node.data !== out) node.data = out;
      shown.set(node, out);
    } else if (node.nodeType === 1) {
      if (node.hasAttribute && node.hasAttribute("placeholder")) {
        if (!node.dataset.phEn) node.dataset.phEn = node.getAttribute("placeholder");
        var ph = lang === "de" ? (tr(node.dataset.phEn) || node.dataset.phEn) : node.dataset.phEn;
        node.setAttribute("placeholder", ph);
      }
      if (node.classList && node.classList.contains("wave")) {
        var src = node.dataset.en || node.textContent; node.dataset.en = src;
        node.textContent = lang === "de" ? (tr(src) || src) : src;
        if (window.slWrap) window.slWrap(node, "bob soft");
        return;
      }
      node.childNodes.forEach(apply);
    }
  }
  function set(l) {
    lang = l; document.documentElement.lang = l;
    try { localStorage.setItem("lang", l); } catch (e) {}
    apply(document.body);
    document.querySelectorAll(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.l === l); });
  }
  // the switch, placed in the header
  var sw = document.createElement("div"); sw.className = "lang"; sw.setAttribute("role", "group"); sw.setAttribute("aria-label", "language");
  sw.innerHTML = '<button type="button" data-l="en">en</button><span aria-hidden="true">/</span><button type="button" data-l="de">de</button>';
  var head = document.querySelector(".site-header .wrap"); if (head) head.appendChild(sw);
  sw.addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) set(b.dataset.l); });
  // keep translating text that scripts add later (form notes, the player)
  new MutationObserver(function (ms) {
    if (lang !== "de") return;
    ms.forEach(function (m) {
      if (m.type === "characterData" && !(m.target.parentNode && m.target.parentNode.closest(".wave"))) apply(m.target);
      m.addedNodes && m.addedNodes.forEach(function (n) { if (!(n.parentNode && n.parentNode.closest && n.parentNode.closest(".wave"))) apply(n); });
    });
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
  var saved = null; try { saved = localStorage.getItem("lang"); } catch (e) {}
  set(saved || ((navigator.language || "").toLowerCase().indexOf("de") === 0 ? "de" : "en"));
})();
