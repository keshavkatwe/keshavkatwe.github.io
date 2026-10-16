type BayKind = 'empty' | 'bug' | 'release' | 'caught' | 'mistake';
type RoundState = 'ready' | 'playing' | 'paused' | 'finished';

const game = document.querySelector<HTMLElement>('[data-bugbash]');
if (game) {
  const find = <T extends HTMLElement = HTMLElement>(key: string) => game.querySelector<T>(`[data-bb-${key}]`)!;
  const bays = Array.from(game.querySelectorAll<HTMLButtonElement>('[data-bb-bay]'));
  const arena = find('arena');
  const overlay = find('overlay');
  const startButton = find<HTMLButtonElement>('start');
  const pauseButton = find<HTMLButtonElement>('pause');
  const scoreElement = find('score');
  const bestElement = find('best');
  const secondsElement = find('seconds');
  const comboElement = find('combo');
  const progress = find('progress');
  const live = find('live');
  const milestoneElements = Array.from(game.querySelectorAll<HTMLButtonElement>('[data-bb-milestone]'));
  const duration = 30_000;
  const storageKey = 'keshav-bug-bash-best-v1';
  const facts = [
    { threshold: 200, title: '11+ years. Still curious.', copy: 'React, React Native, TypeScript and frontend architecture. From the foundations to the finishing touches.', href: '#about', label: 'Meet the engineer', number: '11+' },
    { threshold: 500, title: 'An idea. An entire product.', copy: 'Pushwing: a publishing dashboard, API, hosted MCP server and background workers, built from scratch.', href: '/work/pushwing/', label: 'Inside Pushwing', number: '01' },
    { threshold: 850, title: 'Conversations with memory.', copy: 'Agenvik connects document-grounded LangGraph agents with WhatsApp, Slack and the web.', href: '/work/agenvik/', label: 'Inside Agenvik', number: '02' },
    { threshold: 1200, title: 'Built for the thumb zone.', copy: 'At InvestSky, owned the React Native rebuild from architecture through release on iOS and Android.', href: '/work/investsky/', label: 'Inside the mobile rebuild', number: '03' },
    { threshold: 1600, title: 'Make the whole team faster.', copy: 'At Sense, led frontend teams while staying hands-on with deployment, forms and shared engineering systems.', href: '/work/sense/', label: 'Inside the systems', number: '04' },
  ];
  let state: RoundState = 'ready';
  let score = 0;
  let best = 0;
  let cleanCatches = 0;
  let totalCatches = 0;
  let mistakes = 0;
  let remaining = duration;
  let previousTime = 0;
  let waveRemaining = 0;
  let frame = 0;
  let discovered = 0;
  let lastAnnouncedSecond = 30;
  let previousWave: number[] = [];
  try { best = Math.max(0, Number(localStorage.getItem(storageKey)) || 0); } catch { /* Storage can be unavailable in a private session. */ }

  const format = (value: number) => String(value).padStart(4, '0');
  function renderBest() { bestElement.replaceChildren(document.createTextNode(format(best))); const arrow = document.createElement('span'); arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true'); bestElement.append(arrow); }
  renderBest();

  function announce(message: string) { live.textContent = message; }
  function setBay(index: number, kind: BayKind) {
    const bay = bays[index];
    bay.dataset.kind = kind;
    const name = kind === 'bug' ? 'bug, catch for 100 points' : kind === 'release' ? 'release, avoid or lose 150 points' : kind === 'caught' ? 'caught' : kind === 'mistake' ? 'release hit' : 'empty';
    bay.setAttribute('aria-label', `Bay ${index + 1}, ${name}`);
    bay.querySelector<HTMLElement>('[data-bb-target-word]')!.textContent = kind === 'bug' ? 'CATCH ME' : kind === 'release' ? 'DO NOT HIT' : 'STANDBY';
    if (kind !== 'caught' && kind !== 'mistake') bay.querySelector<HTMLElement>('[data-bb-feedback]')!.textContent = '';
  }
  function clearBays() { bays.forEach((_, i) => setBay(i, 'empty')); }
  function setInteractivity(enabled: boolean) { bays.forEach(bay => { bay.disabled = !enabled; }); }
  function nextWave() {
    clearBays();
    const indices = [0, 1, 2, 3, 4, 5];
    // Fisher–Yates gives every bay an equal chance without repeating targets within a wave.
    for (let i = indices.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [indices[i], indices[j]] = [indices[j], indices[i]]; }
    if (indices[0] === previousWave[0] && indices[1] === previousWave[1]) [indices[0], indices[3]] = [indices[3], indices[0]];
    setBay(indices[0], 'bug');
    setBay(indices[1], 'bug');
    setBay(indices[2], 'release');
    previousWave = indices.slice(0, 3);
    waveRemaining = 1450;
  }
  function updateHud() {
    const formattedScore = format(score);
    const combo = `×${Math.min(3, 1 + Math.floor(cleanCatches / 3))}`;
    const seconds = String(Math.ceil(remaining / 1000));
    if (scoreElement.textContent !== formattedScore) scoreElement.textContent = formattedScore;
    if (comboElement.textContent !== combo) comboElement.textContent = combo;
    if (secondsElement.textContent !== seconds) secondsElement.textContent = seconds;
    progress.style.transform = `scaleX(${Math.max(0, remaining / duration)})`;
    game!.classList.toggle('bb-urgent', remaining <= 10_000 && state === 'playing');
  }
  function showFact(index: number) {
    const fact = facts[index];
    find('fact-number').textContent = fact.number;
    find('fact-title').textContent = fact.title;
    find('fact-copy').textContent = fact.copy;
    const link = find<HTMLAnchorElement>('fact-link');
    link.href = fact.href;
    link.replaceChildren(document.createTextNode(`${fact.label} `));
    const arrow = document.createElement('span'); arrow.setAttribute('aria-hidden', 'true'); arrow.textContent = '↗'; link.append(arrow);
    milestoneElements.forEach((milestone, i) => milestone.setAttribute('aria-pressed', String(i === index)));
  }
  function revealFacts() {
    const unlocked = facts.filter(fact => score >= fact.threshold).length;
    if (unlocked <= discovered) return;
    discovered = unlocked;
    const fact = facts[discovered - 1];
    milestoneElements.forEach((milestone, i) => {
      milestone.classList.toggle('bb-unlocked', i < discovered);
      milestone.disabled = i >= discovered;
      if (i < discovered) {
        milestone.setAttribute('aria-label', `Snapshot ${i + 1}: ${facts[i].title}`);
        milestone.title = `View ${facts[i].label.toLowerCase()}. Pauses an active game.`;
      }
    });
    showFact(discovered - 1);
    find('milestones').setAttribute('aria-label', `${discovered} of 5 engineering snapshots discovered`);
    announce(`Snapshot unlocked: ${fact.title} ${fact.copy}`);
  }
  function hit(index: number) {
    if (state !== 'playing') return;
    const kind = bays[index].dataset.kind as BayKind;
    if (kind === 'bug') {
      const multiplier = Math.min(3, 1 + Math.floor(cleanCatches / 3));
      const points = 100 * multiplier;
      score += points;
      cleanCatches++;
      totalCatches++;
      setBay(index, 'caught');
      bays[index].querySelector<HTMLElement>('[data-bb-feedback]')!.textContent = `+${points}`;
      find('state').textContent = cleanCatches > 2 ? `CLEAN STREAK / ${cleanCatches} BUGS CAUGHT` : 'NICE CATCH. KEEP SHIPPING.';
      updateHud(); revealFacts();
    } else if (kind === 'release') {
      score = Math.max(0, score - 150);
      cleanCatches = 0;
      mistakes++;
      setBay(index, 'mistake');
      bays[index].querySelector<HTMLElement>('[data-bb-feedback]')!.textContent = '−150';
      find('state').textContent = 'THAT WAS A RELEASE. PROTECT THE BLUE ONES.';
      updateHud();
      announce('Release hit. 150 points lost. Streak reset.');
    }
  }
  function showOverlay(kicker: string, title: string, copy: string, button: string, note: string, symbol: string) {
    find('overlay-kicker').textContent = kicker;
    find('overlay-title').textContent = title;
    find('overlay-copy').textContent = copy;
    find('start-label').textContent = button;
    find('overlay-note').textContent = note;
    find('overlay-symbol').textContent = symbol;
    overlay.hidden = false;
  }
  function finish() {
    state = 'finished';
    remaining = 0;
    cancelAnimationFrame(frame);
    game!.dataset.gameState = state;
    game!.classList.remove('bb-urgent');
    setInteractivity(false);
    pauseButton.disabled = true;
    const newBest = score > best;
    if (newBest) { best = score; try { localStorage.setItem(storageKey, String(best)); } catch {} renderBest(); }
    updateHud();
    const title = score >= 2500 ? 'Ship it.\nYou earned it.' : score >= 1000 ? 'Good catch.\nGreat instincts.' : 'First release.\nMany more to go.';
    showOverlay(newBest ? 'NEW PERSONAL BEST / NICE WORK' : 'RELEASE COMPLETE / GOOD GAME', title, `${format(score)} points · ${totalCatches} bugs caught · ${mistakes} release${mistakes === 1 ? '' : 's'} hit.`, 'Run it back', 'The work behind these pixels is worth a look, too.', '✓');
    find('state').textContent = 'BUILD COMPLETE / THANKS FOR PLAYING';
    announce(`Round complete. ${score} points, ${totalCatches} bugs caught, ${mistakes} releases hit.${newBest ? ' New personal best.' : ''}`);
    startButton.focus({ preventScroll: true });
  }
  function tick(now: number) {
    if (state !== 'playing') return;
    const elapsed = now - previousTime;
    previousTime = now;
    remaining = Math.max(0, remaining - elapsed);
    waveRemaining -= elapsed;
    if (remaining === 0) { finish(); return; }
    if (waveRemaining <= 0) nextWave();
    updateHud();
    const second = Math.ceil(remaining / 1000);
    if (second !== lastAnnouncedSecond && (second === 20 || second === 10 || second === 5)) { lastAnnouncedSecond = second; announce(`${second} seconds left. ${score} points.`); }
    frame = requestAnimationFrame(tick);
  }
  function play() {
    const isResume = state === 'paused';
    if (state === 'playing') return;
    if (!isResume) {
      score = 0; cleanCatches = 0; totalCatches = 0; mistakes = 0; remaining = duration; lastAnnouncedSecond = 30; previousWave = [];
      nextWave();
    }
    state = 'playing';
    game!.dataset.gameState = state;
    overlay.hidden = true;
    setInteractivity(true);
    pauseButton.disabled = false;
    find('pause-label').textContent = 'Pause';
    pauseButton.setAttribute('aria-label', 'Pause game');
    find('state').textContent = 'BUILD IN PROGRESS / CATCH THE ACID-GREEN BUGS';
    previousTime = performance.now();
    updateHud();
    arena.focus({ preventScroll: true });
    announce(isResume ? 'Game resumed.' : 'Game started. 30 seconds. Catch green bugs. Avoid blue releases. Use keys 1 to 6 or tap the bays.');
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(tick);
  }
  function pause(away = false) {
    if (state !== 'playing') return;
    // Account for the fraction of a frame before the pause event.
    remaining = Math.max(0, remaining - (performance.now() - previousTime));
    cancelAnimationFrame(frame);
    if (remaining === 0) { finish(); return; }
    state = 'paused';
    game!.dataset.gameState = state;
    game!.classList.remove('bb-urgent');
    setInteractivity(false);
    pauseButton.disabled = true;
    updateHud();
    showOverlay('TAKE YOUR TIME. THE BUILD CAN WAIT.', 'Coffee\nbreak?', away ? 'Paused while you were away. Your time and score are right where you left them.' : 'Your score is safe. Take a breath, then get back to the good stuff.', 'Back to the bugs', `${Math.ceil(remaining / 1000)} seconds remaining · ${format(score)} points`, 'Ⅱ');
    find('state').textContent = 'BUILD PAUSED / NO RUSH';
    announce('Game paused. Select Back to the bugs to resume.');
    if (!away) startButton.focus({ preventScroll: true });
  }
  bays.forEach((bay, index) => bay.addEventListener('click', () => hit(index)));
  startButton.addEventListener('click', play);
  pauseButton.addEventListener('click', () => pause());
  milestoneElements.forEach((milestone, index) => milestone.addEventListener('click', () => {
    if (index >= discovered) return;
    if (state === 'playing') pause(true);
    showFact(index);
    announce(`${facts[index].title} ${facts[index].copy}`);
  }));
  game.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
    if (state === 'playing' && /^[1-6]$/.test(event.key)) { event.preventDefault(); hit(Number(event.key) - 1); }
    else if (event.key.toLowerCase() === 'p' || event.key === 'Escape') {
      if (state === 'playing') { event.preventDefault(); pause(); }
      else if (state === 'paused' && event.key.toLowerCase() === 'p') { event.preventDefault(); play(); }
    }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(true); });
  window.addEventListener('pagehide', () => { cancelAnimationFrame(frame); if (state === 'playing') pause(true); });
  // Pause on focus leaving the game so keyboard players can explore the page freely.
  game.addEventListener('focusout', event => {
    if (state !== 'playing') return;
    const next = event.relatedTarget;
    if (next instanceof Node && !game!.contains(next)) pause(true);
  });
  game.dataset.gameState = state;
}
