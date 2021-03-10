(function () {
  'use strict';

  var formProfile;

  window.addEventListener('load', function() {
    formProfile = document.querySelector('#form-profile');
    formProfile.addEventListener('invalid', checkFormValidity.bind(formProfile));
    formProfile.addEventListener('submit', onUpdateProfileSubmitted);

    activateFormOnClick(formProfile);
    formProfile.querySelectorAll('input').forEach(activateFormOnClick);
  });

  //
  // activateForm
  //
  function activateForm(form) {
    form.querySelectorAll('input').forEach(function(el) {
      el.removeAttribute('disabled');
    });
    form.classList.remove('disabled');
  }

  //
  // deactivateForm
  //
  function deactivateForm(form) {
    form.classList.remove('was-validated');
    form.querySelectorAll('input').forEach(function(el) {
      el.setAttribute('disabled', true);
    });
    form.classList.add('disabled');
  }

  //
  // activateFormOnClick
  //
  function activateFormOnClick(el) {
    el.addEventListener('click', function(ev) {
      if(formProfile.classList.contains('disabled')) {
        activateForm(formProfile);
        el.focus();
      }
    });
  }

  //
  // onUpdateProfileSubmitted
  //
  function onUpdateProfileSubmitted(ev) {
    if (checkFormValidity.bind(formProfile)(ev)) {
      sendUpdateProfileForm(ev);
    }
  }

  //
  // sendUpdateProfileForm
  //
  function sendUpdateProfileForm(ev) {
    ev.preventDefault();
    var form = ev.currentTarget;
    var method = 'PUT',
      url = '/client/',
      data = Object.fromEntries(new FormData(form).entries());

    hideFormError(form);
    sendRequest(method, url, data, function(err, resp) {
      if(err) {
        showFormError(form, err.message);
      }
      else {
        deactivateForm(form);
      }
    });
  }

})();


(function changePasswordModal() {
  'use strict';

  var formChangePassword,
    currentPassword,
    newPassword,
    newPasswordVerification;

  window.addEventListener('load', function() {
    formChangePassword = document.querySelector('#form-change-password');
    formChangePassword.addEventListener('invalid', checkFormValidity.bind(formChangePassword));
    formChangePassword.addEventListener('submit', onChangePasswordSubmitted);

    currentPassword = formChangePassword.currentPassword;

    newPassword = formChangePassword.newPassword;
    newPassword.addEventListener('input', validateChangePasswordForm);

    newPasswordVerification = formChangePassword.newPasswordVerify;
    newPasswordVerification.addEventListener('input', validateChangePasswordForm);

    $('#modal-change-password').on('hide.bs.modal', function resetFormOnModalClose(e) {
      formChangePassword.reset();
      resetValidationOnForm(formChangePassword);
    });
  });

  //
  // resetValidation
  //
  function resetValidation(el) {
    el.classList.remove('is-valid');
    el.classList.remove('is-invalid');
  }

  //
  // resetValidationOnForm
  //
  function resetValidationOnForm(form) {
    form.querySelectorAll('.form-control').forEach(resetValidation);
  }

  //
  // validateChangePasswordForm
  //
  function validateChangePasswordForm() {
    const MIN_PASSWORD_LENGTH = 8;
    const MAX_PASSWORD_LENGTH = 32;
    resetValidation(newPassword);
    resetValidation(newPasswordVerification);

    var pass = newPassword.value;
    if(pass.length >= MIN_PASSWORD_LENGTH &&
      pass.length <= MAX_PASSWORD_LENGTH &&
      hasUppercaseCharacter(pass) &&
      hasLowercaseCharacter(pass) &&
      hasNumericCharacter(pass) &&
      hasSymbolCharacter(pass) &&
      !hasIllegalCharacter(pass))
    {  // Password meets requirements. Check if passwords match
      newPassword.classList.add('is-valid');
      if(pass !== newPasswordVerification.value) { // Passwords failed match
        newPasswordVerification.classList.add('is-invalid');
        return false;
      }
      else {  // Password matched. We can submit an update
        newPasswordVerification.classList.add('is-valid');
        return true;
      }
    }
    else { // Password doesn't meet requirements
      newPassword.classList.add('is-invalid');
      return false;
    }
  }

  //
  // onChangePasswordSubmitted
  //
  function onChangePasswordSubmitted(ev) {
    ev.preventDefault();
    if(validateChangePasswordForm() && checkFormValidity.bind(formChangePassword)(ev)) {
      sendChangePasswordForm();
    } else {
      ev.stopPropagation();
    }
  }

  //
  // sendChangePasswordForm
  //
  function sendChangePasswordForm() {
    var form = formChangePassword;
    var method = 'PUT',
      url = '/client/password',
      data = Object.fromEntries(new FormData(form).entries());

    hideFormError(form);
    sendRequest(method, url, data, function(err, resp) {
      if(err) {
        console.error("Error while changing password:", err);
        showFormError(form, err.message);
      }
      else {
        form.classList.remove('was-validated'); // remove any error messages
        form.reset();   // clear inputs
        $('#modal-change-password').modal('hide');
      }
    });
  }

})();