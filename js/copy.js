// Function to fetch country codes from the API
async function fetchCountryCodes() {
    try {
        const response = await fetch("https://flagcdn.com/en/codes.json");
        if (!response.ok) {
            throw new Error("Failed to fetch country codes");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching country codes: ", error);
        return {}; // Return empty object in case of error
    }
}

// Function to dynamically generate flag elements based on search
async function generateFlags(searchTerm = "") {
    try {
        const countryCodes = await fetchCountryCodes();
        const flagsContainer = document.querySelector(".grid");
        flagsContainer.innerHTML = ""; // Clear previous flags
        let found = false; // Flag to check if search result found

        // Iterate through country codes and create flag elements based on search
        for (const countryCode in countryCodes) {
            const countryName = countryCodes[countryCode].toLowerCase();
            if (countryName.includes(searchTerm.toLowerCase())) {
                found = true;
                const flagSvgUrl = `https://flagcdn.com/${countryCode}.svg`;
                const flagElement = createFlagElement(countryCode, flagSvgUrl);
                flagsContainer.appendChild(flagElement);
            }
        }

        // If no search result found, display message
        
    } catch (error) {
        console.error("Error generating flags: ", error);
    }
}

// Function to create flag element
function createFlagElement(countryCode, flagSvgUrl) {
    const flagElement = document.createElement("div");
    flagElement.classList.add("flex", "flex-col", "gap-[15px]", "w-[100%]", "items-center");

    flagElement.innerHTML = `
        <div class="flex items-center justify-center pt-[10px] pb-[10px] w-[200px] h-[200px] sm:w-[150px] sm:h-[150px] pl-[20px] pr-[20px] border-[1px] border-opacity-[100%] border-[#e0e0e0] rounded-[2px]">
            <img class="w-[auto] h-[auto] max-w-[100%]" src="${flagSvgUrl}">
        </div>
        <div class="flex gap-[10px] w-[auto]">
            <button onclick="copyFlag('${flagSvgUrl}')" class="button items-center justify-center text-white text-[14px] tracking-[0.025em] pt-[10px] pr-[12px] pb-[10px] pl-[12px] border-[transparent] border-[1px] border-solid focus:outline-none flex flex-row gap-[5px] rounded-[9999px] bg-opacity-[100%] bg-[#e8e8ff]" type="button">
                <span><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_3781_1068)">
                <path d="M15 6H7.5C6.67157 6 6 6.67157 6 7.5V15C6 15.8284 6.67157 16.5 7.5 16.5H15C15.8284 16.5 16.5 15.8284 16.5 15V7.5C16.5 6.67157 15.8284 6 15 6Z" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 12C2.175 12 1.5 11.325 1.5 10.5V3C1.5 2.175 2.175 1.5 3 1.5H10.5C11.325 1.5 12 2.175 12 3" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                <clipPath id="clip0_3781_1068">
                <rect width="18" height="18" fill="white"/>
                </clipPath>
                </defs>
                </svg>
                </span>
                <span class="font-plus-jakarta-sans font-medium text-[12px] block text-opacity-[100%] text-[#000000]">SVG</span>
            </button>
            <button onclick="downloadPng('https://flagcdn.com/256x192/${countryCode}.png')" class="button items-center justify-center text-white text-[14px] tracking-[0.025em] pt-[10px] pr-[12px] pb-[10px] pl-[12px] border-[transparent] border-[1px] border-solid focus:outline-none flex flex-row gap-[5px] rounded-[9999px] bg-opacity-[100%] bg-[#e8e8ff]" type="button">
                <span class="material-icons"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12.75V2.25" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4.5 8.25L9 12.75L13.5 8.25" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14.25 15.75H3.75" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg></span>
                <span class="font-plus-jakarta-sans font-medium text-[12px] block text-opacity-[100%] text-[#000000]">PNG</span>
            </button>
        </div>
    `;
    return flagElement;
}



// Function to copy flag SVG content to clipboard
async function copyFlag(svgUrl) {
    try {
        const response = await fetch(svgUrl);
        if (!response.ok) {
            throw new Error("Failed to copy SVG content");
        }
        const svgText = await response.text();
        
        const textArea = document.createElement("textarea");
        textArea.value = svgText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        
        showToast("SVG content copied to clipboard!");
    } catch (error) {
        console.error("Error copying SVG content: ", error);
    }
}

// Function to show a toast notification
function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add("show");
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Call function to generate flags when the page loads
window.onload = () => {
    generateFlags(); // Generate flags without search term initially
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", (event) => {
        generateFlags(event.target.value); // Generate flags based on search term
    });
};

// Function to download PNG image
function downloadPng(pngUrl) {
    const filename = pngUrl.substring(pngUrl.lastIndexOf("/") + 1);
    fetch(pngUrl)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            showToast("PNG image downloaded!");
        })
        .catch(error => console.error("Error downloading PNG: ", error));
}


