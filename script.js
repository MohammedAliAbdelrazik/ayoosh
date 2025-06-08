document.getElementById("toggleFormBtn").addEventListener("click", () => {
  const form = document.getElementById("formContainer");
  form.classList.toggle("open");
});


document.getElementById("showAchievementsBtn").addEventListener("click", () => {
  const section = document.getElementById("achievementSection");
  const clearBtn = document.getElementById("clearAllBtn");

  if (section.classList.contains("open")) {
    section.classList.remove("open");
    setTimeout(() => clearBtn.classList.add("hidden"), 500);
  } else {
    section.classList.add("open");
    const achievements = JSON.parse(localStorage.getItem("achievements")) || [];
    if (achievements.length > 0) {
      clearBtn.classList.remove("hidden");
    }
  }
});

window.addEventListener("DOMContentLoaded", () => {
  renderAchievements();
});

document.getElementById("achievementText").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // عشان ميعملش سطر جديد
    document.getElementById("submitBtn").click(); // اضغط زر سجل
  }
});


document.getElementById("submitBtn").addEventListener("click", () => {
  
  document.getElementById("clickSound").play();

  const text = document.getElementById("achievementText").value.trim();
  const imageInput = document.getElementById("imageInput");

  if (!text) {
    alert("من فضلك اكتب إنجازًا أولًا.");
    return;
  }

  const now = new Date();
  const dateText = now.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (imageInput.files && imageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imageData = e.target.result;
      const achievement = { text, date: dateText, image: imageData };
      saveAndDisplayAchievement(achievement);
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    const achievement = { text, date: dateText, image: null };
    saveAndDisplayAchievement(achievement);
  }

  document.getElementById("achievementText").value = "";
  document.getElementById("imageInput").value = "";
});

function saveAndDisplayAchievement(achievement) {
  let achievements = JSON.parse(localStorage.getItem("achievements")) || [];
  achievements.unshift(achievement);
  localStorage.setItem("achievements", JSON.stringify(achievements));
  renderAchievements();
}

function renderAchievements() {
  const list = document.getElementById("achievementList");
  list.innerHTML = "";
  const achievements = JSON.parse(localStorage.getItem("achievements")) || [];

  achievements.forEach((ach, i) => {
    const item = document.createElement("div");
    item.className = "achievement-item";

    const paragraph = document.createElement("p");
    paragraph.textContent = ach.text;
    item.appendChild(paragraph);

    const timeStamp = document.createElement("div");
    timeStamp.className = "timestamp";
    timeStamp.textContent = `📅 تم التسجيل بتاريخ: ${ach.date}`;
    item.appendChild(timeStamp);

    if (ach.image) {
      const img = document.createElement("img");
      img.src = ach.image;
      item.appendChild(img);
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑 حذف هذا الإنجاز";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => {
      deleteAchievement(i);
    });

    item.appendChild(deleteBtn);
    list.appendChild(item);
  });

  const clearBtn = document.getElementById("clearAllBtn");
  if (achievements.length > 0) {
    clearBtn.classList.remove("hidden");
  } else {
    clearBtn.classList.add("hidden");
  }

  updateBadge(); 
}

function deleteAchievement(index) {
  let achievements = JSON.parse(localStorage.getItem("achievements")) || [];
  achievements.splice(index, 1);
  localStorage.setItem("achievements", JSON.stringify(achievements));
  renderAchievements();
}

document.getElementById("clearAllBtn").addEventListener("click", () => {
  const confirmDelete = confirm("هل أنت متأكد أنك تريد حذف جميع الإنجازات؟");
  if (confirmDelete) {
    localStorage.removeItem("achievements");
    renderAchievements();
  }
});

function updateBadge() {
  const badge = document.getElementById("badge");
  const achievements = JSON.parse(localStorage.getItem("achievements")) || [];

  if (achievements.length > 0) {
    badge.textContent = achievements.length;
    badge.classList.remove("hidden");
  } else {
    badge.textContent = "";
    badge.classList.add("hidden");
  }
}
