function toggleAttendance(button) {

    const row = button.parentElement.parentElement;
    const statusCell = row.querySelector(".status");

    if (statusCell.textContent === "Absent") {

        statusCell.textContent = "Present";
        button.textContent = "Mark Absent";

    } else {

        statusCell.textContent = "Absent";
        button.textContent = "Mark Present";

    }

    updateAttendance();
}


function updateAttendance() {

    const statuses = document.querySelectorAll(".status");

    let present = 0;

    statuses.forEach(function(status) {

        if (status.textContent === "Present") {
            present++;
        }

    });

    const total = statuses.length;
    const absent = total - present;

    document.getElementById("totalStudents").textContent = total;
    document.getElementById("presentCount").textContent = present;
    document.getElementById("absentCount").textContent = absent;

    const percentage = total === 0
        ? 0
        : ((present / total) * 100).toFixed(1);

    document.getElementById("attendancePercentage").textContent =
        "Attendance Percentage: " + percentage + "%";
}


updateAttendance();