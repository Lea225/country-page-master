# Country Page - WorldRanks | devChallenges

<div align="center">
   Solution for the <a href="https://devchallenges.io/challenges/country-page" target="_blank">Country Page Challenge</a> from <a href="http://devchallenges.io" target="_blank">devChallenges.io</a>.
</div>

<div align="center">
  <h3>
    <a href="https://lea225.github.io/country-page-master/">
      Demo
    </a>
    <span> | </span>
    <a href="https://github.com/Lea225/country-page-master">
      Solution
    </a>
    <span> | </span>
    <a href="https://devchallenges.io/challenges/country-page">
      Challenge
    </a>
  </h3>
</div>

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Built With](#built-with)
- [What I Learned](#what-i-learned)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)

## Overview

![screenshot](./screenshot.jpg)

A responsive country information page that displays:
- List of all countries with sorting and filtering capabilities
- Detailed country view with comprehensive information
- Neighboring countries section
- Dark mode UI design

Key features implemented:
- REST Countries API integration
- Advanced filtering by region and status
- Dynamic sorting options
- Responsive design for all screen sizes
- Clean, modern UI with dark theme

## Features

- **Country Listing**:
  - View all countries in a clean table format
  - Sort by population, name, or area
  - Filter by region (Americas, Africa, Asia, Europe, Oceania)
  - Filter by UN member status and independence status

- **Country Details**:
  - Comprehensive country information display
  - Flag image with high resolution
  - Key statistics (population, area, capital)
  - Additional details (languages, currencies, timezones)
  - Neighboring countries with links

- **UI/UX**:
  - Responsive design for mobile, tablet and desktop
  - Dark theme for better readability
  - Intuitive navigation
  - Loading states and error handling

## Built With

- HTML5 semantic markup
- CSS3 with custom properties
- Flexbox and CSS Grid for layout
- Vanilla JavaScript (ES6+)
- REST Countries API
- Mobile-first workflow

## What I Learned

- **API Integration**: Gained experience working with RESTful APIs and handling asynchronous data
- **Advanced Filtering**: Implemented complex filtering logic combining multiple criteria
- **Responsive Design**: Created a fully responsive layout that works on all devices
- **Performance Optimization**: Learned techniques to improve page load times
- **Error Handling**: Implemented proper error states for API failures

```javascript
// Example code snippet - Fetching and filtering countries
async function fetchAndFilterCountries() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    
    // Filtering logic
    const filtered = data.filter(country => {
      return (
        (selectedRegion ? country.region === selectedRegion : true) &&
        (unMemberOnly ? country.unMember : true)
      );
    });
    
    // Sorting logic
    filtered.sort((a, b) => {
      if (sortBy === 'population') return b.population - a.population;
      if (sortBy === 'area') return b.area - a.area;
      return a.name.common.localeCompare(b.name.common);
    });
    
    displayCountries(filtered);
  } catch (error) {
    showErrorState();
  }
}

## Acknowledgements

- [REST Countries API](https://restcountries.com/) - For providing comprehensive country data

- [devChallenges](https://devchallenges.io/) - For the design inspiration and challenge

- [Font Awesome](https://fontawesome.com/) - For the icons used in the project

- [Google Fonts](https://fonts.google.com/) - For the Be Vietnam Pro font

## Author

- Website [my-website.com](https://{https://lea225.github.io/country-page-master/})
- GitHub [@my-username](https://github.com/Lea225})
