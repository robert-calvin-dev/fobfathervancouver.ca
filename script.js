/* =====================================================
   FobFather — script.js
   Vanilla JS frontend logic
   Handles form validation, mailto submission, WhatsApp prefill,
   spinner, and response messages
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const spinner = document.getElementById('formSpinner');
  const responseDiv = document.getElementById('formResponse');
  const whatsappBtn = document.querySelector('.whatsapp');

  // ----------------------------
  // Spinner helpers
  // ----------------------------
  function showSpinner() { spinner.style.display = 'inline-block'; }
  function hideSpinner() { spinner.style.display = 'none'; }

  // ----------------------------
  // Response helpers
  // ----------------------------
  function showResponse(message, isSuccess = true) {
    responseDiv.textContent = message;
    responseDiv.style.color = isSuccess ? 'green' : 'red';
  }

  // ----------------------------
  // Phone validation
  // ----------------------------
  function validatePhone(phone) {
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(phone.replace(/\D/g, ''));
  }

  // ----------------------------
  // Form validation
  // ----------------------------
  function validateForm() {
    let valid = true;
    const phone = form.phone.value.trim();
    const consent = form.consent.checked;

    if (!phone || !validatePhone(phone)) {
      valid = false;
      showResponse('Please enter a valid 10-digit phone number.', false);
    } else if (!consent) {
      valid = false;
      showResponse('You must agree to be contacted.', false);
    } else {
      showResponse('', true);
    }
    return valid;
  }

  // ----------------------------
  // Serialize form for mailto
  // ----------------------------
  function getMailtoLink() {
    const name = encodeURIComponent(form.name.value.trim() || '[No name]');
    const phone = encodeURIComponent(form.phone.value.trim() || '[No phone]');
    const email = encodeURIComponent(form.email.value.trim() || '[No email]');
    const preferred = encodeURIComponent(form.preferred.value.trim() || '[No date/time]');
    const message = encodeURIComponent(form.message.value.trim() || '[No message]');

    const subject = encodeURIComponent('FobFather Appointment / Message');
    const body = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nPreferred date/time: ${preferred}\nMessage: ${message}`;

    return `mailto:fodfathervancouver@gmail.com?subject=${subject}&body=${body}`;
  }

  // ----------------------------
  // Handle form submission
  // ----------------------------
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    submitBtn.disabled = true;
    showSpinner();
    showResponse('');

    // Open mailto link
    const mailtoLink = getMailtoLink();
    window.location.href = mailtoLink;

    // Reset form and UI after a short delay
    setTimeout(() => {
      hideSpinner();
      submitBtn.disabled = false;
      form.reset();
      showResponse('Thanks! Your message has been prepared in your email client.', true);
    }, 500);
  });

  // ----------------------------
  // WhatsApp button prefill
  // ----------------------------
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const name = form.name.value.trim() || '[No name]';
      const phone = form.phone.value.trim() || '[No phone]';
      const messageText = form.message.value.trim() || '[No message]';

      const prefilledMessage = encodeURIComponent(
        `Hi FobFather! My name is ${name}.\nPhone: ${phone}\nMessage: ${messageText}`
      );

      const waNumber = '12362685690'; // Canadian WhatsApp number
      const waLink = `https://wa.me/${waNumber}?text=${prefilledMessage}`;

      window.open(waLink, '_blank', 'noopener,noreferrer');
    });
  }

  // ----------------------------
  // Smooth scroll for header/hero CTAs
  // ----------------------------
  const ctaBtns = document.querySelectorAll('#ctaPrimary, #headerMessageBtn');
  ctaBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });
  });
});
