/* ==========================================================================
   Hero: a glass "</>" floating inside the glass tile
   Hand-written WebGL raymarcher (no libraries):
   - signed-distance glass rods, smooth-blended at the joints
   - real refraction through the glass + Beer–Lambert colour absorption
   - fresnel reflections of a soft "studio" environment (white + rose lights)
   - follows the mouse, assembles on intro, pauses when off-screen
   ========================================================================== */
(() => {
  'use strict';

  const canvas = document.getElementById('heroCanvas');
  const visual = document.querySelector('.hero-visual');
  if (!canvas || !visual) return;

  const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

  const FRAGMENT = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uIntro;
uniform vec3 uEnvTop;
uniform vec3 uEnvBottom;
uniform vec3 uAbsorb;
uniform vec3 uRose;
uniform vec3 uRim;
uniform float uAlpha;

mat3 R;
float S;

mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }
mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotZ(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0); }

float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
  vec3 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// the "</>" symbol built from five glass rods
float map(vec3 p) {
  p = (R * p) / S;
  float r = 0.15;
  float l = sdCapsule(p, vec3(-0.42, 0.58, 0.0), vec3(-1.02, 0.0, 0.0), r);
  l = smin(l, sdCapsule(p, vec3(-1.02, 0.0, 0.0), vec3(-0.42, -0.58, 0.0), r), 0.07);
  float m = sdCapsule(p, vec3(0.24, 0.84, 0.0), vec3(-0.24, -0.84, 0.0), r);
  float g = sdCapsule(p, vec3(0.42, 0.58, 0.0), vec3(1.02, 0.0, 0.0), r);
  g = smin(g, sdCapsule(p, vec3(1.02, 0.0, 0.0), vec3(0.42, -0.58, 0.0), r), 0.07);
  return min(min(l, m), g) * S;
}

vec3 calcNormal(vec3 p) {
  const vec2 e = vec2(1.0, -1.0) * 0.0012;
  return normalize(e.xyy * map(p + e.xyy) + e.yyx * map(p + e.yyx) + e.yxy * map(p + e.yxy) + e.xxx * map(p + e.xxx));
}

