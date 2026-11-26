// Contact forms. PREVIEW mode: nothing is sent.
// When the site goes live, set FORM_ENDPOINT to the form service address (e.g. Formspree)
// and messages will be emailed to Slade.
var FORM_ENDPOINT = "";

document.querySelectorAll("form[data-contact]").forEach(function (form) {
  var note = form.querySelector(".note");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      note.textContent = "Please add your name, a valid email and a message.";
      note.dataset.state = "";
      return;
    }
    if (!FORM_ENDPOINT) {
      note.textContent = "Looks good. This is a preview, so nothing was sent. On the live site this goes straight to Slade's inbox.";
      note.dataset.state = "done";
      return;
    }
    note.textContent = "Sending…";
    fetch(FORM_ENDPOINT, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then(function (r) {
        if (!r.ok) throw new Error();
        form.reset();
        note.textContent = "Thank you, your message has arrived. Talk soon.";
        note.dataset.state = "done";
      })
      .catch(function () {
        note.textContent = "That didn't go through. Please try again, or write to me on Instagram.";
        note.dataset.state = "";
      });
  });
});
