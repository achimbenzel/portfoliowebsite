/* ===== Confinium hero shader =====
   Self-contained WebGL animated background. No dependencies.
   Reproduces the swirl + chroma-flow look as a single
   fragment shader. Reads the page theme (dark/light) for its base tone.

   Mount target: <canvas id="heroShader"> inside the hero.

   Exposes window._startHeroShader() so it can be (re)initialised every time
   the SPA re-renders the home page (same pattern as _startHero3D). Safe to
   call repeatedly: tears down any previous instance first.
*/
window._heroShaderRAF = window._heroShaderRAF || null;
window._heroShaderResize = window._heroShaderResize || null;
window._heroShaderGen = window._heroShaderGen || 0;   // invalidates stale loops
window._heroShaderResume = window._heroShaderResume || null; // current resume fn

window._startHeroShader = function () {
  const canvas = document.getElementById('heroShader');
  if (!canvas) return;

  // Tear down a previous instance (re-render / navigation back to home).
  // Bumping the generation token makes any still-scheduled stale frame bail.
  const gen = ++window._heroShaderGen;
  if (window._heroShaderRAF) { cancelAnimationFrame(window._heroShaderRAF); window._heroShaderRAF = null; }
  if (window._heroShaderResize) { window.removeEventListener('resize', window._heroShaderResize); window._heroShaderResize = null; }
  window._heroShaderResume = null;

  const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false });
  if (!gl) { canvas.style.display = 'none'; return; }

  /* ---- Tunables (mirror the reference component props) ---- */
  const CONFIG = {
    accent:   [0.0, 0.459, 0.533],  // #007588 — brand teal (chroma flow color)
    accent2:  [0.388, 0.718, 0.929], // #63b7ed — lighter teal/blue highlight
    detail:   1.7,                  // swirl detail
    momentum: 13.0,                 // chroma flow momentum
    radius:   3.5,                  // chroma flow radius
    speed:    0.15                  // overall time scale
  };

  const VERT = `
    attribute vec2 p;
    void main(){ gl_Position = vec4(p, 0.0, 1.0); }
  `;

  const FRAG = `
    precision highp float;
    uniform vec2  u_res;
    uniform float u_time;
    uniform float u_dark;     // 1.0 dark, 0.0 light
    uniform vec3  u_accent;   // warm flow color
    uniform vec3  u_accent2;  // secondary tone
    uniform float u_detail;
    uniform float u_momentum;
    uniform float u_radius;

    // --- hash / noise ---
    float hash(vec2 p){
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }
    float noise(vec2 p){
      vec2 i = floor(p), f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }
    float fbm(vec2 p){
      float v = 0.0, amp = 0.5;
      for (int i = 0; i < 6; i++){
        v += amp * noise(p);
        p *= 2.0;
        amp *= 0.5;
      }
      return v;
    }

    // domain-warped swirl field
    float swirl(vec2 uv, float t){
      vec2 q = vec2(fbm(uv + vec2(0.0, t * 0.15)),
                    fbm(uv + vec2(5.2, 1.3 - t * 0.12)));
      vec2 r = vec2(fbm(uv + u_detail * q + vec2(1.7, 9.2) + t * 0.1),
                    fbm(uv + u_detail * q + vec2(8.3, 2.8) - t * 0.08));
      return fbm(uv + u_detail * r);
    }

    void main(){
      vec2 uv = gl_FragCoord.xy / u_res.xy;
      float aspect = u_res.x / u_res.y;
      vec2 p = (uv - 0.5);
      p.x *= aspect;

      float t = u_time;

      // base swirl
      float s = swirl(p * (1.4 + u_detail * 0.4) + vec2(0.0, t * 0.05), t);

      // chroma flow: radial momentum pushing the warm color outward
      float dist = length(p);
      float flow = sin(dist * u_radius - t * (u_momentum * 0.06) + s * 4.0) * 0.5 + 0.5;
      flow *= smoothstep(1.1, 0.1, dist);            // fade at edges
      flow = pow(flow, 1.6);

      // base background tone (dark vs light)
      vec3 baseDark  = mix(vec3(0.043, 0.043, 0.055), vec3(0.02, 0.05, 0.07), s);
      vec3 baseLight = mix(vec3(0.92, 0.92, 0.90), vec3(0.85, 0.88, 0.90), s);
      vec3 base = mix(baseLight, baseDark, u_dark);

      // === DARK MODE: additive glow (smoke lifts toward the accent) ===
      vec3 colDark = mix(base, base + u_accent2 * 0.25, smoothstep(0.4, 0.85, s));
      colDark = mix(colDark, colDark + u_accent, flow * 0.9);

      // === LIGHT MODE: tint toward a darker teal so the smoke reads against
      //     the bright background (additive lightening was washing out) ===
      vec3 tintMid  = u_accent2 * 0.85;            // mid-swirl teal/blue
      vec3 tintFlow = u_accent * 0.9;              // chroma-flow brand teal
      vec3 colLight = mix(base, mix(base, tintMid, 0.55),
                          smoothstep(0.35, 0.9, s) * 0.7);
      colLight = mix(colLight, mix(colLight, tintFlow, 0.7), flow * 0.85);

      vec3 col = mix(colLight, colDark, u_dark);

      // soft highlight band drifting across (fluted-glass feel)
      float band = sin((uv.x + uv.y) * 6.2831 * 1.0 + t * 0.25) * 0.5 + 0.5;
      // dark: bright highlight; light: subtle darker streak for contrast
      col += (0.08 * u_dark) * pow(band, 8.0) * u_accent2;
      col -= (0.05 * (1.0 - u_dark)) * pow(band, 8.0) * (1.0 - u_accent);

      // subtle vignette
      col *= 1.0 - dist * 0.35;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compile(type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn('Shader compile error:', gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  }

  const prog = gl.createProgram();
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) { canvas.style.display = 'none'; return; }
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = {
    res:      gl.getUniformLocation(prog, 'u_res'),
    time:     gl.getUniformLocation(prog, 'u_time'),
    dark:     gl.getUniformLocation(prog, 'u_dark'),
    accent:   gl.getUniformLocation(prog, 'u_accent'),
    accent2:  gl.getUniformLocation(prog, 'u_accent2'),
    detail:   gl.getUniformLocation(prog, 'u_detail'),
    momentum: gl.getUniformLocation(prog, 'u_momentum'),
    radius:   gl.getUniformLocation(prog, 'u_radius')
  };

  gl.uniform3fv(U.accent, CONFIG.accent);
  gl.uniform3fv(U.accent2, CONFIG.accent2);
  gl.uniform1f(U.detail, CONFIG.detail);
  gl.uniform1f(U.momentum, CONFIG.momentum);
  gl.uniform1f(U.radius, CONFIG.radius);

  function isDark() {
    return document.body.getAttribute('data-theme') !== 'light' ? 1.0 : 0.0;
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(U.res, canvas.width, canvas.height);
  }
  window._heroShaderResize = resize;
  window.addEventListener('resize', resize);
  resize();

  // pause when off-screen / tab hidden, and respect reduced-motion
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Elapsed animation time is accumulated so pausing (tab hidden) and
  // resuming continues smoothly instead of jumping or freezing.
  let elapsed = 0;          // seconds of animation consumed so far
  let last = performance.now();

  function frame(now) {
    // A newer _startHeroShader() invalidated this loop — stop quietly.
    if (gen !== window._heroShaderGen) return;
    elapsed += (now - last) / 1000;
    last = now;
    gl.uniform1f(U.dark, isDark());
    gl.uniform1f(U.time, elapsed * CONFIG.speed * 8.0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    window._heroShaderRAF = requestAnimationFrame(frame);
  }

  // Resume helper kept current on window so the single visibilitychange
  // handler always restarts THIS instance's loop, not a stale one.
  function resume() {
    if (gen !== window._heroShaderGen) return;
    if (window._heroShaderRAF) return; // already running
    last = performance.now();          // don't fast-forward time while hidden
    window._heroShaderRAF = requestAnimationFrame(frame);
  }
  window._heroShaderResume = resume;

  if (reduce) {
    // draw a single static frame
    resize();
    gl.uniform1f(U.dark, isDark());
    gl.uniform1f(U.time, 12.0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  } else {
    last = performance.now();
    window._heroShaderRAF = requestAnimationFrame(frame);
    if (!window._heroShaderVisBound) {
      window._heroShaderVisBound = true;
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (window._heroShaderRAF) { cancelAnimationFrame(window._heroShaderRAF); window._heroShaderRAF = null; }
        } else if (window._heroShaderResume && document.getElementById('heroShader')) {
          window._heroShaderResume();
        }
      });
    }
  }
};
