$(document).ready(function() {
  // Getting references to the name input and member container, as well as the table body
  var nameInput = $("#member-name");
  var memberList = $("tbody");
  var memberContainer = $(".member-container");
  // Adding event listeners to the form to create a new object, and the button to delete
  // an Member
  $(document).on("submit", "#member-form", handleMemberFormSubmit);
  $(document).on("click", ".delete-member", handleDeleteButtonPress);

  // Getting the initial list of Members
  getMembers();

  // A function to handle what happens when the form is submitted to create a new Member
  function handleMemberFormSubmit(event) {
    event.preventDefault();
    // Don't do anything if the name fields hasn't been filled out
    if (!nameInput.val().trim().trim()) {
      return;
    }
    // Calling the upsertMember function and passing in the value of the name input
    upsertMember({
      name: nameInput
        .val()
        .trim()
    });
  }

  // A function for creating an member. Calls getMembers upon completion
  function upsertMember(memberData) {
    $.post("/api/members", memberData)
      .then(getMembers);
  }

  // Function for creating a new list row for members
  function createMemberRow(memberData) {
    var newTr = $("<tr>");
    newTr.data("member", memberData);
    newTr.append("<td>" + memberData.name + "</td>");
    newTr.append("<td> " + memberData.Reports.length + "</td>");
    newTr.append("<td><a href='/blog?member_id=" + memberData.id + "'>Go to Reports</a></td>");
    newTr.append("<td><a href='/cms?member_id=" + memberData.id + "'>Create a Report</a></td>");
    newTr.append("<td><a style='cursor:pointer;color:red' class='delete-member'>Delete Member</a></td>");
    return newTr;
  }

  // Function for retrieving members and getting them ready to be rendered to the page
  function getMembers() {
    $.get("/api/members", function(data) {
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createMemberRow(data[i]));
      }
      renderMemberList(rowsToAdd);
      nameInput.val("");
    });
  }

  // A function for rendering the list of members to the page
  function renderMemberList(rows) {
    memberList.children().not(":last").remove();
    memberContainer.children(".alert").remove();
    if (rows.length) {
      console.log(rows);
      memberList.prepend(rows);
    }
    else {
      renderEmpty();
    }
  }

  // Function for handling what to render when there are no members
  function renderEmpty() {
    var alertDiv = $("<div>");
    alertDiv.addClass("alert alert-danger");
    alertDiv.text("You must create an Member before you can create a Report.");
    memberContainer.append(alertDiv);
  }

  // Function for handling what happens when the delete button is pressed
  function handleDeleteButtonPress() {
    var listItemData = $(this).parent("td").parent("tr").data("member");
    var id = listItemData.id;
    $.ajax({
      method: "DELETE",
      url: "/api/members/" + id
    })
      .then(getMembers);
  }
});
