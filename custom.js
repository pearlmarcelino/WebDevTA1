var grades = [];
var counter = 1;
var pendingDeleteIndex = -1;

var deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
var clearModal = new bootstrap.Modal(document.getElementById("clearModal"));

function addGrade() {
  var subjectInput = document.getElementById("subjectName");
  var gradeInput = document.getElementById("gradeInput");
  var errorMsg = document.getElementById("errorMsg");

  var subject = subjectInput.value.trim();
  var grade = parseFloat(gradeInput.value);

  if (subject == "" || isNaN(grade) || grade < 0 || grade > 100) {
    errorMsg.classList.remove("d-none");
    return;
  }

  errorMsg.classList.add("d-none");

  grades.push({ id: counter, subject: subject, grade: grade });
  counter++;

  displayGrades();
  computeAverage();

  subjectInput.value = "";
  gradeInput.value = "";
  subjectInput.focus();
}

function displayGrades() {
  var tbody = document.getElementById("gradeTableBody");
  var tableWrapper = document.getElementById("tableWrapper");
  var emptyMsg = document.getElementById("emptyMsg");

  tbody.innerHTML = "";

  if (grades.length == 0) {
    tableWrapper.classList.add("d-none");
    emptyMsg.style.display = "block";
    return;
  }

  tableWrapper.classList.remove("d-none");
  emptyMsg.style.display = "none";

  for (var i = 0; i < grades.length; i++) {
    var g = grades[i];
    var remark = getRemark(g.grade);

    var row = "<tr>";
    row += "<td>" + (i + 1) + "</td>";
    row += "<td>" + g.subject + "</td>";
    row += "<td><strong>" + g.grade.toFixed(1) + "</strong></td>";
    row += "<td>" + remark + "</td>";
    row +=
      "<td><button class='btn-delete' onclick='openDeleteModal(" +
      i +
      ")'><i class='bi bi-trash3'></i></button></td>";
    row += "</tr>";

    tbody.innerHTML += row;
  }
}

function getRemark(grade) {
  if (grade >= 90) {
    return "<span class='badge-excellent'>Excellent</span>";
  } else if (grade >= 75) {
    return "<span class='badge-passed'>Passed</span>";
  } else {
    return "<span class='badge-failed'>Failed</span>";
  }
}

function computeAverage() {
  var avgDisplay = document.getElementById("avgDisplay");
  var avgRemark = document.getElementById("avgRemark");

  if (grades.length == 0) {
    avgRemark.textContent = "No grades yet";
    return;
  }

  var total = 0;
  for (var i = 0; i < grades.length; i++) {
    total += grades[i].grade;
  }

  var average = total / grades.length;
  avgDisplay.textContent = average.toFixed(2);

  if (average >= 90) {
    avgRemark.textContent = "Excellent!";
  } else if (average >= 85) {
    avgRemark.textContent = "Very Good";
  } else if (average >= 75) {
    avgRemark.textContent = "Passed";
  } else {
    avgRemark.textContent = "Failed";
  }
}

function openDeleteModal(index) {
  pendingDeleteIndex = index;
  document.getElementById("deleteSubjectName").textContent =
    grades[index].subject;
  deleteModal.show();
}

document
  .getElementById("confirmDeleteBtn")
  .addEventListener("click", function () {
    if (pendingDeleteIndex >= 0) {
      grades.splice(pendingDeleteIndex, 1);
      pendingDeleteIndex = -1;
      displayGrades();
      computeAverage();
      deleteModal.hide();
    }
  });

function confirmClearAll() {
  if (grades.length == 0) return;
  clearModal.show();
}

document
  .getElementById("confirmClearBtn")
  .addEventListener("click", function () {
    grades = [];
    counter = 1;
    displayGrades();
    computeAverage();
    clearModal.hide();
  });

document.addEventListener("keydown", function (event) {
  if (event.key == "Enter") {
    addGrade();
  }
});
