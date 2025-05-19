function getSubmissionData(email) {
    const data = localStorage.getItem(`submissionData_${email}`);
    return data ? JSON.parse(data) : { attempts: 0, lastSubmission: null };
}

function updateSubmissionData(email) {
    const data = {
        attempts: 1,
        lastSubmission: new Date().getTime()
    };
    localStorage.setItem(`submissionData_${email}`, JSON.stringify(data));
}

function canSubmit(email) {
    const data = getSubmissionData(email);
    if (data.lastSubmission) {
        const timeElapsed = new Date().getTime() - data.lastSubmission;
        const hoursElapsed = timeElapsed / (1000 * 60 * 60);
        return hoursElapsed >= 24;
    }
    return true;
}

function resetFormAfterSubmission(event) {
    event.preventDefault();

    var form = document.getElementById("contactForm");
    var formData = new FormData(form);
    var email = formData.get('email');

    if (!canSubmit(email)) {
        alert('Please wait 24 hours before submitting another message with this email.');
        form.reset();
        return;
    }

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            updateSubmissionData(email);
            form.reset();
            alert('Your message has been sent successfully!');
        } else {
            alert('There was an error with your submission. Please try again.');
        }
    })
    .catch(error => {
        alert('There was an error with your submission. Please try again.');
    });
}
