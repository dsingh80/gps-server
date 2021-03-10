(function () {
  'use strict';

  var formLogin,
    formResetPassword,
    btnHideResetPassword;

  window.addEventListener('load', function() {
    formLogin = document.querySelector('#form-login');
    formLogin.addEventListener('invalid', checkFormValidity.bind(formLogin));
    formLogin.addEventListener('submit', onLoginSubmitted);

    formResetPassword = document.querySelector('#form-reset-password');
    formResetPassword.addEventListener('invalid', checkFormValidity.bind(formResetPassword));
    formResetPassword.addEventListener('submit', onResetPasswordSubmitted);

    document.querySelectorAll('.show-reset-password').forEach(function(btnShowResetPassword) {
      btnShowResetPassword.addEventListener('click', showResetPasswordForm);
    });

    btnHideResetPassword = document.querySelector('#hide-reset-password');
    btnHideResetPassword.addEventListener('click', hideResetPasswordForm);
  });

  //
  // showResetPasswordForm
  //
  function showResetPasswordForm(ev) {
    ev.preventDefault();
    formLogin.classList.add('invisible');
    formResetPassword.classList.remove('invisible');
  }

  //
  // hideResetPasswordForm
  //
  function hideResetPasswordForm(ev) {
    ev.preventDefault();
    formResetPassword.classList.add('invisible');
    formLogin.classList.remove('invisible');
  }

  //
  // onLoginSubmitted
  //
  function onLoginSubmitted(ev) {
    ev.preventDefault();
    if(checkFormValidity.bind(formLogin)(ev)) {
      sendLoginForm(ev);
    }
  }

  //
  // sendLoginForm
  //
  function sendLoginForm() {
    var form = formLogin;
    var method = 'POST',
      url = '/login',
      data = Object.fromEntries(new FormData(form).entries());

    hideFormError(form);
    sendRequest(method, url, data, function(err, resp, xhr) {
      console.log(xhr);
      if(err) {
        console.error("Error while logging in:", err);
        if(!resp) { showFormError(form, err.message); }
        else { showFormError(form); }
      }
      else {
        form.classList.remove('was-validated'); // remove any error messages
        form.reset();   // clear inputs
        window.location = xhr.responseURL;
      }
    });
  }

  //
  // onResetPasswordSubmitted
  //
  function onResetPasswordSubmitted(ev) {
    ev.preventDefault();
    if(checkFormValidity.bind(formResetPassword)(ev)) {
      sendResetPasswordForm(ev);
    }
  }

  //
  // sendResetPasswordForm
  //
  function sendResetPasswordForm() {
    var form = formResetPassword;
    var method = 'POST',
      url = '/change-password',
      data = Object.fromEntries(new FormData(form).entries());

    hideFormError(form);
    sendRequest(method, url, data, function(err, resp) {
      if(err) {
        console.error("Error while resetting password:", err);
        showFormError(form);
      }
      else {
        form.classList.remove('was-validated'); // remove any error messages
        form.reset();   // clear inputs
      }
    });
  }

})();