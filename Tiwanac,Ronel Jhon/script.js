
document.addEventListener("DOMContentLoaded", function () {

    const studentForm = document.getElementById("studentForm");
    const studentTable = document.getElementById("studentTable");
    const message = document.getElementById("message");
    const darkModeBtn = document.getElementById("darkModeBtn");
    const totalStudents = document.getElementById("totalStudents");

   

            updateThemeButton();
        });

   
    studentForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const program = document.getElementById("program").value;

        if (!name || !email || !program) {
            showMessage("Please complete all fields!", "error");
            return;
        }

        addStudentToTable(name, email, program);

        updateNumbers();
        updateStudentCount();
        saveStudents();

        showMessage("Student added successfully!", "success");

        studentForm.reset();
    });

  
    function addStudentToTable(name, email, program) {

        const row = document.createElement("tr");

        const numberCell = document.createElement("td");
        const nameCell = document.createElement("td");
        const emailCell = document.createElement("td");
        const programCell = document.createElement("td");
        const actionCell = document.createElement("td");

        nameCell.textContent = name;
        emailCell.textContent = email;

        const badge = document.createElement("span");

        badge.className = "program-badge";
        badge.textContent = program;

        programCell.appendChild(badge);

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function () {

            row.remove();

            updateNumbers();
            updateStudentCount();
            saveStudents();

            showMessage("Student deleted successfully!", "success");

        });

        actionCell.appendChild(deleteButton);

        row.appendChild(numberCell);
        row.appendChild(nameCell);
        row.appendChild(emailCell);
        row.appendChild(programCell);
        row.appendChild(actionCell);

        studentTable.appendChild(row);
    }

    
    function saveStudents() {

        const rows = studentTable.querySelectorAll("tr:not(#emptyRow)");

        const students = [];

        rows.forEach(function (row) {

            students.push({
                name: row.cells[1].textContent,
                email: row.cells[2].textContent,
                program: row.cells[3].textContent
            });

        });

        localStorage.setItem("students", JSON.stringify(students));
    }

    // LOAD STUDENTS
    function loadStudents() {

        let students = [];

        try {
            students = JSON.parse(localStorage.getItem("students")) || [];

            if (!Array.isArray(students)) {
                students = [];
            }

        } catch (error) {
            students = [];
        }

        students.forEach(function (student) {

            if (student.name && student.email && student.program) {

                addStudentToTable(
                    student.name,
                    student.email,
                    student.program
                );

            }

        });

        updateNumbers();
        updateStudentCount();
    }

    
    function updateNumbers() {

        const rows = studentTable.querySelectorAll("tr:not(#emptyRow)");

        rows.forEach(function (row, index) {
            row.cells[0].textContent = index + 1;
        });
    }

   
    function updateStudentCount() {

        const rows = studentTable.querySelectorAll("tr:not(#emptyRow)");

        totalStudents.textContent = rows.length;

        let emptyRow = document.getElementById("emptyRow");

        if (rows.length === 0 && !emptyRow) {

            emptyRow = document.createElement("tr");
            emptyRow.id = "emptyRow";

            const cell = document.createElement("td");

            cell.colSpan = 5;
            cell.className = "empty-message";
            cell.textContent = "No student records available.";

            emptyRow.appendChild(cell);
            studentTable.appendChild(emptyRow);

        } else if (rows.length > 0 && emptyRow) {

            emptyRow.remove();

        }
    }

    function showMessage(text, type) {

        message.textContent = text;
        message.className = "message " + type;
    }

    // SIGN OUT
    const signOutBtn = document.getElementById("signOutBtn");

    if (signOutBtn) {

        signOutBtn.addEventListener("click", function (event) {

            event.preventDefault();

            localStorage.removeItem("authToken");
            sessionStorage.clear();

            window.location.href = "login.html";
        });
    }

    
    loadStudents();
