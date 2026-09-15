document.addEventListener("DOMContentLoaded", () => {
  const sendOtpBtn = document.getElementById("sendOtpBtn");
  const verifyOtpBtn = document.getElementById("verifyOtpBtn");
  const emailInput = document.getElementById("email");
  const otpInput = document.getElementById("otp");
  const otpSection = document.getElementById("otpSection");
  const otpError = document.getElementById("otpError");
  const signupBtn = document.getElementById("signupBtn");
  const signupResendOtpLink = document.getElementById("signupResendOtpLink");
  const resendOtpLink = document.getElementById("resendOtpLink");
  const resetPasswordForm = document.getElementById("resetPassword");
  const spinner = document.getElementById("loader");
  let otpTimer;

  const showLoader = () => {
    spinner.style.display = "flex";
    spinner.setAttribute("aria-busy", "true");
  };

  const hideLoader = () => {
    spinner.style.display = "none";
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

  const startOtpTimer = () => {
    let time = 1 * 60;
    otpTimer = setInterval(() => {
      if (time <= 0) {
        clearInterval(otpTimer);
        document.querySelector(".timer").innerText = "00:00";
        otpError.textContent = "OTP expired, please request a new one";
        otpError.style.color = "red";
        if (signupBtn) {
          signupBtn.disabled = true;
        }
      } else {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        document.querySelector(".timer").innerText =
          `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        if (time < 10) {
          document.querySelector(".timer").style.color = "red";
        } else {
          document.querySelector(".timer").style.color = "black";
        }

        time--;
      }
    }, 1000);
  };

  const clearOtpTimer = () => {
    clearInterval(otpTimer);
    document.querySelector(".timer").innerText = "00:00";
  };

  const handleSendOtpResponse = (data, redirectUrl) => {
    hideLoader();

    if (data.success) {
      Swal.fire({
        icon: "success",
        title: "OTP Sent!",
        text: "An OTP has been sent to your email. Please check your email.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          if (redirectUrl === "/users/signup") {
            otpSection.style.display = "block";

            clearErrors();

            if (data.otpSend) {
              startOtpTimer();
            }
          } else {
            window.location.href = redirectUrl;
            if (data.otpSend) {
              startOtpTimer();
            }
          }
        }
      });
    } else {
      displayErrors("email", "Error sending OTP");
    }
  };

  const handleVerifyOtpResponse = (data, redirectUrl) => {
    if (data.success) {
      Swal.fire({
        icon: "success",
        title: "OTP Verified!",
        text: "Proceed with the signup.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          clearErrors();

          if (redirectUrl === "/users/signup") {
            otpError.textContent = "OTP verified successfully";
            otpError.classList.add("success-message");
            otpError.classList.remove("error-message");
            otpInput.classList.remove("error-border");

            clearOtpTimer();
          } else {
            // Actions for password reset or other flows
            otpError.textContent = "OTP verified successfully";
            otpError.classList.add("success-message");

            clearOtpTimer();

            window.location.href = redirectUrl;
          }
        }
      });
    } else {
      // Handle OTP verification failure
      let errorMessage = "";

      if (data.errors && data.errors[0]) {
        errorMessage = data.errors[0];
      } else if (data.message === "The OTP has expired.") {
        errorMessage = "The OTP has expired. Please request a new one.";
      } else if (data.message === "Invalid OTP.") {
        errorMessage = "The OTP is invalid. Please check and try again.";
      } else {
        errorMessage = "An unexpected error occurred. Please try again.";
      }

      otpError.textContent = errorMessage;
      otpError.classList.add("error-message");
      otpInput.classList.add("error-border");
      otpError.classList.remove("success-message");
    }
  };

  if (sendOtpBtn && emailInput) {
    sendOtpBtn.addEventListener("click", async (event) => {
      event.preventDefault();

      const email = emailInput.value.trim();
      const redirectUrl = document.querySelector(
        'input[name="redirectUrl"]',
      ).value;

      if (!email) {
        displayErrors("email", "Please provide your email to send OTP");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        displayErrors("email", "Please provide a valid email to send OTP");
        return;
      }

      clearErrors();

      showLoader();

      const response = await fetch("/otp/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, redirectUrl }),
      });

      const data = await response.json();

      handleSendOtpResponse(data, redirectUrl);
    });
  }

  if (verifyOtpBtn && otpInput) {
    const redirectUrl = document.querySelector(
      'input[name="redirectUrl"]',
    ).value;
    const otpSend = document.querySelector(`input[name="otpSend"]`)
      ? document.querySelector(`input[name="otpSend"]`).value
      : "";
    console.log("otpSend:", otpSend);

    if (redirectUrl === "/otp/reset-password" && otpSend) {
      startOtpTimer();
    }

    verifyOtpBtn.addEventListener("click", async (event) => {
      event.preventDefault();
      const otp = otpInput.value;

      if (!otp) {
        displayErrors("otp", "Please enter the OTP.");
        return;
      }

      clearErrors();

      let bodyData;
      if (emailInput) {
        const email = emailInput.value.trim();
        bodyData = { email, otp, redirectUrl };
      } else {
        bodyData = { otp, redirectUrl };
      }

      const response = await fetch("/otp/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();
      handleVerifyOtpResponse(data, redirectUrl);
    });
  }

  if (signupResendOtpLink && sendOtpBtn) {
    signupResendOtpLink.addEventListener("click", (event) => {
      event.preventDefault();
      sendOtpBtn.click();
    });
  }

  if (resendOtpLink) {
    resendOtpLink.addEventListener("click", async (event) => {
      event.preventDefault();

      const redirectUrl = window.location.href;
      const email = document.querySelector('input[name="email"]').value;

      showLoader();

      try {
        const response = await fetch("/otp/send-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, redirectUrl }),
        });

        const data = await response.json();

        // Handle the response and hide the loader when the response is received
        handleSendOtpResponse(data, redirectUrl);
      } catch (error) {
        console.error("Error sending OTP:", error);
        displayErrors("email", "Error resending OTP");
        hideLoader();
      }
    });
  }

  if (resetPasswordForm) {
    resetPasswordForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const newPassword = document.getElementById("newPassword").value.trim();
      const confirmPassword = document
        .getElementById("confirmPassword")
        .value.trim();
      const resetPasswordError = document.getElementById("resetPasswordError");
      const email = document.querySelector('input[name="email"]').value;
      const redirectUrl = document.querySelector(
        'input[name="redirectUrl"]',
      ).value;

      clearErrors();

      // Client-side validation
      if (newPassword === "" || confirmPassword === "") {
        displayErrors("resetPassword", "Please fill out both password fields.");
      } else if (newPassword.length < 8) {
        displayErrors(
          "resetPassword",
          "Password must be at least 8 characters long.",
        );
      } else if (confirmPassword.length < 8) {
        displayErrors(
          "resetPassword",
          "Confirm password must be at least 8 characters long.",
        );
      } else if (newPassword !== confirmPassword) {
        displayErrors(
          "resetPassword",
          "Passwords do not match. Please try again.",
        );
      } else {
        // If validation passes, prepare the data to send to the server
        const requestData = {
          email,
          newPassword,
          confirmPassword,
          redirectUrl,
        };

        try {
          // Send the request to the server
          const response = await fetch("/otp/reset-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });

          const data = await response.json();

          // Handle success
          if (data.success) {
            Swal.fire({
              icon: "success",
              title: "Password Changed!",
              text: data.message,
              confirmButtonText: "OK",
              allowOutsideClick: false,
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = redirectUrl;
              }
            });
          } else {
            // Handle failure
            Swal.fire({
              icon: "error",
              title: "Password Reset Failed",
              text: data.message,
              confirmButtonText: "OK",
              allowOutsideClick: false,
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = "/otp/reset-password";
              }
            });
          }
        } catch (error) {
          console.error("Error:", error);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "An unexpected error occurred. Please try again.",
            confirmButtonText: "OK",
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/otp/reset-password";
            }
          });
        }
      }
    });
  }
});