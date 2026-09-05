const students = [
    { roll: "01", name: "Student 1" },
    { roll: "02", name: "Student 2" },
    { roll: "03", name: "Student 3" },
    { roll: "04", name: "Student 4" },
    { roll: "05", name: "Student 5" },
    { roll: "06", name: "Student 6" },
    { roll: "07", name: "Student 7" },
    { roll: "08", name: "Student 8" },
    { roll: "09", name: "Student 9" },
    { roll: "10", name: "Student 10" }
];

const STORAGE_KEY = "smartAttendanceData";

let currentAttendance = {};


/* -----------------------------
   Utility Functions
----------------------------- */

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
    if (!dateString) {
        return "";
    }

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function getSavedData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function showMessage(text) {
    const message = document.getElementById("message");
    message.textContent = text;

    setTimeout(() => {
        message.textContent = "";
    }, 3000);
}


/* -----------------------------
   Load Attendance
----------------------------- */

function loadDate(date) {

    const savedData = getSavedData();

    if (savedData[date]) {
        currentAttendance = { ...savedData[date] };
    } else {
        currentAttendance = {};

        students.forEach(student => {
            currentAttendance[student.roll] = false;
        });
    }

    document.getElementById("attendanceDate").value = date;

    document.getElementById("selectedDateText").textContent =
        "Attendance for " + formatDate(date);

    renderStudents();
    updateSummary();
}


/* -----------------------------
   Load Button
----------------------------- */

function loadAttendance() {

    const date = document.getElementById("attendanceDate").value;

    if (!date) {
        showMessage("Please select a date.");
        return;
    }

    loadDate(date);

    showMessage("Attendance loaded for " + formatDate(date));
}


/* -----------------------------
   Render Students
----------------------------- */

function renderStudents() {

    const table = document.getElementById("studentTable");

    const searchText =
        document.getElementById("searchInput").value.toLowerCase();

    table.innerHTML = "";

    students.forEach(student => {

        if (!student.name.toLowerCase().includes(searchText)) {
            return;
        }

        const isPresent = currentAttendance[student.roll] === true;

        const row = document.createElement("tr");

        const percentage = calculateStudentPercentage(student.roll);

        row.innerHTML = `
            <td>${student.roll}</td>

            <td>${student.name}</td>

            <td>
                <span class="status-badge ${isPresent ? "present" : "absent"}">
                    ${isPresent ? "Present" : "Absent"}
                </span>
            </td>

            <td>
                <span class="student-percentage">
                    ${percentage}%
                </span>
            </td>

            <td>
                <button
                    class="action-btn"
                    onclick="toggleAttendance('${student.roll}')"
                >
                    ${isPresent ? "Mark Absent" : "Mark Present"}
                </button>
            </td>
        `;

        table.appendChild(row);
    });
}


/* -----------------------------
   Toggle Attendance
----------------------------- */

function toggleAttendance(roll) {

    currentAttendance[roll] =
        !currentAttendance[roll];

    renderStudents();
    updateSummary();
}


/* -----------------------------
   Update Summary
----------------------------- */

function updateSummary() {

    let present = 0;

    students.forEach(student => {

        if (currentAttendance[student.roll] === true) {
            present++;
        }

    });

    const total = students.length;

    const absent = total - present;

    const percentage =
        total === 0
            ? 0
            : ((present / total) * 100).toFixed(1);

    document.getElementById("totalStudents").textContent = total;

    document.getElementById("presentCount").textContent = present;

    document.getElementById("absentCount").textContent = absent;

    document.getElementById("attendancePercentage").textContent =
        percentage + "%";
}


/* -----------------------------
   Save Attendance
----------------------------- */

function saveAttendance() {

    const date =
        document.getElementById("attendanceDate").value;

    if (!date) {
        showMessage("Please select a date before saving.");
        return;
    }

    const savedData = getSavedData();

    savedData[date] = currentAttendance;

    saveData(savedData);

    renderStudents();
    updateSummary();
    renderHistory();

    showMessage(
        "Attendance saved successfully for " +
        formatDate(date)
    );
}


/* -----------------------------
   Mark All Present
----------------------------- */

function markAllPresent() {

    students.forEach(student => {
        currentAttendance[student.roll] = true;
    });

    renderStudents();
    updateSummary();
}


/* -----------------------------
   Mark All Absent
----------------------------- */

function markAllAbsent() {

    students.forEach(student => {
        currentAttendance[student.roll] = false;
    });

    renderStudents();
    updateSummary();
}


/* -----------------------------
   Student Attendance %
----------------------------- */

function calculateStudentPercentage(roll) {

    const savedData = getSavedData();

    const dates = Object.keys(savedData);

    if (dates.length === 0) {
        return 0;
    }

    let presentCount = 0;

    dates.forEach(date => {

        if (savedData[date][roll] === true) {
            presentCount++;
        }

    });

    return ((presentCount / dates.length) * 100).toFixed(1);
}


/* -----------------------------
   Attendance History
----------------------------- */

function renderHistory() {

    const historyTable =
        document.getElementById("historyTable");

    const noHistory =
        document.getElementById("noHistory");

    const savedData = getSavedData();

    const dates =
        Object.keys(savedData).sort().reverse();

    historyTable.innerHTML = "";

    if (dates.length === 0) {
        noHistory.style.display = "block";
        return;
    }

    noHistory.style.display = "none";

    dates.forEach(date => {

        const attendance = savedData[date];

        let present = 0;

        students.forEach(student => {

            if (attendance[student.roll] === true) {
                present++;
            }

        });

        const absent =
            students.length - present;

        const percentage =
            ((present / students.length) * 100).toFixed(1);

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${formatDate(date)}</td>
            <td>${present}</td>
            <td>${absent}</td>
            <td>${percentage}%</td>
            <td>
                <button
                    class="load-btn"
                    onclick="loadHistoryDate('${date}')"
                >
                    Load
                </button>
            </td>
        `;

        historyTable.appendChild(row);
    });
}


/* -----------------------------
   Load History Date
----------------------------- */

function loadHistoryDate(date) {

    loadDate(date);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    showMessage(
        "Loaded attendance for " +
        formatDate(date)
    );
}


/* -----------------------------
   Export CSV
----------------------------- */

function exportCSV() {

    const date =
        document.getElementById("attendanceDate").value;

    if (!date) {
        showMessage("Please select a date first.");
        return;
    }

    const savedData = getSavedData();

    if (!savedData[date]) {
        showMessage("Save attendance for this date before exporting.");
        return;
    }

    let csv =
        "Roll No.,Student Name,Status,Attendance Percentage\n";

    students.forEach(student => {

        const status =
            savedData[date][student.roll]
                ? "Present"
                : "Absent";

        const percentage =
            calculateStudentPercentage(student.roll);

        csv +=
            `${student.roll},${student.name},${status},${percentage}%\n`;
    });

    const blob =
        new Blob([csv], { type: "text/csv" });

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        `attendance-${date}.csv`;

    link.click();

    URL.revokeObjectURL(url);

    showMessage("CSV file exported successfully.");
}


/* -----------------------------
   Date Change
----------------------------- */

document
    .getElementById("attendanceDate")
    .addEventListener("change", function () {

        loadDate(this.value);

    });


/* -----------------------------
   Initial Load
----------------------------- */

document.getElementById("attendanceDate").value =
    getTodayDate();

loadDate(getTodayDate());

renderHistory();