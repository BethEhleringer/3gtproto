var db = require("../models");

module.exports = function(app) {
  app.get("/api/members", function(req, res) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Report
    db.Member.findAll({
      include: [db.Report]
    }).then(function(dbMember) {
      res.json(dbMember);
    });
  });

  app.get("/api/members/:id", function(req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Report
    db.Member.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Report]
    }).then(function(dbMember) {
      res.json(dbMember);
    });
  });

  app.post("/api/members", function(req, res) {
    db.Member.create(req.body).then(function(dbMember) {
      res.json(dbMember);
    });
  });

  app.delete("/api/members/:id", function(req, res) {
    db.Member.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbMember) {
      res.json(dbMember);
    });
  });

};
