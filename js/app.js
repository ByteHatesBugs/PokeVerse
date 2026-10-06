const revealTargets = document.querySelectorAll(".trainer-setup");
const heroSection = document.querySelector(".universe");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let transitionFrame = 0;
let journeyLocked = false;

const updatePageTransition = () => {
  const transitionDistance = Math.max(window.innerHeight * 0.72, 1);
  const progress = Math.min(Math.max(window.scrollY / transitionDistance, 0), 1);
  const opacity = Math.max(1 - progress * 1.12, 0);
  const blur = reduceMotion.matches ? 0 : progress * 8;

  heroSection.style.setProperty("--hero-opacity", opacity.toFixed(3));
  heroSection.style.setProperty("--hero-blur", `${blur.toFixed(2)}px`);

  if (!journeyLocked && window.scrollY >= heroSection.offsetHeight - 4) {
    journeyLocked = true;
    document.documentElement.classList.add("journey-locked");
    heroSection.setAttribute("aria-hidden", "true");
    window.scrollTo(0, 0);
  }

  transitionFrame = 0;
};

const requestPageTransition = () => {
  if (transitionFrame) return;
  transitionFrame = window.requestAnimationFrame(updatePageTransition);
};

window.addEventListener("scroll", requestPageTransition, { passive: true });
window.addEventListener("resize", requestPageTransition);
reduceMotion.addEventListener("change", requestPageTransition);
updatePageTransition();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.22 },
);

revealTargets.forEach((target) => revealObserver.observe(target));

const trainerForm = document.querySelector("#trainer-form");
const trainerName = document.querySelector("#trainer-name");
const avatarCards = [...document.querySelectorAll(".avatar-card")];
const journeyButton = trainerForm.querySelector(".journey-button");
const welcomeMessage = document.querySelector("#trainer-welcome");
let selectedAvatar = "";

const updateButton = () => {
  journeyButton.disabled = trainerName.value.trim().length === 0 || selectedAvatar.length === 0;
  journeyButton.querySelector("span").textContent = "Begin my journey";
  welcomeMessage.textContent = "";
};

avatarCards.forEach((card) => {
  card.addEventListener("click", () => {
    selectedAvatar = card.dataset.avatar;

    avatarCards.forEach((avatarCard) => {
      avatarCard.setAttribute("aria-pressed", String(avatarCard === card));
    });

    updateButton();
  });
});

trainerName.addEventListener("input", updateButton);

trainerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = trainerName.value.trim();
  if (!name || !selectedAvatar) return;

  welcomeMessage.textContent = `Trainer ${name}, your ${selectedAvatar} pass is ready.`;
  journeyButton.querySelector("span").textContent = "Journey ready";
});
