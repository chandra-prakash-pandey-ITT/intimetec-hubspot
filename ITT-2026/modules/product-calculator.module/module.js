/* =========================================================
   CONFIG – TAX & CHARGES
========================================================= */

const TAX_1_RATE = 0;
const TAX_2_RATE = 0;
const SERVICE_CHARGE = 0;

/* =========================================================
   FEATURE TOGGLE
========================================================= */

let APPLY_INDUSTRY_MULTIPLIER = false;

/* =========================================================
   SERVICE DATA (WITH _DEFAULT RESTORED)
========================================================= */

const SERVICE_DATA = {
  _DEFAULT: [
    createPackage("Default CS Package 1", 8000),
    createPackage("Default CS Package 2", 12000),
    createPackage("Default CS Package 3", 15000)
  ]
};

/* =========================================================
   PACKAGE FACTORY
========================================================= */

function createPackage(name, basePrice) {
  return {
    packageName: name,
    basePrice,
    children: [
      `${name} Child 1`,
      `${name} Child 2`,
      `${name} Child 3`,
      `${name} Child 4`
    ]
  };
}

/* =========================================================
   MULTIPLIERS
========================================================= */

const EMPLOYEE_MULTIPLIER = {
  "1-50": 1,
  "51-150": 2,
  "151-500": 3,
  "501-750": 4
};

const INDUSTRY_MULTIPLIER = {
  Healthcare: 2,
  "Financial Services": 1.6,
  Technology: 1.3,
  Retail: 1.2,
  Manufacturing: 1.25,
  Education: 1.1,
  Government: 1.5,
  "Small Business": 1.0,
  Other: 1.2,
  _DEFAULT: 1.2
};

/* =========================================================
   DOM REFERENCES
========================================================= */

const industrySelect = document.getElementById("industry");
const employeeSelect = document.getElementById("employees");
const servicesContainer = document.getElementById("services-container");
const finalInvoiceEl = document.querySelector(".final-Invoice");
const submitButton = document.querySelector(".email-estimate-wrapper button");
const emailInput = document.querySelector(".email-estimate-wrapper input");
const emailErrorEl = document.querySelector(".cs-form-error-message");
const emailSuccessEl = document.querySelector(".cs-form-update-message");

const cardSkeleton = document.getElementById("service-card-skeleton");
const childSkeleton = cardSkeleton.querySelector(".js-child-skeleton");

cardSkeleton.remove();

/* =========================================================
   HELPERS
========================================================= */

function getEmployeeMultiplier() {
  return EMPLOYEE_MULTIPLIER[employeeSelect.value] || 1;
}

function getIndustryMultiplier(industry) {
  if (!APPLY_INDUSTRY_MULTIPLIER) return 1;
  return INDUSTRY_MULTIPLIER[industry] || INDUSTRY_MULTIPLIER._DEFAULT;
}

function disableForm() {
  submitButton.disabled = true;
  emailInput.disabled = true;
}

function enableForm() {
  submitButton.disabled = false;
  emailInput.disabled = false;
}

function renderNA() {
  return `<span style="color:red;font-weight:700;">N/A</span>`;
}

function getSelectValue(selectElement) {
  if (!selectElement || !selectElement.value) {
    return null;
  }
  
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  if (selectedOption && selectedOption.disabled) {
    return null;
  }
  
  return selectElement.value.trim() !== "" ? selectElement.value : null;
}

function updateParentCheckboxState(parentCB, childCheckboxes) {
  const checkedCount = childCheckboxes.filter(cb => cb.checked).length;
  const totalCount = childCheckboxes.length;

  if (checkedCount === 0) {
    parentCB.checked = false;
    parentCB.indeterminate = false;
  } else if (checkedCount === totalCount) {
    parentCB.checked = true;
    parentCB.indeterminate = false;
  } else {
    parentCB.checked = false;
    parentCB.indeterminate = true;
  }
}

