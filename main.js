const url = "https://koreanapp.herokuapp.com/api/public";

initialize = () => {
    const sourceTypesFetch = fetch(url + "/sourceTypes");
    const videoTypesFetch = fetch(url + "/videoTypes");
    const artistsFetch = fetch(url + "/artist");

    Promise.all([sourceTypesFetch, videoTypesFetch, artistsFetch])
        .then(res => Promise.all(res.map(r => r.json())))
        .then(res => {
            const sourceTypes = res[0];
            const videoTypes = res[1];
            const artists = res[2];
            artists.unshift("");
            populateSelect("sourceSelect", sourceTypes);
            populateSelect("videoSelect", videoTypes);
            populateSelect("artistSelect", artists);
            setSourceSelectOnChange();
            hideElement("loading");
            showElement("selectContainer");
        })
        .catch(err => console.log(err))
}

initialize();

populateSelect = (id, elements) => {
    const select = document.getElementById(id);
    elements.forEach(e => {
        const option = document.createElement("option");
        if(typeof e === "string"){
            option.value = e;
            option.text = e;
        } else {
            option.value = e.id;
            option.text = e.name;
        }
        select.appendChild(option);
    })
}

setSourceSelectOnChange = () => {
    const source = document.getElementById("sourceSelect");
    const video = document.getElementById("videoSelect");
    video.classList.add('hide');
    source.onchange = () => {
        if(source.value === 'VIDEO'){
            video.classList.replace('hide', 'show');
        } else {
            video.classList.replace('show', 'hide');
        }
    }
}

inputRandomWord = () => {
    const words = ["오늘", "우리", "누구", "사랑", "바다"];
    const word = words[Math.floor(Math.random()*words.length)];
    const input = document.getElementById("wordInput");
    input.value = word;
}

search = () => {
    hideElement("invalidInput");
    const word = document.getElementById("wordInput").value;
    if(word.length === 0){
        showElement("invalidInput");
    } else {
        showElement("loadingResults");
        hideElement("searchResultContainer");
        const artist = document.getElementById("artistSelect").value;
        const source = document.getElementById("sourceSelect").value.toLowerCase();
        const video = document.getElementById("videoSelect").value;

        const searchUrl = source === "video"
            ? `${url}/search/${source}?word=${word}&idArtist=${artist}&type=${video}`
            : `${url}/search/${source}?word=${word}&idArtist=${artist}`;
        showSearchUrl(searchUrl);

        fetch(searchUrl)
            .then(res => res.json())
            .then(data => showSearchResult(data))
    }
}

showSearchUrl = (url) => {
    innerHTMLCleaner("searchUrl");
    const searchUrl = document.getElementById("searchUrl");
    searchUrl.innerHTML = url;
    showElement("searchUrl");
}

showSearchResult = (data) => {
    console.log(data)
    innerHTMLCleaner("searchResultContainer");
    hideElement("noResults");
    hideElement("loadingResults");
    const container = document.getElementById("searchResultContainer");
    if(data.length === 0){
        showElement("noResults")
    } else {
        data.forEach(e => {
            const result = document.createElement("div");
            const title = document.createElement("p");
            title.classList.add("resultTitle");
            title.innerHTML = "Title: " + e.title;
            result.appendChild(title);
            Object.keys(e.lines).forEach(number => {
                const position = document.createElement("p");
                position.innerHTML = "line: " + number;
                const koreanLine = document.createElement("p");
                koreanLine.innerHTML = e.lines[number][0];
                const englishLine = document.createElement("p");
                englishLine.innerHTML = e.lines[number][1];
                const linesContainer = document.createElement("div")
                linesContainer.classList.add("linesContainer");
                linesContainer.appendChild(position);
                linesContainer.appendChild(koreanLine);
                linesContainer.appendChild(englishLine);
                result.appendChild(linesContainer);
            })
            container.appendChild(result);
        })
        showElement("searchResultContainer");
    }
}

showElement = (id) =>{
    const element = document.getElementById(id)
    element.classList.replace('hide', 'show')
}

hideElement = (id) =>{
    const element = document.getElementById(id)
    element.classList.replace('show', 'hide')
}

innerHTMLCleaner = (elementId) =>{
    const element = document.getElementById(elementId)
    element.innerHTML = ''
}

inputCleaner = (elementId) =>{
    const input = document.getElementById(elementId)
    input.value =''
}

