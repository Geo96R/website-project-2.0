
// Skills expandable functionality
const skillItems = document.querySelectorAll('.skill-item[data-skill]');
skillItems.forEach(item => {
  item.addEventListener('click', function() {
    const skillId = this.getAttribute('data-skill');
    const expand = document.querySelector(`.skill-expand[data-skill-expand="${skillId}"]`);
    
    // Toggle current item
    const isActive = this.classList.contains('active');
    
    // Close all other items
    document.querySelectorAll('.skill-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.skill-expand').forEach(e => e.classList.remove('active'));
    
    // Toggle current item
    if (!isActive && expand) {
      this.classList.add('active');
      expand.classList.add('active');
    }
  });
});

// Nav active state on scroll
const secs = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 80) cur = s.id; });
  links.forEach(a => { a.classList.toggle('active', a.getAttribute('href') === '#' + cur); });
}, { passive: true });

// Rotating command line - TRUE RANDOM
const el = document.getElementById("cmd-rotator");
if (el) {
  const commands = [
    "uptime",
    "free -h",
    "df -hT",
    "docker ps --filter status=running | wc -l",
    "docker ps --format 'table {{.Names}}\\t{{.Status}}' | head",
    "docker stats --no-stream | head",
    "docker compose ps",
    "docker compose logs --tail=100",
    "docker system df",
    "kubectl get nodes -o wide",
    "kubectl get pods -A | head",
    "kubectl get svc -A | head",
    "kubectl get events -A --sort-by=.lastTimestamp | tail -n 15",
    "kubectl top nodes",
    "kubectl top pods -A | head",
    "kubectl get ingress -A",
    "kubectl get httproute -A",
    "kubectl rollout status deploy/<name> -n <ns>",
    "kubectl rollout restart deploy/<name> -n <ns>",
    "kubectl explain pod.spec.containers",
    "journalctl -p 3 -xb | tail -n 20",
    "systemctl --failed",
    "ss -lntp | head -n 10",
    "ip a",
    "ip r"
  ];
  let currentIdx = Math.floor(Math.random() * commands.length);
  el.textContent = commands[currentIdx];

  setInterval(() => {
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * commands.length);
    } while (nextIdx === currentIdx && commands.length > 1);
    currentIdx = nextIdx;
    el.style.opacity = 0;
    setTimeout(() => {
      el.textContent = commands[currentIdx];
      el.style.opacity = 1;
    }, 300);
  }, 1800);
}

// Contact form submission
// Contact Modal
const contactLink = document.getElementById('contact-link');
const contactModal = document.getElementById('contact-modal');
const contactModalClose = document.querySelector('.contact-modal-close');
const contactModalOverlay = document.querySelector('.contact-modal-overlay');

if (contactLink && contactModal) {
  // Open modal
  contactLink.addEventListener('click', function(e) {
    e.preventDefault();
    contactModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Focus first input
    setTimeout(() => {
      const firstInput = contactModal.querySelector('input[type="text"]');
      if (firstInput) firstInput.focus();
    }, 100);
  });
  
  // Close modal
  function closeModal() {
    contactModal.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  if (contactModalClose) {
    contactModalClose.addEventListener('click', closeModal);
  }
  
  if (contactModalOverlay) {
    contactModalOverlay.addEventListener('click', closeModal);
  }
  
  // Close on ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && contactModal.classList.contains('active')) {
      closeModal();
    }
  });
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('.contact-submit');
    const statusDiv = document.getElementById('contact-status');
    const formData = new FormData(this);
    
    // Disable submit button
    submitBtn.disabled = true;
    statusDiv.textContent = 'Sending...';
    statusDiv.className = 'contact-status';
    
    try {
      const response = await fetch('/contact', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        statusDiv.textContent = data.message || 'Message sent successfully. I\'ll get back to you soon.';
        statusDiv.className = 'contact-status success';
        this.reset();
        // Close modal after 2 seconds on success
        setTimeout(() => {
          if (contactModal) {
            contactModal.classList.remove('active');
            document.body.style.overflow = '';
          }
        }, 2000);
      } else {
        statusDiv.textContent = data.error || 'Failed to send message. Please try again.';
        statusDiv.className = 'contact-status error';
      }
    } catch (error) {
      statusDiv.textContent = 'Network error. Please try again later.';
      statusDiv.className = 'contact-status error';
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// Back to top button
const btn = document.createElement('button');
btn.className = 'back-to-top';
btn.innerHTML = '↑';
btn.setAttribute('aria-label', 'Back to top');
btn.onclick = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
document.body.appendChild(btn);

let lastScroll = 0;
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 300) {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }
  lastScroll = scrollY;
}, { passive: true });

// Blog accordion functionality
const blogItems = document.querySelectorAll('.blog-item[data-blog-index]');
blogItems.forEach(item => {
  item.addEventListener('click', function() {
    const index = this.getAttribute('data-blog-index');
    const content = document.querySelector(`.blog-content[data-blog-content="${index}"]`);
    
    // Close all other items
    document.querySelectorAll('.blog-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.blog-content').forEach(c => c.classList.remove('active'));
    
    // Toggle current item
    if (content && !content.classList.contains('active')) {
      this.classList.add('active');
      content.classList.add('active');
    } else {
      this.classList.remove('active');
      if (content) content.classList.remove('active');
    }
  });
});

