document.addEventListener("DOMContentLoaded", () => {
  const spinner = document.getElementById("loader");

  const showLoader = () => {
    spinner.style.display = "flex"; // Show the loader
    spinner.setAttribute("aria-busy", "true");
  };

  const hideLoader = () => {
    spinner.style.display = "none"; // Hide the loader
    spinner.removeAttribute("aria-busy");
  };

  const displayErrors = (fieldId, message) => {
    const errorElement = document.getElementById(`${fieldId}Error`);
    const inputElement = document.getElementById(fieldId);

    if (errorElement) {
      errorElement.textContent = message;
    }

    if (inputElement) {
      inputElement.classList.add("error-border");
    }
  };

  const clearErrors = () => {
    document.querySelectorAll(".error-message").forEach((error) => {
      error.textContent = "";
    });

    document.querySelectorAll(".error-border").forEach((input) => {
      input.classList.remove("error-border");
    });
  };

  const isValidName = (name) => {
    const regex = /^[A-Za-z\s]+$/;
    return regex.test(name);
  };

  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validateContactForm = () => {
    const messageName = document.getElementById("messageName");
    const messageEmail = document.getElementById("messageEmail");
    const messageContent = document.getElementById("messageContent");

    let isValid = true;

    clearErrors();

    if (!messageName.value.trim()) {
      displayErrors("messageName", "Name is required.");
      isValid = false;
    } else if (!isValidName(messageName.value.trim())) {
      displayErrors("messageName", "Name should not contain numbers.");
      isValid = false;
    }

    if (!messageEmail.value.trim()) {
      displayErrors("messageEmail", "Email is required.");
      isValid = false;
    } else if (!isValidEmail(messageEmail.value.trim())) {
      displayErrors("messageEmail", "Please enter a valid email address.");
      isValid = false;
    }

    if (!messageContent.value.trim()) {
      displayErrors("messageContent", "Message is required.");
      isValid = false;
    }

    return isValid;
  };

  const handleFormSubmit = async (form, endpoint, method) => {
    const formData = new FormData(form);
    const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));

    showLoader();

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      });

      const data = await response.json();
      hideLoader();

      if (data.success) {
        window.location.reload();
      } else {
        window.location.reload();
      }
    } catch (error) {
      hideLoader();

      window.location.reload();
    }
  };

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const isValidContactForm = validateContactForm();
      if (isValidContactForm) {
        handleFormSubmit(contactForm, "/users/contact/send-email", "POST");
      }
    });
  }
});