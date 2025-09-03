async function fetchAndSearch() {
    const keywordInput = document.getElementById('searchInput').value.trim();
    const resultsDiv = document.getElementById('navSearchResults');

    if (!keywordInput) {
        alert("Please enter a search keyword (beach, temple, or country).");
        resetSearch();
        return;
    }
 
    const lowerKeyword = keywordInput.toLowerCase();
    let searchKey = null;

    switch (lowerKeyword) {
        case 'beach':
        case 'beaches':
            searchKey = 'beaches';
            break;
        case 'temple':
        case 'temples':
            searchKey = 'temples';
            break;
        case 'country':
        case 'countries':
            searchKey = 'countries';
            break;
        default:
            alert("Please enter one of these keywords: beach(es), temple(s), or country(s).");
            resetSearch();
            return;
    }

    try {
        const response = await fetch('./travel_recommendation_api.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const travelData = await response.json();

        let matches = [];

        if (searchKey === 'countries') { 
            if (travelData.countries && Array.isArray(travelData.countries)) {
                travelData.countries.forEach(country => {
                    if (Array.isArray(country.cities)) {
                        matches.push(...country.cities);
                    }
                });
            }
        } else {
            matches = travelData[searchKey] || [];
        }

        if (matches.length === 0) {
            resultsDiv.innerHTML = `<p>No recommendations found for "${keywordInput}".</p>`;
            resultsDiv.style.display = 'block';
            return;
        }

        let html = '';
        matches.slice(0, 2).forEach(place => {
            html += `
                <div class="recommendation-card">
                    <img src="${place.imageUrl}" alt="${place.name}" class="recommendation-image" />
                    <div class="recommendation-content">
                        <h3>${place.name}</h3>
                        <p>${place.description}</p>
                        <button class="visit-btn">Visit</button>
                    </div>
                </div>
            `;
        });

        resultsDiv.innerHTML = html;
        resultsDiv.style.display = 'flex';

    } catch (error) {
        console.error("Error fetching travel data:", error);
        resultsDiv.innerHTML = `<p>Error loading data. Please try again later.</p>`;
        resultsDiv.style.display = 'block';
    }
}

// Clear search input and results
function resetSearch() {
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('navSearchResults');
    if (searchInput) searchInput.value = "";
    if (resultsDiv) {
        resultsDiv.style.display = "none";
        resultsDiv.innerHTML = "";
    }
}

// Show page function with search bar toggle and reset search
function showPage(page) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => (p.style.display = 'none'));

    if (!page || !document.getElementById(page)) page = 'home';

    document.getElementById(page).style.display = 'block';

    document.getElementById('navSearch').style.display = page === 'home' ? 'flex' : 'none';

    resetSearch();
}
 