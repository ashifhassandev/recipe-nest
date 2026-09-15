document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const editProfileForm = document.getElementById("editProfileForm");

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

  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validateLoginForm = () => {
    const loginEmail = document.getElementById("loginEmail").value.trim();
    const loginPassword = document.getElementById("loginPassword").value.trim();

    let isValid = true;

    clearErrors();

    if (!loginEmail) {
      displayErrors("loginEmail", "Email is required.");
      isValid = false;
    } else if (!isValidEmail(loginEmail)) {
      displayErrors("loginEmail", "Enter a valid email.");
      isValid = false;
    }

    if (!loginPassword) {
      displayErrors("loginPassword", "Password is required.");
      isValid = false;
    } else if (loginPassword.length < 8) {
      displayErrors("loginPassword", "Password must be atleast 8 characters.");
      isValid = false;
    }

    return isValid;
  };

  const validateSignupForm = () => {
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const passwordField = document.getElementById("password");
    const confirmPasswordField = document.getElementById("confirmPassword");
    const isEditModeElement = document.getElementById("isEditMode");
    const isEditMode = isEditModeElement
      ? isEditModeElement.value === "true"
      : false;

    let isValid = true;

    clearErrors();

    if (firstName === "") {
      displayErrors("firstName", "First name is required.");
      isValid = false;
    } else if (firstName.length < 3 || firstName.length > 15) {
      displayErrors(
        "firstName",
        "First name must be between 3 and 15 characters long.",
      );
      isValid = false;
    } else if (!/^[a-zA-Z]+$/.test(firstName)) {
      displayErrors(
        "firstName",
        "Please enter a valid first name. Only letters are allowed.",
      );
      isValid = false;
    }

    if (lastName === "") {
      displayErrors("lastName", "Last name is required.");
      isValid = false;
    } else if (lastName.length < 3 || lastName.length > 15) {
      displayErrors(
        "lastName",
        "Last name must be between 3 and 15 characters long.",
      );
      isValid = false;
    } else if (!/^[a-zA-Z]+$/.test(lastName)) {
      displayErrors(
        "lastName",
        "Please enter a valid last name. Only letters are allowed.",
      );
      isValid = false;
    }

    if (email === "") {
      displayErrors("email", "Email is required.");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      displayErrors("email", "Please enter a valid email address.");
      isValid = false;
    }

    if (!isEditMode) {
      if (passwordField && confirmPasswordField) {
        const password = passwordField.value;
        const confirmPassword = confirmPasswordField.value;

        if (!password) {
          displayErrors("password", "Password is required.");
          isValid = false;
        } else if (password.length < 8) {
          displayErrors(
            "password",
            "Password must be at least 8 characters long.",
          );
          isValid = false;
        }

        if (!confirmPassword) {
          displayErrors("confirmPassword", "Please confirm your password.");
          isValid = false;
        } else if (confirmPassword.length < 8) {
          displayErrors(
            "confirmPassword",
            "Password must be at least 8 characters long.",
          );
          isValid = false;
        } else if (password !== confirmPassword) {
          displayErrors("confirmPassword", "Passwords do not match.");
          isValid = false;
        }
      }
    }

    return isValid;
  };

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const isValidateLoginForm = validateLoginForm();
      if (isValidateLoginForm) {
        loginForm.submit();
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const isValidateSignupForm = validateSignupForm();
      if (isValidateSignupForm) {
        signupForm.submit();
      }
    });
  }

  if (editProfileForm) {
    editProfileForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const isValidateSignupForm = validateSignupForm();
      if (!isValidateSignupForm) {
        return;
      }

      const formData = new FormData(editProfileForm);
      const jsonData = JSON.stringify(Object.fromEntries(formData));
      const userId = editProfileForm.action.split("/").pop();

      try {
        const response = await fetch(`/users/user-profile/edit/${userId}`, {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: jsonData,
        });

        const result = await response.json();

        if (response.ok && result.success) {
          window.location.href = "/users/user-profile";
        } else {
          window.location.href = "/users/user-profile/edit";
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        window.location.href = "/users/user-profile";
      }
    });
  }
});