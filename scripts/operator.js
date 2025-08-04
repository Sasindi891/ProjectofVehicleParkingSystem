/**
 * Operator Interface Functionality
 * 
 * This file contains all the JavaScript code specific to the operator interface
 * including parking vehicles, calculating fees, and managing parking slots.
 * 
 * Depends on main.js for shared utility functions
 */

// Parking rates configuration
const parkingRates = {
    car: 2.50,
    motorcycle: 1.50,
    truck: 4.00
};

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the operator page
    if (!document.querySelector('.operator-tabs')) {
        return;
    }
    
    console.log('Operator interface initialized');
    
    // Load initial data
    updateOperatorSlots();
    
    // Set up form event listeners
    document.getElementById('parking-form').addEventListener('submit', handleParking);
    document.getElementById('removal-form').addEventListener('submit', handleRemoval);
});

/**
 * Updates the operator's view of parking slots
 * 
 * Populates the slot grid with current parking slot status
 */
function updateOperatorSlots() {
    // Get the slot container element
    const slotContainer = document.getElementById('operator-slot-container');
    
    // Clear existing content
    slotContainer.innerHTML = '';
    
    // Check if we have slots to display
    if (sampleSlots.length === 0) {
        slotContainer.innerHTML = '<p class="empty-msg">No parking slots available</p>';
        return;
    }
    
    // Create a card for each slot
    sampleSlots.forEach(slot => {
        const slotCard = document.createElement('div');
        slotCard.className = `operator-slot ${slot.status}`;
        
        slotCard.innerHTML = `
            <h3>${slot.id}</h3>
            <p>${slot.status === 'available' ? 'Available' : 'Occupied'}</p>
        `;
        
        slotContainer.appendChild(slotCard);
    });
}

/**
 * Handles parking a new vehicle
 * 
 * @param {Event} event - The form submit event
 */
function handleParking(event) {
    // Prevent default form submission
    event.preventDefault();
    
    // Get form values
    const vehicleNumber = document.getElementById('vehicle-number').value.trim().toUpperCase();
    const vehicleType = document.getElementById('vehicle-type').value;
    
    // Validate inputs
    if (!vehicleNumber || !vehicleType) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    // Check if vehicle is already parked
    if (sampleSlots.some(slot => slot.status === 'occupied' && slot.vehicleNumber === vehicleNumber)) {
        showAlert('This vehicle is already parked', 'error');
        return;
    }
    
    // Find an available slot
    const availableSlot = sampleSlots.find(slot => slot.status === 'available');
    
    if (!availableSlot) {
        showAlert('No available parking slots', 'error');
        return;
    }
    
    // Park the vehicle
    availableSlot.status = 'occupied';
    availableSlot.vehicleNumber = vehicleNumber;
    availableSlot.vehicleType = vehicleType;
    availableSlot.entryTime = new Date();
    
    // Show confirmation
    document.getElementById('confirmed-number').textContent = vehicleNumber;
    document.getElementById('confirmed-slot').textContent = availableSlot.id;
    document.getElementById('park-confirm').classList.remove('hidden');
    
    // Reset form and update display
    document.getElementById('parking-form').reset();
    updateOperatorSlots();
    
    console.log(`Parked vehicle ${vehicleNumber} in slot ${availableSlot.id}`);
}

/**
 * Hides the parking confirmation message
 */
function hideConfirmation() {
    document.getElementById('park-confirm').classList.add('hidden');
}

/**
 * Handles removing a vehicle and calculating fees
 * 
 * @param {Event} event - The form submit event
 */
function handleRemoval(event) {
    // Prevent default form submission
    event.preventDefault();
    
    // Get vehicle number
    const vehicleNumber = document.getElementById('exit-vehicle-number').value.trim().toUpperCase();
    
    // Validate input
    if (!vehicleNumber) {
        showAlert('Please enter a vehicle number', 'error');
        return;
    }
    
    // Find the vehicle
    const vehicleSlot = sampleSlots.find(slot => 
        slot.status === 'occupied' && slot.vehicleNumber === vehicleNumber
    );
    
    if (!vehicleSlot) {
        showAlert('Vehicle not found in parking', 'error');
        return;
    }
    
    // Calculate parking duration and fee
    const entryTime = new Date(vehicleSlot.entryTime);
    const exitTime = new Date();
    const durationHours = (exitTime - entryTime) / (1000 * 60 * 60);
    const rate = parkingRates[vehicleSlot.vehicleType];
    const fee = Math.ceil(durationHours) * rate; // Round up to nearest hour
    
    // Display fee information
    document.getElementById('fee-vehicle').textContent = vehicleNumber;
    document.getElementById('fee-entry-time').textContent = formatDate(entryTime);
    document.getElementById('fee-duration').textContent = calculateDuration(entryTime, exitTime);
    document.getElementById('fee-total').textContent = `$${fee.toFixed(2)}`;
    document.getElementById('fee-display').classList.remove('hidden');
    
    console.log(`Calculated fee for ${vehicleNumber}: $${fee.toFixed(2)}`);
}

/**
 * Confirms payment and removes the vehicle
 */
function confirmPayment() {
    const vehicleNumber = document.getElementById('exit-vehicle-number').value.trim().toUpperCase();
    
    // Find the vehicle slot
    const slotIndex = sampleSlots.findIndex(slot => 
        slot.status === 'occupied' && slot.vehicleNumber === vehicleNumber
    );
    
    if (slotIndex !== -1) {
        // Free up the slot
        sampleSlots[slotIndex].status = 'available';
        delete sampleSlots[slotIndex].vehicleNumber;
        delete sampleSlots[slotIndex].vehicleType;
        delete sampleSlots[slotIndex].entryTime;
        
        // Reset forms and update display
        document.getElementById('removal-form').reset();
        document.getElementById('fee-display').classList.add('hidden');
        updateOperatorSlots();
        
        showAlert(`Vehicle ${vehicleNumber} has exited. Thank you!`);
        
        console.log(`Vehicle ${vehicleNumber} removed from parking`);
    }
}

/**
 * Cancels the removal process
 */
function cancelRemoval() {
    document.getElementById('removal-form').reset();
    document.getElementById('fee-display').classList.add('hidden');
}