/**
 * Admin Interface Functionality
 * 
 * This file contains all the JavaScript code specific to the admin interface
 * including parking slot management, vehicle tracking, and earnings reports.
 * 
 * Depends on main.js for shared utility functions
 */

// Parking rates configuration
const parkingRates = {
    car: 2.50,
    motorcycle: 1.50,
    truck: 4.00
};

// Earnings data (simulated)
let earningsData = {
    today: 150.50,
    week: 875.25,
    total: 5245.75
};

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the admin page
    if (!document.querySelector('.admin-tabs')) {
        return;
    }
    
    console.log('Admin interface initialized');
    
    // Load initial data
    loadParkingData();
    
    // Set up event listeners
    document.getElementById('add-slot').addEventListener('click', addParkingSlot);
    document.getElementById('remove-slot').addEventListener('click', removeParkingSlot);
    
    // Initialize the earnings chart
    initializeEarningsChart();
});

/**
 * Loads and displays parking data
 * 
 * This function populates the parking slots grid and vehicles table
 * with data from our sampleSlots array
 */
function loadParkingData() {
    console.log('Loading parking data...');
    
    // Get the slot container element
    const slotContainer = document.getElementById('slot-container');
    
    // Clear any existing content
    slotContainer.innerHTML = '';
    
    // Check if we have slots to display
    if (sampleSlots.length === 0) {
        slotContainer.innerHTML = '<p class="empty-msg">No parking slots configured</p>';
        return;
    }
    
    // Create a card for each parking slot
    sampleSlots.forEach(slot => {
        const slotCard = document.createElement('div');
        slotCard.className = `slot-card ${slot.status}`;
        
        // Basic slot info
        slotCard.innerHTML = `
            <h3>${slot.id}</h3>
            <p>${slot.status === 'available' ? 'Available' : 'Occupied'}</p>
        `;
        
        // Add vehicle info if occupied
        if (slot.status === 'occupied') {
            slotCard.innerHTML += `
                <p class="vehicle-info">${slot.vehicleNumber}</p>
                <p class="vehicle-type">${slot.vehicleType}</p>
            `;
        }
        
        // Add to the container
        slotContainer.appendChild(slotCard);
    });
    
    // Also update the vehicles table
    updateVehiclesTable();
}

/**
 * Adds a new parking slot
 * 
 * Validates input and adds a new slot to the system
 */
function addParkingSlot() {
    // Get input value and clean it
    const slotIdInput = document.getElementById('slot-id');
    const slotId = slotIdInput.value.trim().toUpperCase();
    
    // Validate input
    if (!slotId) {
        showAlert('Please enter a slot ID', 'error');
        return;
    }
    
    // Check if slot already exists
    if (sampleSlots.some(slot => slot.id === slotId)) {
        showAlert('Slot already exists', 'error');
        return;
    }
    
    // Add new slot
    sampleSlots.push({
        id: slotId,
        status: 'available'
    });
    
    // Clear input and refresh display
    slotIdInput.value = '';
    loadParkingData();
    showAlert(`Slot ${slotId} added successfully`);
    
    console.log(`Added new slot: ${slotId}`);
}

/**
 * Removes a parking slot
 * 
 * Validates input and removes a slot from the system
 */
function removeParkingSlot() {
    // Get input value and clean it
    const slotIdInput = document.getElementById('slot-id');
    const slotId = slotIdInput.value.trim().toUpperCase();
    
    // Validate input
    if (!slotId) {
        showAlert('Please enter a slot ID', 'error');
        return;
    }
    
    // Find slot index
    const slotIndex = sampleSlots.findIndex(slot => slot.id === slotId);
    
    if (slotIndex === -1) {
        showAlert('Slot not found', 'error');
        return;
    }
    
    // Check if slot is occupied
    if (sampleSlots[slotIndex].status === 'occupied') {
        showAlert('Cannot remove an occupied slot', 'error');
        return;
    }
    
    // Remove the slot
    sampleSlots.splice(slotIndex, 1);
    
    // Clear input and refresh display
    slotIdInput.value = '';
    loadParkingData();
    showAlert(`Slot ${slotId} removed successfully`);
    
    console.log(`Removed slot: ${slotId}`);
}

/**
 * Updates the parked vehicles table
 * 
 * Populates the table with data from occupied parking slots
 */
function updateVehiclesTable() {
    // Get the table body element
    const tableBody = document.querySelector('#vehicles-table tbody');
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Filter for occupied slots
    const occupiedSlots = sampleSlots.filter(slot => slot.status === 'occupied');
    
    // Check if we have parked vehicles
    if (occupiedSlots.length === 0) {
        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="5">No vehicles currently parked</td>
            </tr>
        `;
        return;
    }
    
    // Add a row for each parked vehicle
    occupiedSlots.forEach(slot => {
        const entryDate = new Date(slot.entryTime);
        const duration = calculateDuration(entryDate);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${slot.id}</td>
            <td>${slot.vehicleNumber}</td>
            <td>${slot.vehicleType.charAt(0).toUpperCase() + slot.vehicleType.slice(1)}</td>
            <td>${formatDate(entryDate)}</td>
            <td>${duration}</td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * Initializes the earnings chart
 * 
 * Uses Chart.js to create a visual representation of earnings data
 */
function initializeEarningsChart() {
    // Get the canvas element
    const ctx = document.getElementById('earnings-chart').getContext('2d');
    
    // Sample data for the chart
    const chartData = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [{
            label: 'Daily Earnings ($)',
            data: [120, 190, 150, 200, 180, 95, 140],
            backgroundColor: 'rgba(76, 175, 80, 0.5)',
            borderColor: 'rgba(76, 175, 80, 1)',
            borderWidth: 1
        }]
    };
    
    // Create the chart
    new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    console.log('Earnings chart initialized');
}