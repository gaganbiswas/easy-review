import "./styles.css";

const form = document.getElementById("feedbackForm");
const toast = document.getElementById("toast");
const submitButton = form.querySelector(".submit-btn");
const star4 = document.getElementById("star4");
const star5 = document.getElementById("star5");

let timeout;

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent default form submission
  if (timeout) {
    clearTimeout(timeout);
  }

  submitButton.disabled = true;
  submitButton.classList.add("loading");

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  try {
    const response = await fetch("/create-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (response.ok) {
      // Show success toast
      showToast("Feedback submitted successfully!");
      form.reset(); // Reset the form
    } else {
      // Handle error
      showToast(responseData?.message, true);
    }
  } catch (error) {
    showToast(error?.message, true);
  } finally {
    submitButton.disabled = false;
    submitButton.classList.remove("loading");
  }
});

const showToast = (message, isError) => {
  toast.textContent = message;
  toast.classList.add("show");

  if (isError) {
    toast.classList.add("error-toast");
  } else {
    toast.classList.remove("error-toast");
  }

  timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000); // Hide after 3 seconds
};

star4.addEventListener("click", () => {
  if (!businessLink) {
    window.location.pathname = "#";
  }

  window.location.href = businessLink;
});

star5.addEventListener("click", () => {
  if (!businessLink) {
    window.location.pathname = "#";
  }
  window.location.href = businessLink;
});
