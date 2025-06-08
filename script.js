// عرض أو إخفاء النموذج
document.getElementById("toggleFormBtn").addEventListener("click", () => {
  const form = document.getElementById("formContainer");
  form.classList.toggle("hidden");
});

// عرض أو إخفاء الإنجازات
document.getElementById("showAchievementsBtn").addEventListener("click", () => {
  const section = document.getElementById("achievementSection");
  section.classList.toggle("hidden");
  if (section.classList.contains("hidden")) {
    document.getElementById("clearAllBtn").classList.add("hidden");
  } else {
    const achievements = JSON.parse(localStorage.getItem("achievements")) || [];
    if (achievements.length > 0) {
      document.getElementById("clearAllBtn").classList.remove("hidden");
    }
  }
});

// تحميل الإنجازات المحفوظة
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("achievements");
  if (saved) {
    const achievements = JSON.parse(saved);
    achievements.forEach((achievement, index) => addAchievementToPage(achievement, index));
    if (achievements.length > 0) {
      document.getElementById("clearAllBtn").classList.remove("hidden");
    }
  }
});

// تسجيل إنجاز جديد
document.getElementById("submitBtn").addEventListener("click", () => {
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

// حفظ الإنجاز
function saveAndDisplayAchievement(achievement) {
  let achievements = JSON.parse(localStorage.getItem("achievements")) || [];
  achievements.unshift(achievement);
  localStorage.setItem("achievements", JSON.stringify(achievements));
  renderAchievements();
}

// إضافة إنجاز إلى الصفحة
function addAchievementToPage({ text, date, image }, index) {
  const list = document.getElementById("achievementList");

  const item = document.createElement("div");
  item.className = "achievement-item";

  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  item.appendChild(paragraph);

  const timeStamp = document.createElement("div");
  timeStamp.className = "timestamp";
  timeStamp.textContent = `📅 تم التسجيل بتاريخ: ${date}`;
  item.appendChild(timeStamp);

  if (image) {
    const img = document.createElement("img");
    img.src = image;
    item.appendChild(img);
  }

  // زر الحذف الفردي
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑 حذف هذا الإنجاز";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", () => {
    deleteAchievement(index);
  });

  item.appendChild(deleteBtn);
  list.appendChild(item);
}

// حذف إنجاز واحد
function deleteAchievement(index) {
  let achievements = JSON.parse(localStorage.getItem("achievements")) || [];
  achievements.splice(index, 1);
  localStorage.setItem("achievements", JSON.stringify(achievements));
  renderAchievements();
}

// حذف الكل
document.getElementById("clearAllBtn").addEventListener("click", () => {
  const confirmDelete = confirm("هل أنت متأكد أنك تريد حذف جميع الإنجازات؟");
  if (confirmDelete) {
    localStorage.removeItem("achievements");
    renderAchievements();
  }
});

// إعادة عرض كل الإنجازات
function renderAchievements() {
  const list = document.getElementById("achievementList");
  list.innerHTML = "";
  const achievements = JSON.parse(localStorage.getItem("achievements")) || [];
  achievements.forEach((ach, i) => addAchievementToPage(ach, i));

  const clearBtn = document.getElementById("clearAllBtn");
  if (achievements.length > 0) {
    clearBtn.classList.remove("hidden");
  } else {
    clearBtn.classList.add("hidden");
  }
}