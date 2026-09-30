document.addEventListener("DOMContentLoaded", () => {
    // Header scroll effect
    const mainHeader = document.getElementById('main-header');
    if (mainHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                mainHeader.classList.add('shadow-sm');
                mainHeader.classList.replace('py-4', 'py-3');
            } else {
                mainHeader.classList.remove('shadow-sm');
                mainHeader.classList.replace('py-3', 'py-4');
            }
        });
    }
});
