'use strict';

/**
 * @function checkFormValidity
 * @param event
 * @description Validates Boostrap forms and applies styling to show various messages
 */
function checkFormValidity(event) {
  // Make sure to bind 'this' to a form DOM element
  var isValid = true;
  event.preventDefault();
  if(!this || !this.checkValidity) { throw 'Invalid form element provided to checkFormValidity. Make sure `this` is bound to a form DOM element'; }
  if (this.checkValidity() === false) {
    event.stopPropagation();
    isValid = false;
  }
  this.classList.add('was-validated');
  return isValid;
}

/**
 * @function sendRequest
 * @param {String} method
 * @param {String} url
 * @param {Object} data
 * @param {Function} callback => (error, data)
 */
function sendRequest(method, url, data, callback) {
  method = method || 'POST';
  if(!url) {
    console.error('No url provided to sendRequest. Aborting request.');
  }
  var request = new XMLHttpRequest();
  request.open(method, url);
  request.setRequestHeader('Content-Type', 'application/json');
  request.setRequestHeader('Accept', 'application/json');
  request.addEventListener('load', function() {
    if(callback) {
      if(request.status == 404) {
        callback('Failed to reach server. Please try again later or contact support for further assistance');
        return;
      }
      let result = null;
      if (request.getResponseHeader('content-type').indexOf("application/json") !== -1 && request.response) {
        result = JSON.parse(request.response);
        callback(result.error, result.data, request);
      }
      else {
        callback(null, null, request);
      }
    }
  });
  request.addEventListener('error', function() {
    if(callback) {
      let result = {};
      if(request.response) { result = JSON.parse(request.response); }
      callback(result, result.data, request);
    }
  });
  request.addEventListener('abort', function() {
    if(callback) {
      callback('User aborted XHR request');
    }
  });

  data._csrf = getCSRFToken();
  request.send(JSON.stringify(data));
}

/**
 * @function getCSRFToken
 * @returns {string|string}
 */
function getCSRFToken() {
  return document.querySelector('meta[name="_csrf"]').getAttribute('content') || '';
}

/**
 * @function getClientId
 * @returns {string|string}
 */
function getClientId() {
  return document.querySelector('meta[name="_clientId"]').getAttribute('content') || '';
}

/**
 * @function hasUppercaseCharacter
 * @param {String} str
 * @returns {boolean}
 */
function hasUppercaseCharacter(str) {
  var matches = str.match(/[A-Z]/g);
  return matches !== null;
}

/**
 * @function hasLowercaseCharacter
 * @param {String} str
 * @returns {boolean}
 */
function hasLowercaseCharacter(str) {
  var matches = str.match(/[a-z]/g);
  return matches !== null;
}

/**
 * @function hasNumericCharacter
 * @param {String} str
 * @returns {boolean}
 */
function hasNumericCharacter(str) {
  var matches = str.match(/[0-9]/g);
  return matches !== null;
}


/**
 * @function hasSymbolCharacter
 * @param {String} str
 * @returns {boolean}
 */
function hasSymbolCharacter(str) {
  var matches = str.match(/[!#%@?]/g);
  return matches !== null;
}


/**
 * @function hasIllegalCharacter
 * @param {String} str
 * @returns {boolean}
 */
function hasIllegalCharacter(str) {
  var matches = str.match(/[><\\":;/&]/g);
  return matches !== null;
}


/**
 * showFormError
 * @param {Element} form
 * @param {String=} err
 */
function showFormError(form, err) {
  var formError = form.querySelector('.error');
  var formErrorMessage = formError.querySelector('.message');
  if(err) {
    formErrorMessage.innerHTML = err;
  }
  formError.classList.remove('invisible');
}


/**
 * hideFormError
 * @param {Element} form
 */
function hideFormError(form) {
  var formError = form.querySelector('.error');
  formError.classList.add('invisible');
}


/**
 * @function getUrlParam
 * @param param
 * @returns {boolean|string}
 */
function getUrlParam(param) {
  var pageUrl = window.location.search.substring(1),  // substring starting at 1 because we want to remove the '?' from the query string
    queryParams = pageUrl.split('&'),
    paramName;
  for (var i = 0; i < queryParams.length; i++) {
    paramName = queryParams[i].split('=');
    if (paramName[0] === param) {
      return paramName[1] === undefined ? true : decodeURIComponent(paramName[1]);
    }
  }
}