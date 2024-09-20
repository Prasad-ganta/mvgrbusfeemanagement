let adminPassword = localStorage.getItem('adminPassword') || "admin123";
let buses = JSON.parse(localStorage.getItem('buses')) || {};

function switchTab(tab) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="switchTab('${tab}')"]`).classList.add('active');
    document.getElementById('studentLogin').style.display = tab === 'student' ? 'block' : 'none';
    document.getElementById('adminLogin').style.display = tab === 'admin' ? 'block' : 'none';
}

function studentLogin() {
    const studentId = document.getElementById('studentId').value.trim();
    let foundStudent = null;
    let foundBus = '';
    for (let bus in buses) {
        foundStudent = buses[bus].find(student => student.id === studentId);
        if (foundStudent) {
            foundBus = bus;
            break;
        }
    }
    if (foundStudent) {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('studentDetails').style.display = 'block';
        document.getElementById('studentInfo').innerHTML = `
            <p><strong>Name:</strong> ${foundStudent.name}</p>
            <p><strong>ID:</strong> ${foundStudent.id}</p>
            <p><strong>Department:</strong> ${foundStudent.department}</p>
            <p><strong>Year:</strong> ${foundStudent.year}</p>
            <p><strong>Bus:</strong> ${foundBus}</p>
            <p><strong>Total Fees:</strong> ${foundStudent.feesTotal}</p>
            <p><strong>Fees Paid:</strong> ${foundStudent.feesPaid}</p>
            <p><strong>Fees Due:</strong> ${foundStudent.feesTotal - foundStudent.feesPaid}</p>
            <p><strong>Fine:</strong> ${foundStudent.fine || 0}</p>
            <p><strong>Bus Stop:</strong> ${foundStudent.busStop || 'Not set'}</p>
            <p><strong>Permission Granted:</strong> ${foundStudent.permissionGranted ? "Yes" : "No"}</p>
        `;
        showToast('Login successful!', 'success');
    } else {
        showToast('Student not found!', 'error');
    }
}

function studentLogout() {
    document.getElementById('studentDetails').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('studentId').value = '';
    showToast('Logged out successfully!', 'success');
}

function adminLogin() {
    const enteredPassword = document.getElementById('adminPassword').value;
    if (enteredPassword === adminPassword) {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('adminContainer').style.display = 'block';
        document.getElementById('logoutButton').style.display = 'block';
        showToast('Admin login successful!', 'success');
    } else {
        showToast('Incorrect password!', 'error');
    }
}

function adminLogout() {
    document.getElementById('adminContainer').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('adminPassword').value = '';
    document.getElementById('busDetails').innerHTML = '';
    document.getElementById('formContainer').style.display = 'none';
    document.getElementById('searchResult').innerHTML = '';
    document.getElementById('logoutButton').style.display = 'none';
    showToast('Admin logged out successfully!', 'success');
}

function saveData() {
    localStorage.setItem('buses', JSON.stringify(buses));
    localStorage.setItem('adminPassword', adminPassword);
}

function displayBusDetails() {
    const busName = document.getElementById('busInput').value.trim();
    const busDetails = document.getElementById('busDetails');

    if (buses[busName]) {
        let html = `<h2>Details for ${busName}</h2>`;
        buses[busName].forEach(student => {
            html += `
                <div class="student-card animate_animated animate_fadeIn">
                    <p><strong>Student ID:</strong> ${student.id}</p>
                    <p><strong>Name:</strong> ${student.name}</p>
                    <p><strong>Department:</strong> ${student.department}</p>
                    <p><strong>Year of Study:</strong> ${student.year}</p>
                    <p><strong>Total Fees:</strong> ${student.feesTotal}</p>
                    <p><strong>Fees Paid:</strong> ${student.feesPaid}</p>
                    <p><strong>Fees Due:</strong> ${student.feesTotal - student.feesPaid}</p>
                    <p><strong>Fine:</strong> ${student.fine || 0}</p>
                    <p><strong>Bus Stop:</strong> ${student.busStop || 'Not set'}</p>
                    <p><strong>Permission Granted:</strong> ${student.permissionGranted ? "Yes" : "No"}</p>
                    <button onclick="changeStudentYearById('${student.id}')">Change Year</button>
                </div>`;
        });
        busDetails.innerHTML = html;
    } else {
        busDetails.innerHTML = `<p class="alert">No details found for ${busName}</p>`;
    }
}

function showAddBusForm() {
    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('addBusForm').style.display = 'block';
    document.getElementById('addStudentForm').style.display = 'none';
    document.getElementById('changePasswordForm').style.display = 'none';
    document.getElementById('searchStudentForm').style.display = 'none';
}

function showAddStudentForm() {
    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('addStudentForm').style.display = 'block';
    document.getElementById('addBusForm').style.display = 'none';
    document.getElementById('changePasswordForm').style.display = 'none';
    document.getElementById('searchStudentForm').style.display = 'none';
}

function showChangePasswordForm() {
    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('changePasswordForm').style.display = 'block';
    document.getElementById('addBusForm').style.display = 'none';
    document.getElementById('addStudentForm').style.display = 'none';
    document.getElementById('searchStudentForm').style.display = 'none';
}

function showSearchStudentForm() {
    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('searchStudentForm').style.display = 'block';
    document.getElementById('addBusForm').style.display = 'none';
    document.getElementById('addStudentForm').style.display = 'none';
    document.getElementById('changePasswordForm').style.display = 'none';
}

function addBus() {
    const busName = document.getElementById('newBusName').value.trim();
    if (busName && !buses[busName]) {
        buses[busName] = [];
        saveData();
        showToast(`Bus ${busName} added successfully.`, 'success');
        document.getElementById('newBusName').value = '';
    } else {
        showToast("Bus name is invalid or already exists.", 'error');
    }
}

function addStudent() {
    const busName = document.getElementById('studentBusName').value.trim();
    const studentId = document.getElementById('newStudentId').value.trim();
    const studentName = document.getElementById('studentName').value.trim();
    const studentDepartment = document.getElementById('studentDepartment').value.trim();
    const studentYear = document.getElementById('studentYear').value.trim();
    const feesTotal = parseFloat(document.getElementById('feesTotal').value.trim());
    const feesPaid = parseFloat(document.getElementById('feesPaid').value.trim());
    const fine = parseFloat(document.getElementById('fine').value.trim()) || 0;
    const busStop = document.getElementById('busStop').value.trim();

    if (busName && studentId && studentName && studentDepartment && studentYear && !isNaN(feesTotal) && !isNaN(feesPaid) && busStop) {
        if (!buses[busName]) {
            showToast(`Bus ${busName} does not exist.`, 'error');
            return;
        }
        buses[busName].push({
            id: studentId,
            name: studentName,
            department: studentDepartment,
            year: studentYear,
            feesTotal: feesTotal,
            feesPaid: feesPaid,
            fine: fine,
            busStop: busStop,
            permissionGranted: feesPaid >= feesTotal
        });
        saveData();
        showToast(`Student ${studentName} added successfully.`, 'success');
        document.getElementById('studentBusName').value = '';
        document.getElementById('newStudentId').value = '';
        document.getElementById('studentName').value = '';
        document.getElementById('studentDepartment').value = '';
        document.getElementById('studentYear').value = '';
        document.getElementById('feesTotal').value = '';
        document.getElementById('feesPaid').value = '';
        document.getElementById('fine').value = '';
        document.getElementById('busStop').value = '';
    } else {
        showToast("Please fill all the required fields correctly.", 'error');
    }
}

function changeAdminPassword() {
    const currentPassword = document.getElementById('currentPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();

    if (currentPassword === adminPassword && newPassword) {
        adminPassword = newPassword;
        saveData();
        showToast("Password changed successfully.", 'success');
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
    } else {
        showToast("Current password is incorrect or new password is invalid.", 'error');
    }
}

function searchStudent() {
    const studentId = document.getElementById('searchStudentId').value.trim();
    const searchResult = document.getElementById('searchResult');
    let found = false;

    for (let bus in buses) {
        buses[bus].forEach(student => {
            if (student.id === studentId) {
                searchResult.innerHTML = `
                    <h2>Search Result</h2>
                    <div class="student-card animate_animated animate_fadeIn">
                        <p><strong>Bus Name:</strong> ${bus}</p>
                        <p><strong>Student ID:</strong> ${student.id}</p>
                        <p><strong>Name:</strong> ${student.name}</p>
                        <p><strong>Department:</strong> ${student.department}</p>
                        <p><strong>Year of Study:</strong> ${student.year}</p>
                        <p><strong>Total Fees:</strong> ${student.feesTotal}</p>
                        <p><strong>Fees Paid:</strong> ${student.feesPaid}</p>
                        <p><strong>Fees Due:</strong> ${student.feesTotal - student.feesPaid}</p>
                        <p><strong>Fine:</strong> ${student.fine || 0}</p>
                        <p><strong>Bus Stop:</strong> ${student.busStop || 'Not set'}</p>
                        <p><strong>Permission Granted:</strong> ${student.permissionGranted ? "Yes" : "No"}</p>
                        <button onclick="changeStudentYearById('${student.id}')">Change Year</button>
                    </div>`;
                found = true;
            }
        });
    }

    if (!found) {
        searchResult.innerHTML = `<p class="alert">No student found with ID ${studentId}</p>`;
    }
}

function showToast(message, type) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = type === 'success' ? 'toast-success' : 'toast-error';
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 3000);
}

function printStudentDetails() {
    window.print();
}

function updateFeeByIdOrDept() {
    const input = prompt("Enter Student ID or Department:");
    const amount = parseFloat(prompt("Enter fee amount to update:"));
    
    if (input && !isNaN(amount)) {
        let updated = false;
        for (let bus in buses) {
            buses[bus].forEach(student => {
                if (student.id === input || student.department === input) {
                    student.feesPaid += amount;
                    student.permissionGranted = student.feesPaid >= student.feesTotal;
                    updated = true;
                }
            });
        }
        if (updated) {
            saveData();
            showToast(`Fees updated for ${input}`, 'success');
            displayBusDetails();
        } else {
            showToast(`No student found with ID or Department: ${input}`, 'error');
        }
    } else {
        showToast("Invalid input", 'error');
    }
}

function grantPermissionByIdOrDept() {
    const input = prompt("Enter Student ID or Department:");
    
    if (input) {
        let updated = false;
        for (let bus in buses) {
            buses[bus].forEach(student => {
                if (student.id === input || student.department === input) {
                    student.permissionGranted = true;
                    updated = true;
                }
            });
        }
        if (updated) {
            saveData();
            showToast(`Permission granted for ${input}`, 'success');
            displayBusDetails();
        } else {
            showToast(`No student found with ID or Department: ${input}`, 'error');
        }
    } else {
        showToast("Invalid input", 'error');
    }
}

function deleteStudentByIdOrDept() {
    const input = prompt("Enter Student ID or Department:");
    
    if (input) {
        let deleted = false;
        for (let bus in buses) {
            buses[bus] = buses[bus].filter(student => {
                if (student.id === input || student.department === input) {
                    deleted = true;
                    return false;
                }
                return true;
            });
        }
        if (deleted) {
            saveData();
            showToast(`Student(s) with ID or Department ${input} deleted`, 'success');
            displayBusDetails();
        } else {
            showToast(`No student found with ID or Department: ${input}`, 'error');
        }
    } else {
        showToast("Invalid input", 'error');
    }
}

function printAllBusDetails() {
    let printContent = '<h1>All Bus Details</h1>';
    for (let bus in buses) {
        printContent += `<h2>Bus: ${bus}</h2>`;
        buses[bus].forEach(student => {
            printContent += `
                <div class="student-card">
                    <p><strong>Student ID:</strong> ${student.id}</p>
                    <p><strong>Name:</strong> ${student.name}</p>
                    <p><strong>Department:</strong> ${student.department}</p>
                    <p><strong>Year of Study:</strong> ${student.year}</p>
                    <p><strong>Total Fees:</strong> ${student.feesTotal}</p>
                    <p><strong>Fees Paid:</strong> ${student.feesPaid}</p>
                    <p><strong>Fees Due:</strong> ${student.feesTotal - student.feesPaid}</p>
                    <p><strong>Fine:</strong> ${student.fine || 0}</p>
                    <p><strong>Bus Stop:</strong> ${student.busStop || 'Not set'}</p>
                    <p><strong>Permission Granted:</strong> ${student.permissionGranted ? "Yes" : "No"}</p>
                </div>`;
        });
    }
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>All Bus Details</title>');
    printWindow.document.write('<style>body { font-family: Arial, sans-serif; } .student-card { border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

function changeStudentYear() {
    const studentId = prompt("Enter Student ID:");
    const newYear = prompt("Enter new Year of Study:");

    if (studentId && newYear) {
        let updated = false;
        for (let bus in buses) {
            buses[bus].forEach(student => {
                if (student.id === studentId) {
                    student.year = newYear;
                    updated = true;
                }
            });
        }
        if (updated) {
            saveData();
            showToast(`Year updated for student ${studentId}`, 'success');
            displayBusDetails();
        } else {
            showToast(`No student found with ID: ${studentId}`, 'error');
        }
    } else {
        showToast("Invalid input", 'error');
    }
}

function changeStudentYearById(studentId) {
    const newYear = prompt(`Enter new Year of Study for student ${studentId}:`);

    if (newYear) {
        let updated = false;
        for (let bus in buses) {
            buses[bus].forEach(student => {
                if (student.id === studentId) {
                    student.year = newYear;
                    updated = true;
                }
            });
        }
        if (updated) {
            saveData();
            showToast(`Year updated for student ${studentId}`, 'success');
            displayBusDetails();
        } else {
            showToast(`No student found with ID: ${studentId}`, 'error');
        }
    } else {
        showToast("Invalid input", 'error');
    }
}