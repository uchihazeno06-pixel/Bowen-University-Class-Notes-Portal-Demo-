// ---------- DATA (all hard coded) ----------

// A note has a title, who posted it, and a list of departments it is hidden for
function note(title, by) {
  return {title: title, by: by, hiddenFor: []};
}

// A course starts with 3 notes. Its owner and tags are filled in by setupCourses() below.
function course(code, title) {
  return {code: code, title: title, owner: "", tags: [],
    notes: [note("Week 1 Note", "Lecturer"), note("Week 2 Note", "Lecturer"), note("Past Questions", "Lecturer")]};
}

var departments = [
  {name: "General Studies", courses: [course("GST 111", "Use of English"), course("GST 112", "Nigerian Peoples and Culture"), course("GST 211", "Entrepreneurship and Innovation")]},
  {name: "Software Engineering", courses: [course("SEN 201", "Software Development Life Cycle"), course("SEN 301", "Software Design"), course("SEN 401", "Software Testing")]},
  {name: "Information Technology", courses: [course("IFT 201", "Database Systems"), course("IFT 301", "Web Development"), course("IFT 401", "Network Administration")]},
  {name: "Cyber Security", courses: [course("CYB 201", "Intro to Cyber Security"), course("CYB 301", "Cryptography"), course("CYB 401", "Ethical Hacking")]},
  {name: "Computer Science", courses: [course("CSC 201", "Programming in Python"), course("CSC 301", "Algorithms"), course("CSC 401", "Operating Systems")]},
  {name: "English Language", courses: [course("ENG 201", "English Grammar"), course("ENG 301", "Phonetics"), course("ENG 401", "Literary Criticism")]},
  {name: "Mechatronics", courses: [course("MCT 201", "Intro to Robotics"), course("MCT 301", "Sensors and Actuators"), course("MCT 401", "Control Systems")]},
  {name: "Electrical Engineering", courses: [course("EEE 201", "Circuit Theory"), course("EEE 301", "Electrical Machines"), course("EEE 401", "Power Systems")]},
  {name: "International Relations", courses: [course("IRL 201", "Intro to International Relations"), course("IRL 301", "Diplomacy"), course("IRL 401", "Foreign Policy")]},
  {name: "MBBS", courses: [course("MED 201", "Physiology"), course("MED 301", "Pathology"), course("MED 401", "Pharmacology")]},
  {name: "Anatomy", courses: [course("ANA 201", "Gross Anatomy"), course("ANA 301", "Histology"), course("ANA 401", "Neuroanatomy")]}
];

// Every course gets an owner (the department that made it) and tags (departments it is related to).
// General Studies courses get the tag "General", which counts as related to every department.
function setupCourses() {
  for (var d = 0; d < departments.length; d++) {
    for (var c = 0; c < departments[d].courses.length; c++) {
      var cr = departments[d].courses[c];
      cr.owner = departments[d].name;
      if (cr.owner === "General Studies") {
        cr.tags = ["General"];
      } else {
        cr.tags = [cr.owner];
      }
    }
  }
}
setupCourses();

// Logins. Roles: "student" (view and report), "rep" (add notes, delete for own department, send requests), "admin" (delete for everyone).
var users = [
  {user: "student1", pass: "stud123", role: "student", name: "Student One", dept: "Information Technology"},
  {user: "student2", pass: "stud456", role: "student", name: "Student Two", dept: "Cyber Security"},
  {user: "student3", pass: "stud789", role: "student", name: "Student Three", dept: "Software Engineering"},
  {user: "repift", pass: "ift123", role: "rep", name: "IFT Course Rep", dept: "Information Technology"},
  {user: "repsen", pass: "sen123", role: "rep", name: "SEN Course Rep", dept: "Software Engineering"},
  {user: "repcyb", pass: "cyb123", role: "rep", name: "CYB Course Rep", dept: "Cyber Security"},
  {user: "repcsc", pass: "csc123", role: "rep", name: "CSC Course Rep", dept: "Computer Science"},
  {user: "repgst", pass: "gst123", role: "rep", name: "GST Course Rep", dept: "General Studies"},
  {user: "admin", pass: "admin123", role: "admin", name: "Admin", dept: "Administration"}
];

var me = null;       // the person who is logged in
var requests = [];   // requests from a rep to show another department's course under their department
var reports = [];    // notes that students have reported

// ---------- SMALL HELPERS ----------

// Show or hide an element by id
function setVisible(id, yes) {
  var el = document.getElementById(id);
  if (yes) {
    el.classList.remove("hidden");
  } else {
    el.classList.add("hidden");
  }
}

// Is this course related to the logged in person's department?
function isRelated(cr) {
  return cr.tags.indexOf("General") !== -1 || cr.tags.indexOf(me.dept) !== -1;
}

// Was this note deleted for the logged in person's department?
function isHidden(nt) {
  return nt.hiddenFor.indexOf(me.dept) !== -1;
}

