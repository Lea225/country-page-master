document.addEventListener('DOMContentLoaded', function() {
    const countryList = document.getElementById('country-list');
    const sortSelect = document.getElementById('sort-by');
    const countryCount = document.getElementById('country-count');
    const searchInput = document.querySelector('.search-container input');
    
    let countries = [];
    let filteredCountries = [];
    let activeRegions = [];
    
    // Fetch countries data
    async function fetchCountries() {
    const API_URL = 'https://restcountries.com/v3.1/all';
    const FIELDS = 'name,flags,population,area,region,subregion,unMember,independent,cca3';
    
    try {
        // 1. Vérifier d'abord le cache local
        const cachedData = localStorage.getItem('countriesData');
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            
            // Utiliser le cache si moins de 1 heure
            if (Date.now() - timestamp < 3600000) {
                processCountryData(data);
                return;
            }
        }

        // 2. Configuration de la requête avec timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        
        const response = await fetch(`${API_URL}?fields=${FIELDS}`, {
            signal: controller.signal
        });
        
        clearTimeout(timeout);

        // 3. Vérification de la réponse
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        
        // 4. Sauvegarde dans le cache
        localStorage.setItem('countriesData', JSON.stringify({
            data: data,
            timestamp: Date.now()
        }));

        // 5. Traitement des données
        processCountryData(data);

    } catch (error) {
        console.error('Fetch Error:', error);
        handleFetchError(error);
    }
}

function processCountryData(data) {
    countries = data.map(country => ({
        name: country.name?.common || 'Unknown',
        flag: country.flags?.svg || country.flags?.png || 'default-flag.svg',
        population: country.population ?? 0,
        area: country.area ?? 0,
        region: country.region || 'Unknown',
        subregion: country.subregion || '',
        unMember: country.unMember ?? false,
        independent: country.independent ?? false,
        cca3: country.cca3 || 'XXX'
    }));
    
    sortCountries('population');
    updateCountryCount();
}

function handleFetchError(error) {
    // Essayer de récupérer du cache même expiré
    const cachedData = localStorage.getItem('countriesData');
    if (cachedData) {
        const { data } = JSON.parse(cachedData);
        processCountryData(data);
        showToast('Using cached data (might be outdated)');
        return;
    }

    // Affichage d'une erreur élégante
    countryList.innerHTML = `
        <tr>
            <td colspan="4" class="error-state">
                <div class="error-content">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <h3>Connection Issue</h3>
                    <p>We couldn't load country data. ${error.message}</p>
                    <button class="retry-btn">Try Again</button>
                </div>
            </td>
        </tr>
    `;

    document.querySelector('.retry-btn').addEventListener('click', fetchCountries);
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
    
    // Sort countries
    function sortCountries(criteria) {
        filteredCountries = [...filteredCountries.length ? filteredCountries : countries];
        
        switch(criteria) {
            case 'name':
                filteredCountries.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'area':
                filteredCountries.sort((a, b) => b.area - a.area);
                break;
            case 'population':
            default:
                filteredCountries.sort((a, b) => b.population - a.population);
                break;
        }
        
        renderCountries();
    }
    
    // Filter countries
    function filterCountries() {
        const searchTerm = searchInput.value.toLowerCase();
        const unMemberChecked = document.querySelector('input[name="unMember"]:checked');
        const independentChecked = document.querySelector('input[name="independent"]:checked');
        
        filteredCountries = countries.filter(country => {
            // Search filter
            const matchesSearch = searchTerm === '' || 
                country.name.toLowerCase().includes(searchTerm) ||
                country.region.toLowerCase().includes(searchTerm) ||
                country.subregion.toLowerCase().includes(searchTerm);
            
            // Region filter
            const matchesRegion = activeRegions.length === 0 || 
                                activeRegions.includes(country.region);
            
            // Status filters
            const matchesUnMember = !unMemberChecked || country.unMember;
            const matchesIndependent = !independentChecked || country.independent;
            
            return matchesSearch && matchesRegion && matchesUnMember && matchesIndependent;
        });
        
        sortCountries(sortSelect.value);
        updateCountryCount();
    }
    
    // Render countries
    function renderCountries() {
        countryList.innerHTML = '';
        
        if (filteredCountries.length === 0) {
            countryList.innerHTML = '<tr><td colspan="4">No countries found matching your criteria.</td></tr>';
            return;
        }
        
        filteredCountries.forEach(country => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${country.flag}" alt="${country.name} flag" class="country-flag" onerror="this.src='assets/images/Done_round.svg'"></td>
                <td><a href="country.html?code=${country.cca3}">${country.name}</a></td>
                <td>${country.population.toLocaleString()}</td>
                <td>${country.area ? country.area.toLocaleString() : 'N/A'}</td>
            `;
            countryList.appendChild(row);
        });
    }
    
    // Update country count
    function updateCountryCount() {
        countryCount.textContent = filteredCountries.length;
    }
    
    // Handle region button clicks
    document.querySelectorAll('.region-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            const region = this.dataset.region;
            
            if (this.classList.contains('active')) {
                activeRegions.push(region);
            } else {
                activeRegions = activeRegions.filter(r => r !== region);
            }
            
            filterCountries();
        });
    });
    
    // Event listeners
    sortSelect.addEventListener('change', (e) => {
        sortCountries(e.target.value);
    });
    
    searchInput.addEventListener('input', filterCountries);
    
    // Keep checkbox listeners for status filters
    document.querySelectorAll('input[name="unMember"], input[name="independent"]').forEach(input => {
        input.addEventListener('change', filterCountries);
    });
    
    // Initialize
    fetchCountries();
});