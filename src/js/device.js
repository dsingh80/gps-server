(function() {
  'use strict';

  var formCancelSubscription;

  window.addEventListener('load', function() {
    formCancelSubscription = document.querySelector('#form-cancel-subscription');
    formCancelSubscription.addEventListener('submit', onCancelSubscriptionSubmitted);

    $('#modal-cancel-subscription').on('show.bs.modal', function (ev) {
      hideFormError(formCancelSubscription);
      formCancelSubscription.reset();
    });
  });

  //
  // onCancelSubscription
  //
  function onCancelSubscriptionSubmitted(ev) {
    ev.preventDefault();
    sendCancelSubscriptionForm();
  }

  //
  // sendCancelSubscriptionForm
  //
  function sendCancelSubscriptionForm() {
    var form = formCancelSubscription;
    var method = 'DELETE',
      url = '/subscription';

    var data = {
      subscriptionId: form.subscriptionId.value
    };

    hideFormError(form);
    sendRequest(method, url, data, function(err, resp, xhr) {
      if(err) {
        showFormError(form, err.message);
      }
      else {
        form.reset();
        window.location = '/portal';
      }
    });
  }

})();


(function paymentFormModal() {
  'use strict';

  var stripe = Stripe(
    'pk_test_51GwvRbBiptgCg7PmxXD569PSCfyhung0lcNPVut2bdKuEEIcmrB8IZqIP7IbVrD3akO89Y9XtgL0DXy2M6mLpcR300UelBUj0x'  // TODO: Change this to a Stripe production key
  );
  var stripeElements = [];

  var wrapper,
    paymentForm;

  window.addEventListener('load', function() {
    wrapper = document.querySelector('#modal-payment-method .modal-body');

    paymentForm = wrapper.querySelector('#form-payment-method');
    paymentForm.addEventListener('invalid', checkFormValidity.bind(paymentForm));
    paymentForm.addEventListener('submit', onPaymentMethodSubmitted);

    mountStripeElements();
  });

  //
  // mountStripeElements
  //
  function mountStripeElements() {
    var elements = stripe.elements({
      locale: 'auto'
    });
    var elementStyles = {
      base: {
        fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Ubuntu,sans-serif',
        fontSize: '15px',
        fontSmoothing:  'antialiased',
        fontWeight: '400',
        '::placeholder': {
          color: '#909090', //'#CFD7DF',

        },
        ':-webkit-autofill': {
          color: '#e39f48',
        }
      },
      invalid: {
        color: '#E25950',
        '::placeholder': {
          color: '#FFCCA5',
        }
      },
    };
    var elementClasses = {
      focus: 'focused',
      empty: 'empty',
      invalid: 'invalid'
    };

    var cardNumber = elements.create('cardNumber', {
      style: elementStyles,
      classes: elementClasses,
      showIcon: false,
      iconStyle: 'default'
    });
    cardNumber.mount('#stripe-form-card-number');

    var cardExpiry = elements.create('cardExpiry', {
      style: elementStyles,
      classes: elementClasses,
    });
    cardExpiry.mount('#stripe-form-card-expiry');

    var cardCvc = elements.create('cardCvc', {
      style: elementStyles,
      classes: elementClasses,
    });
    cardCvc.mount('#stripe-form-card-cvc');

    stripeElements = [cardNumber, cardExpiry, cardCvc];
    connectStripeValidation(stripeElements);
  }

  //
  // validateStripeElements
  //
  function connectStripeValidation(elements) {
    // Listen for errors from each Element, and show error messages in the UI.
    var savedErrors = {};
    elements.forEach(function (element, idx) {
      element.on('change', function (event) {
        disableSubmitForm(paymentForm);
        if (event.error) {
          savedErrors[idx] = event.error.message;
          showPaymentFormError(event.error.message);
        } else {
          savedErrors[idx] = null;

          // Loop over the saved errors and find the first one, if any.
          var nextError = Object.keys(savedErrors)
            .sort()
            .reduce(function (maybeFoundError, key) {
              return maybeFoundError || savedErrors[key];
            }, null);

          if (nextError) {
            // Now that they've fixed the current error, show another one.
            showPaymentFormError(nextError)
          } else {
            // The user fixed the last error; no more errors.
            enableSubmitForm(paymentForm);
            hidePaymentFormError();
          }
        }
      });
    });
  }

  //
  // enableSubmitForm
  //
  function enableSubmitForm(parentElement) {
    var btn = parentElement.querySelector("button[type=submit]");
    btn.removeAttribute('disabled');
  }

  //
  // disableSubmitForm
  //
  function disableSubmitForm(parentElement) {
    var btn = parentElement.querySelector("button[type=submit]");
    btn.setAttribute('disabled', 'true');
  }

  //
  // showPaymentFormError
  //
  function showPaymentFormError(message) {
    if(!message) { message = 'Please make sure your information is correct!'; }
    var err = message + "<br><span style='font-weight: 500;font-size: 1.1em;line-height: 1.2em;'>We do not accept prepaid cards.</span>";
    showFormError(paymentForm, err);
  }

  //
  // hidePaymentFormError
  //
  function hidePaymentFormError() {
    hideFormError(paymentForm);
  }

  //
  // getBillingAddress
  //
  function getBillingAddress() {
    return {
      address1: paymentForm.line1.value,
      city: paymentForm.city.value,
      state: paymentForm.state.value,
      postalCode: paymentForm.zipCode.value,
      country: 'US'
    };
  }

  //
  // getPaymentFormInput
  //
  function getPaymentFormInput() {
    return new Promise(function(resolve, reject) {
      stripe.createToken(stripeElements[0])
        .then(function(resp) {
          if(resp.token) {
            var payload = {
              billingAddress: getBillingAddress(),
              stripeToken: resp.token.id
            };
            resolve(payload);
          }
          else {
            reject(resp.error);
          }
        })
        .catch(function(err) {
          reject(err);
        });
    });
  }

  //
  // onPaymentMethodSubmitted
  //
  function onPaymentMethodSubmitted(ev) {
    ev.preventDefault();
    sendPaymentMethodForm()
      .then()
      .catch();
  }

  //
  // sendPaymentMethodForm
  //
  async function sendPaymentMethodForm() {
    var form = paymentForm;
    var method = 'PUT',
      url = '/subscription/autopay';    // TODO: Create route to update payment method (regardless of platform)

    try {
      var data = await getPaymentFormInput();
    }
    catch(err) {
      console.error(err);
      showPaymentFormError('Failed to contact Stripe. Please try again later');
      return;
    }

    hidePaymentFormError();
    sendRequest(method, url, data, function(err, resp) {
      if(err) {
        showPaymentFormError(err.message);
      }
      else {
        form.classList.add('success');
        form.classList.remove('was-validated'); // remove any error messages
        form.reset();   // clear inputs
      }
    });
  }

})();