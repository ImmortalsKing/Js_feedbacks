// -- Global --
const timer = 2000;
const maxChars = 150;
const feedsUrl = 'https://bytegrad.com/course-assets/js/1/api'

const textArea = document.querySelector('#textarea')
const counter = document.querySelector('.counter')
const formEl = document.querySelector('.form')
const spinnerEl = document.querySelector('.spinner');
const feedbacksEl = document.querySelector('.feedbacks')
const submitEl = document.querySelector('.submit-btn')
const upvoteBtn = document.querySelector('.upvote')
const upvoteEl = document.querySelector('.upvote__count')
const hashtagsListEl = document.querySelector('.hashtags')

// -- Feedback Item Html --

const renderFeedbackItem = feedback => {
    const feedItem = `
    <li class="feedback">
            <button class="upvote">
                <i class="fa-solid fa-caret-up upvote__icon"></i>
                <span class="upvote__count">${feedback.upvoteCount}</span>
            </button>
            <section class="feedback__badge">
                <p class="feedback__letter">${feedback.badgeLetter}</p>
            </section>
            <div class="feedback__content">
                <p class="feedback__company">${feedback.company}</p>
                <p class="feedback__text">${feedback.text}</p>
            </div>
            <p class="feedback__date">${feedback.daysAgo === 0 ? 'NEW' : `${feedback.daysAgo}d`}</p>
        </li>`
    feedbacksEl.insertAdjacentHTML('beforeend', feedItem);
};

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
    const daysAgo = 0;

    const feed = {
        company: company,
        badgeLetter: badgeLetter,
        upvoteCount: upvoteCount,
        daysAgo: daysAgo,
        text: text
    };

    renderFeedbackItem(feed);

    // send feedback to server

    fetch(`${feedsUrl}/feedbacks`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(feed)
    })
        .then(response => {
            if (!response.ok) {
                console.log('Something went wrong');

            } else {
                console.log('Successfuly submitted');
            }
        });

    // Todo after sending feeds to server

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


fetch(`${feedsUrl}/feedbacks`)
    .then(response => {
        return response.json();
    }).then(data => {
        data.feedbacks.forEach(feedItem => {
            renderFeedbackItem(feedItem);
        });
        spinnerEl.remove();
    }).catch(error => {
        feedbacksEl.innerHTML = `<br>
    <div><p style="padding-left:5px;">Failed to fetch feedback items; here is the error message : <strong class="error_msg">${error}</strong></p></div>`
    })

// Add event to uptovote & feedback text expand

const clickHandler = event => {
    const clickedEl = event.target;
    const upvoteEl = clickedEl.className.includes('upvote');
    if (upvoteEl) { 
        const upvoteBtnEl = clickedEl.closest('.upvote');
        upvoteBtnEl.disabled=true;
        const upvoteCountEl = upvoteBtnEl.querySelector('.upvote__count');
        let upvoteCount = +upvoteBtnEl.textContent;
        upvoteCountEl.textContent = ++upvoteCount;
     }
    else { 
        clickedEl.closest('.feedback').classList.toggle('feedback--expand');
     }
};

feedbacksEl.addEventListener('click', clickHandler);


const findHashtagHandler = event => {
    const clickedEl = event.target;
    const hashtagsUlEl = clickedEl.className === 'hashtags';
    if(hashtagsUlEl){
        return;
    }else{
        const companyNameFromHashtag = clickedEl.textContent.substring(1).trim();
        feedbacksEl.childNodes.forEach((childNode) => {
            if(childNode.nodeType === 3) return;
            const companyNameFromFeedbackItem = childNode.querySelector('.feedback__company')
            .textContent.toLowerCase().trim()
            if(companyNameFromHashtag.toLowerCase().trim() !== companyNameFromFeedbackItem){
                childNode.remove();
            };
        })
    }
    
};

hashtagsListEl.addEventListener('click', findHashtagHandler)