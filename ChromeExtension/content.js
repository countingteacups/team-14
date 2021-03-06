const baseUrl = 'http://localhost:8080';

function htmlToElement(html) {
    const template = document.createElement('template');
    const trimmedHtml = html.trim();
    template.innerHTML = trimmedHtml;
    return template.content.firstChild;
}

const inputContainer = document.getElementById("howheard-block");
const additionalInformation = htmlToElement('<div class="form-set cf how">' +
    '<br><h2>Additional Information</h2>' +
    '   <br><label for="age">Age:</label>' +
    '    <input type="number" id="age" name="age"' +
    '            step="1" /><br>' +
    '    <br><label>Student Status:</label>' + 
    '    <div class="form-item cf select-field odd">' +
    '        <select id="student" name="student" onclick="setHowHeard();">' +
    '            <option value="-1" selected="selected">Select one </option>' +
    '            <option value="1">Not a student</option>' +
    '            <option value="2">1st year</option>' +
    '            <option value="3">2nd year</option>' +
    '            <option value="4">3rd year</option>' +
    '            <option value="5">4th Year</option>' +
    '            <option value="6">Other</option>' +
    '        </select>' +
    '    </div>' +
    '    <div class="form-item cf text-field howheardother">' +
    '        <input style="display: none; width: 15em;" type="text" id="howheard-other" maxlength="255" value="" placeholder="please specify..." name="howheard-other">' +
    '				</div>' +
    '        <div><span class="req"></span></div>' +
    '    </div>'
);

inputContainer.appendChild(additionalInformation);

// Checkbox for bussiness owners
let businessOnwershipRendered = false;
const businessOwnerInput = htmlToElement('<div>' +
    '    <br><label>Are You A Business Owner?</label>' +
    '    <div>' +
    '        <select id="business" name="student" onclick="setHowHeard();">' +
    '            <option value="-1" selected="selected">Select one </option>' +
    '            <option value="1">Yes, I own a business</option>' +
    '            <option value="2">No, I do not own a business</option>' +
    '        </select>' +
    '  </div>' +
    '</div>'
);

// Description of business
const businessDescriptionInput = htmlToElement('<div class="form-item cf text-field odd" >' +
    '        <br><label>Describe Your Business And How You Would Like To Support B+</label>' +
    '        <input type="text" id="business_descr" maxlength="255" name="business" value="">' +
    '					</div>');

// Check if donater is a student
const schoolInput = htmlToElement('<div class="form-item cf text-field odd" >' +
    '        <label>What School Do You Attend?</label>' +
    '        <input type="text" id="school" maxlength="255" name="school" value="">' +
    '					</div>'
);

getDonationAmount = function () {
    const listElem = document.getElementsByClassName("active")[0];
    const spanElem = listElem.children[0];
    const textContent = spanElem.textContent;
    const amount = Number(textContent);
    return amount;
};

getDonationFreq = function() {
    const freqRadio = document.getElementsByClassName("radio-btn")[0];
    const freqLabels = freqRadio.getElementsByTagName("label");
    if (freqLabels[0].children[0].checked) {
        return "one_time";
    } else if (freqLabels[1].children[0].checked) {
        return "monthly"
    } else {
        return "annually"
    }
};

getName = function() {
    const fname = document.getElementById("fname");
    const lname = document.getElementById("lname");

    return {
        fname: fname.value,
        lnmae: lname.value,
    }
};

getAge = function() {
    const ageLabel = document.getElementById("age");
    return ageLabel.value;
};

getSchool = function() {
    return document.getElementById("school").value;
};

getBusinessDesc = function () {
    return document.getElementById("business_descr").value;
};

let businessoOptions;
let studentStatusText;
let businessStatusText;
const studentOption = document.getElementById("student");
studentOption.onchange = function() {
    studentStatusText = studentOption.options[studentOption.selectedIndex].textContent;
    const studentStatus = studentOption.options[studentOption.selectedIndex].value;
    const isStudent = !(studentStatus === '1');

    if (isStudent) {
        inputContainer.appendChild(schoolInput);
    } else {
        inputContainer.removeChild(schoolInput);
    }

    if (!businessOnwershipRendered) {
        inputContainer.appendChild(businessOwnerInput);
    }

    businessOptions = document.getElementById("business");
    // Check if donator is a business owner
    businessOptions.onchange = function () {
        businessStatusText = businessOptions.options[businessOptions.selectedIndex].textContent;
        const businessStatus = businessOptions.options[businessOptions.selectedIndex].value;
        const isBusinessOwner = businessStatus === '1';
        if (isBusinessOwner) {
            inputContainer.appendChild(businessDescriptionInput);
            inputContainer.appendChild(htmlToElement('<br>'));
        }
    };
};

sendDonorData = function() {
    const fullname = getName();
    const donateJson = {
        donation_amount: getDonationAmount(),
        donation_freq: getDonationFreq(),
        fname: fullname.fname,
        lname: fullname.lname,
        student_status: studentStatusText,
        school: getSchool(),
        has_business: businessStatusText,
        business_descr: getBusinessDesc(),
    };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", baseUrl + '/api/add_donor', true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            console.log("data send");
        }
    }
    xhr.send(JSON.stringify(donateJson));
};

const donateBtn = document.getElementById("submit");
donateBtn.onmouseover = function() {
    sendDonorData();
};


