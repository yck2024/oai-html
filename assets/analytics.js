(() => {
  "use strict";

  const MEASUREMENT_ID = "G-QLFWNZWDSS";
  const sentOnce = new Set();

  // GA4 Enhanced Measurement already tracks page views, outbound clicks,
  // form interactions, 90% scroll, and 10s engaged sessions. This helper only
  // adds what it does not, so events are not double-counted.

  // gtag.js only processes `arguments` objects pushed to dataLayer, not arrays,
  // so queue through a real gtag function if the page snippet hasn't defined one.
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
  }

  function clean(value, max = 80) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, max);
  }

  function send(eventName, params = {}) {
    const event = clean(eventName, 40).toLowerCase().replace(/[^a-z0-9_]/g, "_");
    if (!event) return;

    // Privacy rule: never automatically send text content, form values,
    // selected/copy text, query strings, or other user-entered content.
    window.gtag("event", event, { content_group: "oai-html", ...params });
  }

  function once(key, eventName, params = {}) {
    if (sentOnce.has(key)) return;
    sentOnce.add(key);
    send(eventName, params);
  }

  function declaredLabel(el) {
    return clean(el.dataset.analyticsLabel || el.getAttribute("aria-label"), 80);
  }

  window.oaiTrack = send;
  window.OAI_ANALYTICS = {
    measurementId: MEASUREMENT_ID,
    track: send
  };

  document.addEventListener("click", (event) => {
    const el = event.target.closest("[data-analytics-event], a[href^='#'], button");
    if (!el) return;

    const explicitEvent = el.dataset.analyticsEvent;
    if (explicitEvent) {
      send(explicitEvent, {
        element_id: clean(el.id || el.dataset.analyticsId, 60),
        element_label: declaredLabel(el)
      });
      return;
    }

    if (el.tagName === "A") {
      send("section_nav", {
        target_section: clean(el.getAttribute("href").slice(1), 60),
        element_label: declaredLabel(el)
      });
      return;
    }

    // Only identifiable buttons; anonymous clicks are noise in reports.
    const elementId = clean(el.id || el.dataset.analyticsId, 60);
    const elementLabel = declaredLabel(el);
    if (elementId || elementLabel) {
      send("button_click", { element_id: elementId, element_label: elementLabel });
    }
  });

  document.addEventListener("copy", () => {
    const length = String(window.getSelection?.() || "").length;
    const bucket = length === 0 ? "0" : length < 40 ? "1_39" : length < 120 ? "40_119" : "120_plus";
    send("content_copy", { selection_length_bucket: bucket });
  });

  // 90% is covered by Enhanced Measurement's built-in `scroll` event.
  // Same parameter name so one custom dimension covers both.
  const scrollThresholds = [25, 50, 75];
  let ticking = false;

  function checkScroll() {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - innerHeight);
    const percent = Math.min(100, Math.round((scrollY / max) * 100));

    for (const threshold of scrollThresholds) {
      if (percent >= threshold) {
        once("scroll_" + threshold, "scroll_depth", { percent_scrolled: threshold });
      }
    }
    ticking = false;
  }

  addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(checkScroll);
  }, { passive: true });

  setTimeout(() => {
    if (document.visibilityState === "visible") {
      once("engaged_30s", "engaged_30s");
    }
  }, 30000);
})();
