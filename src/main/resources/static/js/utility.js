const clearLocalStorageBtn = document.getElementById('clearLocalStorageBtn');
clearLocalStorageBtn.addEventListener('click', () => {
    localStorage.clear();
});

const resetToDefault = document.getElementById('resetToDefaultBtn');
resetToDefault.addEventListener('click', () => {
    localStorage.setItem('currentCenter',JSON.stringify({ lat: 47.620, lng: -122.349 }));
    localStorage.setItem('currentBounds',"-134.741578,44.573786,-109.956421,50.498531");
    localStorage.setItem('currentZoom',6);
    console.log('localStorage',localStorage.getItem('currentZoom'));
})
