// main.js

let currentPage = 1;
let totalUsers = 0;
let usersPerPage = 5;
let allUsers = [];
let filteredUsers = [];
let currentSortOrder = 'asc'; // Track current sort order

document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
});

function fetchUsers() {
    fetch(`https://jsonplaceholder.typicode.com/users`)
        .then(response => response.json())
        .then(data => {
            allUsers = data;
            filteredUsers = data;
            totalUsers = data.length;
            displayUsers(currentPage);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayUsers(page) {
    const start = (page - 1) * usersPerPage;
    const end = start + usersPerPage;
    const usersToShow = filteredUsers.slice(start, end);
    const tableBody = document.getElementById('userTable');
    tableBody.innerHTML = ''; // Clear previous data

    usersToShow.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}</td>
            <td>${user.phone}</td>
            <td>${user.website}</td>
            <td>${user.company.name}</td>
        `;
        tableBody.appendChild(row);
    });
    updatePagination();
}

function fetchUserByName() {
    const userName = document.getElementById('userName').value.toLowerCase();
    filteredUsers = allUsers.filter(user => user.name.toLowerCase().includes(userName));
    totalUsers = filteredUsers.length;
    currentPage = 1; // Reset to first page
    displayUsers(currentPage);
}

function toggleSortOrder() {
    if (currentSortOrder === 'asc') {
        currentSortOrder = 'desc';
    } else {
        currentSortOrder = 'asc';
    }
    sortByName(currentSortOrder);
}

function sortByName(order) {
    if (order === 'asc') {
        filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
    } else if (order === 'desc') {
        filteredUsers.sort((a, b) => b.name.localeCompare(a.name));
    }
    displayUsers(currentPage);
}

function nextPage() {
    if (currentPage * usersPerPage < totalUsers) {
        currentPage++;
        displayUsers(currentPage);
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayUsers(currentPage);
    }
}

function goToPage(page) {
    if (page > 0 && (page - 1) * usersPerPage < totalUsers) {
        currentPage = page;
        displayUsers(currentPage);
    }
}

function updatePagination() {
    const totalPages = Math.ceil(totalUsers / usersPerPage);
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = `
        <li class="page-item">
            <a class="page-link" href="#" aria-label="Previous" onclick="previousPage()">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
    `;
    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
            <li class="page-item"><a class="page-link" href="#" onclick="goToPage(${i})">${i}</a></li>
        `;
    }
    pagination.innerHTML += `
        <li class="page-item">
            <a class="page-link" href="#" aria-label="Next" onclick="nextPage()">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    `;
}
