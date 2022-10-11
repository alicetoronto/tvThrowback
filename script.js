// responsiveness (wrapper)

const app = {};

app.key = "";
app.url = "https://api.tvmaze.com/search/shows?q=:query";

app.$form = $('form');
app.$userShowInput = $('#search-input');
app.$userBirthYearInput = $('#birthYear');
app.$results = $('#results ul');

app.displayErrorMessage = function (message) {
    app.$results.append(message);
};

app.$userBirthYearValue = 0;

app.calcAge = function (e) {
    const userAge = e.target.getAttribute("dataYear") - app.$userBirthYearValue;
    return userAge;
};

app.displayAlert = function () {
    app.$results.on("click", ".imgButton", function (e) { //attach event listener to parent element that is already loaded onto the page and on click of the child element that gets loaded later, will trigger action
        const age = app.calcAge(e);
        if (age >= 0) {
            alert(`You were ${age} years old when '${e.target.getAttribute("dataName")}' first aired!`);
        } else if (age < 0) {
            ageAbsolute = Math.abs(age);
            alert(`'${e.target.getAttribute("dataName")}' first aired ${ageAbsolute} years before you were born!`);
        }
    });
};

app.displayShows = function (showResults) {
    showResults.forEach(function (showResult) {
        const img = showResult.show.image ? `<button class="imgButton" dataYear="${showResult.show.premiered.slice(0, 4)}" dataName="${showResult.show.name}"><img src="${showResult.show.image.medium}" alt="${showResult.show.name}"></button>` : `<button class="imgButton" dataYear="${showResult.show.premiered.slice(0, 4)}" dataName="${showResult.show.name}"><p class="noImage">no image exists but you can still click here to find out your age at the time this show first aired</p></button>`;

        const resultHTML = `
                <li class="showResultBox">
                    <p><a href="${showResult.show.url}" target="_blank">${showResult.show.name}</a></p>
                    ${img}
                </li>
            `;
        app.$results.append(resultHTML);
    });
};

app.getShows = async function (userInput) {
    try {
        const results = await $.ajax({
            url: app.url,
            method: 'GET',
            dataType: 'json',
            data: {
                q: userInput,
            }
        });
        app.$userShowInput.val('');
        app.$userBirthYearInput.val('');
        app.$results.empty();
        app.displayShows(results);
    } catch (error) {
        app.displayErrorMessage(error);
    };
};

app.init = function () {
    app.$form.on('submit', function (event) {
        event.preventDefault();
        const $userShowInputValue = app.$userShowInput.val();
        app.$userBirthYearValue = app.$userBirthYearInput.val();
        app.getShows($userShowInputValue);
    });
    app.displayAlert();
};

$(document).ready(function () {
    app.init();
});
