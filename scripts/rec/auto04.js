(() => {
  const D = window.__dbg; D.start(); D.step(1/60, 1);
  let f = 0, yaw = null, pitch = 0, reloading = 0;
  window.__frame = () => {
    const st = D.st(); const t = f / 30;
    if (yaw === null) yaw = D.camera.rotation.y;
    const cam = D.camera.position, ds = D.drones().filter(d => d.hp > 0);
    let keys = { KeyW: t > 0.6 && t < 5.5, KeyA: false, KeyD: false, ShiftLeft: t > 1 && t < 4 };
    let fire = false, ads = false;
    if (ds.length && t > 2.5) {
      ds.sort((a, b) => Math.hypot(a.p[0]-cam.x, a.p[2]-cam.z) - Math.hypot(b.p[0]-cam.x, b.p[2]-cam.z));
      const [x, y, z] = ds[0].p, dx = x - cam.x, dy = y - cam.y, dz = z - cam.z;
      const ty = Math.atan2(-dx, -dz), tp = Math.atan2(dy, Math.hypot(dx, dz));
      let dyaw = Math.atan2(Math.sin(ty - yaw), Math.cos(ty - yaw));
      yaw += dyaw * 0.12; pitch += (tp - pitch) * 0.12;
      const onT = Math.abs(dyaw) < 0.05;
      ads = onT || Math.abs(dyaw) < 0.3; fire = onT && (f % 24) < 14;
      keys.KeyA = (f % 120) < 50 && t > 6; keys.KeyD = (f % 120) >= 70 && t > 6;
    } else { yaw += Math.sin(t * 0.7) * 0.004; }
    if (st.ammo === 0 && !reloading) { D.reload(); reloading = 60; }
    if (reloading) { reloading--; fire = false; }
    D.set({ yaw, pitch, fire, ads, keys, hp: Math.max(st.hp, 60) });
    D.step(1/60, 2); f++;
    return f;
  };
  return 'ok';
})()
