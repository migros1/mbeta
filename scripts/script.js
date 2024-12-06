const apiUrl = 'https://migros1.github.io/miggy/uplist.txt';

function filterCategory(category) {
    fetch(apiUrl)
        .then(response => response.text())
        .then(data => {
            // Text formatında gelen veriyi JSON'a dönüştür
            const productsList = JSON.parse(data);
            // Kategorilere göre filtrele
            const filteredProducts = productsList.filter(product => product.category === category);
            // Ürünleri göster
            displayProducts(filteredProducts);
        })
        .catch(error => console.error("Hata:", error));
}

function displayProducts(productsList) {
    const resultsContainer = document.getElementById('productResults');
    resultsContainer.innerHTML = '';  // Önceki sonuçları temizle

    if (productsList.length === 0) {
        resultsContainer.innerHTML = '<p>Bu kategoriye ait ürün bulunamadı.</p>';
        return;
    }

    productsList.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');

        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" />
            <div class="product-details">
                <p><strong>Ürün Adı:</strong> ${product.name}</p>
                <p><strong>Kasa Kodu:</strong> ${product.code}</p>
            </div>
        `;

        resultsContainer.appendChild(productElement);
    });
}
