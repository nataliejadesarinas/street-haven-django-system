function switchTab(name, el) {
  // Hide all sections
  document.querySelectorAll('.profile-section').forEach(s => s.classList.remove('active'));
  // Remove active from all nav items
  document.querySelectorAll('.profile-nav-item').forEach(b => b.classList.remove('active'));
  // Show selected section
  document.getElementById('section-' + name).classList.add('active');
  // Activate clicked button
  el.classList.add('active');
}

// Auto open tab based on messages if needed
document.addEventListener('DOMContentLoaded', function() {
  // Your existing code for message-based tab switching
});
