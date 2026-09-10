// Clock
const clockEl = document.getElementById('clock');

function tick() {
  const d = new Date();
  clockEl.textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Cairo time';
}

tick();
setInterval(tick, 1000);

// Hero typing animation
const typedEl = document.getElementById('typed');
const heroLines = [
  'whoami',
  'cat status.txt → open to work',
  'node server.js  # listening on :4000'
];
let li = 0, ci = 0, deleting = false;

function typeLoop() {
  const current = heroLines[li];
  if (!deleting) {
    ci++;
    typedEl.textContent = current.slice(0, ci);
    if (ci === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    ci--;
    typedEl.textContent = current.slice(0, ci);
    if (ci === 0) {
      deleting = false;
      li = (li + 1) % heroLines.length;
    }
  }
  setTimeout(typeLoop, deleting ? 28 : 48);
}

typeLoop();

// Accordion
document.querySelectorAll('.tl-head').forEach(head => {
  head.addEventListener('click', () => {
    const item = head.closest('.tl-item');
    item.classList.toggle('open');
  });
});

// Interactive shell
const shellBody = document.getElementById('shell-body');
const shellForm = document.getElementById('shell-form');
const shellInput = document.getElementById('shell-input');

function printLine(text, cls) {
  const p = document.createElement('p');
  p.className = 'line' + (cls ? ' ' + cls : '');
  p.textContent = text;
  shellBody.appendChild(p);
  shellBody.scrollTop = shellBody.scrollHeight;
}

function printCmd(cmd) {
  const p = document.createElement('p');
  p.className = 'line';
  p.innerHTML = '<span class="prompt">$</span> ' + cmd.replace(/</g, '&lt;');
  shellBody.appendChild(p);
}

const commands = {
  help: () => 'commands: whoami, skills, projects, joke, sudo hire-me, coffee, clear',
  whoami: () => 'Mohamed Moamen — junior backend developer. Probably debugging a JWT right now.',
  skills: () => 'Node.js, NestJS, Express, TypeScript, PostgreSQL, MongoDB, JWT auth, GraphQL, Docker (fundamentals).',
  projects: () => 'Gym Management System · BizFlow · Social Media App Backend — see the projects section above.',
  coffee: () => '☕ brewing... backend developers run on this and stack traces.',
  'sudo hire-me': () => {
    window.location.href = 'mailto:mohamedmoamen272@gmail.com';
    return null;
  },
  joke: () => pickJoke(),
  clear: () => {
    shellBody.innerHTML = '';
    return null;
  }
};

shellForm.addEventListener('submit', e => {
  e.preventDefault();
  const raw = shellInput.value.trim();
  if (!raw) return;
  printCmd(raw);
  const key = raw.toLowerCase();
  if (commands[key]) {
    const out = commands[key]();
    if (out !== null && out !== undefined) printLine(out, 'out');
  } else {
    printLine(`command not found: ${raw} — try "help"`, 'out');
  }
  shellInput.value = '';
});

// Joke generator
const jokes = [
  'fix: it works now, don\'t ask why',
  'chore: renamed \'temp_fix_final\' to \'temp_fix_final_v2\'',
  'feat: added error handling (catches everything, blames nothing)',
  'fix: off-by-one error that was actually off by seventeen',
  'docs: added a comment explaining the hack, not removing it',
  'refactor: deleted 400 lines, added 380, called it progress',
  'fix: works on my machine — deploying my machine',
  'feat: migrated from callbacks to async/await, sanity partially restored',
  'fix: turns out the token expired, not the universe',
  'chore: updated dependencies, prayed silently'
];

const jokeText = document.getElementById('joke-text');
document.getElementById('joke-btn').addEventListener('click', () => {
  jokeText.textContent = pickJoke();
});

function pickJoke() {
  return jokes[Math.floor(Math.random() * jokes.length)];
}

// Konami code easter egg
const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let progress = 0;
const toast = document.getElementById('egg-toast');

window.addEventListener('keydown', (e) => {
  const key = e.key;
  if (key === konami[progress]) {
    progress++;
    if (progress === konami.length) {
      toast.classList.add('show');
      document.getElementById('status-fact').textContent = 'Open to work (extra karma)';
      setTimeout(() => toast.classList.remove('show'), 3200);
      progress = 0;
    }
  } else {
    progress = (key === konami[0]) ? 1 : 0;
  }
});

// Contact form feedback
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'sent!';
    btn.style.background = 'var(--mint)';
    btn.style.color = '#0a0c11';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.color = '';
      contactForm.reset();
    }, 2000);
  });
}

// Active nav state
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav ul a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = 'var(--text)';
        }
      });
    }
  });
}, { rootMargin: '-20% 0px -70% 0px' });

sections.forEach(section => observer.observe(section));