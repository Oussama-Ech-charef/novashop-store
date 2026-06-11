(function() {
    // Immediate execution in head to prevent layout theme flashing
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
        document.documentElement.classList.add("dark-theme");
    } else {
        document.documentElement.classList.remove("dark-theme");
    }
})();

document.addEventListener("DOMContentLoaded", () => {
    setupThemeToggle();
});

function setupThemeToggle() {
    const themeToggles = document.querySelectorAll(".theme-toggle-btn");
    
    themeToggles.forEach(toggle => {
        updateToggleIcon(toggle);
        
        toggle.addEventListener("click", () => {
            const isDark = document.documentElement.classList.toggle("dark-theme");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            
            // Synchronize all theme toggle buttons on the page
            document.querySelectorAll(".theme-toggle-btn").forEach(btn => {
                updateToggleIcon(btn);
            });
        });
    });
}

function updateToggleIcon(btn) {
    const icon = btn.querySelector("i");
    if (!icon) return;
    
    if (document.documentElement.classList.contains("dark-theme")) {
        icon.className = "fa-solid fa-sun";
        btn.setAttribute("title", "Switch to Light Mode");
    } else {
        icon.className = "fa-solid fa-moon";
        btn.setAttribute("title", "Switch to Dark Mode");
    }
}
