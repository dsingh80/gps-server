(function activateDeviceModal() {
  'use strict';

  var formActivateDevice;

  window.addEventListener('load', function() {
    formActivateDevice = document.querySelector('#form-activate-device');
    formActivateDevice.addEventListener('invalid', checkFormValidity.bind(formActivateDevice));
    formActivateDevice.addEventListener('submit', onActivateDeviceSubmitted);
  });

  //
  // onActivateDeviceSubmitted
  //
  function onActivateDeviceSubmitted(ev) {
    ev.preventDefault();
    if(checkFormValidity.bind(formActivateDevice)(ev)) {
      sendActivateDeviceForm(ev);
    }
  }

  //
  // sendActivateDeviceForm
  //
  function sendActivateDeviceForm() {
    var form = formActivateDevice;
    var method = 'POST',
      url = '/subscription',
      data = Object.fromEntries(new FormData(form).entries());
    data = Object.assign(data, form.subscriptionId.options[form.subscriptionId.selectedIndex].dataset);

    hideFormError(form);
    sendRequest(method, url, data, function(err, resp) {
      if(err) {
        showFormError(form, err.message);
      }
      else {
        console.log("Activated new device!");
        form.classList.remove('was-validated'); // remove any error messages
        form.reset();   // clear inputs
        $('#modal-activate-device').modal('hide');
        window.location.reload();
      }
    });
  }

})();