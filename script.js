const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const codeSample = document.querySelector("#codeSample");
const workflowButtons = document.querySelectorAll(".step");
const endpointButtons = document.querySelectorAll("[data-endpoint]");
const modal = document.querySelector(".endpoint-modal");
const modalClose = document.querySelector(".modal-close");
const endpointTitle = document.querySelector("#endpointTitle");
const endpointCode = document.querySelector("#endpointCode");
const form = document.querySelector(".contact-form");
const formMessage = document.querySelector(".form-message");

const workflowExamples = {
  1: `POST /v1/auth/token
Content-Type: application/json

{
  "client_id": "sandbox-client-id",
  "client_secret": "sandbox-secret",
  "scope": "identity:read threats:read"
}`,
  2: `GET /v1/identity/risk?email=analyst@company.com
Authorization: Bearer YOUR_ACCESS_TOKEN

{
  "include": ["exposure", "breach_history", "domain_risk"]
}`,
  3: `HTTP/1.1 200 OK
{
  "risk_score": 72,
  "risk_level": "elevated",
  "signals": ["credential_exposure", "suspicious_domain"],
  "recommended_action": "step_up_verification"
}`
};

const endpointExamples = {
  "/v1/identity/risk": `GET /v1/identity/risk
Query: email, domain, user_id

Returns identity exposure score, breach indicators,
and recommended verification actions.`,
  "/v1/threats/signals": `GET /v1/threats/signals
Query: domain, ip, hash, url

Returns threat type, confidence, first seen date,
and suggested response priority.`,
  "/v1/compliance/checks": `POST /v1/compliance/checks
Body: framework, asset_id, control_id

Returns control status, evidence reference,
and remediation guidance.`
};

function setWorkflowStep(step) {
  workflowButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.step === step);
  });
  codeSample.textContent = workflowExamples[step];
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

workflowButtons.forEach((button) => {
  button.addEventListener("click", () => setWorkflowStep(button.dataset.step));
});

endpointButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const endpoint = button.dataset.endpoint;
    endpointTitle.textContent = endpoint;
    endpointCode.textContent = endpointExamples[endpoint];
    modal.hidden = false;
    modalClose.focus();
  });
});

function closeModal() {
  modal.hidden = true;
}

modalClose.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) {
    closeModal();
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = data.get("name").trim();
  const email = data.get("email").trim();
  const interest = data.get("interest");

  if (!name || !email || !interest) {
    formMessage.textContent = "Please complete all fields before preparing the request.";
    formMessage.className = "form-message error";
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    formMessage.textContent = "Please enter a valid work email address.";
    formMessage.className = "form-message error";
    return;
  }

  formMessage.textContent = `Request prepared for ${name}. Selected API: ${interest}.`;
  formMessage.className = "form-message success";
  form.reset();
});

setWorkflowStep("1");
