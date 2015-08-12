/*****************************************************************************/
/* Server Only Methods */
/*****************************************************************************/
Meteor.methods({
  generatePDF: function() {
    console.log('generate PDF');
  },
  exportAllSigns2CSV: function()
  {
    console.log('Server side Export to CSV');


    var JSON2CSV = Meteor.npmRequire('json2csv');
    var data = Signs.find().fetch();
    var yourCSVData = JSON2CSV(data);

    console.log(yourCSVData);

    var blob = new Blob([yourCSVData], {type: "text/csv;charset=utf-8"});
    saveAs(blob, "signs.csv");

    // var fastCsv = Meteor.npmRequire('fast-csv');
    // var jsZip = Meteor.npmRequire('jszip');

    // var zip = new jsZip();
    // var getSigns = Signs.find({}).fetch();

    // fastCsv.writeToString(getSigns, {headers: true}, function(error, data) {
    //   if(error) {
    //     console.log('error' + error);
    //   } else {
    //     console.log('adding CSV to ZIP');
    //     zip.file('signs.csv', data);
    //   }
    // });

     return zip.generate({type: "base64"});
  },
  assignProjectToUser: function(userIdValue, projectIdValue)
  {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    //reset floor
    var assignment = { 'userId': userIdValue,
                    'project': projectIdValue,
                    'floor': null};

    var existingAssignment = UserProjectAssigned.find({userId: userIdValue});
    if (existingAssignment.count() > 0)
    {
      var assignmentDone = UserProjectAssigned.update({userId: userIdValue}, {$set: {projectId: projectIdValue}});
      console.log('A new assignment was successfully updated ' + JSON.stringify(assignment));
    }
    else
    {
      var assignmentDone = UserProjectAssigned.insert(assignment);
      console.log('A new assignment was successfully added ' + JSON.stringify(assignment));
    }

    return assignmentDone;
  },
  assignFloorToUser: function(userIdValue, floorNameValue)
  {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var assignment = { 'userId': userIdValue,
                    'floor': floorNameValue};

    var existingAssignment = UserProjectAssigned.find({userId: userIdValue});
    if (existingAssignment.count() > 0)
    {
      var assignmentDone = UserProjectAssigned.update({userId: userIdValue}, {$set: {floor: floorNameValue}});
      console.log('A new assignment was successfully updated ' + JSON.stringify(assignment));
    }

    return assignmentDone;
  }
});
