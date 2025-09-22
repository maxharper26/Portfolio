const GITHUB_API_BASE = 'https://api.github.com/repos/maxharper26/Portfolio/contents';

// Project configuration with icons and descriptions
const PROJECT_CONFIG = {
    'Consulting': {
    icon: '',
    description: 'Data analytics and Business Intelligence Solutions.'
    },
     'Trading': {
    icon: '',
    description: 'Quantitative trading strategies using Machine Learning.'
    },

};

// Function to sanitize folder names for display
function sanitizeFolderName(folderName) {
    return folderName
    .replace(/[-_]/g, ' ')  // Replace hyphens and underscores with spaces
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')  // Add space on lower→Upper transitions
    .replace(/\s+/g, ' ')  // Collapse multiple spaces
    .trim()  // Remove leading/trailing spaces
    .replace(/\b\w/g, l => l.toUpperCase());  // Capitalize first letter of each word
}

// Function to fetch folder contents from GitHub API
async function fetchFolderContents(folderPath) {
    try {
    const response = await fetch(`${GITHUB_API_BASE}/${folderPath}`);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data.filter(item => item.type === 'dir');  // Only return directories
    } catch (error) {
    console.error(`Error fetching ${folderPath}:`, error);
    return [];
    }
}

// Function to build the dynamic table of contents
async function buildTableOfContents() {
    const tocList = document.getElementById('toc-list');
    const loading = document.getElementById('loading');
    
    try {
    let sectionNumber = 1;
    
    // Process each main project folder
    for (const [folderName, config] of Object.entries(PROJECT_CONFIG)) {
        // Fetch subfolders
        const subfolders = await fetchFolderContents(folderName);
        
        // Create main project section
        const mainItem = document.createElement('li');
        mainItem.className = 'toc-item main-project';
        
        mainItem.innerHTML = `
        <span class="toc-number">${sectionNumber}</span>
        <div class="toc-content">
            <div class="toc-link main-project-title">
            ${sanitizeFolderName(folderName)}
            </div>
            <div class="toc-description">${config.description}</div>
        </div>
        <div class="toc-dots"></div>
        `;
        
        tocList.appendChild(mainItem);
        
        // Add subprojects if they exist
        if (subfolders.length > 0) {
        subfolders.forEach((subfolder, index) => {
            const subItem = document.createElement('li');
            subItem.className = 'toc-item sub-project';
            
            subItem.innerHTML = `
            <span class="toc-number">${sectionNumber}.${index + 1}</span>
            <div class="toc-content">
                <a href="${folderName}/${subfolder.name}/" class="toc-link sub-project-link">
                <span class="toc-icon">📁</span>${sanitizeFolderName(subfolder.name)}
                </a>
            </div>
            <div class="toc-dots"></div>
            `;
            tocList.appendChild(subItem);
        });
        }
        
        sectionNumber++;
    }
    
    // Show the completed table of contents
    loading.style.display = 'none';
    tocList.style.display = 'block';
    
    } catch (error) {
    console.error('Error building table of contents:', error);
    loading.innerHTML = 'Error loading projects. Please refresh the page.';
    }
}

// Load the table of contents when page loads
document.addEventListener('DOMContentLoaded', buildTableOfContents);