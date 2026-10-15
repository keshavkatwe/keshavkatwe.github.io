const root = document.documentElement;
const preference = matchMedia('(prefers-reduced-motion: reduce)');
const toggle = document.querySelector<HTMLButtonElement>('#motion-toggle')!;
let userPaused = false;
try { userPaused = localStorage.getItem('portfolio-motion') === 'paused'; } catch {}
function syncMotion() {
 const paused = userPaused || preference.matches;
 root.classList.toggle('motion-off', paused);
 toggle.setAttribute('aria-pressed', String(paused));
 toggle.setAttribute('aria-label', paused ? 'Enable animations' : 'Pause animations');
 toggle.title = paused ? 'Enable animations' : 'Pause animations';
 toggle.textContent = paused ? '▷' : 'Ⅱ';
}
syncMotion();
preference.addEventListener('change', syncMotion);
toggle.addEventListener('click', () => { userPaused = !root.classList.contains('motion-off'); try { localStorage.setItem('portfolio-motion', userPaused ? 'paused' : 'on'); } catch {} syncMotion(); });
document.querySelector('.hero')?.classList.add('hero-enter');
const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }, { threshold: .08 });
document.querySelectorAll('.project, .section-heading, .about-copy, .about-label, .contact h2').forEach(el => { el.classList.add('reveal'); observer.observe(el); });
let frame = 0;
const progress = document.querySelector<HTMLElement>('.scroll-progress')!;
const updateProgress = () => { const range = document.documentElement.scrollHeight - innerHeight; progress.style.transform = `scaleX(${range > 0 ? scrollY / range : 0})`; frame = 0; };
addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(updateProgress); }, { passive: true });
addEventListener('resize', updateProgress); updateProgress();
const colors = ['#b4a0db', '#eaa484', '#94babe', '#a3b66c']; let color = 0;
document.querySelector('#flower')?.addEventListener('click', () => { root.style.setProperty('--purple', colors[++color % colors.length]); if (!root.classList.contains('motion-off')) document.querySelector('.flower')?.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], { duration: 800, easing: 'cubic-bezier(.22,1,.36,1)' }); });
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
document.querySelectorAll<HTMLElement>('[data-tilt]').forEach(card => {
 card.addEventListener('pointermove', e => { if (!finePointer.matches || root.classList.contains('motion-off')) return; const b = card.getBoundingClientRect(); const x = (e.clientX - b.left) / b.width - .5; const y = (e.clientY - b.top) / b.height - .5; card.style.transform = `perspective(1200px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`; });
 card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});
const clock = document.querySelector('#dubai-time');
function tick() { if(clock) clock.textContent = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit' }).format(new Date()) + ' GST'; }
tick(); setInterval(tick, 60000);
document.querySelector('#copy-email')?.addEventListener('click', async () => { const status = document.querySelector('#copy-status')!; try { await navigator.clipboard.writeText('keshav.katwe@gmail.com'); status.textContent = 'Copied!'; } catch { status.textContent = 'keshav.katwe@gmail.com'; } });
