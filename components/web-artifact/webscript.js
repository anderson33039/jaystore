const container = document.querySelector(".appcontainer");

// GitHub repo info
const owner = "anderson33039";
const repo = "jaystore";

// Function to fetch latest release info
async function fetchLatestRelease() {
  const resp = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);
  if (!resp.ok) throw new Error("Failed to fetch latest release");
  return resp.json();
}

// Function to fetch assets from the release
async function fetchReleaseAssets(assets_url) {
  const resp = await fetch(assets_url);
  if (!resp.ok) throw new Error("Failed to fetch release assets");
  return resp.json(); // array of assets
}

// Convert file name to title, e.g. “code_ciphers.apk” → “Code Ciphers”
function toTitleCase(str) {
  return str
    .replace(/_/g, " ")
    .replace(/\.apk$/i, "")
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Main function to load apps
async function loadAppsFromRelease() {
  try {
    const release = await fetchLatestRelease();
    const assets = await fetchReleaseAssets(release.assets_url);

    assets
      .filter(asset => asset.name.endsWith(".apk"))
      .forEach(asset => {
        const fileName = asset.name;
        const downloadURL = asset.browser_download_url; // direct link

        const cleanName = fileName.replace(/_/g, " ").replace(/\.apk$/i, "");
        const displayName = toTitleCase(cleanName);

        const appDiv = document.createElement("div");
        appDiv.classList.add("app-icon");

        appDiv.innerHTML = `
          <button>
            <img src="${iconURL}${fileName.replace(".apk","")}.png" alt="${displayName} icon" style="width:40px;height:40px;">
          </button>
          <p>${displayName}</p>
        `;

        appDiv.addEventListener("click", () => {
          const link = document.createElement("a");
          link.href = downloadURL;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });

        container.appendChild(appDiv);
      });
  } catch (err) {
    console.error("Error loading release apps:", err);
  }
}

// Call it
loadAppsFromRelease();

// The rest of your menu toggle etc.
const menuToggle = document.getElementById("menuToggle");
const sidemenu = document.getElementById("sidemenu");
menuToggle.addEventListener("click", () => {
  sidemenu.classList.toggle("open");
});

// Search filter
const searchInput = document.getElementById("searchQueue");
searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase();
  const apps = container.querySelectorAll(".app-icon");
  apps.forEach(app => {
    const name = app.querySelector("p").textContent.toLowerCase();
    app.style.display = name.includes(q) ? "flex" : "none";
  });
});

// Side menu buttons
const sidemenubtn = document.querySelectorAll(".menu-btn");
sidemenubtn.forEach(btn => {
  btn.addEventListener("click", () => {
    const bclick = btn.textContent.toLowerCase();
    window.location.href = `jaystore/Code4534672/${bclick}.html`;
  });
});
