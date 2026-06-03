const NAME_PATTERN = /^[A-Za-zÀ-ž' -]{2,}$/;

export function validateGuest(guest) {
  const errors = {};
  if (!NAME_PATTERN.test(guest.firstName.trim())) errors.firstName = 'Use at least 2 letters.';
  if (!NAME_PATTERN.test(guest.lastName.trim())) errors.lastName = 'Use at least 2 letters.';
  if (!isValidEmail(guest.email)) errors.email = 'Enter a valid email with @ and domain.';
  if (!isValidPhone(guest.phone)) errors.phone = 'Use international format, for example +48 501 234 567.';
  return errors;
}

export function validatePayment(payment) {
  const errors = {};
  if (!NAME_PATTERN.test(payment.cardName.trim())) errors.cardName = 'Enter the cardholder name.';
  if (!luhnCheck(payment.cardNumber)) errors.cardNumber = 'Enter a valid card number for the demo.';
  if (!isFutureExpiry(payment.expiry)) errors.expiry = 'Use MM/YY and a future date.';
  if (!/^\d{3,4}$/.test(payment.cvc.trim())) errors.cvc = 'Use 3 or 4 digits.';
  if (!/^[A-Za-z0-9 -]{4,10}$/.test(payment.billingZip.trim())) errors.billingZip = 'Enter a valid billing postal code.';
  if (!payment.agree) errors.agree = 'Accept the demo checkout terms.';
  return errors;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

function isValidPhone(value) {
  const digits = value.replace(/\D/g, '');
  return /^\+\d[\d\s-]{7,18}$/.test(value.trim()) && digits.length >= 8;
}

function luhnCheck(value) {
  const digits = value.replace(/\D/g, '');
  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return digits.length >= 12 && sum % 10 === 0;
}

function isFutureExpiry(value) {
  const match = value.trim().match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;

  return new Date(year, month, 0).getTime() >= Date.now();
}
