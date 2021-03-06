'use strict'

// getting from local storge
var imgArray;

// global variables
var attempts = 25;
var userAttempts = 0;
var imgShown = [];
var imgVotes = [];
var firstImgIndex, secondImgIndex, thirdImgIndex;
var indexes = [firstImgIndex, secondImgIndex, thirdImgIndex];

// DOM variables
var imgDiv = document.getElementById('images');
var firstImg = document.createElement('img');
firstImg.id = 'firstImg';
var secondImg = document.createElement('img');
secondImg.id = 'secondImg';
var thirdImg = document.createElement('img');
thirdImg.id = 'thirdImg';
var firstImgTitle = document.createElement('h2');
var secondImgTitle = document.createElement('h2');
var thirdImgTitle = document.createElement('h2');
// var resultList = document.getElementById('resultList');
var form = document.getElementById('form');
var button = document.getElementById('resultButton');
var chart = document.getElementById('resultChart');
var ctx = document.getElementById('resultChart').getContext('2d');

// object constructor
function Product(imgName) {
    this.name = imgName;
    this.src = 'img/' + imgName + '.jpg';
    this.shown = 0;
    this.vote = 0;
    imgShown.push(this.shown);
    imgVotes.push(this.vote);
}

// declaring objects .... if statement to keep all data even after multiple refreshes
// if (!imgArray) {
imgArray = [
    new Product('bag'),
    new Product('banana'),
    new Product('bathroom'),
    new Product('boots'),
    new Product('breakfast'),
    new Product('bubblegum'),
    new Product('chair'),
    new Product('cthulhu'),
    new Product('dog-duck'),
    new Product('dragon'),
    new Product('pen'),
    new Product('pet-sweep'),
    new Product('scissors'),
    new Product('shark'),
    new Product('sweep'),
    new Product('tauntaun'),
    new Product('unicorn'),
    new Product('usb'),
    new Product('water-can'),
    new Product('wine-glass')
];
// }

// envoking functions
chooseThreeImages();
renderImages();

// adding events
form.addEventListener('submit', submitted);
imgDiv.addEventListener('click', userClick);
button.addEventListener('click', result);

// event functions
function submitted(event) {
    event.preventDefault();
    userAttempts = event.target.userAttempts.value;
    attempts = userAttempts;
    form.reset();
}

function userClick(event) {
    attempts--;
    if (attempts >= 0) {
        chooseThreeImages();
        if (event.target.id === firstImg.id) {
            imgArray[firstImgIndex].vote++;
            renderImages();
        } else if (event.target.id === secondImg.id) {
            imgArray[secondImgIndex].vote++;
            renderImages();
        } else if (event.target.id === thirdImg.id) {
            imgArray[thirdImgIndex].vote++;
            renderImages();
        }
        else {
            attempts++;
        }
    } else {
        button.removeAttribute('disabled');
        imgDiv.removeEventListener('click', userClick);
    }

}

function result() {
    chart.style.display = "block";
    renderChart();
    // var results;
    // for (var i = 0; i < imgArray.length; i++) {
    //     results = document.createElement('li');
    //     results.textContent = imgArray[i].name.toUpperCase() + ' got ' + imgArray[i].vote + ' votes out of ' + imgArray[i].shown + ' times it was displayed.';
    //     resultList.appendChild(results);
    // }

    // setting local storage
    localStorage.setItem('allProducts', JSON.stringify(imgArray));
}

// render functions
function chooseThreeImages() {
    //getting random indexes
    do {
        firstImgIndex = randomIndex();
        do {
            secondImgIndex = randomIndex();
            thirdImgIndex = randomIndex();
        } while (firstImgIndex === secondImgIndex || firstImgIndex === thirdImgIndex || secondImgIndex === thirdImgIndex)
    } while (indexes.includes(firstImgIndex) || indexes.includes(secondImgIndex) || indexes.includes(thirdImgIndex))

    imgArray[firstImgIndex].shown++;
    imgArray[secondImgIndex].shown++;
    imgArray[thirdImgIndex].shown++;

    indexes = [firstImgIndex, secondImgIndex, thirdImgIndex];
}

function renderImages() {
    firstImgTitle.textContent = imgArray[firstImgIndex].name;
    imgDiv.appendChild(firstImgTitle);
    secondImgTitle.textContent = imgArray[secondImgIndex].name;
    imgDiv.appendChild(secondImgTitle);
    thirdImgTitle.textContent = imgArray[thirdImgIndex].name;
    imgDiv.appendChild(thirdImgTitle);
    firstImg.src = imgArray[firstImgIndex].src;
    imgDiv.appendChild(firstImg);
    secondImg.src = imgArray[secondImgIndex].src;
    imgDiv.appendChild(secondImg);
    thirdImg.src = imgArray[thirdImgIndex].src;
    imgDiv.appendChild(thirdImg);
}

// random function
function randomIndex() {
    return Math.floor(Math.random() * imgArray.length);
}

// chart
function renderChart() {
    var imgNames = [];
    for (var i = 0; i < imgArray.length; i++) {
        imgNames[i] = imgArray[i].name + ' (' + (imgArray[i].vote * imgArray[i].shown) / 100 + '%)';
        imgShown[i] = imgArray[i].shown;
        imgVotes[i] = imgArray[i].vote;
    }
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: imgNames,
            datasets: [
                {
                    label: "seen",
                    backgroundColor: "#3b5360",
                    data: imgShown
                }, {
                    label: "voted",
                    backgroundColor: "#8b5e83",
                    data: imgVotes
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: 'Vote Results',
                position: 'bottom',
            },
            data: {
                precision: 0
            },
            maintainAspectRatio: true,
            aspectRatio: 2,
            scales: {
                yAxes: [{
                    ticks: {
                        // max:50,
                        min: 0,
                        beginAtZero: 0,
                        // stepSize: 1,
                    }
                }],

            }

        }
    });
}