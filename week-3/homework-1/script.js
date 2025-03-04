$(document).ready(function () {
  var studentsData = [];

  $("#submit").hover(
    function () {
      $(this).css("background-color", "blue");
    },
    function () {
      $(this).css("background-color", "");
    }
  );

  $("#studentForm").submit(function (event) {
    event.preventDefault();

    var name = $("#studentName").val();
    var surname = $("#studentSurname").val();
    var age = $("#studentAge").val();
    var department = $("#studentDepartment").val();
    var city = $("#studentCity").val();

    if (
      name === "" ||
      surname === "" ||
      age === "" ||
      department === "" ||
      city === ""
    ) {
      $("#message").text("Please fill all the fields").css("color", "red");
      return;
    }

    var newStudent = {
      name: name,
      surname: surname,
      age: age,
      department: department,
      city: city,
    };

    var jsonString = JSON.stringify(newStudent);

    studentsData.push(newStudent);

    var row = `<tr>
                <td>${newStudent.name}</td>
                <td>${newStudent.surname}</td>
                <td>${newStudent.age}</td>
                <td>${newStudent.department}</td>
                <td>${newStudent.city}</td>
                <td><button class="deleteBtn">Delete</button></td>
            </tr>`;

    $("#studentTable tbody").append(row);

    $("#studentForm")[0].reset();

    $("#message").text(jsonString).css("color", "green");

    $("tr")
      .not("thead tr")
      .mouseover(function () {
        $(this).css("background-color", "green");
      });

    $("tr ")
      .not("thead tr")
      .mouseout(function () {
        $(this).css("background-color", "white");
      });

    $("#studentTable").on("dblclick", ".deleteBtn", function () {
      $(this).closest("tr").remove();
      $("#message").text("Student deleted successfully").css("color", "green");
    });
  });
});
