// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the reports
  app.get("/api/reports", function(req, res) {
    var query = {};
    if (req.query.member_id) {
      query.MemberId = req.query.member_id;
    }
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Member
    db.Report.findAll({
      where: query,
      include: [db.Member]
    }).then(function(dbReport) {
      res.json(dbReport);
    });
  });

  // Get route for retrieving a single report
  app.get("/api/reports/:id", function(req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Member
    db.Report.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Member]
    }).then(function(dbReport) {
      res.json(dbReport);
    });
  });

  // POST route for saving a new report
  app.post("/api/reports", function(req, res) {
    db.Report.create(req.body).then(function(dbReport) {
      res.json(dbReport);
    });
  });

  // DELETE route for deleting reports
  app.delete("/api/reports/:id", function(req, res) {
    db.Report.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbReport) {
      res.json(dbReport);
    });
  });

  // PUT route for updating reports
  app.put("/api/reports", function(req, res) {
    db.Report.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbReport) {
      res.json(dbReport);
    });
  });
};
