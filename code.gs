var options = {
  inputTableId: '1oJ2NW0E4IEdPwVtwt_0uHEX6sgRxLXj-uqLkk4hsVDE',
  inputSheetName: 'Questions',
  
  outputTableId: '1oJ2NW0E4IEdPwVtwt_0uHEX6sgRxLXj-uqLkk4hsVDE',
  outputSheetName: 'Answers'
}

function doGet(request) {
  return HtmlService
    .createTemplateFromFile('index')
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function include(filename) {
  return HtmlService
    .createHtmlOutputFromFile(filename)
    .getContent();
}

function processForm(formObject) {
  // var formBlob = formObject.mark;
  saveData(formObject);
  return formObject;
}

function getData() {
  return SpreadsheetApp
    .openById(options.inputTableId)
    .getSheetByName(options.inputSheetName)
    .getDataRange()
    .getValues();
}

function saveData(answers) {
  var data = [];
  var currentDate = new Date();
  data.push(currentDate.toLocaleDateString());
  data.push(currentDate.toLocaleTimeString().split(' ')[0]);
  
  for (var i in answers) {
    data.push(answers[i]);
  }

  SpreadsheetApp
    .openById(options.outputTableId)
    .getSheetByName(options.outputSheetName)
    .appendRow(data)
}


function createHomePage() {
  // create a new site
  var site = SitesApp.createSite("example.com", "rover", "Team Rover", "We'll be the divisional champs this year!");

  // add team members from our Gmail Contacts as collaborators, and create a profile webpage for each contact
  var contacts = ContactsApp.getContactGroup("Soccer").getContacts();
  for (var i = 0; i < contacts.length; i++) {
    site.addCollaborator(contacts[i].getPrimaryEmail());

    var name = contacts[i].getFullName();
    var pageName = name.replace(/\s/g,"");
    var phone = contacts[i].getWorkPhone();
    var description = contacts[i].getNotes();

    var welcomeMessage = name + "'s profile page<br/><br/>Phone: " + phone + "<br/><br/>" + description;
    var webpage = site.createWebPage(name + "'s Page", pageName + "sPage", welcomeMessage);
  }

  // notify club members about future matches
  var annPage = site.createAnnouncementsPage("Team Announcements", "Announcements", "New announcements for the team will be posted here.");
  var d1 = new Date("10/29/2009");
  var d2 = new Date("3/2/2010");
  var events = CalendarApp.openByName("Rover").getEvents(d1, d2);
  for (var i = 0; i < events.length; i++) {
    var message = "There will be a soccer match from " + events[i].getStartTime() + " until " + events[i].getEndTime() + "!";
    annPage.createAnnouncement("Soccer Match #" + (i + 1), message);
  }
}