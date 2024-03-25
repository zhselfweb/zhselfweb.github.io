document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 1;
    const totalPages = document.querySelectorAll('.page').length;

    function scrollToPage(pageNumber) {
        const pageElement = document.getElementById(`page${pageNumber}`);
        pageElement.scrollIntoView({
            behavior: 'smooth'
        });
    }

    function handleScroll(event) {
        if (event.deltaY > 0 && currentPage < totalPages) {
            currentPage++;
            scrollToPage(currentPage);
        } else if (event.deltaY < 0 && currentPage > 1) {
            currentPage--;
            scrollToPage(currentPage);
        }
    }

    document.addEventListener('wheel', handleScroll);
});