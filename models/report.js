module.exports = function(sequelize, DataTypes) {
  var Report = sequelize.define("Report", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    pers_spir: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1]
     }
     },
     pers_emot: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1]
     }
     },
     pers_phys: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1]
     }
     },
    marriage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      len: [1]
    },
    
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: [1]
    }
  });

  Report.associate = function(models) {
    // We're saying that a Report should belong to an Member
    // A Report can't be created without a Member due to the foreign key constraint
    Report.belongsTo(models.Member, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Report;
};
