// little moments of play: swimming fish, wobbling glyphs, a wavy line
(function () {
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. wrap each character of the glyph rows and the wavy line so they can bob one after another
  function wrapChars(el, cls) {
    var text = el.textContent, k = 0; el.textContent = "";
    text.split(/( )/).forEach(function (word) {
      if (word === " ") { el.appendChild(document.createTextNode(" ")); return; }
      var w = document.createElement("span"); w.style.whiteSpace = "nowrap"; w.style.display = "inline-block";
      Array.from(word).forEach(function (ch) {
        var s = document.createElement("span"); s.className = cls; s.textContent = ch;
        s.style.animationDelay = (k++ * 0.09) + "s"; w.appendChild(s);
      });
      el.appendChild(w);
    });
  }
  document.querySelectorAll(".glyphs").forEach(function (el) { wrapChars(el, "bob"); });
  window.slWrap = wrapChars;
  document.querySelectorAll(".wave").forEach(function (el) { el.dataset.en = el.textContent; wrapChars(el, "bob soft"); });

  // 2. a small school of fish drifting across the page
  if (still) return;
  var glyphs = ["𓆝", "𓆟", "𓆞", "𓆝", "𓆟"];
  var tank = document.createElement("div");
  tank.className = "tank"; tank.setAttribute("aria-hidden", "true");
  document.body.appendChild(tank);

  function release(delay) {
    var f = document.createElement("span");
    var rtl = Math.random() < 0.5;
    var dur = 38 + Math.random() * 40;
    f.className = "fish" + (rtl ? " rtl" : "");
    f.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    f.style.top = (8 + Math.random() * 84) + "vh";
    f.style.fontSize = (16 + Math.random() * 18) + "px";
    f.style.animationDuration = dur + "s, " + (3 + Math.random() * 3) + "s";
    f.style.animationDelay = delay + "s, 0s";
    tank.appendChild(f);
    f.addEventListener("animationiteration", function (e) {
      if (e.animationName === "swim") f.style.top = (8 + Math.random() * 84) + "vh";
    });
  }
  for (var i = 0; i < 6; i++) release(-Math.random() * 60);
})();

// music player: a bar that slides up from the bottom and plays inside the page
(function () {
  var SRC = {
    cat: { name: "music for the common house cat sunbathing in winter", link: "https://soundcloud.com/sladeontheark/music-for-the-common-house-cat-sunbathing-in-winter?in=sladeontheark/sets/mixes",
          embed: "https://w.soundcloud.com/player/?url=" + encodeURIComponent("https://soundcloud.com/sladeontheark/music-for-the-common-house-cat-sunbathing-in-winter") + "&auto_play=true&color=%23b8a796&visual=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false", h: 120, label: "open on soundcloud" },
    sc: { name: "music for invisible fish and other ocean companions", link: "https://soundcloud.com/sladeontheark/music-for-invisible-fish-and-other-ocean-companions",
          embed: "https://w.soundcloud.com/player/?url=" + encodeURIComponent("https://soundcloud.com/sladeontheark/music-for-invisible-fish-and-other-ocean-companions") + "&auto_play=true&color=%23b8a796&visual=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false", h: 120, label: "open on soundcloud" },
    bc: { name: "choons 1 · show and tell records", link: "https://showandtellrecords.bandcamp.com/album/choons-1",
          embed: "https://bandcamp.com/EmbeddedPlayer/album=744147371/size=large/bgcol=1b1918/linkcol=b8a796/tracklist=true/artwork=small/transparent=true/", h: 240, label: "open on bandcamp" }
  };
  var bar;
  function open(key) {
    var s = SRC[key];
    if (!bar) {
      bar = document.createElement("div"); bar.className = "player"; bar.setAttribute("role", "region"); bar.setAttribute("aria-label", "music player");
      document.body.appendChild(bar);
    }
    bar.innerHTML = '<div class="player-top"><span class="player-name"><span class="g">𓆝</span> now playing: ' + s.name + '</span>' +
      '<a href="' + s.link + '" target="_blank" rel="noopener">' + s.label + ' ↗</a>' +
      '<button type="button" class="player-x" aria-label="close player">×</button></div>' +
      '<iframe title="' + s.name + '" src="' + s.embed + '" height="' + s.h + '" allow="autoplay" loading="eager"></iframe>';
    bar.querySelector(".player-x").onclick = function () { bar.classList.remove("on"); setTimeout(function () { bar.innerHTML = ""; }, 400); };
    requestAnimationFrame(function () { bar.classList.add("on"); });
  }
  document.querySelectorAll("[data-play]").forEach(function (el) {
    el.addEventListener("click", function (e) { e.preventDefault(); open(el.dataset.play); });
  });
})();
