export default function ContactPresenter() {
  const form = document.getElementById("contactForm");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Pesan berhasil dikirim (simulasi)." );
    form.reset();
  });
}