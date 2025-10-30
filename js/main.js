const form = document.querySelector(".form");
const firstNameInput = document.querySelector(".firstName");
const lastNameInput = document.querySelector(".lastName");
const submitBtn = document.querySelector(".submitBtn");

let editing = null; 

async function getIp() {
  const firstValue = firstNameInput.value.trim();
  const lastValue = lastNameInput.value.trim();

  const userId = new Date().getMilliseconds();
  let student = {
    first_name: firstValue,
    last_name: lastValue,
    userId: userId,
  };

  try {
    const response = await fetch("https://reqres.in/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "reqres-free-v1",
      },
      body: JSON.stringify(student),
    });
    const data = await response.json();
    createCard(data);
  } catch (error) {
    console.log("Error:", error);
  }
}

function createCard(data) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <h2 class="card-title">${data.first_name} <br> ${data.last_name}</h2>
    <p class="card-id">Id ${data.userId}</p>
    <button class="deleteBtn">Delete</button>
    <button class="updateBtn">Update</button>
  `;

  const deleteBtn = card.querySelector(".deleteBtn");
  const updateBtn = card.querySelector(".updateBtn");

  document.body.appendChild(card);

  deleteBtn.addEventListener("click", () => {
    deletePost(data.userId, card);
  });

  updateBtn.addEventListener("click", () => {
    edit(data.userId, card);
  });
}

async function deletePost(id, card) {
  try {
    await fetch(`https://reqres.in/api/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    });
    card.remove();
  } catch (error) {
    console.log("Error:", error);
  }
}

async function edit(id, card) {
  try {
    const fullName = card.querySelector(".card-title").innerHTML.split("<br>");
    firstNameInput.value = fullName[0].trim();
    lastNameInput.value = fullName[1].trim();

    editing = { id, card };

    submitBtn.textContent = "Save";
  } catch (error) {
    console.log("Error editing:", error);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (editing) {
    try {
      const response = await fetch(`https://reqres.in/api/users/${editing.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstNameInput.value,
          last_name: lastNameInput.value,
        }),
      });

      await response.json();

      editing.card.querySelector(".card-title").innerHTML = `
        ${firstNameInput.value} <br> ${lastNameInput.value}
      `;

      editing = null;
      submitBtn.textContent = "Submit";
      form.reset();
    } catch (error) {
      console.log("Error saving:", error);
    }
  } else {
    // oddiy holatda yangi user yaratish
    getIp();
    form.reset();
  }
});
