module.exports = function(sequelize, DataTypes) {
  var Member = sequelize.define("Member", {
    // Giving the Member model a name of type STRING
    name: DataTypes.STRING
  });

  Member.associate = function(models) {
    // Associating Member with Posts
    // When an Member is deleted, also delete any associated Posts
    Member.hasMany(models.Report, {
      onDelete: "cascade"
    });
  };

  return Member;
};
