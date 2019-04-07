$(document).ready(function() {
  /* global moment */

  // reportContainer holds all of our reports
  var reportContainer = $(".report-container");
  var reportCategorySelect = $("#category");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete", handleReportDelete);
  $(document).on("click", "button.edit", handleReportEdit);
  // Variable to hold our reports
  var reports;

  // The code below handles the case where we want to get report reports for a specific member
  // Looks for a query param in the url for member_id
  var url = window.location.search;
  var memberId;
  if (url.indexOf("?member_id=") !== -1) {
    memberId = url.split("=")[1];
    getReports(memberId);
  }
  // If there's no memberId we just get all reports as usual
  else {
    getReports();
  }


  // This function grabs reports from the database and updates the view
  function getReports(member) {
    memberId = member || "";
    if (memberId) {
      memberId = "/?member_id=" + memberId;
    }
    $.get("/api/reports" + memberId, function(data) {
      console.log("Reports", data);
      reports = data;
      if (!reports || !reports.length) {
        displayEmpty(member);
      }
      else {
        initializeRows();
      }
    });
  }

  // This function does an API call to delete reports
  function deleteReport(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/reports/" + id
    })
      .then(function() {
        getReports(reportCategorySelect.val());
      });
  }

  // InitializeRows handles appending all of our constructed reportt HTML inside reportContainer
  function initializeRows() {
    reportContainer.empty();
    var reportsToAdd = [];
    for (var i = 0; i < reports.length; i++) {
      reportsToAdd.push(createNewRow(reports[i]));
    }
    reportContainer.append(reportsToAdd);
  }

  // This function constructs a report's HTML
  function createNewRow(report) {
    var formattedDate = new Date(report.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY");
    var newReportCard = $("<div>");
    newReportCard.addClass("card");
    var newReportCardHeading = $("<div>");
    newReportCardHeading.addClass("card-header");
    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-info");
    var newReportTitle = $("<h6>");
    var newReportDate = $("<small>");
    var newReportMember = $("<h5>");
    /*newReportMember.text("Written by: " + report.Member.name);
    newReportMember.css({
      float: "right",
      color: "blue",
      "margin-top":
      "-10px"
    });*/

    
    var newReportCardBody = $("<div>");
    newReportCardBody.addClass("card-body");
    var newReportBody = $("<table>");
    
    newReportTitle.text("Submitted by" + report.Member.name + " on " + formattedDate);
    newReportBody.append("<tr><td>" + "Spiritual: " + report.pers_spir + "</td><td> Emotional: " + report.pers_emot + "</td><td>Health: " + report.pers_phys + "</td><td>Marriage: " + report.marriage + "</td></tr>" + "<tr><td colspan='4'>Prayer Requests:" + report.body + "</td></tr>");
    
    newReportDate.text(formattedDate);
    //newReportTitle.append(newReportDate);
    newReportCardHeading.append(deleteBtn);
    newReportCardHeading.append(editBtn);
    newReportCardHeading.append(newReportTitle);
    newReportCardHeading.append(newReportMember);
    newReportCardBody.append(newReportBody);
    newReportCard.append(newReportCardHeading);
    newReportCard.append(newReportCardBody);
    newReportCard.data("report", report);
    return newReportCard;
  }

  // This function figures out which report we want to delete and then calls deleteReport
  function handleReportDelete() {
    var currentReport = $(this)
      .parent()
      .parent()
      .data("report");
    deleteReport(currentReport.id);
  }

  // This function figures out which report we want to edit and takes it to the appropriate url
  function handleReportEdit() {
    var currentReport = $(this)
      .parent()
      .parent()
      .data("report");
    window.location.href = "/cms?report_id=" + currentReport.id;
  }

  // This function displays a message when there are no reports
  function displayEmpty(id) {
    var query = window.location.search;
    var partial = "";
    if (id) {
      partial = " for Member #" + id;
    }
    reportContainer.empty();
    var messageH2 = $("<h2>");
    messageH2.css({ "text-align": "center", "margin-top": "50px" });
    messageH2.html("No reports yet" + partial + ", navigate <a href='/cms" + query +
    "'>here</a> in order to get started.");
    reportContainer.append(messageH2);
  }

});
