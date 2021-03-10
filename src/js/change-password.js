(function() {
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
      url = '/change-password',
      data = Object.fromEntries(new FormData(form).entries());

    var resetToken = getUrlParam('token');
    if(!resetToken || typeof resetToken == 'boolean') {
      showFormError(form, 'Invalid password reset token. Your request may have expired! Please reset your password again by clicking <a href="/login">here</a>');
      return;
    }

    data.resetPasswordToken = resetToken;

    hideFormError(form);
    sendRequest(method, url, data, function(err, resp, xhr) {
      if(err) {
        console.error("Error while changing password:", err);
        showFormError(form, err.message);
      }
      else {
        form.classList.remove('was-validated'); // remove any error messages
        form.reset();   // clear inputs
        window.location = xhr.responseURL;
      }
    });
  }

})();