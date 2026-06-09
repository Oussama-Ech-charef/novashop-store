document.addEventListener("DOMContentLoaded", () => {
    const headerSearchInput = document.getElementById("search-input");
    
    if (headerSearchInput) {
        headerSearchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const query = headerSearchInput.value.trim();
                const isOnProductsPage = window.location.pathname.includes("products.html");
                
                if (isOnProductsPage) {
                    const toolbarSearch = document.getElementById("toolbar-search-input");
                    if (toolbarSearch) {
                        toolbarSearch.value = query;
                        toolbarSearch.dispatchEvent(new Event("input"));
                    }
                    
                    const searchBox = document.querySelector(".search-box");
                    if (searchBox) {
                        searchBox.classList.remove("active");
                    }
                } else {
                    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }
});