// Admin can approve any request. A rep can approve requests for courses owned by their department.
function canApprove(cr) {
  return me.role === "admin" || (me.role === "rep" && me.dept === cr.owner);
}

// ---------- LOGIN AND LOGOUT ----------

function login() {
  var u = document.getElementById("user").value.trim().toLowerCase();
  var p = document.getElementById("pass").value;
  me = null;

  for (var i = 0; i < users.length; i++) {
    if (users[i].user === u && users[i].pass === p) {
      me = users[i];
    }
  }

  if (me === null) {
    document.getElementById("error").innerText = "Wrong username or password";
    return;
  }

  document.getElementById("error").innerText = "";
  setVisible("loginPage", false);
  setVisible("mainPage", true);
  window.scrollTo(0, 0);

  if (me.role === "rep") {
    document.getElementById("who").innerText = me.name + " (Course Rep, " + me.dept + ")";
  } else if (me.role === "admin") {
    document.getElementById("who").innerText = "Admin";
  } else {
    document.getElementById("who").innerText = me.name + " (Student, " + me.dept + ")";
  }

  // Which panels this person can see
  setVisible("repPanel", me.role === "rep");
  setVisible("reqPanel", me.role === "rep");
  setVisible("inboxPanel", me.role !== "student");
  setVisible("mineLabel", me.role !== "admin");

  fillFilter();
  fillCourseSelect("addCourse", true);
  fillCourseSelect("reqCourse", false);
  showCourses();
  showInbox();
}

function logout() {
  me = null;
  document.getElementById("pass").value = "";
  document.getElementById("search").value = "";
  document.getElementById("mineOnly").checked = false;
  document.getElementById("repMsg").innerText = "";
  document.getElementById("reqMsg").innerText = "";
  setVisible("mainPage", false);
  setVisible("loginPage", true);
}

// ---------- DROPDOWNS ----------

// Department filter: everyone can browse every department
function fillFilter() {
  var html = '<option value="all">All Departments</option>';
  for (var d = 0; d < departments.length; d++) {
    html += '<option value="' + departments[d].name + '">' + departments[d].name + '</option>';
  }
  document.getElementById("deptFilter").innerHTML = html;
}

// Fills a course dropdown with courses related to my department (wantRelated = true) or not related (false)
function fillCourseSelect(id, wantRelated) {
  var html = "";
  for (var d = 0; d < departments.length; d++) {
    for (var c = 0; c < departments[d].courses.length; c++) {
      var cr = departments[d].courses[c];
      if (isRelated(cr) === wantRelated) {
        html += '<option value="' + d + '-' + c + '">' + cr.code + ' - ' + cr.title + '</option>';
      }
    }
  }
  document.getElementById(id).innerHTML = html;
}

// ---------- SHOW COURSES ----------

function showCourses() {
  var word = document.getElementById("search").value.toLowerCase();
  var filter = document.getElementById("deptFilter").value;
  var mineOnly = document.getElementById("mineOnly").checked;
  var html = "";

  for (var d = 0; d < departments.length; d++) {
    var dept = departments[d];
    if (filter !== "all" && filter !== dept.name) {
      continue;
    }

    for (var c = 0; c < dept.courses.length; c++) {
      var cr = dept.courses[c];
      var label = cr.code + " - " + cr.title;
      if (mineOnly && !isRelated(cr)) {
        continue;
      }
      if ((label + " " + cr.tags.join(" ")).toLowerCase().indexOf(word) === -1) {
        continue;
      }

      html += '<div class="course">';
      for (var t = 0; t < cr.tags.length; t++) {
        var tagName = (cr.tags[t] === "General") ? "General (all departments)" : cr.tags[t];
        html += '<span class="badge">' + tagName + '</span>';
      }
      html += '<h3>' + label + '</h3><ul>';

      var shown = 0;
      for (var n = 0; n < cr.notes.length; n++) {
        var nt = cr.notes[n];
        if (isHidden(nt)) {
          continue;
        }
        shown++;
        var args = d + ',' + c + ',' + n;
        html += '<li><div><a href="class_note.pdf" target="_blank">' + nt.title + '</a>';
        html += '<span class="by">Posted by ' + nt.by + '</span></div>';
        if (me.role === "rep") {
          html += '<button class="del" onclick="deleteNote(' + args + ')">Delete</button>';
        } else if (me.role === "admin") {
          html += '<button class="del" onclick="deleteForAll(' + args + ')">Delete for all</button>';
        } else {
          html += '<button class="report" onclick="reportNote(' + args + ')">Report</button>';
        }
        html += '</li>';
      }
      if (shown === 0) {
        html += '<li class="empty">No notes yet</li>';
      }
      html += '</ul></div>';
    }
  }

  if (html === "") {
    html = '<p class="empty">No courses found.</p>';
  }
  document.getElementById("courseList").innerHTML = html;
}

// ---------- COURSE REP ACTIONS ----------

