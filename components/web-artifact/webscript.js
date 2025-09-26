const container = document.querySelector(".appcontainer");
const baseURL = "https://raw.githubusercontent.com/anderson33039/jaystore/main/apps/";
const iconURL = "https://github.com/anderson33039/jaystore/raw/refs/heads/main/icons/";

// GitHub API to fetch file list
const apiURL = "https://api.github.com/repos/anderson33039/jaystore/contents/apps";

function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

fetch(apiURL)
  .then(res => res.json())
  .then(files => {
    files
      .filter(file => file.name.endsWith(".apk"))
      .forEach(file => {
        let fileName = file.name; // ✅ string, not object
        let cleanName = fileName.replace(/_/g, " ").replace(/\.apk$/i, "");
        let appName = cleanName.replace(/ /g, ""); // for icon + download file

        const appDiv = document.createElement("div");
        appDiv.classList.add("app-icon");

        appDiv.innerHTML = `
          <button>
            <img src="${iconURL}${fileName.replace(".apk","")}.png" alt="${appName} icon" style="width:40px;height:40px;">
          </button>
          <p>${toTitleCase(cleanName)}</p>
        `;

        // Click → Download
        appDiv.addEventListener("click", async () => {
        const response = await fetch(`${baseURL}${fileName}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
      
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      
        URL.revokeObjectURL(url);
      });
        container.appendChild(appDiv);
      });
  })
  .catch(err => console.error("Error fetching apps:", err));

const menuToggle = document.getElementById("menuToggle");
const sidemenu = document.getElementById("sidemenu");

menuToggle.addEventListener("click", () => {
  sidemenu.classList.toggle("open");
});

// --- SEARCH BAR LIVE FILTER ---
const searchInput = document.getElementById("searchQueue");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const apps = container.querySelectorAll(".app-icon");
  apps.forEach(app => {
    const appName = app.querySelector("p").textContent.toLowerCase();
    app.style.display = appName.includes(query) ? "flex" : "none";
  });
});

const sidemenubtn = document.querySelectorAll(".menu-btn"); // use the correct class
sidemenubtn.forEach(btn => {
  btn.addEventListener('click', () => {
    console.log(`${btn.textContent} clicked`);
    const bclick = btn.textContent;
    const filt = bclick.toLowerCase();
    window.location.href = `Code4534672/${filt}.html`;
    });
});
