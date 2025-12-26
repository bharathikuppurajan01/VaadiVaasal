document.addEventListener("DOMContentLoaded", function () {
    const addTamerBullBtn = document.getElementById("addTamerBullBtn");
    const formContainer = document.getElementById("tamerBullFormContainer");
    const editFormContainer = document.getElementById("editFormContainer");

    const addForm = document.getElementById("addTamerBullForm");
    const editForm = document.getElementById("editTamerBullForm");

    const overlay = document.getElementById("overlay");
    const tamerBullGrid = document.getElementById("tamerBullGrid");

    // Inputs for Filtering
    const searchInput = document.getElementById("searchInput");
    const sortSelect = document.getElementById("sortSelect");

    // Cancel Buttons
    const cancelAddBtn = document.getElementById("cancelAddBtn");
    const cancelEditBtn = document.getElementById("cancelEdit");

    // Dummy Data to Start With (If empty)
    let tamersAndBulls = [
        { id: 1, name: "Velu", experience: 5, region: "Madurai", Nationality: "Indian", matchesPlayed: 12, bullName: "Karuppu", bullStrength: 85, bullSpeed: 90, bullBreed: "Kangayam" },
        { id: 2, name: "Muthu", experience: 8, region: "Trichy", Nationality: "Indian", matchesPlayed: 20, bullName: "Singam", bullStrength: 92, bullSpeed: 88, bullBreed: "Jallikattu" }
    ];

    // Load initial data
    renderTamerBullCards();

    // Event Listeners for UI
    addTamerBullBtn.addEventListener("click", () => openModal(formContainer));
    cancelAddBtn.addEventListener("click", () => closeModal(formContainer));
    cancelEditBtn.addEventListener("click", () => closeModal(editFormContainer));
    overlay.addEventListener("click", () => {
        closeModal(formContainer);
        closeModal(editFormContainer);
    });

    // Search and Sort Listeners
    searchInput.addEventListener("input", renderTamerBullCards);
    sortSelect.addEventListener("change", renderTamerBullCards);

    // Add Form Submit
    addForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const newEntry = {
            id: Date.now(), // Simple unique ID
            name: document.getElementById("tamerName").value,
            experience: parseInt(document.getElementById("tamerExperience").value),
            region: document.getElementById("tamerRegion").value,
            Nationality: document.getElementById("tamerNationality").value,
            matchesPlayed: parseInt(document.getElementById("matchesPlayed").value),
            bullName: document.getElementById("bullName").value,
            bullStrength: parseInt(document.getElementById("bullStrength").value),
            bullSpeed: parseInt(document.getElementById("bullSpeed").value),
            bullBreed: document.getElementById("bullBreed").value
        };

        tamersAndBulls.push(newEntry);
        renderTamerBullCards();
        closeModal(formContainer);
        addForm.reset();

        // Optional: Send to server if needed
        // sendToServer(newEntry, "BullsCardServlet");
    });

    // Helper: Open Modal
    function openModal(modal) {
        modal.style.display = "block";
        overlay.style.display = "block";
    }

    // Helper: Close Modal
    function closeModal(modal) {
        modal.style.display = "none";
        overlay.style.display = "none";
    }

    // Render Cards with Filter and Sort
    function renderTamerBullCards() {
        tamerBullGrid.innerHTML = "";

        let filtered = tamersAndBulls.filter(item => {
            const term = searchInput.value.toLowerCase();
            return item.name.toLowerCase().includes(term) ||
                item.region.toLowerCase().includes(term) ||
                item.bullName.toLowerCase().includes(term);
        });

        const sortValue = sortSelect.value;
        filtered.sort((a, b) => {
            if (sortValue === "name") return a.name.localeCompare(b.name);
            if (sortValue === "experience") return b.experience - a.experience;
            if (sortValue === "strength") return b.bullStrength - a.bullStrength;
            if (sortValue === "speed") return b.bullSpeed - a.bullSpeed;
            return 0;
        });

        filtered.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("tamer-bull-card");
            card.innerHTML = `
                <div>
                    <h3>${item.name}</h3>
                    <p><strong>Region:</strong> ${item.region}</p>
                    <p><strong>Experience:</strong> ${item.experience} Years</p>
                    <p><strong>Matches:</strong> ${item.matchesPlayed}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">
                    <h3>Bull: ${item.bullName}</h3>
                    <p><strong>Breed:</strong> ${item.bullBreed}</p>
                    <p><strong>Strength:</strong> ${item.bullStrength} | <strong>Speed:</strong> ${item.bullSpeed}</p>
                </div>
                <div class="card-actions">
                    <button class="edit-btn" onclick="openEditModal(${item.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteEntry(${item.id})">Delete</button>
                </div>
            `;
            tamerBullGrid.appendChild(card);
        });
    }

    // Expose functions to global scope for HTML onclick
    window.openEditModal = function (id) {
        const item = tamersAndBulls.find(i => i.id === id);
        if (!item) return;

        document.getElementById("editTamerBullId").value = item.id;
        document.getElementById("editTamerName").value = item.name;
        document.getElementById("editTamerExperience").value = item.experience;
        document.getElementById("editTamerRegion").value = item.region;
        document.getElementById("editTamerNationality").value = item.Nationality;
        document.getElementById("editMatchesPlayed").value = item.matchesPlayed;

        document.getElementById("editBullName").value = item.bullName;
        document.getElementById("editBullStrength").value = item.bullStrength;
        document.getElementById("editBullSpeed").value = item.bullSpeed;
        document.getElementById("editBullBreed").value = item.bullBreed;

        openModal(editFormContainer);
    };

    window.submitEditTamerBull = function () {
        const id = parseInt(document.getElementById("editTamerBullId").value);
        const index = tamersAndBulls.findIndex(i => i.id === id);

        if (index !== -1) {
            tamersAndBulls[index] = {
                id: id,
                name: document.getElementById("editTamerName").value,
                experience: parseInt(document.getElementById("editTamerExperience").value),
                region: document.getElementById("editTamerRegion").value,
                Nationality: document.getElementById("editTamerNationality").value,
                matchesPlayed: parseInt(document.getElementById("editMatchesPlayed").value),
                bullName: document.getElementById("editBullName").value,
                bullStrength: parseInt(document.getElementById("editBullStrength").value),
                bullSpeed: parseInt(document.getElementById("editBullSpeed").value),
                bullBreed: document.getElementById("editBullBreed").value
            };

            renderTamerBullCards();
            closeModal(editFormContainer);
            alert("Updated successfully!");
        }
    };

    window.deleteEntry = function (id) {
        if (confirm("Are you sure you want to delete this entry?")) {
            tamersAndBulls = tamersAndBulls.filter(i => i.id !== id);
            renderTamerBullCards();
        }
    };
});
