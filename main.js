const url = "https://koreanapp.herokuapp.com/api/public";
const host = window.location.href.replace('/index.html', '');
const words = ['Learn', 'Remember', 'Understand', 'Explore'];
let isMainLoaderFinished = false;
let isDataLoaded = false;
const delayUnit = 1000;

window.onload = () => {
    initialize();
    fetchData();
    setTimeout(() => {
        isMainLoaderFinished = true;
        redirectToHome();
    }, delayUnit*words.length*2)
}; 

const initialize = () => {
    const wordSlot = document.getElementById('wordSlot')
    let delayToAppear = 0;
    let delayToDisappear = delayUnit;
    const increase = delayToDisappear * 2;
    words.forEach((word, index) => {
        if(index === 0){
            wordSlot.classList.add('visible')
            wordSlot.innerText = word
            makeNonVisible(wordSlot, delayToDisappear)
        } else if(index === words.length - 1){
            delayToAppear += increase
            makeVisible(wordSlot, word, delayToAppear)
        } else{
            delayToAppear += increase
            makeVisible(wordSlot, word, delayToAppear)
            delayToDisappear += increase
            makeNonVisible(wordSlot, delayToDisappear)
        }
    })
}

const fetchData = () => {
    const sourceTypesFetch = fetch(url + "/sourceTypes");
    const videoTypesFetch = fetch(url + "/videoTypes");
    const artistsFetch = fetch(url + "/artist");

    Promise.all([sourceTypesFetch, videoTypesFetch, artistsFetch])
        .then(res => Promise.all(res.map(r => r.json())))
        .then(res => {
            const sourceTypes = res[0];
            const videoTypes = res[1];
            const artists = res[2];
            isDataLoaded = true;
            redirectToHome();
        })
        .catch(err => {
            console.log(err)   
        })
}

const redirectToHome = () => {
    if(isMainLoaderFinished && isDataLoaded){
        window.location.href = host + "/home/home.html"
    }
}

const makeVisible = (element, word, delay) => {
    setTimeout(() => {
        element.classList.replace('non-visible', 'visible')
        element.innerText = word
    }, delay)
}

const makeNonVisible = (element, delay) => {
    setTimeout(() => {
        element.classList.replace('visible', 'non-visible')
    }, delay)
}

