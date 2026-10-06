const revealTargets = document.querySelectorAll(".trainer-setup");
const heroSection = document.querySelector(".universe");
const trainerSetup = document.querySelector(".trainer-setup");
const pageRoot = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let journeyLocked = false;
let transitionRunning = false;
let touchStartY = 0;

const startJourneyTransition = () => {
  if (journeyLocked || transitionRunning) return;

  transitionRunning = true;
  pageRoot.classList.add("is-transitioning");
  const coverDelay = reduceMotion.matches ? 0 : 460;
  const revealDelay = reduceMotion.matches ? 0 : 1040;
  const finishDelay = reduceMotion.matches ? 0 : 1540;

  window.setTimeout(() => {
    journeyLocked = true;
    pageRoot.classList.add("journey-locked");
    heroSection.setAttribute("aria-hidden", "true");
    trainerSetup.classList.add("is-visible");
    window.scrollTo(0, 0);
  }, coverDelay);

  window.setTimeout(() => pageRoot.classList.add("is-revealing"), revealDelay);

  window.setTimeout(() => {
    pageRoot.classList.remove("is-transitioning", "is-revealing");
    transitionRunning = false;
  }, finishDelay);
};

window.addEventListener(
  "wheel",
  (event) => {
    if (journeyLocked || event.deltaY <= 0) return;
    event.preventDefault();
    startJourneyTransition();
  },
  { passive: false },
);

window.addEventListener("touchstart", (event) => {
  touchStartY = event.touches[0]?.clientY ?? 0;
}, { passive: true });

window.addEventListener(
  "touchmove",
  (event) => {
    if (journeyLocked) return;
    const currentY = event.touches[0]?.clientY ?? touchStartY;
    if (touchStartY - currentY < 18) return;
    event.preventDefault();
    startJourneyTransition();
  },
  { passive: false },
);

window.addEventListener("keydown", (event) => {
  if (journeyLocked || !["ArrowDown", "PageDown", " ", "End"].includes(event.key)) return;
  event.preventDefault();
  startJourneyTransition();
});

window.addEventListener("scroll", () => {
  if (journeyLocked || transitionRunning || window.scrollY <= 2) return;
  window.scrollTo(0, 0);
  startJourneyTransition();
}, { passive: true });

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
