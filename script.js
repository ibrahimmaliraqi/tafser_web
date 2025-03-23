// Fetch the tafsir data
async function fetchTafsirData() {
    try {
        const response = await fetch('https://www.mp3quran.net/api/v3/tafsir?tafsir=1&language=ar');
        const data = await response.json();
        return data.tafasir.soar;
    } catch (error) {
        console.error('Error fetching tafsir data:', error);
        return [];
    }
}

// Group surahs by surah_id
function groupBySurah(surahs) {
    const grouped = {};
    surahs.forEach(surah => {
        if (!grouped[surah.sura_id]) {
            grouped[surah.sura_id] = [];
        }
        grouped[surah.sura_id].push(surah);
    });
    return grouped;
}

// Create surah list item
function createSurahListItem(surahGroup) {
    const firstItem = surahGroup[0];
    const surahName = firstItem.name.split('سورة')[1].split('الايات')[0].trim();
    const item = document.createElement('div');
    item.className = 'surah-item';
    item.textContent = `سورة ${surahName}`;
    
    item.addEventListener('click', () => {
        // Remove active class from all items
        document.querySelectorAll('.surah-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Show tafsir sections
        displayTafsirSections(surahGroup, surahName);
        
        // Add smooth scroll on mobile devices
        if (window.innerWidth <= 968) {
            const tafsirContainer = document.getElementById('tafsirContainer');
            setTimeout(() => {
                tafsirContainer.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    });
    
    return item;
}

// Display tafsir sections for selected surah
function displayTafsirSections(surahGroup, surahName) {
    const tafsirContainer = document.getElementById('tafsirContainer');
    const selectedSurahTitle = document.getElementById('selectedSurahTitle');
    const tafsirSections = document.getElementById('tafsirSections');
    
    selectedSurahTitle.textContent = `سورة ${surahName}`;
    tafsirSections.innerHTML = '';
    
    surahGroup.forEach(section => {
        const sectionElement = document.createElement('div');
        sectionElement.className = 'tafsir-section';
        sectionElement.innerHTML = `
            <h3>${section.name}</h3>
        `;
        
        sectionElement.addEventListener('click', () => {
            playTafsir(section);
        });
        
        tafsirSections.appendChild(sectionElement);
    });
}

// Play tafsir function
function playTafsir(section) {
    const audioElement = document.getElementById('audioElement');
    const currentTrackName = document.getElementById('currentTrackName');
    
    audioElement.src = section.url;
    currentTrackName.textContent = section.name;
    audioElement.play();
}

// Filter surahs based on search
function filterSurahs(searchText, groupedSurahs) {
    const container = document.getElementById('surahsList');
    container.innerHTML = '';
    
    Object.values(groupedSurahs).forEach(surahGroup => {
        const surahName = surahGroup[0].name.split('سورة')[1].split('الايات')[0].trim();
        if (surahName.includes(searchText) || searchText === '') {
            container.appendChild(createSurahListItem(surahGroup));
        }
    });
}

// Initialize the application
async function init() {
    const surahs = await fetchTafsirData();
    const groupedSurahs = groupBySurah(surahs);
    
    // Initial render
    filterSurahs('', groupedSurahs);
    
    // Add search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        filterSurahs(e.target.value, groupedSurahs);
    });
}

// Start the application
init();