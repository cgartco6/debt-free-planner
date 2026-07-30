"""
streamlit_app.py
================
Wraps the DebtFree Planner in a Streamlit app.
The planner is a pure HTML/CSS/JS app — Streamlit just hosts it
inside a full-height iframe via st.components.v1.html().

Deploy to Streamlit Community Cloud:
  1. Push this file + the whole repo to GitHub
  2. Go to share.streamlit.io → New app → pick this file
  3. Done. No secrets, no config needed.

Local dev:
  pip install streamlit
  streamlit run streamlit_app.py
"""

import os
import sys
import subprocess
from pathlib import Path
import streamlit as st

# ── Page config ─────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="DebtFree Planner",
    page_icon="🔓",
    layout="wide",
    initial_sidebar_state="collapsed",
    menu_items={
        "Get Help": None,
        "Report a bug": None,
        "About": "DebtFree Planner — Income-first debt payoff planner. No signup, no ads.",
    },
)

# ── Hide Streamlit chrome so the app fills the screen ───────────────────────
st.markdown("""
<style>
  /* Hide Streamlit header, footer, hamburger */
  #MainMenu  { visibility: hidden; }
  footer     { visibility: hidden; }
  header     { visibility: hidden; }

  /* Remove default Streamlit padding so iframe fills the page */
  .block-container {
    padding: 0 !important;
    max-width: 100% !important;
  }
  [data-testid="stAppViewContainer"] {
    padding: 0 !important;
  }
  [data-testid="stVerticalBlock"] {
    gap: 0 !important;
    padding: 0 !important;
  }
</style>
""", unsafe_allow_html=True)


# ── Build the standalone bundle if not already built ────────────────────────
DIST_FILE = Path(__file__).parent / "dist" / "index.html"
BUNDLE_SCRIPT = Path(__file__).parent / "scripts" / "bundle.py"


def build_bundle() -> bool:
    """Run the bundle script to produce dist/index.html."""
    try:
        result = subprocess.run(
            [sys.executable, str(BUNDLE_SCRIPT), "--no-chartjs"],
            capture_output=True,
            text=True,
            timeout=60,
        )
        return result.returncode == 0
    except Exception as e:
        st.error(f"Bundle script failed: {e}")
        return False


@st.cache_resource(show_spinner="Building app bundle…")
def get_html() -> str:
    """
    Load (or build) the standalone HTML bundle.
    Cached so it's built only once per Streamlit session lifetime.
    """
    if not DIST_FILE.exists():
        ok = build_bundle()
        if not ok or not DIST_FILE.exists():
            return _fallback_html()

    html = DIST_FILE.read_text(encoding="utf-8")

    # Patch localStorage calls to work inside an iframe sandboxed by Streamlit.
    # Streamlit's iframe blocks cross-origin storage — we add a try/catch wrapper
    # so the app degrades gracefully (plan won't persist across Streamlit refreshes,
    # but all calculations still work in-session).
    html = html.replace(
        "localStorage.getItem(",
        "_safeGet(",
    ).replace(
        "localStorage.setItem(",
        "_safeSet(",
    ).replace(
        "localStorage.removeItem(",
        "_safeDel(",
    )

    ls_patch = """
<script>
// localStorage compatibility shim for Streamlit iframe sandbox
(function() {
  var _mem = {};
  window._safeGet = function(k) {
    try { return localStorage.getItem(k); }
    catch(e) { return _mem[k] || null; }
  };
  window._safeSet = function(k, v) {
    try { localStorage.setItem(k, v); }
    catch(e) { _mem[k] = v; }
  };
  window._safeDel = function(k) {
    try { localStorage.removeItem(k); }
    catch(e) { delete _mem[k]; }
  };
})();
</script>
"""
    html = html.replace("<body>", "<body>\n" + ls_patch, 1)
    return html


def _fallback_html() -> str:
    return """
<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<style>
  body { font-family: system-ui, sans-serif; display: flex; align-items: center;
         justify-content: center; min-height: 100vh; margin: 0;
         background: #0D1B2A; color: #94A3B8; text-align: center; }
  h2 { color: #06B6D4; } a { color: #06B6D4; }
</style></head><body>
<div>
  <h2>🔓 DebtFree Planner</h2>
  <p>Bundle not found. Run <code>python scripts/bundle.py</code> locally<br>
  and commit <code>dist/index.html</code> to your repo.</p>
</div>
</body></html>
"""


# ── Render ───────────────────────────────────────────────────────────────────
html_content = get_html()

st.components.v1.html(
    html_content,
    height=920,      # Tall enough for the dashboard sidebar + content
    scrolling=True,  # Allow vertical scroll inside iframe
)


# ── Optional: tiny info footer below the iframe ──────────────────────────────
with st.expander("ℹ️ About this app", expanded=False):
    st.markdown("""
    **DebtFree Planner** is a free, open-source financial planning tool.

    - 📊 Income-first: enter what you earn, then expenses, then debts
    - ⚔️ Three payoff strategies: Avalanche, Snowball, Hybrid
    - 🔓 Liberation Timeline: see exactly when each debt payment becomes savings
    - 🚀 Wealth projection: compound growth after your last debt is paid
    - 🔒 All data is stored in your browser — nothing leaves your device

    > Note: On Streamlit Community Cloud, plan data may not persist across browser
    > sessions (iframe localStorage restrictions). For persistence, use the
    > **Export JSON** button in Settings and re-import each session.
    """)
