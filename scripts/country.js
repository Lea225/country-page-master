document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const countryCode = urlParams.get('code');
    
    if (!countryCode) {
        window.location.href = 'index.html';
        return;
    }
    
    fetchCountryData(countryCode);
});

async function fetchCountryData(code) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
        if (!response.ok) throw new Error('Country not found');
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            displayCountryDetails(data[0]);
            
            if (data[0].borders && data[0].borders.length > 0) {
                fetchNeighbors(data[0].borders);
            } else {
                document.getElementById('neighbors-list').innerHTML = '<p>No neighboring countries</p>';
            }
        } else {
            throw new Error('No data returned');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('country-name').textContent = 'Country not found';
    }
}

function displayCountryDetails(country) {
    // Informations de base existantes...
    document.getElementById('country-name').textContent = country.name.common;
    
    const flagImg = document.getElementById('country-flag');
    flagImg.src = country.flags?.svg || country.flags?.png || '';
    flagImg.alt = `${country.name.common} flag`;
    
    document.getElementById('country-population').textContent = 
        country.population ? country.population.toLocaleString() : 'N/A';
    
    document.getElementById('country-area').textContent = 
        country.area ? `${country.area.toLocaleString()} km²` : 'N/A';
    
    document.getElementById('country-capital').textContent = 
        country.capital ? country.capital.join(', ') : 'N/A';
    
    document.getElementById('country-region').textContent = 
        country.region || 'N/A';
    
    document.getElementById('country-subregion').textContent = 
        country.subregion || 'N/A';
    
    document.getElementById('country-unmember').textContent = 
        country.unMember ? 'Yes' : 'No';

    // Nouveaux détails ajoutés :
    
    // Langues
    const languagesElement = document.getElementById('country-languages');
    if (country.languages) {
        languagesElement.innerHTML = Object.values(country.languages)
            .map(lang => `<span class="info-tag">${lang}</span>`)
            .join(' ');
    } else {
        languagesElement.textContent = 'No data';
    }

    // Devises
    const currenciesElement = document.getElementById('country-currencies');
    if (country.currencies) {
        currenciesElement.innerHTML = Object.entries(country.currencies)
            .map(([code, currency]) => 
                `<span class="info-tag">${currency.name} (${currency.symbol || 'No symbol'})</span>`
            )
            .join(' ');
    } else {
        currenciesElement.textContent = 'No data';
    }

    // Fuseaux horaires
    document.getElementById('country-timezones').textContent = 
        country.timezones ? country.timezones.join(', ') : 'N/A';

    // Sens de conduite
    document.getElementById('country-driving').textContent = 
        country.car?.side ? country.car.side.charAt(0).toUpperCase() + country.car.side.slice(1) : 'N/A';
}

async function fetchNeighbors(borderCodes) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes.join(',')}`);
        if (!response.ok) throw new Error('Failed to fetch neighbors');
        
        const neighbors = await response.json();
        const neighborsList = document.getElementById('neighbors-list');
        neighborsList.innerHTML = '';
        
        if (!neighbors || neighbors.length === 0) {
            neighborsList.innerHTML = '<p>No neighboring countries found</p>';
            return;
        }
        
        neighbors.forEach(neighbor => {
            const neighborElement = document.createElement('a');
            neighborElement.className = 'neighbor-tag';
            neighborElement.href = `country.html?code=${neighbor.cca3}`;
            neighborElement.innerHTML = `
                <img src="${neighbor.flags.svg}" alt="${neighbor.name.common}" class="neighbor-flag" onerror="this.src='assets/images/Done_round.svg'">
                <span>${neighbor.name.common}</span>
            `;
            neighborsList.appendChild(neighborElement);
        });
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('neighbors-list').innerHTML = '<p>Failed to load neighboring countries</p>';
    }
}