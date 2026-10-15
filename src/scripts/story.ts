// The architecture explorer is progressively enhanced: all steps remain readable without JS.
const steps = [...document.querySelectorAll<HTMLAnchorElement>('.flow-steps a')];
const panels = [...document.querySelectorAll<HTMLElement>('.flow-panel')];
function selectStep(id: string) {
 if (!panels.some(panel => '#' + panel.id === id)) return;
 panels.forEach(panel => { panel.hidden = '#' + panel.id !== id; });
 steps.forEach(step => { step.setAttribute('aria-expanded', String(step.hash === id)); if(step.hash === id) step.setAttribute('aria-current','step'); else step.removeAttribute('aria-current'); });
}
if(steps.length) {
 selectStep(location.hash.startsWith('#step-') ? location.hash : steps[0].hash);
 steps.forEach(step => { step.setAttribute('role', 'button'); step.addEventListener('keydown', event => { if(event.key === ' ') { event.preventDefault(); selectStep(step.hash); } }); });
 steps.forEach(step => step.addEventListener('click', event => {
  // Keep native modified-link behaviour and keyboard activation.
  if(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault(); selectStep(step.hash);
 }));
 addEventListener('hashchange', () => selectStep(location.hash));
}