// soft studio: gradient sky, big white softbox, rose rim light, thin strip light
vec3 env(vec3 d) {
  float t = d.y * 0.5 + 0.5;
  vec3 col = mix(uEnvBottom, uEnvTop, smoothstep(0.0, 1.0, t));
  float k1 = max(dot(d, normalize(vec3(-0.55, 0.7, 0.55))), 0.0);
  col += vec3(1.0) * smoothstep(0.78, 0.97, k1) * 1.7;
  float k2 = max(dot(d, normalize(vec3(0.95, 0.05, 0.3))), 0.0);
  col += uRose * smoothstep(0.72, 0.96, k2) * 1.1;
  col += vec3(0.85) * smoothstep(0.04, 0.0, abs(d.y + 0.25)) * smoothstep(-0.2, 0.7, d.z) * 0.5;
  return col;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec3 ro = vec3(0.0, 0.0, 6.2);
  vec3 rd = normalize(vec3(uv, -1.75));

  float intro = uIntro * uIntro * (3.0 - 2.0 * uIntro);
  S = mix(0.55, 1.0, intro);
  float spin = (1.0 - intro) * 2.6;
  R = rotZ(-0.32 + sin(uTime * 0.4) * 0.05)
    * rotX(sin(uTime * 0.55) * 0.2 - uMouse.y * 0.45)
    * rotY(sin(uTime * 0.35) * 0.55 + uMouse.x * 0.75 + spin);

  // march to the surface
  float t = 0.0;
  float minD = 1e9;
  bool hit = false;
  for (int i = 0; i < 96; i++) {
    float d = map(ro + rd * t);
    minD = min(minD, d);
    if (d < 0.0008) { hit = true; break; }
    t += d;
    if (t > 9.0) break;
  }

  if (!hit) {
    // soft halo around the glass + feathered silhouette for anti-aliasing
    float halo = exp(-minD * 9.0) * 0.18;
    gl_FragColor = vec4(uRim, halo * intro * uAlpha);
    return;
  }

  vec3 p = ro + rd * t;
  vec3 n = calcNormal(p);
  float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
  vec3 refl = env(reflect(rd, n));

  // refract into the rod, march through it, refract out
  vec3 rdi = refract(rd, n, 1.0 / 1.5);
  vec3 pi = p - n * 0.004;
  float ti = 0.0;
  for (int i = 0; i < 40; i++) {
    float d = -map(pi + rdi * ti);
    if (d < 0.0008) break;
    ti += max(d, 0.003);
    if (ti > 3.0) break;
  }
  vec3 pe = pi + rdi * ti;
  vec3 ne = -calcNormal(pe);
  vec3 rdo = refract(rdi, ne, 1.5);
  if (dot(rdo, rdo) < 0.0001) rdo = reflect(rdi, ne);
  vec3 absorb = exp(-ti * uAbsorb);
  vec3 refr = env(rdo) * absorb;

  vec3 col = mix(refr, refl, clamp(fres * 0.9 + 0.06, 0.0, 1.0));

  vec3 h1 = normalize(normalize(vec3(-0.5, 0.8, 0.6)) - rd);
  col += vec3(1.0) * pow(max(dot(n, h1), 0.0), 110.0) * 1.6;
  vec3 h2 = normalize(normalize(vec3(0.9, 0.15, 0.45)) - rd);
  col += uRose * pow(max(dot(n, h2), 0.0), 45.0) * 0.7;
  col += uRim * fres * 0.25;

  col = col / (1.0 + col * 0.3);
  float a = clamp(0.58 + fres * 0.55 + (1.0 - absorb.r) * 0.25, 0.0, 1.0);
  gl_FragColor = vec4(col, a * intro * uAlpha);
}`;

  const THEMES = {
    dark: {
      top: [0.58, 0.88, 0.86], bottom: [0.05, 0.26, 0.26],
      absorb: [0.8, 0.18, 0.26], rose: [1.0, 0.6, 0.68], rim: [0.56, 0.94, 0.87], alpha: 1,
    },
    light: {
      top: [0.97, 1.0, 1.0], bottom: [0.45, 0.68, 0.66],
      absorb: [1.4, 0.45, 0.55], rose: [1.0, 0.55, 0.64], rim: [0.06, 0.49, 0.45], alpha: 1,
    },
  };

  function init() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false, powerPreference: 'high-performance' });
    if (!gl) { visual.classList.add('no-gl'); canvas.remove(); return; }

    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
      return sh;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const U = {};
    ['uRes', 'uTime', 'uMouse', 'uIntro', 'uEnvTop', 'uEnvBottom', 'uAbsorb', 'uRose', 'uRim', 'uAlpha']
      .forEach((name) => { U[name] = gl.getUniformLocation(prog, name); });

    const small = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75);
    let intro = reduce ? 1 : 0;
    let introStart = -1;
    let elapsed = 0;
    let last = performance.now();
    const mouse = { x: 0, y: 0, sx: 0, sy: 0 };

    function applyTheme() {
      const t = THEMES[document.documentElement.getAttribute('data-theme')] || THEMES.dark;
      gl.uniform3fv(U.uEnvTop, t.top);
      gl.uniform3fv(U.uEnvBottom, t.bottom);
      gl.uniform3fv(U.uAbsorb, t.absorb);
      gl.uniform3fv(U.uRose, t.rose);
      gl.uniform3fv(U.uRim, t.rim);
      gl.uniform1f(U.uAlpha, t.alpha);
      if (reduce) draw();
    }

    function resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U.uRes, canvas.width, canvas.height);
      if (reduce) draw();
    }

    function draw() {
      gl.uniform1f(U.uTime, elapsed);
      gl.uniform1f(U.uIntro, intro);
      gl.uniform2f(U.uMouse, mouse.sx, mouse.sy);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    window.addEventListener('pointermove', (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    }, { passive: true });
    window.addEventListener('resize', resize);
    window.addEventListener('themechange', applyTheme);
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);

    const startIntro = () => { if (introStart < 0) introStart = performance.now(); };
    if (window.__heroIntro) startIntro();
    window.addEventListener('hero:intro', startIntro);
    setTimeout(startIntro, 6000); // failsafe if the loader never signals

    let visible = true;
    let running = !document.hidden;
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(visual);
    document.addEventListener('visibilitychange', () => { running = !document.hidden; last = performance.now(); });
    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); running = false; });

    applyTheme();
    resize();

    if (reduce) { draw(); return; }

    const frame = (now) => {
      requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!running || !visible) return;
      elapsed += dt;
      if (introStart >= 0 && intro < 1) intro = Math.min(1, (performance.now() - introStart) / 2200);
      mouse.sx += (mouse.x - mouse.sx) * 0.05;
      mouse.sy += (mouse.y - mouse.sy) * 0.05;
      draw();
    };
    requestAnimationFrame(frame);
  }

  try { init(); } catch (err) { console.warn('Hero WebGL disabled:', err); visual.classList.add('no-gl'); canvas.remove(); }
})();
