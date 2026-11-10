(function (global) {
  'use strict';

  const motion = global.BIRD_MOTION;
  if (!motion || !Array.isArray(motion.frames)) {
    throw new Error('PixelBirdBackground: 请先加载 bird-motion.js');
  }

  const points = motion.frames.flat();
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const [x, y] of points) {
    const px = motion.xPhase + x * motion.pitch;
    const py = motion.yPhase + y * motion.pitch;
    minX = Math.min(minX, px);
    maxX = Math.max(maxX, px);
    minY = Math.min(minY, py);
    maxY = Math.max(maxY, py);
  }

  const sourceWidth = maxX - minX;
  const sourceHeight = maxY - minY;
  const sourceCenterX = (minX + maxX) * 0.5;
  const sourceCenterY = (minY + maxY) * 0.5;
  const fieldStride = 4096;
  const fieldOffset = 2048;
  const haloRadius = 4;
  const fieldKey = (x, y) => (y + fieldOffset) * fieldStride + x + fieldOffset;

  // Precompute once: the bird core and its four-step, size-falloff edge.
  const frameFields = motion.frames.map((frame) => {
    const field = new Map();
    for (const [pointX, pointY] of frame) {
      for (let offsetY = -haloRadius; offsetY <= haloRadius; offsetY += 1) {
        for (let offsetX = -haloRadius; offsetX <= haloRadius; offsetX += 1) {
          const distance = Math.hypot(offsetX, offsetY);
          if (distance > haloRadius) continue;
          const strength = distance < 0.5
            ? 1
            : Math.pow(1 - distance / (haloRadius + 0.55), 1.45) * 0.72;
          const key = fieldKey(pointX + offsetX, pointY + offsetY);
          field.set(key, Math.max(field.get(key) || 0, strength));
        }
      }
    }
    return field;
  });

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (start, end, amount) => start + (end - start) * amount;
  const easeInOutSine = (value) => -(Math.cos(Math.PI * value) - 1) / 2;

  function resolveTarget(target) {
    if (target instanceof Element) return target;
    if (typeof target === 'string') return document.querySelector(target);
    return document.body;
  }

  function mount(options = {}) {
    const target = resolveTarget(options.target);
    if (!target) throw new Error('PixelBirdBackground: 找不到目标容器');

    const duration = Math.max(4, Number(options.duration) || 20);
    const color = options.color || '#ffffff';
    const sizeScale = clamp(Number(options.sizeScale) || 1, 0.6, 1.8);
    const startProgress = clamp(Number(options.startProgress ?? 0.14), 0, 0.95);
    const isPageBackground = target === document.body || target === document.documentElement;
    const originalPosition = target.style.position;

    if (!isPageBackground && getComputedStyle(target).position === 'static') {
      target.style.position = 'relative';
    }

    const canvas = document.createElement('canvas');
    canvas.className = 'pixel-bird-background';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.dataset.pixelBirdBackground = '';
    Object.assign(canvas.style, {
      position: isPageBackground ? 'fixed' : 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      display: 'block',
      pointerEvents: 'none',
      zIndex: String(options.zIndex ?? 0),
    });
    target.prepend(canvas);

    const ctx = canvas.getContext('2d');
    const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let dpr = 1;
    let elapsed = duration * startProgress;
    let last = performance.now();
    let raf = 0;
    let paused = false;
    let destroyed = false;

    function resize() {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render();
    }

    function draw(time) {
      if (!width || !height) return;

      const reduced = motionPreference.matches;
      const cycleTime = reduced ? duration * 0.58 : time % duration;
      const progress = reduced ? 0.58 : clamp(cycleTime / duration, 0, 1);
      const eased = easeInOutSine(progress);
      const wingCycle = (time * motion.fps / motion.frames.length) % 1;
      const wingPulse = reduced ? 0 : Math.sin(wingCycle * Math.PI * 2 - 0.7);
      const scale = Math.min(width * 0.56 / sourceWidth, height * 0.88 / sourceHeight) * sizeScale;
      const startX = width * (width < 720 ? 0.42 : 0.22);
      const endX = width * (width < 720 ? 0.64 : 0.82);
      const x = lerp(startX, endX, eased) + wingPulse * 1.1 * scale;
      const y = lerp(height * 0.65, height * 0.23, eased) + wingPulse * 2.4 * scale;
      const frameIndex = reduced
        ? Math.min(12, motion.frames.length - 1)
        : Math.floor(time * motion.fps) % motion.frames.length;
      const field = frameFields[frameIndex];
      const presence = reduced
        ? 1
        : Math.min(clamp(progress / 0.05, 0, 1), clamp((1 - progress) / 0.06, 0, 1));
      const gridPitch = Math.max(9.5, motion.pitch * scale);
      const ambientSize = clamp(gridPitch * 0.13, 0.9, 1.7);
      const birdSize = Math.min(gridPitch * 0.72, Math.max(3.4, 5.7 * scale));
      const columns = Math.ceil(width / gridPitch);
      const rows = Math.ceil(height / gridPitch);

      ctx.save();
      ctx.fillStyle = color;
      for (let row = 0; row <= rows; row += 1) {
        const gridY = row * gridPitch + gridPitch * 0.5;
        for (let column = 0; column <= columns; column += 1) {
          const gridX = column * gridPitch + gridPitch * 0.5;
          const sourceX = Math.round(((gridX - x) / scale + sourceCenterX - motion.xPhase) / motion.pitch);
          const sourceY = Math.round(((gridY - y) / scale + sourceCenterY - motion.yPhase) / motion.pitch);
          const strength = (field.get(fieldKey(sourceX, sourceY)) || 0) * presence;
          const twinkle = reduced
            ? 0.35
            : (Math.sin(time * 0.7 + column * 1.73 + row * 0.91) + 1) * 0.5;
          const size = lerp(ambientSize, birdSize, Math.pow(strength, 0.82));
          ctx.globalAlpha = clamp(0.055 + twinkle * 0.075 + strength * 0.86, 0.04, 0.96);
          ctx.fillRect(
            Math.round(gridX - size / 2),
            Math.round(gridY - size / 2),
            size,
            size,
          );
        }
      }
      ctx.restore();
    }

    function render() {
      ctx.clearRect(0, 0, width, height);
      draw(elapsed);
    }

    function tick(now) {
      if (destroyed) return;
      if (!paused && !motionPreference.matches && !document.hidden) {
        elapsed += Math.min((now - last) / 1000, 0.1);
        render();
      }
      last = now;
      raf = requestAnimationFrame(tick);
    }

    const resizeObserver = new ResizeObserver(resize);
    const onVisibility = () => { last = performance.now(); };
    const onMotionPreference = () => render();
    resizeObserver.observe(canvas);
    document.addEventListener('visibilitychange', onVisibility);
    motionPreference.addEventListener('change', onMotionPreference);
    resize();
    raf = requestAnimationFrame(tick);

    return {
      canvas,
      play() {
        paused = false;
        last = performance.now();
      },
      pause() {
        paused = true;
        render();
      },
      reset(progress = startProgress) {
        elapsed = duration * clamp(Number(progress) || 0, 0, 0.99);
        render();
      },
      destroy() {
        if (destroyed) return;
        destroyed = true;
        cancelAnimationFrame(raf);
        resizeObserver.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        motionPreference.removeEventListener('change', onMotionPreference);
        canvas.remove();
        if (!isPageBackground) target.style.position = originalPosition;
      },
    };
  }

  global.PixelBirdBackground = { mount };
})(window);