// Posting is public: everyone can see the new note
function addNote() {
  var title = document.getElementById("addTitle").value.trim();
  var msg = document.getElementById("repMsg");

  if (title === "") {
    msg.innerText = "Please type a note title first.";
    return;
  }

  var pos = document.getElementById("addCourse").value.split("-");
  var cr = departments[pos[0]].courses[pos[1]];
  cr.notes.push(note(title, me.name));

  msg.innerText = '"' + title + '" added to ' + cr.code + ". All departments can see it.";
  document.getElementById("addTitle").value = "";
  showCourses();
}

// Deleting only hides the note for the rep's own department
function deleteNote(d, c, n) {
  if (confirm("Delete this note for " + me.dept + " only? Other departments will still see it until their own reps delete it.")) {
    departments[d].courses[c].notes[n].hiddenFor.push(me.dept);
    showCourses();
  }
}

// Ask for another department's course to be related to my department
function sendRequest() {
  var value = document.getElementById("reqCourse").value;
  var msg = document.getElementById("reqMsg");

  if (value === "") {
    msg.innerText = "There are no other courses to request.";
    return;
  }

  var pos = value.split("-");
  var cr = departments[pos[0]].courses[pos[1]];

  for (var i = 0; i < requests.length; i++) {
    if (requests[i].course === cr && requests[i].dept === me.dept && requests[i].status === "pending") {
      msg.innerText = "You already sent this request.";
      return;
    }
  }

  requests.push({course: cr, dept: me.dept, by: me.name, status: "pending"});
  msg.innerText = "Request sent to the " + cr.owner + " rep.";
  showInbox();
}

// Approve or decline a request. Approving adds the requesting department to the course's tags.
function answerRequest(i, yes) {
  var r = requests[i];
  if (yes) {
    r.status = "approved";
    r.course.tags.push(r.dept);
  } else {
    r.status = "declined";
  }
  showInbox();
  showCourses();
}

// ---------- STUDENT AND ADMIN ACTIONS ----------

function reportNote(d, c, n) {
  var cr = departments[d].courses[c];
  var nt = cr.notes[n];

  for (var i = 0; i < reports.length; i++) {
    if (reports[i].note === nt && reports[i].by === me.name) {
      alert("You already reported this note.");
      return;
    }
  }

  reports.push({course: cr, note: nt, by: me.name});
  alert("Thank you. Your report was sent to the course reps and the admin.");
}

// Remove a note for every department, and clear any reports about it
function removeEverywhere(cr, nt) {
  var at = cr.notes.indexOf(nt);
  if (at !== -1) {
    cr.notes.splice(at, 1);
  }
  var kept = [];
  for (var i = 0; i < reports.length; i++) {
    if (reports[i].note !== nt) {
      kept.push(reports[i]);
    }
  }
  reports = kept;
  showCourses();
  showInbox();
}

function deleteForAll(d, c, n) {
  var cr = departments[d].courses[c];
  if (confirm("Delete this note for ALL departments?")) {
    removeEverywhere(cr, cr.notes[n]);
  }
}

function deleteReported(i) {
  if (confirm("Delete this note for ALL departments?")) {
    removeEverywhere(reports[i].course, reports[i].note);
  }
}

function dismissReport(i) {
  reports.splice(i, 1);
  showInbox();
}

// ---------- REQUESTS AND REPORTS LIST ----------

function showInbox() {
  var rhtml = "";
  for (var i = 0; i < requests.length; i++) {
    var r = requests[i];
    if (r.status === "pending" && canApprove(r.course)) {
      rhtml += '<div class="item"><span>' + r.by + ' (' + r.dept + ') wants <b>' + r.course.code + '</b> related to their department</span>';
      rhtml += '<span><button class="ok-btn" onclick="answerRequest(' + i + ', true)">Approve</button> ';
      rhtml += '<button class="del" onclick="answerRequest(' + i + ', false)">Decline</button></span></div>';
    } else if (me.role === "rep" && r.dept === me.dept) {
      rhtml += '<div class="item"><span>Your request for <b>' + r.course.code + '</b>: ' + r.status + '</span></div>';
    }
  }
  if (rhtml === "") {
    rhtml = '<p class="empty">No requests.</p>';
  }
  document.getElementById("requestList").innerHTML = rhtml;

  var phtml = "";
  for (var j = 0; j < reports.length; j++) {
    var rp = reports[j];
    if (me.role === "admin" || isRelated(rp.course)) {
      phtml += '<div class="item"><span>"' + rp.note.title + '" in <b>' + rp.course.code + '</b> reported by ' + rp.by + '</span><span>';
      if (me.role === "admin") {
        phtml += '<button class="del" onclick="deleteReported(' + j + ')">Delete for all</button> ';
      }
      phtml += '<button onclick="dismissReport(' + j + ')">Dismiss</button></span></div>';
    }
  }
  if (phtml === "") {
    phtml = '<p class="empty">No reports.</p>';
  }
  document.getElementById("reportList").innerHTML = phtml;
}
