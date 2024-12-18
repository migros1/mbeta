// uplist.txt dosyasından verileri çek ve işleme
fetch('https://migros1.github.io/miggy/uplist.txt')
  .then(response => {
    if (!response.ok) throw new Error('Dosya yüklenemedi');
    return response.text();
  })
  .then(data => {
    const lines = data.split('\n');
    products = lines.map(line => {
      const [product, code, imageUrl, infoLink] = line.split(' - ');
      return { product, code, imageUrl, infoLink };
    });

    // Ürünleri ürün adına göre sırala
    products.sort((a, b) => a.product.localeCompare(b.product));

    let currentPage = 1;
    let productsPerPage = 12;
    let filteredProducts = [...products];

    function displayProducts() {
      const productList = document.querySelector('.product-list');
      productList.innerHTML = '';

      const startIndex = (currentPage - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      paginatedProducts.forEach(item => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
          <div class="product-image">
            <img src="${item.imageUrl}" alt="${item.product}">
          </div>
          <div class="product-info">
            <div class="product-name">${item.product}</div>
            <div class="product-code">${item.code}</div>
          </div>
          <button class="migros-link" data-info-link="${item.infoLink}">Migros ile bak</button>
        `;

        const migrosLinkBtn = productCard.querySelector('.migros-link');
        migrosLinkBtn.addEventListener('click', () => {
          showStockControlModal(item.infoLink);
        });

        productList.appendChild(productCard);
      });

      // Sayfalama bilgileri
      const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
      document.getElementById('current-page').textContent = currentPage;
      document.getElementById('total-pages').textContent = totalPages;
      document.getElementById('prev-page').disabled = currentPage === 1;
      document.getElementById('next-page').disabled = currentPage === totalPages;
    }

    // Önceki ve Sonraki sayfa butonları
    document.getElementById('prev-page').addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        displayProducts();
      }
    });

    document.getElementById('next-page').addEventListener('click', () => {
      const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        displayProducts();
      }
    });

    // Form gönderildiğinde arama işlevi
    const queryInput = document.getElementById('query');
    queryInput.addEventListener('input', () => {
      const query = queryInput.value.toLowerCase();
      filteredProducts = products.filter(item =>
        item.product && item.product.toLowerCase().includes(query)
      );
      currentPage = 1;
      displayProducts();
    });

    // Stok kontrol penceresi
    const modal = document.getElementById('stock-control-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    function showStockControlModal(infoLink) {
      if (!localStorage.getItem('stockControlModalClosed')) {
        modal.style.display = 'block';
        modalCloseBtn.addEventListener('click', () => {
          modal.style.display = 'none';
          localStorage.setItem('stockControlModalClosed', 'true');
        });
      } else {
        window.open(infoLink, '_blank');
      }
    }

    // Sayfa yüklendikten sonra Lottie animasyonunu gizle
    window.addEventListener('load', () => {
      const loadingScreen = document.getElementById('loading-screen');
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    });

    displayProducts();
  })
  .catch(error => console.error('Hata:', error));