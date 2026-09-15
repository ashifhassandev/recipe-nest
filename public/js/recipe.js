document.addEventListener("DOMContentLoaded", () => {
  const recipeForm = document.getElementById("recipeForm");
  const editRecipeForm = document.getElementById("editRecipeForm");

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

  const validateRecipeForm = () => {
    const recipeName = document.getElementById("recipeName").value.trim();
    const category = document.getElementById("category").value;
    const image = document.getElementById("image").files[0];
    const preparationTime = document
      .getElementById("preparationTime")
      .value.trim();
    const servingSize = document.getElementById("servingSize").value.trim();
    const ingredients = document.getElementById("ingredients").value.trim();
    const steps = document.getElementById("steps").value.trim();
    const isEditModeElement = document.getElementById("isEditMode");
    const isEditMode = isEditModeElement
      ? isEditModeElement.value === "true"
      : false;

    clearErrors();

    let isValid = true;

    if (!recipeName) {
      displayErrors("recipeName", "Recipe Name is required.");
      isValid = false;
    }

    if (!category) {
      displayErrors("category", "Category is required.");
      isValid = false;
    }

    if (!isEditMode) {
      if (!image) {
        displayErrors("image", "An image file is required.");
        isValid = false;
      } else if (!image.type.startsWith("image/")) {
        displayErrors("image", "Only image files are allowed.");
        isValid = false;
      } else if (image.size > 5 * 1024 * 1024) {
        displayErrors("image", "Image size should not exceed 5MB.");
        isValid = false;
      }
    } else {
      if (image) {
        if (!image.type.startsWith("image/")) {
          displayErrors("image", "Only image files are allowed.");
          isValid = false;
        } else if (image.size > 5 * 1024 * 1024) {
          displayErrors("image", "Image size should not exceed 5MB.");
          isValid = false;
        }
      }
    }

    if (!preparationTime || isNaN(preparationTime) || preparationTime <= 0) {
      displayErrors(
        "preparationTime",
        "Valid preparation time (in minutes) is required.",
      );
      isValid = false;
    }

    if (!servingSize || isNaN(servingSize) || servingSize <= 0) {
      displayErrors("servingSize", "Valid serving size is required.");
      isValid = false;
    }

    if (!ingredients) {
      displayErrors("ingredients", "At least one ingredient is required.");
      isValid = false;
    }

    if (!steps) {
      displayErrors("steps", "At least one preparation step is required.");
      isValid = false;
    }

    return isValid;
  };

  if (recipeForm) {
    recipeForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const isValidRecipeForm = validateRecipeForm();
      if (isValidRecipeForm) {
        recipeForm.submit();
      }
    });
  }

  if (editRecipeForm) {
    editRecipeForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const isValidRecipeForm = validateRecipeForm();
      if (!isValidRecipeForm) {
        return;
      }

      const formData = new FormData(editRecipeForm);
      const recipeId = editRecipeForm.action.split("/").pop();

      try {
        const response = await fetch(`/users/edit-recipe/${recipeId}`, {
          method: "PUT",
          body: formData,
        });

        const result = await response.json();

        if (response.ok && result.success) {
          window.location.href = `/recipes`;
        } else {
          window.location.href = `/users/edit-recipe/${recipeId}`;
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        window.location.href = `/recipes`;
      }
    });
  }
});