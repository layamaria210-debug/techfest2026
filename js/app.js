document.addEventListener("DOMContentLoaded", function () {
    const regForm = document.getElementById("registrationForm");
    const regTable = document.getElementById("registrationTable");
    const welcomeMsg = document.getElementById("welcomeMsg");
    if (welcomeMsg) {
        let visitorName = sessionStorage.getItem("visitorName");
        if (!visitorName) {
            visitorName = prompt("Welcome! Please enter your name:") || "Visitor";
            sessionStorage.setItem("visitorName", visitorName);
        }
        welcomeMsg.textContent = `Welcome, ${visitorName}!`;
    }
    if (regForm) {
        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const phoneInput = document.getElementById("phone");
        const dobInput = document.getElementById("dob");
        const namePattern = /^[A-Za-z ]{3,30}$/;
        const emailPattern = /^[\w\.-]+@[\w-]+\.[a-z]{2,}$/i;
        const phonePattern = /^[6-9]\d{9}$/;
        const dobPattern = /^(199[5-9]|200[0-8])-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
        function validateField(input, pattern, errorId, errorMsg) {
            const errorElement = document.getElementById(errorId);
            if (!pattern.test(input.value.trim())) {
                input.classList.add("invalid-input");
                input.classList.remove("valid-input");
                if (errorElement) errorElement.textContent = errorMsg;
                return false;
            } else {
                input.classList.add("valid-input");
                input.classList.remove("invalid-input");
                if (errorElement) errorElement.textContent = "";
                return true;
            }
        }
        nameInput.addEventListener("input", () => validateField(nameInput, namePattern, "nameError", "3-30 letters allowed."));
        emailInput.addEventListener("input", () => validateField(emailInput, emailPattern, "emailError", "Invalid email address."));
        phoneInput.addEventListener("input", () => validateField(phoneInput, phonePattern, "phoneError", "Enter a 10-digit number."));
        dobInput.addEventListener("change", () => validateField(dobInput, dobPattern, "dobError", "DOB must be between 1995 and 2008."));
        regForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const isNameValid = validateField(nameInput, namePattern, "nameError", "3-30 letters allowed.");
            const isEmailValid = validateField(emailInput, emailPattern, "emailError", "Invalid email address.");
            const isPhoneValid = validateField(phoneInput, phonePattern, "phoneError", "Enter a 10-digit number.");
            const isDobValid = validateField(dobInput, dobPattern, "dobError", "DOB must be between 1995 and 2008.");
            const genderElement = document.querySelector('input[name="gender"]:checked');
            const genderError = document.getElementById("genderError");
            if (!genderElement) {
                genderError.textContent = "Please select gender.";
            } else {
                genderError.textContent = "";
            }
            const eventElements = document.querySelectorAll('input[name="events"]:checked');
            const eventsError = document.getElementById("eventsError");
            if (eventElements.length === 0) {
                eventsError.textContent = "Select at least one event.";
            } else {
                eventsError.textContent = "";
            }
            const department = document.getElementById("department").value;
            const deptError = document.getElementById("deptError");
            if (department === "") {
                deptError.textContent = "Please select a department.";
            } else {
                deptError.textContent = "";
            }
            if (!isNameValid || !isEmailValid || !isPhoneValid || !isDobValid || !genderElement || eventElements.length === 0 || department === "") {
                return;
            }
            let events = [];
            eventElements.forEach(el => events.push(el.value));
            const registration = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                dob: dobInput.value,
                gender: genderElement.value,
                events: events,
                department: department,
                message: document.getElementById("message").value.trim()
            };
            let registrations = JSON.parse(localStorage.getItem("registrations")) || [];
            registrations.push(registration);
            localStorage.setItem("registrations", JSON.stringify(registrations));
            regForm.reset();
            document.querySelectorAll(".valid-input").forEach(el => el.classList.remove("valid-input"));
            alert("Registration Successful!");
        });
    }
    if (regTable) {
        displayRegistrations();
        const clearBtn = document.getElementById("clearAllBtn");
        if (clearBtn) {
            clearBtn.addEventListener("click", function () {
                if (confirm("Are you sure you want to clear all registrations?")) {
                    localStorage.removeItem("registrations");
                    displayRegistrations();
                }
            });
        }
        setupTaskManager();
    }
});
function displayRegistrations() {
    let registrations = JSON.parse(localStorage.getItem("registrations")) || [];
    let table = document.getElementById("registrationTable");
    let totalCountSpan = document.getElementById("totalCount");
    if (!table) return;
    table.innerHTML = "";
    if (totalCountSpan) totalCountSpan.textContent = registrations.length;
    registrations.forEach(function (reg, index) {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${reg.name}</td>
            <td>${reg.email}</td>
            <td>${reg.phone}</td>
            <td>${reg.dob}</td>
            <td>${reg.gender}</td>
            <td>${reg.events.join(", ")}</td>
            <td>${reg.department}</td>
            <td>${reg.message}</td>
            <td><button onclick="deleteParticipant(${index})">Delete</button></td>
        `;
        table.appendChild(row);
    });
}
function deleteParticipant(index) {
    let registrations = JSON.parse(localStorage.getItem("registrations")) || [];
    registrations.splice(index, 1);
    localStorage.setItem("registrations", JSON.stringify(registrations));
    displayRegistrations();
}
function setupTaskManager() {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    if (!addTaskBtn) return;
    function renderTasks() {
    let tasks = JSON.parse(localStorage.getItem("organizerTasks")) || [];
    let taskList = document.getElementById("taskList");
    if (!taskList) return;
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.innerHTML = `
            <span class="${task.completed ? 'completed-task' : ''}">${task.text}</span>
            <div class="task-buttons">
                <button onclick="toggleTask(${index})">✓</button>
                <button onclick="deleteTask(${index})">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}
    addTaskBtn.addEventListener("click", function () {
        let taskText = taskInput.value.trim();
        if (taskText === "") return;
        let tasks = JSON.parse(localStorage.getItem("organizerTasks")) || [];
        tasks.push({ text: taskText, completed: false });
        localStorage.setItem("organizerTasks", JSON.stringify(tasks));
        taskInput.value = "";
        renderTasks();
    });
    window.toggleTask = function (index) {
        let tasks = JSON.parse(localStorage.getItem("organizerTasks")) || [];
        tasks[index].completed = !tasks[index].completed;
        localStorage.setItem("organizerTasks", JSON.stringify(tasks));
        renderTasks();
    };
    window.deleteTask = function (index) {
        let tasks = JSON.parse(localStorage.getItem("organizerTasks")) || [];
        tasks.splice(index, 1);
        localStorage.setItem("organizerTasks", JSON.stringify(tasks));
        renderTasks();
    };
    renderTasks();
}
// ==========================================
// INTERACTIVE GALLERY & LIGHTBOX SLIDESHOW
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    const galleryImages = document.querySelectorAll(".gallery-img");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const closeBtn = document.getElementById("closeBtn");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const startSlideBtn = document.getElementById("startSlideBtn");
    const stopSlideBtn = document.getElementById("stopSlideBtn");

    if (!lightbox) return; // Exit if not on gallery page

    let currentIndex = 0;
    let slideshowInterval = null;

    function showImage(index) {
        if (index < 0) {
            currentIndex = galleryImages.length - 1;
        } else if (index >= galleryImages.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        lightboxImg.src = galleryImages[currentIndex].src;
    }

    function openLightbox(index) {
        lightbox.style.display = "flex";
        showImage(index);
    }

    function closeLightbox() {
        lightbox.style.display = "none";
        stopSlideshow();
    }

    function startSlideshow() {
        if (!slideshowInterval) {
            slideshowInterval = setInterval(() => {
                showImage(currentIndex + 1);
            }, 3000);
        }
    }

    function stopSlideshow() {
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
            slideshowInterval = null;
        }
    }

    galleryImages.forEach((img, idx) => {
        img.addEventListener("click", () => openLightbox(idx));
    });

    closeBtn.addEventListener("click", closeLightbox);
    nextBtn.addEventListener("click", () => showImage(currentIndex + 1));
    prevBtn.addEventListener("click", () => showImage(currentIndex - 1));
    startSlideBtn.addEventListener("click", startSlideshow);
    stopSlideBtn.addEventListener("click", stopSlideshow);

    // Keyboard navigation controls
    document.addEventListener("keydown", function (e) {
        if (lightbox.style.display === "flex") {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") showImage(currentIndex + 1);
            if (e.key === "ArrowLeft") showImage(currentIndex - 1);
        }
    });
});