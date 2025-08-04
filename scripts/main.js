/**
 * Vehicle Parking Management System - Shared Functions
 * 
 * This file contains utility functions used across all pages
 * 
 
 */

// Global flag to track if DOM is fully loaded
let domLoaded = false;

// Wait for DOM to be fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', function() {
    domLoaded = true;
    console.log('DOM fully loaded and parsed');
    
    // Initialize tab functionality if tabs exist on page
    if (document.querySelector('.tabs')) {
        setupTabs();
    }
});

/**
 * Sets up tab functionality for admin and operator interfaces
 * 
 * This function adds click event listeners to all tab buttons
 * and handles showing/hiding the corresponding content
 */
function setupTabs() {
    // Get all tab buttons and content areas
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Add click event to each tab button
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the tab ID from data attribute
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    console.log('Tab navigation initialized');
}

/**
 * Displays a simple alert message to the user
 * 
 * @param {string} message - The message to display
 * @param {string} type - Type of alert (success, error, warning)
 */
function showAlert(message, type = 'success') {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    // Position at top of page
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.left = '50%';
    alertDiv.style.transform = 'translateX(-50%)';
    alertDiv.style.padding = '15px 25px';
    alertDiv.style.borderRadius = '5px';
    alertDiv.style.zIndex = '1000';
    
    // Set colors based on type
    if (type === 'success') {
        alertDiv.style.backgroundColor = '#4CAF50';
        alertDiv.style.color = 'white';
    } else if (type === 'error') {
        alertDiv.style.backgroundColor = '#f44336';
        alertDiv.style.color = 'white';
    } else {
        alertDiv.style.backgroundColor = '#ff9800';
        alertDiv.style.color = 'black';
    }
    
    // Add to page
    document.body.appendChild(alertDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

/**
 * Formats a date object into a readable string
 * 
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    // Validate input
    if (!(date instanceof Date)) {
        console.error('Invalid date object provided');
        return 'N/A';
    }
    
    // Format options
    const options = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return date.toLocaleString('en-US', options);
}

/**
 * Calculates time difference between two dates
 * 
 * @param {Date} start - Start time
 * @param {Date} end - End time (defaults to now)
 * @returns {string} Formatted duration string
 */
function calculateDuration(start, end = new Date()) {
    // Validate input
    if (!(start instanceof Date)) {
        return 'Invalid time';
    }
    
    // Calculate difference in milliseconds
    const diffMs = end - start;
    
    // Convert to minutes and hours
    const diffMins = Math.round(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    
    // Format output string
    if (diffMins < 60) {
        return `${diffMins} minutes`;
    } else {
        return `${diffHrs} hours ${diffMins % 60} minutes`;
    }
}

// Sample data storage (for demo purposes)
const sampleSlots = [
    { id: 'A1', status: 'available' },
    { id: 'A2', status: 'available' },
    { id: 'B1', status: 'occupied', vehicleNumber: 'ABC123', vehicleType: 'car', entryTime: new Date() },
    { id: 'B2', status: 'available' }
];

console.log('Shared functions loaded');