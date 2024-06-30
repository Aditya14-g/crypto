window.addEventListener("load", function() {
    const priceElement = document.querySelector(".crypto-price");
    let oldPrice = parseFloat(priceElement.innerText);

    console.log("Initial price:", oldPrice);

    fetch(`/currency?name=${encodeURIComponent('<%= name %>')}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            let newPrice = data.price;

            console.log("Fetched new price:", newPrice);

            if (!priceElement) {
                console.error("Price element not found!");
                return;
            }

            if (newPrice > oldPrice) {
                priceElement.classList.add("green");
                priceElement.classList.remove("red");
                console.log("Price increased. Adding 'green' class.");
            } else if (newPrice < oldPrice) {
                priceElement.classList.add("red");
                priceElement.classList.remove("green");
                console.log("Price decreased. Adding 'red' class.");
            } else {
                console.log("Price remained the same.");
            }

            priceElement.innerText = newPrice;
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
});
