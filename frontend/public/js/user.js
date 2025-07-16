document.addEventListener('DOMContentLoaded', async () => {
    // Get user ID from URL
    const userId = window.location.pathname.split('/').pop();
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = '/';
        return;
    }

    // DOM Elements
    const viewMode = document.getElementById('viewMode');
    const editForm = document.getElementById('editForm');
    const editBtn = document.getElementById('editBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const cancelEdit = document.getElementById('cancelEdit');
    const errorMessage = document.getElementById('errorMessage');

    // Form elements
    const editUsername = document.getElementById('editUsername');
    const editFirstName = document.getElementById('editFirstName');
    const editLastName = document.getElementById('editLastName');
    const editGender = document.getElementById('editGender');
    const editBirthdate = document.getElementById('editBirthdate');

    let userData;

    // Load user data
    async function loadUser() {
        try {
            const response = await fetch(`http://localhost:3500/api/show/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 401) {
                const refreshed = await refreshToken();
                if (refreshed) return loadUser();
                window.location.href = '/';
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            userData = await response.json();
            renderUserData();
        } catch (error) {
            console.error('Error loading user:', error);
            errorMessage.textContent = 'Failed to load user data. Please try again.';
        }
    }

    // Render user data in view mode
    function renderUserData() {
        document.getElementById('username').textContent = userData.username;
        document.getElementById('firstName').textContent = userData.first_name || '-';
        document.getElementById('lastName').textContent = userData.last_name || '-';
        document.getElementById('gender').textContent = formatGender(userData.gender);
        document.getElementById('birthdate').textContent = userData.birthdate 
            ? formatDate(userData.birthdate) 
            : '-';
    }

    // Populate edit form
    function populateEditForm() {
        editUsername.value = userData.username;
        editFirstName.value = userData.first_name || '';
        editLastName.value = userData.last_name || '';
        editGender.value = userData.gender || 'M';
        editBirthdate.value = userData.birthdate || '';
    }

    // Toggle edit mode
    function toggleEditMode() {
        viewMode.classList.toggle('hidden');
        editForm.classList.toggle('hidden');
        editBtn.classList.toggle('hidden');
    }

    // Event Listeners
    editBtn.addEventListener('click', () => {
        populateEditForm();
        toggleEditMode();
    });

    cancelEdit.addEventListener('click', () => {
        toggleEditMode();
        errorMessage.textContent = '';
    });

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';

        const updatedUser = {
            username: editUsername.value.trim(),
            first_name: editFirstName.value.trim() || null,
            last_name: editLastName.value.trim() || null,
            gender: editGender.value,
            birthdate: editBirthdate.value || null
        };

        try {
            const response = await fetch(`http://localhost:3500/api/auth/update/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedUser)
            });

            if (response.status === 401) {
                const refreshed = await refreshToken();
                if (refreshed) {
                    editForm.dispatchEvent(new Event('submit'));
                    return;
                }
                window.location.href = '/';
                return;
            }
        console.log(response)
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            userData = await response.json();
            renderUserData();
            toggleEditMode();
        } catch (error) {
            console.error('Ошибка изменения пользователя:', error);
            errorMessage.textContent = error.message ;
        }
    });

    deleteBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(`http://localhost:3500/api/auth/delete/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 401) {
                const refreshed = await refreshToken();
                if (refreshed) {
                    deleteBtn.dispatchEvent(new Event('click'));
                    return;
                }
                window.location.href = '/';
                return;
            }

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            window.location.href = '/admin';
        } catch (error) {
            console.error('Error deleting user:', error);
            errorMessage.textContent = 'Ошибка удаления пользователя. Попробуйте еще раз.';
        }
    });

    // Helper functions
    async function refreshToken() {
        try {
            const response = await fetch('http://localhost:3500/api/auth/check', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const { token: newToken } = await response.json();
                localStorage.setItem('token', newToken);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error refreshing token:', error);
            return false;
        }
    }

    function formatGender(gender) {
        switch (gender) {
            case 'M': return 'Мужской';
            case 'F': return 'Женский';
            case 'O': return 'Другой';
            default: return '-';
        }
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Initial load
    loadUser();
});