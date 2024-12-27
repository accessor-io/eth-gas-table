let data = [];
let ethereumPrice = 0;
let currentPage = 1;
const rowsPerPage = 10;
let currentSortKey = 'gasPrice';
let sortAscending = true;

const tableBody = document.getElementById('tableBody');
const loadingIndicator = document.getElementById('loading');
const noDataMessage = document.getElementById('noData');
const pageSelect = document.getElementById('pageSelect');

// Fetch Ethereum Price
function fetchEthereumPrice() {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
        .then(response => response.json())
        .then(prices => {
            ethereumPrice = prices.ethereum.usd;
            updateTable();
        })
        .catch(error => console.error('Failed to fetch Ethereum price', error));
}

// Fetch Table Data (Replace with your actual data fetching logic)
function getTableData() {
    // Mock data (replace with actual API data)
    return [
        { gasPrice: 100, slots: 2, bytes: 256, SLOAD: 5, SSTORE: 3, totalGas: 21000 },
        { gasPrice: 150, slots: 3, bytes: 128, SLOAD: 4, SSTORE: 5, totalGas: 30000 },
        { gasPrice: 200, slots: 4, bytes: 512, SLOAD: 2, SSTORE: 7, totalGas: 45000 },
        // Add more rows as needed
    ];
}

// Create Table Row
function createRow({ gasPrice, slots, bytes, SLOAD, SSTORE, totalGas }) {
    const usdCost = (gasPrice * totalGas * ethereumPrice * 1e-9).toFixed(2);
    const ethCost = (gasPrice * totalGas * 1e-9).toFixed(6);

    return `
        <tr>
            <td>${gasPrice}</td>
            <td>${usdCost}</td>
            <td>${ethCost}</td>
            <td>${slots}</td>
            <td>${bytes}</td>
            <td>${SLOAD}</td>
            <td>${SSTORE}</td>
            <td>${totalGas}</td>
            <td>${usdCost}</td>
        </tr>
    `;
}

// Sort Table
function sortTable(key) {
    sortAscending = (key === currentSortKey) ? !sortAscending : true;
    currentSortKey = key;

    data.sort((a, b) => {
        if (a[key] < b[key]) return sortAscending ? -1 : 1;
        if (a[key] > b[key]) return sortAscending ? 1 : -1;
        return 0;
    });

    updateTable();
}

// Paginate Data
function paginate(data, page) {
    const start = (page - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
}

// Update Table
function updateTable() {
    loadingIndicator.style.display = 'inline';
    const paginatedData = paginate(data, currentPage);

    const rows = paginatedData.map(createRow).join('');
    tableBody.innerHTML = rows || noDataMessage.innerHTML;
    updatePagination();
    loadingIndicator.style.display = 'none';
}

// Update Pagination
function updatePagination() {
    const totalPages = Math.ceil(data.length / rowsPerPage);
    pageSelect.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        if (i === currentPage) option.selected = true;
        pageSelect.appendChild(option);
    }
}

// Change Page
function changePage() {
    currentPage = parseInt(pageSelect.value);
    updateTable();
}

// Fetch Data on Page Load
window.onload = function() {
    data = getTableData(); // Replace with real data fetching logic
    fetchEthereumPrice();
};
