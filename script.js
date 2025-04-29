// Smooth scroll
document.querySelectorAll("nav ul li a").forEach(a=>{
  a.addEventListener("click", e=>{
    e.preventDefault();
    document.querySelector(a.getAttribute("href"))
      .scrollIntoView({ behavior:"smooth" });
  });
});

// Hamburger toggle
const navToggle = document.querySelector(".nav-toggle");
navToggle.addEventListener("click", ()=>{
  const expanded = navToggle.getAttribute("aria-expanded")==="true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
  document.body.classList.toggle("nav-open");
});

// Persistent Dark Mode
const DARK = "dark-theme";
const darkBtn = Object.assign(document.createElement("button"), { textContent:"🌓", id:"darkToggle" });
Object.assign(darkBtn.style, {
  position:"fixed", bottom:"20px", right:"20px",
  padding:"10px", border:"none", borderRadius:"5px",
  background:"var(--accent)", color:"#fff", cursor:"pointer", fontSize:"18px", zIndex:1000
});
document.body.appendChild(darkBtn);
if (localStorage.getItem("mode") === DARK) document.body.classList.add(DARK);
darkBtn.addEventListener("click", ()=>{
  document.body.classList.toggle(DARK);
  localStorage.setItem("mode", document.body.classList.contains(DARK) ? DARK : "");
});

// Reveal on scroll
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("revealed");
      io.unobserve(e.target);
    }
  });
}, { threshold:0.2 });
document.querySelectorAll(".section").forEach(s=>io.observe(s));

// Back-to-Top Button
const backBtn = Object.assign(document.createElement("button"), { id:"backToTop", textContent:"↑ Top" });
document.body.appendChild(backBtn);
window.addEventListener("scroll", ()=>{
  backBtn.classList.toggle("show", window.scrollY>300);
});
backBtn.addEventListener("click", ()=> window.scrollTo({top:0,behavior:"smooth"}));


// Active nav highlighting
const navLinks = document.querySelectorAll("nav ul li a");
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute("id");
    const link = document.querySelector(`nav ul li a[href="#${id}"]`);
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove("active"));
      link && link.classList.add("active");
    }
  });
}, { threshold: 0.5 });

// Observe all sections
document.querySelectorAll("main section[id]").forEach(sec => {
  sectionObserver.observe(sec);
});

// 7) Fetch & display GitHub repos
const repoList = document.getElementById('repoList');
fetch('https://api.github.com/users/puru999/repos?sort=updated&per_page=6')
  .then(res => res.json())
  .then(repos => {
    repoList.innerHTML = ''; // clear loading text
    repos.forEach(repo => {
      const card = document.createElement('div');
      card.className = 'repo-card';
      card.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || 'No description.'}</p>
        <p>
          <a href="${repo.html_url}" target="_blank">View on GitHub ↗️</a>
        </p>`;
      repoList.appendChild(card);
    });
  })
  .catch(err => {
    repoList.textContent = 'Failed to load projects.';
    console.error(err);
  });

  // Contact form validation & submission
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');

form.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  form.querySelectorAll('.form-group').forEach(group => {
    const input = group.querySelector('input, textarea');
    const error = group.querySelector('.error-msg');
    if (!input.checkValidity()) {
      valid = false;
      error.textContent = input.validationMessage;
      error.style.display = 'block';
    } else {
      error.textContent = '';
      error.style.display = 'none';
    }
  });

  if (valid) {
    // Here you'd normally send data to a server...
    successMsg.textContent = 'Thanks! Your message has been sent.';
    form.reset();
  } else {
    successMsg.textContent = '';
  }
});



