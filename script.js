/* =========================================
   DAILYME APPLICATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       ELEMENTS
    ===================================== */

    const taskForm = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const emptyState = document.getElementById("emptyState");

    const totalTasks = document.getElementById("totalTasks");
    const completedTasks = document.getElementById("completedTasks");
    const remainingTasks = document.getElementById("remainingTasks");
    const taskCount = document.getElementById("taskCount");

    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");
    const progressCircleText =
        document.getElementById("progressCircleText");

    const journalInput =
        document.getElementById("journalInput");

    const characterCount =
        document.getElementById("characterCount");

    const clearJournal =
        document.getElementById("clearJournal");

    const selectedMood =
        document.getElementById("selectedMood");

    const moodButtons =
        document.querySelectorAll(".mood-button");

    const resetDay =
        document.getElementById("resetDay");

    const greeting =
        document.getElementById("greeting");

    const currentDay =
        document.getElementById("currentDay");

    const currentDate =
        document.getElementById("currentDate");


    /* =====================================
       STATE
    ===================================== */

    let tasks =
        JSON.parse(localStorage.getItem("dailymeTasks")) || [];

    let mood =
        localStorage.getItem("dailymeMood") || "";

    let journal =
        localStorage.getItem("dailymeJournal") || "";


    /* =====================================
       DATE
    ===================================== */

    function updateDate() {

        const now = new Date();

        const hour = now.getHours();

        if (hour < 12) {
            greeting.textContent = "Selamat pagi! ☀️";
        } else if (hour < 18) {
            greeting.textContent = "Selamat siang! 🌤️";
        } else {
            greeting.textContent = "Selamat malam! 🌙";
        }

        const dayName =
            now.toLocaleDateString("id-ID", {
                weekday: "long"
            });

        const dateName =
            now.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });

        currentDay.textContent = dayName;
        currentDate.textContent = dateName;
    }


    /* =====================================
       LOCAL STORAGE
    ===================================== */

    function saveTasks() {
        localStorage.setItem(
            "dailymeTasks",
            JSON.stringify(tasks)
        );
    }

    function saveMood() {
        localStorage.setItem(
            "dailymeMood",
            mood
        );
    }

    function saveJournal() {
        localStorage.setItem(
            "dailymeJournal",
            journal
        );
    }


    /* =====================================
       RENDER TASKS
    ===================================== */

    function renderTasks() {

        const taskItems =
            taskList.querySelectorAll(".task-item");

        taskItems.forEach(item => {
            item.remove();
        });

        if (tasks.length === 0) {

            emptyState.style.display = "block";

        } else {

            emptyState.style.display = "none";

            tasks.forEach(task => {

                const taskItem =
                    document.createElement("div");

                taskItem.className = "task-item";

                if (task.completed) {
                    taskItem.classList.add("completed");
                }

                taskItem.innerHTML = `
                    <input
                        type="checkbox"
                        class="task-checkbox"
                        ${task.completed ? "checked" : ""}
                    >

                    <span class="task-name">
                        ${escapeHTML(task.name)}
                    </span>

                    <button
                        class="delete-task"
                        title="Hapus aktivitas"
                    >
                        ×
                    </button>
                `;

                const checkbox =
                    taskItem.querySelector(".task-checkbox");

                const deleteButton =
                    taskItem.querySelector(".delete-task");

                checkbox.addEventListener(
                    "change",
                    () => {

                        task.completed =
                            checkbox.checked;

                        saveTasks();
                        renderTasks();
                        updateProgress();
                    }
                );

                deleteButton.addEventListener(
                    "click",
                    () => {

                        tasks =
                            tasks.filter(
                                item => item.id !== task.id
                            );

                        saveTasks();
                        renderTasks();
                        updateProgress();
                    }
                );

                taskList.appendChild(taskItem);
            });
        }

        updateProgress();
    }


    /* =====================================
       ADD TASK
    ===================================== */

    taskForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const name =
                taskInput.value.trim();

            if (!name) {
                return;
            }

            const newTask = {
                id: Date.now(),
                name: name,
                completed: false
            };

            tasks.push(newTask);

            saveTasks();

            taskInput.value = "";

            renderTasks();

            taskInput.focus();
        }
    );


    /* =====================================
       PROGRESS
    ===================================== */

    function updateProgress() {

        const total = tasks.length;

        const completed =
            tasks.filter(
                task => task.completed
            ).length;

        const remaining =
            total - completed;

        let percentage = 0;

        if (total > 0) {
            percentage =
                Math.round(
                    (completed / total) * 100
                );
        }

        totalTasks.textContent = total;
        completedTasks.textContent = completed;
        remainingTasks.textContent = remaining;

        taskCount.textContent =
            `${total} aktivitas`;

        progressFill.style.width =
            `${percentage}%`;

        progressText.textContent =
            `${percentage}%`;

        progressCircleText.textContent =
            `${percentage}%`;
    }


    /* =====================================
       MOOD
    ===================================== */

    function renderMood() {

        moodButtons.forEach(button => {

            button.classList.remove("selected");

            if (
                button.dataset.mood === mood
            ) {
                button.classList.add("selected");
            }
        });

        if (mood) {
            selectedMood.textContent = mood;
        } else {
            selectedMood.textContent =
                "Belum dipilih";
        }
    }


    moodButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                mood =
                    button.dataset.mood;

                saveMood();

                renderMood();
            }
        );
    });


    /* =====================================
       JOURNAL
    ===================================== */

    journalInput.value = journal;

    updateCharacterCount();


    journalInput.addEventListener(
        "input",
        () => {

            journal =
                journalInput.value;

            saveJournal();

            updateCharacterCount();

            showSaveStatus();
        }
    );


    function updateCharacterCount() {

        characterCount.textContent =
            journalInput.value.length;
    }


    function showSaveStatus() {

        const saveStatus =
            document.getElementById("saveStatus");

        saveStatus.textContent =
            "Menyimpan...";

        setTimeout(() => {

            saveStatus.textContent =
                "Tersimpan otomatis";

        }, 500);
    }


    clearJournal.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Hapus catatan hari ini?"
                );

            if (!confirmed) {
                return;
            }

            journal = "";

            journalInput.value = "";

            saveJournal();

            updateCharacterCount();
        }
    );


    /* =====================================
       RESET DAY
    ===================================== */

    resetDay.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Reset semua aktivitas, mood, dan jurnal hari ini?"
                );

            if (!confirmed) {
                return;
            }

            tasks = [];
            mood = "";
            journal = "";

            saveTasks();
            saveMood();
            saveJournal();

            journalInput.value = "";

            renderTasks();
            renderMood();
            updateCharacterCount();
        }
    );


    /* =====================================
       SECURITY
       Mencegah HTML injection dari input
    ===================================== */

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent = text;

        return div.innerHTML;
    }


    /* =====================================
       INITIALIZE
    ===================================== */

    updateDate();

    renderTasks();

    renderMood();

    updateCharacterCount();

});
