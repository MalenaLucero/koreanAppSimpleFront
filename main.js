const url = "https://koreanapp.herokuapp.com/api/public";
const host = window.location.href.replace('/index.html', '');
const words = ['Learn', 'Remember', 'Understand', 'Explore'];
let isDataLoaded = false;
const delayUnit = 1000;

window.onload = () => {
    initialize();
    fetchData();
    setTimeout(() => {
        if(isDataLoaded) {
            window.location.href = host + "/home/home.html"
        } else {
            showElement('refreshMessage')
        }
    }, delayUnit*words.length*2)
}; 

const showElement = (id) =>{
    const element = document.getElementById(id)
    element.classList.replace('visibility-hidden', 'visibility-visible')
}

const hideElement = (id) =>{
    const element = document.getElementById(id)
    element.classList.replace('visibility-visible', 'visibility-hidden')
}

const initialize = () => {
    for (let i = 0; i < 4; i++) {
        const sourceTypesFetch = fetch(url + "/sourceTypes");
    }
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
            console.log(res)
            let data = {};
            data.sourceTypes = res[0];
            data.videoTypes = res[1];
            data.artists = res[2];
            window.localStorage.setItem('koreanAppData', JSON.stringify(data));
            isDataLoaded = true;
            redirectToHome();
        })
        .catch(err => {
            console.log(err)   
        })
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

