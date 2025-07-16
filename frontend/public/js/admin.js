document.addEventListener('DOMContentLoaded', () => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    // Initialize variables
    let currentPage = 1;
    const usersPerPage = 10;
    let totalUsers = 0;
    let sortField = 'username';
    let sortOrder = 'ASC';

    // DOM Elements
    const usersTableBody = document.getElementById('usersTableBody');
    const paginationContainer = document.getElementById('pagination');
    const sortFieldSelect = document.getElementById('sortField');
    const sortOrderSelect = document.getElementById('sortOrder');
    const createUserBtn = document.getElementById('createUserBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const createUserModal = document.getElementById('createUserModal');
    const closeModal = document.querySelector('.close-modal');
    const createUserForm = document.getElementById('createUserForm');
    const createUserError = document.getElementById('createUserError');

    // Event Listeners

    sortFieldSelect.addEventListener('change', handleSortChange);
    sortOrderSelect.addEventListener('change', handleSortChange);
    createUserBtn.addEventListener('click', openCreateUserModal);
    closeModal.addEventListener('click', closeCreateUserModal);
    logoutBtn.addEventListener('click', handleLogout);
    createUserForm.addEventListener('submit', handleCreateUserSubmit);

    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target === createUserModal) {
            closeCreateUserModal();
        }
    });

    // Initial load
    loadUsers();

    // Functions
    async function loadUsers() {
        try {
            const response = await fetch(
                `http://localhost:3500/api/show?page=${currentPage}&perPage=${usersPerPage}&sort=${sortField}&order=${sortOrder}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.status === 401) {
                const refreshResponse = await refreshToken();
                if (refreshResponse) {
                    await loadUsers();
                    return;
                } else {
                    window.location.href = '/';
                    return;
                }
            }

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);            }

            const { users, total } = await response.json();
            totalUsers = total;
            renderUsersTable(users);
            renderPagination();
        } catch (error) {
            console.error('Ошибка загрузки пользователей:', error);
            usersTableBody.innerHTML = '<tr><td colspan="7" class="error">Не удалось загрузить пользователей. Попробуйте еще раз.</td></tr>';
        }
    }

    function renderUsersTable(users) {
        if (users.length === 0) {
            usersTableBody.innerHTML = '<tr><td colspan="7">Пользователь не найден</td></tr>';
            return;
        }

        usersTableBody.innerHTML = users.map(user => `
            <tr>
                <td>${user.username}</td>
                <td>${user.first_name || '-'}</td>
                <td>${user.birthdate ? new Date(user.birthdate).toLocaleDateString() : '-'}</td>
                <td class="actions">
                    <a href="/user/${user.id}" class="btn btn-primary btn-sm">
                        <i class="fas fa-eye"></i> View
                    </a>
                </td>
            </tr>
        `).join('');
    }

    function renderPagination() {
        const totalPages = Math.ceil(totalUsers / usersPerPage);
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        // Previous button
        paginationHTML += `
            <button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <button ${i === currentPage ? 'class="active"' : ''} onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        }

        // Next button
        paginationHTML += `
            <button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        paginationContainer.innerHTML = paginationHTML;
    }

    function changePage(page) {
        currentPage = page;
        loadUsers();
    }

    function handleSortChange() {
        sortField = sortFieldSelect.value;
        sortOrder = sortOrderSelect.value;
        currentPage = 1;
        loadUsers();
    }

    function openCreateUserModal() {
        createUserModal.style.display = 'block';
    }

    function closeCreateUserModal() {
        createUserModal.style.display = 'none';
        createUserError.textContent = '';
        createUserForm.reset();
    }

    async function handleCreateUserSubmit(e) {
        e.preventDefault();
        
        const newUser = {
            username: document.getElementById('newUsername').value.trim(),
            password: document.getElementById('newPassword').value,
            first_name: document.getElementById('newFirstName').value.trim() || null,
            last_name: document.getElementById('newLastName').value.trim() || null,
            gender: document.getElementById('newGender').value,
            birthdate: document.getElementById('newBirthdate').value || null
        };


        try {

            if (!newUser.username) {
                throw new Error('Имя пользователя обязательно для заполнения');
            }
            
            if (newUser.username.length < 4) {
                throw new Error('Имя пользователя должно содержать минимум 4 символа');
            }
    
            if (!newUser.password) {
                throw new Error('Пароль обязателен для заполнения');
            }
    
            if (newUser.password.length < 8) {
                throw new Error('Пароль должен содержать минимум 8 символов');
            }
    
            if (!/[A-ZА-Я]/.test(newUser.password)) {
                throw new Error('Пароль должен содержать хотя бы одну заглавную букву');
            }
    
            if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newUser.password)) {
                throw new Error('Пароль должен содержать хотя бы один специальный символ');
            }
            
            const response = await fetch('http://localhost:3500/api/auth/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newUser)
            });

            if (response.status === 401) {
                const refreshResponse = await refreshToken();
                if (refreshResponse) {
                    await handleCreateUserSubmit(e);
                    return;
                } else {
                    window.location.href = '/';
                    return;
                }
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create user');
            }

            closeCreateUserModal();
            currentPage = 1;
            loadUsers();
        } catch (error) {
            console.error('Error creating user:', error);
            createUserError.textContent = error.message || 'Failed to create user. Please try again.';
        }
    }

    

    async function refreshToken() {
        try {
            const response = await fetch('http://localhost:3500/api/auth/check', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const { token: newToken } = await response.json();
                console.log( New)
                localStorage.setItem('token', newToken);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error refreshing token:', error);
            return false;
        }
    }

    function handleLogout() {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    function getGenderDisplay(gender) {
        switch (gender) {
            case 'M': return 'Мужской';
            case 'F': return 'Женский';
            case 'O': return 'Другой';
            default: return '-';
        }
    }

    function debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

    // Make changePage globally available for pagination buttons
    window.changePage = changePage;
});