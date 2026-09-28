const API_URL = '/api/requests';

const form = document.getElementById('requestForm');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const requestsList = document.getElementById('requestsList');
const messageDiv = document.getElementById('message');

// Load requests when page loads
document.addEventListener('DOMContentLoaded', loadRequests);

// Form submit event
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('requestId').value;
    const requestData = {
        studentName: document.getElementById('studentName').value,
        email: document.getElementById('email').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
        priority: document.getElementById('priority').value
    };

    try {
        if (id) {
            // Update existing request
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });
            showMessage('Request updated successfully');
        } else {
            // Create new request
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });
            showMessage('Request submitted successfully');
        }
        
        resetForm();
        loadRequests();
    } catch (error) {
        console.error('Error saving request:', error);
        showMessage('Error saving request', true);
    }
});

// Cancel edit
cancelBtn.addEventListener('click', resetForm);

// Fetch and display all requests
async function loadRequests() {
    try {
        const response = await fetch(API_URL);
        const requests = await response.json();
        
        requestsList.innerHTML = '';
        
        if (requests.length === 0) {
            requestsList.innerHTML = '<tr><td colspan="7">No requests found.</td></tr>';
            return;
        }

        requests.forEach(request => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${request.id}</td>
                <td>${request.studentName}</td>
                <td>${request.email}</td>
                <td>${request.category}</td>
                <td>${request.priority}</td>
                <td>${request.description}</td>
                <td>
                    <button class="edit-btn" onclick="editRequest(${request.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteRequest(${request.id})">Delete</button>
                </td>
            `;
            requestsList.appendChild(tr);
        });
    } catch (error) {
        console.error('Error loading requests:', error);
        requestsList.innerHTML = '<p>Error loading requests.</p>';
    }
}

// Load request data into form for editing
async function editRequest(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const request = await response.json();
        
        document.getElementById('requestId').value = request.id;
        document.getElementById('studentName').value = request.studentName;
        document.getElementById('email').value = request.email;
        document.getElementById('category').value = request.category;
        document.getElementById('description').value = request.description;
        document.getElementById('priority').value = request.priority;
        
        formTitle.textContent = 'Edit Request';
        submitBtn.textContent = 'Update Request';
        cancelBtn.style.display = 'inline-block';
        
        // Scroll to top
        window.scrollTo(0, 0);
    } catch (error) {
        console.error('Error fetching request details:', error);
        showMessage('Error loading request details', true);
    }
}

// Delete request
async function deleteRequest(id) {
    if (confirm('Are you sure you want to delete this request?')) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            showMessage('Request deleted successfully');
            loadRequests();
        } catch (error) {
            console.error('Error deleting request:', error);
            showMessage('Error deleting request', true);
        }
    }
}

// Reset form to default state
function resetForm() {
    form.reset();
    document.getElementById('requestId').value = '';
    formTitle.textContent = 'Submit a Request';
    submitBtn.textContent = 'Submit Request';
    cancelBtn.style.display = 'none';
}

// Show temporary message
function showMessage(msg, isError = false) {
    messageDiv.textContent = msg;
    messageDiv.style.display = 'block';
    messageDiv.style.backgroundColor = isError ? '#f8d7da' : '#d4edda';
    messageDiv.style.color = isError ? '#721c24' : '#155724';
    messageDiv.style.borderColor = isError ? '#f5c6cb' : '#c3e6cb';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}
