document.addEventListener("DOMContentLoaded", () => {
  const firstnameInput = document.getElementById("firstname");
  const lastnameInput = document.getElementById("lastname");
  const emailInput = document.getElementById("email");
  const usecaseInput = document.getElementById("usecase");
  const submitButton = document.querySelector("button[type='submit']");

  // Utility function to display error message
  const showError = (element, message) => {
    let error = element.nextElementSibling;
    if (!error || !error.classList.contains("error-message")) {
      error = document.createElement("span");
      error.className = "error-message";
      element.insertAdjacentElement("afterend", error);
    }
    error.textContent = message;
    error.classList.add("visible"); // Show the error message
  };

  // Utility function to clear error message
  const clearError = (element) => {
    const error = element.nextElementSibling;
    if (error && error.classList.contains("error-message")) {
      error.textContent = "";
      error.classList.remove("visible"); // Hide the error message
    }
  };
  // Validation functions
  const validateFirstName = () => {
    const nameRegex = /^[a-zA-Z]{2,}$/; // Only letters, minimum length 2
    if (!nameRegex.test(firstnameInput.value.trim())) {
        showError(firstnameInput, "First name must contain only letters and be at least 2 characters long.");
        return false;
    }
    clearError(firstnameInput);
    return true;
};

const validateLastName = () => {
    const nameRegex = /^[a-zA-Z]{2,}$/; // Only letters, minimum length 2
    if (!nameRegex.test(lastnameInput.value.trim())) {
        showError(lastnameInput, "Last name must contain only letters and be at least 2 characters long.");
        return false;
    }
    clearError(lastnameInput);
    return true;
};



const validateEmail = () => {
  // Regular expression for strict email validation
  const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(emailInput.value.trim())) {
      showError(
          emailInput,
          "Please enter a valid email address. Example: user@example.com"
      );
      return false;
  }
  clearError(emailInput);
  return true;
};

  const validateUseCase = () => {
      if (usecaseInput.value.trim().length <= 10) {
          showError(usecaseInput, "Use case must be greater than 10 characters.");
          return false;
      }
      clearError(usecaseInput);
      return true;
  };

  // Check if all inputs are valid
  const checkAllValid = () => {
      return (
          validateFirstName() &&
          validateLastName() &&
          validateEmail() &&
          validateUseCase()
      );
  };

  // Enable or disable the submit button based on validation
  const updateSubmitButton = () => {
      submitButton.disabled = !checkAllValid();
  };

  // Attach event listeners for real-time validation
  const inputs = [firstnameInput, lastnameInput, emailInput, usecaseInput];
  inputs.forEach(input => {
      input.addEventListener("input", () => {
          updateSubmitButton(); // Re-check all validations on input change
      });
  });

  // Form submission handler
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (checkAllValid()) {
      const formData = {
        firstName: firstnameInput.value.trim(),
        lastName: lastnameInput.value.trim(),
        email: emailInput.value.trim(),
        useCase: usecaseInput.value.trim()
      };
  
      // Use Fetch API to send data to backend
      fetch("https://www.voxoverai.com/contact-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Response from server:", data);
  
          // Show success modal
          const successModal = document.getElementById("successModal");
          successModal.style.display = "block";
  
          // Reset the form
          form.reset();
  
          // Clear all error messages
          document.querySelectorAll(".error-message").forEach((error) => (error.textContent = ""));
  
          // Disable the submit button again
          submitButton.disabled = true;
        })
        .catch((error) => {
          console.error("Error:", error);
  
          // Show error modal
          const errorModal = document.getElementById("errorModal");
          errorModal.style.display = "block";
        });
    }
  });
  
  // Close modal when user clicks on the close button or outside the modal
  document.getElementById("closeSuccessModal").onclick = () => {
    document.getElementById("successModal").style.display = "none";
  };
  
  document.getElementById("closeErrorModal").onclick = () => {
    document.getElementById("errorModal").style.display = "none";
  };
  
  window.onclick = (event) => {
    if (event.target === document.getElementById("successModal")) {
      document.getElementById("successModal").style.display = "none";
    }
    if (event.target === document.getElementById("errorModal")) {
      document.getElementById("errorModal").style.display = "none";
    }
  };
  
});