function validateEmail(email) {
  if (!email || email.trim() === "") {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

function showEmailError(message) {
  if (emailErrorEl) {
    emailErrorEl.textContent = message;
    emailErrorEl.classList.remove("d-none");
    emailInput.style.borderColor = "#ff4444";
  }
  clearEmailSuccess();
}

function clearEmailError() {
  if (emailErrorEl) {
    emailErrorEl.textContent = "";
    emailErrorEl.classList.add("d-none");
    emailInput.style.borderColor = "#8B7E7E";
  }
}

function showEmailSuccess(message) {
  if (emailSuccessEl) {
    emailSuccessEl.textContent = message;
    emailSuccessEl.classList.remove("d-none");
  }
  if (emailErrorEl) {
    emailErrorEl.classList.add("d-none");
  }
}

function clearEmailSuccess() {
  if (emailSuccessEl) {
    emailSuccessEl.textContent = "";
    emailSuccessEl.classList.add("d-none");
  }
}

/* =========================================================
   FINAL INVOICE
========================================================= */

function renderFinalInvoice() {
  finalInvoiceEl.innerHTML = "";

  const industry = getSelectValue(industrySelect);
  const employees = getSelectValue(employeeSelect);

  let header = `
    <h5 class="mb-0 text-uppercase">Final Invoice</h5>

    <p class="mb-0 d-flex justify-content-between align-items-center">
      Industry
      <span>
      ${industry || "No value selected"}
      </span>
    </p>

    <p class="mb-0 d-flex justify-content-between align-items-center">
      Employee Range
      <span>
      ${employees || "No value selected"}
      </span>
    </p>
    
    <hr class="my-0" />
  `;

  let subtotal = 0;
  let items = [];

  servicesContainer.querySelectorAll(".service-box").forEach(card => {
    const serviceName = card.querySelector(".js-service-title").textContent;

    card.querySelectorAll(".js-child-skeleton").forEach(row => {
      const cb = row.querySelector(".js-child-checkbox");
      if (!cb.checked) return;

      const label = row.querySelector(".js-child-title").textContent;
      const amt = parseFloat(
        row.querySelector(".js-child-amount").textContent.replace(/[₹,]/g, "")
      );

      subtotal += amt;
      items.push({ serviceName, label, amt });
    });
  });

  if (!items.length) {
    finalInvoiceEl.innerHTML = header + `<p class="mb-0 text-danger fw-bold">No services selected.</p>`;
    disableForm();
    return;
  }

  const tax1 = subtotal * TAX_1_RATE;
  const tax2 = subtotal * TAX_2_RATE;
  const total = subtotal + tax1 + tax2 + SERVICE_CHARGE;

  let body = `<ul class="list-unstyled p-0 m-0">`;

  items.forEach(i => {
    body += `
      <li class="d-flex justify-content-between align-items-center">
      <p class="mb-0">
        <strong>${i.serviceName}</strong> - ${i.label}
        </p>

        <p class="mb-0">₹${i.amt.toFixed(2)}</p>
      </li>`;
  });

  body += `
    </ul>
 <hr class="my-0" />
    <p class="mb-0 d-flex justify-content-between align-items-center">Subtotal <span>₹${subtotal.toFixed(2)}</span></p>
    <p class="mb-0 d-flex justify-content-between align-items-center">Tax 1 (18%) <span>₹${tax1.toFixed(2)}</span></p>
    <p class="mb-0 d-flex justify-content-between align-items-center">Tax 2 (5%) <span>₹${tax2.toFixed(2)}</span></p>
    <p class="mb-0 d-flex justify-content-between align-items-center">Service Charge <span>₹${SERVICE_CHARGE.toFixed(2)}</span></p>
    <hr class="my-0 d-flex justify-content-between align-items-center" />
    <h6 class="mb-0 d-flex justify-content-between align-items-center">Total <span class="float-end">₹${total.toFixed(2)}</span></h6>
  `;

  finalInvoiceEl.innerHTML = header + body;
  enableForm();
}

/* =========================================================
   RENDER SERVICES (WITH _DEFAULT FALLBACK)
========================================================= */

function saveCheckboxStates() {
  const states = {};
  servicesContainer.querySelectorAll(".service-box").forEach(card => {
    const serviceName = card.querySelector(".js-service-title").textContent;
    states[serviceName] = {};
    
    card.querySelectorAll(".js-child-skeleton").forEach(row => {
      const cb = row.querySelector(".js-child-checkbox");
      const childName = row.querySelector(".js-child-title").textContent;
      states[serviceName][childName] = cb.checked;
    });
  });
  return states;
}

function restoreCheckboxStates(states) {
  servicesContainer.querySelectorAll(".service-box").forEach(card => {
    const serviceName = card.querySelector(".js-service-title").textContent;
    if (states[serviceName]) {
      const parentCB = card.querySelector(".js-parent-checkbox");
      const childCheckboxes = [];
      
      card.querySelectorAll(".js-child-skeleton").forEach(row => {
        const cb = row.querySelector(".js-child-checkbox");
        const childName = row.querySelector(".js-child-title").textContent;
        if (states[serviceName][childName]) {
          cb.checked = true;
        }
        childCheckboxes.push(cb);
      });
      
      updateParentCheckboxState(parentCB, childCheckboxes);
    }
  });
}

function renderServices(industry) {
  const savedStates = saveCheckboxStates();
  
  servicesContainer.innerHTML = "";
  finalInvoiceEl.innerHTML = "";
  disableForm();

  const services =
    SERVICE_DATA[industry] || SERVICE_DATA._DEFAULT;

  const empMul = getEmployeeMultiplier();
  const indMul = getIndustryMultiplier(industry);

  services.forEach(service => {
    const card = cardSkeleton.cloneNode(true);

    const title = card.querySelector(".js-service-title");
    const amount = card.querySelector(".js-service-amount");
    const parentCB = card.querySelector(".js-parent-checkbox");
    const childrenContainer = card.querySelector(".js-children-container");

    const finalAmount = service.basePrice * empMul * indMul;
    const childAmount = finalAmount / service.children.length;

    title.textContent = service.packageName;
    amount.textContent = `₹${finalAmount.toFixed(2)}`;
    childrenContainer.innerHTML = "";

    const childCheckboxes = [];

    service.children.forEach(childText => {
      const child = childSkeleton.cloneNode(true);
      child.querySelector(".js-child-title").textContent = childText;
      child.querySelector(".js-child-amount").textContent =
        `₹${childAmount.toFixed(2)}`;

      const cb = child.querySelector(".js-child-checkbox");
      cb.addEventListener("change", () => {
        updateParentCheckboxState(parentCB, childCheckboxes);
        renderFinalInvoice();
      });
      childCheckboxes.push(cb);

      childrenContainer.appendChild(child);
    });

    parentCB.addEventListener("change", () => {
      childCheckboxes.forEach(cb => cb.checked = parentCB.checked);
      parentCB.indeterminate = false;
      renderFinalInvoice();
    });

    // Initialize parent checkbox state
    updateParentCheckboxState(parentCB, childCheckboxes);

    servicesContainer.appendChild(card);
  });
  
  // Restore checkbox states after all cards are created
  restoreCheckboxStates(savedStates);
  renderFinalInvoice();
}

/* =========================================================
   EVENTS
========================================================= */

industrySelect.addEventListener("change", () => {
  renderServices(industrySelect.value);
});

employeeSelect.addEventListener("change", () => {
  renderServices(industrySelect.value);
});

submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  
  const emailValue = emailInput.value.trim();
  
  if (!emailValue) {
    clearEmailSuccess();
    showEmailError("Please enter your email address");
    return;
  }
  
  if (!validateEmail(emailValue)) {
    clearEmailSuccess();
    showEmailError("Please enter a valid email address");
    return;
  }
  
  clearEmailError();
  
  // Collect selected services dynamically
  let selectedServices = [];
  servicesContainer.querySelectorAll(".service-box").forEach(card => {
    const serviceName = card.querySelector(".js-service-title").textContent;
    
    card.querySelectorAll(".js-child-skeleton").forEach(row => {
      const cb = row.querySelector(".js-child-checkbox");
      if (!cb.checked) return;
      
      const label = row.querySelector(".js-child-title").textContent;
      const amt = parseFloat(
        row.querySelector(".js-child-amount").textContent.replace(/[₹,]/g, "")
      );
      
      selectedServices.push(`${serviceName} - ${label} - ₹${amt.toFixed(2)}`);
    });
  });
  
  if (selectedServices.length > 0) {
    // Get industry and employee range
    const industry = getSelectValue(industrySelect) || "No value selected";
    const employees = getSelectValue(employeeSelect) || "No value selected";
    
    // Dynamic message with submitted email, industry, employee range, and selected services
    const successMessage = `An estimated quote email has been sent to your email ${emailValue}. Industry: ${industry}, Employee Range: ${employees}. for the services ${selectedServices.join(", ")}`;
    showEmailSuccess(successMessage);
  } else {
    showEmailError("Please select at least one service before submitting.");
  }
  
  // Email is valid, proceed with submission
  // Add your submission logic here
});

emailInput.addEventListener("input", () => {
  clearEmailError();
  clearEmailSuccess();
});

emailInput.addEventListener("blur", () => {
  const emailValue = emailInput.value.trim();
  if (emailValue && !validateEmail(emailValue)) {
    clearEmailSuccess();
    showEmailError("Please enter a valid email address");
  }
});

/* =========================================================
   INIT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  disableForm();
  if (emailErrorEl) {
    emailErrorEl.classList.add("d-none");
  }
  if (emailSuccessEl) {
    emailSuccessEl.classList.add("d-none");
  }
  renderServices(null); // forces _DEFAULT on load
  renderFinalInvoice();
});
