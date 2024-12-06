const apiUrl = 'https://migros1.github.io/miggy/uplist.txt';
let allProducts = [];

// Kategoriye göre ürünleri filtreleme
function filterCategory(category) {
    const filteredProducts = allProducts.filter(product => product.category === category);
    displayProducts(filteredProducts);
}

// Ürünleri arama
function searchProduct() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    
    const filteredProducts = allProducts.filter(product => {
        const productName = product.name.toLowerCase();
        const productCode = product.code.toLowerCase();
        return productName.includes(query) || productCode.includes(query);
    });

    displayProducts(filteredProducts);
}

// Ürünleri sayfada görüntüleme
function displayProducts(productsList) {
    const resultsContainer = document.getElementById('productResults');
    resultsContainer.innerHTML = '';  // Önceki sonuçları temizle

    if (productsList.length === 0) {
        resultsContainer.innerHTML = '<p>Bu kategoriye ait veya aradığınız ürün bulunamadı.</p>';
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

// Sayfa yüklendiğinde ürünleri al ve başlangıçta listele
window.onload = function() {
    fetch(apiUrl)
        .then(response => response.text())
        .then(data => {
            const productsList = parseProductData(data);
            allProducts = productsList;  // Tüm ürünleri sakla
            displayProducts(allProducts);  // İlk başta tüm ürünleri göster
        })
        .catch(error => console.error("Hata:", error));
};

// `uplist.txt` formatını işleyerek ürünleri JSON'a dönüştürme
function parseProductData(data) {
    const lines = data.split('\n');
    const products = [];

    lines.forEach(line => {
        const parts = line.split(' - ');
        if (parts.length === 3) {
            const product = {
                name: parts[0].trim(),
                code: parts[1].trim(),
                image: parts[2].trim(),
                category: categorizeProduct(parts[0].trim())  // Kategoriyi belirle
            };
            products.push(product);
        }
    });

    return products;
}

// Ürünün kategorisini belirleme
function categorizeProduct(productName) {
    if (productName.includes('Fırın')) {
        return 'MFırın';
    } else if (productName.includes('Meyve') || productName.includes('Sebze')) {
        return 'Meyve & Sebze';
    } else {
        return 'Genel Ürünler';
    }
}
