// tabs.js
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1) Toggle active class on buttons
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 2) Toggle panels
            const panels = document.querySelectorAll('.tab-panel');
            panels.forEach(p => p.classList.remove('active'));
            document.getElementById(btn.dataset.tab)
                .classList.add('active');
        });
    });
});
