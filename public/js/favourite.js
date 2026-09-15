document.addEventListener("DOMContentLoaded", () => {
  const favouriteLink = document.getElementById("add-to-favourite");

  if (favouriteLink) {
    favouriteLink.addEventListener("click", async (event) => {
      event.preventDefault();

      const recipeId = favouriteLink.getAttribute("data-recipe-id");

      try {
        const response = await fetch("/users/add-favourites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ recipeId }),
        });

        const result = await response.json();

        if (response.status === 401) {
          window.location.href = `/recipes/${recipeId}`;
          return;
        }

        if (result.success) {
          window.location.href = `/recipes/${recipeId}`;
          return;
        } else {
          window.location.href = `/recipes/${recipeId}`;
          return;
        }
      } catch (error) {
        console.error("Error adding recipe to favorites:", error);
        window.location.href = `/recipes/${recipeId}`;
      }
    });
  }
});