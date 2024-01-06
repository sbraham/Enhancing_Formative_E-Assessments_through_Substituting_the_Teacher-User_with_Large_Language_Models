console.log('Loading: feedback.js');

const dashboard_button = document.getElementById('dashboard_button');
const house_of_cards = document.getElementById('house_of_cards');

dashboard_button.addEventListener('click', function() {
    const url = `../dashboard/dashboard.html`;

    window.location.href = url;
});