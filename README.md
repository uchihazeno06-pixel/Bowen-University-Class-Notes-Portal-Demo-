# Bowen University Class Notes Portal (Demo)

A frontend-only web application designed to help students, course representatives, and administrators share and manage class notes. 

Because this is a demo, there is **no backend server or database**. All logic, users, and courses are hard-coded in JavaScript. Changes made (like adding a note or approving a request) will reset if you refresh the page.

## 🚀 Features
*   **Role-Based Access:** Different views and permissions for Students, Course Reps, and Admins.
*   **Public Posting, Department Deleting:** When a rep posts a note, everyone sees it. When a rep deletes a note, it only hides it for their specific department.
*   **Course Tags & Requests:** Courses have owners and tags. Reps can request to have another department's course tagged for their own students.
*   **General Courses:** Courses like GST 111 are tagged as "General" and appear for every department.
*   **Reporting System:** Students can report broken or inappropriate notes, which alerts the reps and admin.

## 🛠️ How to Run It
This project works completely offline. No installation or terminal commands are required.
1. Download the four files: `index.html`, `style.css`, `script.js`, and `class_note.pdf`.
2. Place all four files in the same folder.
3. Double-click `index.html` to open it in your web browser.

## 🔑 Demo Logins
Use the following credentials to test the different roles. (Passwords are case-sensitive).

| Role | Username | Password | Department |
| :--- | :--- | :--- | :--- |
| **Student** | `student1` | `stud123` | Information Technology |
| **Student** | `student2` | `stud456` | Cyber Security |
| **Student** | `student3` | `stud789` | Software Engineering |
| **Course Rep** | `repift` | `ift123` | Information Technology |
| **Course Rep** | `repsen` | `sen123` | Software Engineering |
| **Course Rep** | `repcyb` | `cyb123` | Cyber Security |
| **Course Rep** | `repcsc` | `csc123` | Computer Science |
| **Course Rep** | `repgst` | `gst123` | General Studies |
| **Admin** | `admin` | `admin123` | Administration |

## 🧪 Try This Walkthrough
To see how the system handles conflicts and permissions:
1. Log in as `repift` and add a note to GST 111.
2. Log in as `student2` (Cyber Security). You will see the note.
3. Log in as `repift` and delete that note. 
4. Log in as `student1` (IT) — the note is gone. Log in as `student2` (Cyber) — the note is still there.
5. Log in as `repcyb`, request IFT 301. Log in as `repift` and approve it. Now `student2`'s "only my department" view includes IFT 301.

## ⚠️ Disclaimer
This is a frontend demonstration only. Passwords are visible in the `script.js` source code. In a real production environment, this system would require a secure backend server, a database (e.g., MySQL, PostgreSQL), and hashed passwords.
