const revealTargets = document.querySelectorAll(".journey-gate, .trainer-setup");

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
