$(document).ready(function() {
  // Getting jQuery references to the report body, title, form, and member select
  var bodyInput = $("#body");
  var titleInput = $("#title");
  var cmsForm = $("#cms");
  var memberSelect = $("#member");
  var persspirInput = $("input#persspir-input");
  var persemotInput = $("input#persemot-input");
  var persphysInput = $("input#persphys-input");
  var marriageInput = $("#marriage");
   
  // Adding an event listener for when the form is submitted
  $(cmsForm).on("submit", handleFormSubmit);
  // Gets the part of the url that comes after the "?" (which we have if we're updating a report)
  var url = window.location.search;
  var reportId;
  var memberId;
  // Sets a flag for whether or not we're updating a report to be false initially
  var updating = false;

  // If we have this section in our url, we pull out the report id from the url
  // In '?report_id=1', reportId is 1
  if (url.indexOf("?report_id=") !== -1) {
    reportId = url.split("=")[1];
    getReportData(reportId, "report");
  }
  // Otherwise if we have an member_id in our url, preset the member select box to be our Member
  else if (url.indexOf("?member_id=") !== -1) {
    memberId = url.split("=")[1];
  }

  // Getting the members, and their reports
  getMembers();

  // A function for handling what happens when the form to create a new report is submitted
  function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the report if we are missing a body, title, or member
    if (!titleInput.val().trim() || !bodyInput.val().trim() || !memberSelect.val()) {
      return;
    }
    // Constructing a newReport object to hand to the database
    var pers_spir = $("input[name=pers_spir]:checked").val();
    var pers_emot = $("input[name=pers_emot]:checked").val();
    var pers_phys = $("input[name=pers_phys]:checked").val();
    var marriage = $("input[name=marriage]:checked").val();
    var newReport = {
      title: titleInput
        .val()
        .trim(),
        pers_spir: pers_spir,
        pers_emot: pers_emot,
        pers_phys: pers_phys,
        marriage: marriage,
      body: bodyInput
        .val()
        .trim(),
      MemberId: memberSelect.val()
    };

    // If we're updating a report run updateReport to update a report
    // Otherwise run submitReport to create a whole new report
    if (updating) {
      newReport.id = reportId;
      updateReport(newReport);
    }
    else {
      submitReport(newReport);
    }
  }

  // Submits a new report and brings user to blog page upon completion
  function submitReport(report) {
    $.post("/api/reports", report, function() {
      window.location.href = "/blog";
    });
  }

  // Gets report data for the current report if we're editing, or if we're adding to an member's existing reports
  function getReportData(id, type) {
    var queryUrl;
    switch (type) {
    case "report":
      queryUrl = "/api/reports/" + id;
      break;
    case "member":
      queryUrl = "/api/members/" + id;
      break;
    default:
      return;
    }
    $.get(queryUrl, function(data) {
      if (data) {
        console.log(data.MemberId || data.id);
        // If this report exists, prefill our cms forms with its data
        titleInput.val(data.title);
        persspirInput.val(data.pers_spir);
        persemotInput.val(data.pers_emot);
        persphysInput.val(data.pers_phys);
        marriageInput.val(data.marriage);
        bodyInput.val(data.body);
        memberId = data.MemberId || data.id;
        // If we have a report with this id, set a flag for us to know to update the report
        // when we hit submit
        updating = true;
      }
    });
  }

  // A function to get Members and then render our list of Members
  function getMembers() {
    $.get("/api/members", renderMemberList);
  }
  // Function to either render a list of members, or if there are none, direct the user to the page
  // to create an member first
  function renderMemberList(data) {
    if (!data.length) {
      window.location.href = "/members";
    }
    $(".hidden").removeClass("hidden");
    var rowsToAdd = [];
    for (var i = 0; i < data.length; i++) {
      rowsToAdd.push(createMemberRow(data[i]));
    }
    memberSelect.empty();
    console.log(rowsToAdd);
    console.log(memberSelect);
    memberSelect.append(rowsToAdd);
    memberSelect.val(memberId);
  }

  // Creates the member options in the dropdown
  function createMemberRow(member) {
    var listOption = $("<option>");
    listOption.attr("value", member.id);
    listOption.text(member.name);
    return listOption;
  }

  // Update a given report, bring user to the blog page when done
  function updateReport(report) {
    $.ajax({
      method: "PUT",
      url: "/api/reports",
      data: report
    })
      .then(function() {
        window.location.href = "/blog";
      });
  }
});
