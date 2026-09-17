export function buildCatalog(config, inventories, library = { skills: [] }, now = Date.now()) {
  const machines = config.machines.map(machine => {
    const inventory = inventories.find(x => x.machine.id === machine.id);
    return { ...machine, scannedAt: inventory?.scannedAt || null, receivedAt: inventory?.receivedAt || null,
      state: !inventory ? 'unconnected' : now - Date.parse(inventory.receivedAt || inventory.scannedAt) > config.staleAfterMs ? 'stale' : 'live',
      warnings: inventory?.warnings || [], count: inventory?.skills.length || 0 };
  });
  const rows = new Map();
  for (const inventory of inventories) for (const skill of inventory.skills) {
    if (!rows.has(skill.id)) rows.set(skill.id, { ...skill, machines: {} });
    rows.get(skill.id).machines[inventory.machine.id] = skill;
  }
  for (const desired of library.skills || []) {
    if (!rows.has(desired.id)) rows.set(desired.id, { ...desired, machines: {} });
    Object.assign(rows.get(desired.id), { desired });
  }
  const skills = [...rows.values()].map(row => {
    const hashes = new Set(Object.values(row.machines).map(x => x.hash).filter(Boolean));
    return { ...row, examplePrompt: row.desired?.examplePrompt || row.examplePrompt,
      statuses: machines.map(machine => {
        const installed = row.machines[machine.id];
        if (machine.state !== 'live') return { machineId: machine.id, state: 'unknown', label: machine.state === 'stale' ? 'Inventory stale' : 'Not connected', lastKnown: installed?.state || null };
        if (!installed) {
          const inventory = inventories.find(x => x.machine.id === machine.id);
          const scope = inventory.roots.find(x => x.origin === row.origin);
          const uncertain = inventory.warnings.length > 0 || row.kind === 'project' && !scope || scope?.state === 'error';
          return { machineId: machine.id, state: uncertain ? 'unknown' : 'missing', label: uncertain ? 'Scan incomplete or scope not configured' : 'Not installed' };
        }
        if (installed.state !== 'installed') return { machineId: machine.id, state: 'attention', label: installed.state === 'disabled' ? 'Installed but disabled' : 'Cached; enablement unverified' };
        if (!installed.hash) return { machineId: machine.id, state: 'attention', label: 'Fingerprint unavailable' };
        if (hashes.size > 1 || row.desired?.expectedHash && installed.hash !== row.desired.expectedHash) return { machineId: machine.id, state: 'attention', label: 'Content differs' };
        return { machineId: machine.id, state: 'installed', label: 'Installed · dependencies not checked' };
      }) };
  }).sort((a,b) => a.name.localeCompare(b.name));
  return { generatedAt: new Date(now).toISOString(), machines, skills, libraryCount: library.skills?.length || 0 };
}
