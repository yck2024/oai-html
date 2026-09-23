(() => {
  "use strict";

  const MEASUREMENT_ID = "G-QLFWNZWDSS";
  const sentOnce = new Set();

  function clean(value, max = 80) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, max);
  }

  function pageContext() {
    return {
      page_path: location.pathname,
      page_title: document.title,
      content_group: "oai-html"
    };
  }

  function send(eventName, params = {}) {
    const event = clean(eventName, 40).toLowerCase().replace(/[^a-z0-9_]/g, "_");
    if (!event) return;

    const payload = { ...pageContext(), ...params };

    // Never send form values, selected/copy text, query-string contents, or other user-entered content.
    if (typeof window.gtag === "function") {
      window.gtag("event", event, payload);
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(["event", event, payload]);
  }

  function once(key, eventName, params = {}) {
    if (sentOnce.has(key)) return;
    sentOnce.add(key);
    send(eventName, params);
  }

  window.oaiTrack = send;
  window.OAI_ANALYTICS = {
    measurementId: MEASUREMENT_ID,
    track: send
  };

  document.addEventListener("click", (event) => {
    const el = event.target.closest("[data-analytics-event], a, button");
    if (!el) return;

    const explicitEvent = el.dataset.analyticsEvent;
    if (explicitEvent) {
      send(explicitEvent, {
        element_id: clean(el.id || el.dataset.analyticsId, 60),
        element_label: clean(el.dataset.analyticsLabel || el.getAttribute("aria-label") || el.textContent, 80)
      });
      return;
    }

    if (el.tagName === "A") {
      const href = el.getAttribute("href") || "";
      const label = clean(el.getAttribute("aria-label") || el.textContent, 80);

      if (href.startsWith("#")) {
        send("section_nav", {
          target_section: clean(href.slice(1), 60),
          element_label: label
        });
        return;
      }

      try {
        const target = new URL(el.href, location.href);
        if (target.origin !== location.origin) {
          send("outbound_link", {
            target_host: clean(target.hostname, 80),
            element_label: label
          });
        }
      } catch (_) {
        // Ignore malformed or non-HTTP links.
      }
      return;
    }

    if (el.tagName === "BUTTON") {
      send("button_click", {
        element_id: clean(el.id || el.dataset.analyticsId, 60),
        element_label: clean(el.getAttribute("aria-label") || el.textContent, 80)
      });
    }
  });

  document.addEventListener("copy", () => {
    const length = String(window.getSelection?.() || "").length;
    const bucket = length === 0 ? "0" : length < 40 ? "1_39" : length < 120 ? "40_119" : "120_plus";
    send("content_copy", { selection_length_bucket: bucket });
  });

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    send("form_submit", {
      form_id: clean(form.id || form.dataset.analyticsId || "anonymous_form", 60)
    });
  });

  const scrollThresholds = [25, 50, 75, 90];
  let ticking = false;

  function checkScroll() {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - innerHeight);
    const percent = Math.min(100, Math.round((scrollY / max) * 100));

    for (const threshold of scrollThresholds) {
      if (percent >= threshold) {
        once("scroll_" + threshold, "scroll_depth", { percent: threshold });
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

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      const seconds = Math.round(performance.now() / 1000);
      if (seconds >= 10) {
        once("engaged_10s", "engaged_10s");
      }
    }
  });
})();
