const $ = selector => document.querySelector(selector);
let catalog = null, activeTab = 'all', selectedId = null;
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
const relative = timestamp => { if (!timestamp) return 'Never checked'; const seconds = Math.max(0, Math.floor((Date.now() - Date.parse(timestamp))/1000)); return seconds < 60 ? `${seconds}s ago` : `${Math.floor(seconds/60)}m ago`; };
const kindLabel = kind => ({personal:'Personal',builtin:'Built-in',plugin:'Plugin',project:'Project'}[kind] || kind);
function render() {
  if (!catalog) return;
  $('#total').textContent = catalog.skills.length;
  $('#count-all').textContent = catalog.skills.length;
  $('#count-builtin').textContent = catalog.skills.filter(x => x.kind === 'builtin').length;
  $('#count-mine').textContent = catalog.skills.filter(x => x.kind !== 'builtin').length;
  $('#machine-summary').innerHTML = catalog.machines.map(machine => `<div class="machine-block"><strong><i class="dot ${machine.state === 'live' ? 'installed' : 'unknown'}"></i>${escape(machine.name)}</strong><p>${machine.state === 'unconnected' ? 'Not connected yet' : `${machine.count} skills · ${machine.state === 'stale' ? 'stale · ' : ''}${relative(machine.receivedAt || machine.scannedAt)}`}</p></div>`).join('');
  catalog.machines.forEach((machine, i) => { const heading = $(`#machine-${i}`); if (heading) heading.textContent = machine.name; });
  const local = catalog.machines.find(x => x.scannedAt);
  $('#updated').textContent = local ? `Last received ${relative(local.receivedAt || local.scannedAt)}` : 'Waiting for first scan';
  const query = $('#search').value.toLowerCase().trim(), source = $('#source').value;
  const rows = catalog.skills.filter(skill => (activeTab === 'all' || (activeTab === 'builtin' ? skill.kind === 'builtin' : skill.kind !== 'builtin')) && (source === 'all' || skill.kind === source) && `${skill.name} ${skill.description} ${skill.sourceLabel}`.toLowerCase().includes(query));
  $('#skills').innerHTML = rows.length ? rows.map((skill, index) => `<tr><td class="number">${String(index+1).padStart(2,'0')}</td><td><button class="skill-name" data-detail="${escape(skill.id)}">${escape(skill.name)}</button>${skill.duplicate ? '<span class="duplicate">duplicate name</span>' : ''}<p class="description" title="${escape(skill.description)}">${escape(skill.description)}</p></td><td><div class="prompt"><code title="${escape(skill.examplePrompt)}">$${escape(skill.name)}</code><button class="copy" data-copy="${escape(skill.id)}" aria-label="Copy invocation starter for ${escape(skill.name)}" title="Copy invocation starter">⧉</button></div></td><td><span class="badge">${escape(kindLabel(skill.kind))}</span><p class="source-detail">${escape(skill.sourceLabel || skill.origin)}</p></td>${skill.statuses.map(status => `<td class="status-cell"><span class="dot ${escape(status.state)}" role="img" aria-label="${escape(status.label)}" title="${escape(status.label)}"></span>${status.state !== 'installed' ? `<small class="status-label">${escape(status.label)}</small>` : ''}</td>`).join('')}</tr>`).join('') : '<tr><td colspan="6" class="empty">No skills match. Try a different search or source.</td></tr>';
  $('#shown').textContent = `Showing ${rows.length} of ${catalog.skills.length} skills · auto-refreshes`;
  $('#manifest-status').textContent = catalog.libraryCount ? `${catalog.libraryCount} approved skills in the desired-setup manifest.` : 'GitHub-ready scaffold: no approved skill packages or upstream pins have been added yet.';
  $('#warnings').innerHTML = catalog.machines.map(machine => machine.warnings.length ? `<details><summary>${escape(machine.name)}: ${machine.warnings.length} scan warnings</summary><ul>${machine.warnings.map(w => `<li>${escape(w)}</li>`).join('')}</ul></details>` : '').join('');
}
function showDetail(id) {
  selectedId = id;
  const skill = catalog.skills.find(x => x.id === id);
  if (!skill) return;
  $('#detail-name').textContent = skill.name;
  $('#detail-description').textContent = skill.description;
  $('#detail-content').innerHTML = `<p>Invocation starter—not a task-specific example:</p><div class="prompt"><code>${escape(skill.examplePrompt)}</code><button class="copy" data-copy="${escape(skill.id)}" aria-label="Copy invocation starter">⧉</button></div>` + catalog.machines.map(machine => {
    const item = skill.machines[machine.id], status = skill.statuses.find(x => x.machineId === machine.id);
    return `<section class="detail-machine"><h3><i class="dot ${escape(status.state)}"></i> ${escape(machine.name)} · ${escape(status.label)}</h3>${item ? `<code>${escape(item.path)}</code><small>Observed cache version: ${escape(item.version || 'Not versioned')}<br>Package SHA-256: ${escape(item.hash || item.hashError || 'Unavailable')}<br>${escape(item.setup)}</small>` : '<p>No current verified installation record.</p>'}</section>`;
  }).join('');
  if (!$('#detail').open) $('#detail').showModal();
}
async function load() {
  try {
    const response = await fetch('/api/catalog');
    if (!response.ok) throw new Error(`Inventory request failed (${response.status})`);
    catalog = await response.json();
    $('#error').hidden = !catalog.lastScanError;
    $('#error').textContent = catalog.lastScanError ? `Scanner error: ${catalog.lastScanError}. Displaying last-known inventory.` : '';
    render();
    if ($('#detail').open && selectedId) showDetail(selectedId);
  } catch (e) {
    $('#error').hidden = false;
    $('#error').textContent = `${e.message}. The service may be restarting; retrying automatically. ${catalog ? 'Displayed statuses are last-known and may be stale.' : ''}`;
    if (!catalog) $('#skills').innerHTML = '<tr><td colspan="6" class="empty">Inventory unavailable. Check the service and reload.</td></tr>';
  }
}
$('#tabs').addEventListener('click', event => {
  const button = event.target.closest('[data-tab]'); if (!button) return;
  activeTab = button.dataset.tab;
  document.querySelectorAll('[data-tab]').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', item === button ? 'true' : 'false'); });
  render();
});
$('#search').addEventListener('input', render); $('#source').addEventListener('change', render);
document.addEventListener('keydown', event => { if (event.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName) && !$('#detail').open) { event.preventDefault(); $('#search').focus(); } });
document.addEventListener('click', async event => {
  const detail = event.target.closest('[data-detail]'); if (detail) showDetail(detail.dataset.detail);
  const copy = event.target.closest('[data-copy]');
  if (copy) {
    const skill = catalog.skills.find(x => x.id === copy.dataset.copy);
    try {
      if (!navigator.clipboard) throw new Error('Clipboard requires a secure context');
      await navigator.clipboard.writeText(skill.examplePrompt);
      copy.textContent = '✓'; setTimeout(() => { copy.textContent = '⧉'; }, 1600);
    } catch { showDetail(skill.id); $('#error').hidden = false; $('#error').textContent = 'Clipboard unavailable on this address. Select and copy the invocation starter in skill details.'; }
  }
});
$('#close-detail').addEventListener('click', () => $('#detail').close());
$('#detail').addEventListener('click', event => { if (event.target === $('#detail')) { const r = $('#detail').getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) $('#detail').close(); } });
$('#export').addEventListener('click', () => { if (!catalog) return; const url = URL.createObjectURL(new Blob([JSON.stringify(catalog,null,2)], {type:'application/json'})); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'codex-skill-inventory.json'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url),1000); });
await load(); setInterval(load, 15000);
