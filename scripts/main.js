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
        try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            if (!response.ok) throw new Error('Failed to fetch data');
            
            const data = await response.json();
            
            // Format data
            countries = data.map(country => ({
                name: country.name.common,
                flag: country.flags?.svg || country.flags?.png || '',
                population: country.population || 0,
                area: country.area || 0,
                region: country.region || '',
                subregion: country.subregion || '',
                unMember: country.unMember || false,
                independent: country.independent || false,
                cca3: country.cca3
            }));
            
            // Initial sort and render
            sortCountries('population');
            updateCountryCount();
        } catch (error) {
            console.error('Error:', error);
            countryList.innerHTML = '<tr><td colspan="4">Failed to load countries. Please try again later.</td></tr>';
        }
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