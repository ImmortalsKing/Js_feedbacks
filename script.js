// -- Global --
const timer = 2000;
const maxChars = 150;

const textArea = document.querySelector('#textarea')
const counter = document.querySelector('.counter')
const formEl = document.querySelector('.form')
const spinnerEl = document.querySelector('.spinner');
const feedbacksEl = document.querySelector('.feedbacks')
const submitEl = document.querySelector('.submit-btn')



function handlerFunction() {
    const textAreaCharacters = textArea.value.length
    const remainCounterChars = maxChars - textAreaCharacters
    if (remainCounterChars <= 0) {
        counter.textContent = 0
    } else {

        // Show number of character left
        counter.textContent = remainCounterChars
    }
}

textArea.addEventListener('input', handlerFunction);

// --Start Form Component

const submitHandler = event => {
    event.preventDefault();
    const text = textArea.value;

    if (text.includes('#') && text.length >= 5) {
        showVisualIndicator('valid');
        if (spinnerEl) {
            spinnerEl.remove();
        };
    } else {
        showVisualIndicator('invalid');
        textArea.focus();
        return;
    };
    // ToDo Job
    // const hashtag=text.split(' ').find(word => word.startsWith('#'));
    const hashtag = text.split(' ').find(word => word.includes('#'));
    const company = hashtag.substring(1);
    // const badgeLetter=hashtag[1].toUpperCase();
    const badgeLetter = hashtag.substring(1, 2).toUpperCase();

    const upvoteCount = 0;
    const dayAgo = 0;

    const feedItem = `
    <li class="feedback">
            <button class="upvote">
                <i class="fa-solid fa-caret-up upvote__icon"></i>
                <span class="upvote__count">${upvoteCount}</span>
            </button>
            <section class="feedback__badge">
                <p class="feedback__letter">${badgeLetter}</p>
            </section>
            <div class="feedback__content">
                <p class="feedback__company">${company}</p>
                <p class="feedback__text">${text}</p>
            </div>
            <p class="feedback__date">${dayAgo === 0 ? 'NEW' : `${dayAgo}d`}</p>
        </li>
    `;
    feedbacksEl.insertAdjacentHTML('beforeend', feedItem);
    submitEl.blur();
    textArea.value = '';
    counter.textContent = maxChars;
}

// --Timeout Function

const showVisualIndicator = (textCheack) => {
    const className = textCheack === 'valid' ? 'form--valid' : 'form--invalid';
    formEl.classList.add(className);
    setTimeout(() => {
        formEl.classList.remove(className);
    }, timer);
};


formEl.addEventListener('submit', submitHandler);

const feedsitems = 'https://bytegrad.com/course-assets/js/1/api/feedbacks'
fetch(feedsitems)
.then(response => {
    return response.json();
}).then(data => {
    data.feedbacks.forEach(feedItem => {
        const fetchFeedItem = `
            <li class="feedback">
            <button class="upvote">
                <i class="fa-solid fa-caret-up upvote__icon"></i>
                <span class="upvote__count">${feedItem.upvoteCount}</span>
            </button>
            <section class="feedback__badge">
                <p class="feedback__letter">${feedItem.badgeLetter}</p>
            </section>
            <div class="feedback__content">
                <p class="feedback__company">${feedItem.company}</p>
                <p class="feedback__text">${feedItem.text}</p>
            </div>
            <p class="feedback__date">${feedItem.daysAgo === 0 ? 'NEW' : `${feedItem.daysAgo}d`}</p>
        </li>`;
        feedbacksEl.insertAdjacentHTML('beforeend', fetchFeedItem);
    });
    spinnerEl.remove();
}).catch(error => {
    feedbacksEl.innerHTML = `<br>
    <div><p style="padding-left:5px;">Failed to fetch feedback items; here is the error message : <strong class="error_msg">${error}</strong></p></div>`
})