const root = document.documentElement;
const preference = matchMedia('(prefers-reduced-motion: reduce)');
const toggle = document.querySelector<HTMLButtonElement>('#motion-toggle');
let userPaused = false;
try { userPaused = localStorage.getItem('portfolio-motion') === 'paused'; } catch {}
function syncMotion() {
 const paused = userPaused || preference.matches;
 root.classList.toggle('motion-off', paused);
 toggle?.setAttribute('aria-pressed', String(paused));
 toggle?.setAttribute('aria-label', paused ? (preference.matches ? 'Reduced motion enabled by device' : 'Enable animations') : 'Pause animations');
 if(toggle) { toggle.title = paused ? 'Motion paused' : 'Pause animations'; toggle.textContent = paused ? '▷' : 'Ⅱ'; }
 document.dispatchEvent(new CustomEvent('portfolio-motionchange', { detail: { paused } }));
}
syncMotion();
preference.addEventListener('change', syncMotion);
toggle?.addEventListener('click', () => { userPaused = !root.classList.contains('motion-off'); try { localStorage.setItem('portfolio-motion', userPaused ? 'paused' : 'on'); } catch {} syncMotion(); });
document.querySelector('.hero')?.classList.add('hero-enter');
const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }, { threshold: .06 });
document.querySelectorAll('.project, .work-heading, .about-copy, .about-art, .contact-title').forEach(el => { el.classList.add('reveal'); observer.observe(el); });
let scrollFrame = 0;
const progress = document.querySelector<HTMLElement>('.scroll-progress');
const updateProgress = () => { const range = root.scrollHeight - innerHeight; if(progress) progress.style.transform = `scaleX(${range > 0 ? scrollY / range : 0})`; scrollFrame = 0; };
addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress); }, { passive: true });
addEventListener('resize', updateProgress); updateProgress();
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const cursor = document.querySelector<HTMLElement>('.cursor-label');
document.querySelectorAll<HTMLElement>('[data-tilt]').forEach(card => {
 let tiltFrame = 0;
 card.addEventListener('pointermove', event => {
  if (!finePointer.matches || root.classList.contains('motion-off')) return;
  if(cursor) { cursor.style.left = event.clientX + 'px'; cursor.style.top = event.clientY + 'px'; cursor.classList.add('is-visible'); }
  if(tiltFrame) cancelAnimationFrame(tiltFrame);
  tiltFrame = requestAnimationFrame(() => { const b = card.getBoundingClientRect(); const x = (event.clientX - b.left) / b.width - .5; const y = (event.clientY - b.top) / b.height - .5; card.style.transform = `perspective(1200px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`; tiltFrame = 0; });
 });
 card.addEventListener('pointerleave', () => { cancelAnimationFrame(tiltFrame); card.style.transform = ''; cursor?.classList.remove('is-visible'); });
});
document.addEventListener('portfolio-motionchange', () => { if(root.classList.contains('motion-off')) { cursor?.classList.remove('is-visible'); document.querySelectorAll<HTMLElement>('[data-tilt]').forEach(card=>card.style.transform=''); } });
const avatar = document.querySelector<HTMLElement>('.about-avatar');
avatar?.parentElement?.addEventListener('pointermove', event => { if(root.classList.contains('motion-off') || !finePointer.matches) return; const b=avatar.getBoundingClientRect(); avatar.style.setProperty('--eye-x',`${Math.max(-4,Math.min(4,(event.clientX-b.left-b.width/2)/30))}px`); avatar.style.setProperty('--eye-y',`${Math.max(-4,Math.min(4,(event.clientY-b.top-b.height/2)/30))}px`); });
avatar?.parentElement?.addEventListener('pointerleave', () => { avatar.style.setProperty('--eye-x','0px'); avatar.style.setProperty('--eye-y','0px'); });
const clock = document.querySelector('#dubai-time');
function tick() { if(clock) clock.textContent = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit' }).format(new Date()) + ' GST'; }
tick(); if(clock) setInterval(tick, 60000);
document.querySelector('#copy-email')?.addEventListener('click', async () => { const status = document.querySelector('#copy-status'); try { await navigator.clipboard.writeText('keshav.katwe@gmail.com'); if(status) status.textContent = 'Copied!'; } catch { if(status) status.textContent = 'keshav.katwe@gmail.com'; } });
