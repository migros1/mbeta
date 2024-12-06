// uplist.txt dosyasından verileri çek ve işleme
fetch('uplist.txt')
  .then(response => {
    if (!response.ok) throw new Error('Dosya yüklenemedi');
    return response.text();
  })
  .then(data => {
    const lines = data.split('\n');
    const products = lines.map(line => {
      const [product, code, imageUrl] = line.split(' - ');
      return { product, code, imageUrl };
    });

    // Form gönderildiğinde arama işlevi
    const form = document.getElementById('query-form');
    form.addEventListener('submit', event => {
      event.preventDefault();
      const query = document.getElementById('query').value.toLowerCase();
      const resultTable = document.querySelector('#result tbody');
      resultTable.innerHTML = '';

      const matchedProducts = products.filter(item =>
        item.product && item.product.toLowerCase().includes(query)
      );

      if (matchedProducts.length > 0) {
        const matchedCount = document.createElement('p');
        matchedCount.textContent = `${matchedProducts.length} ürün bulundu.`;
        resultTable.parentElement.insertBefore(matchedCount, resultTable);

        matchedProducts.forEach(item => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${item.product}</td>
            <td>${item.code}</td>
            <td><img src="${item.imageUrl}" alt="${item.product}"></td>
          `;
          resultTable.appendChild(row);
        });
      } else {
        resultTable.innerHTML = '<tr><td colspan="3">Sonuç bulunamadı.</td></tr>';
      }
    });
  })
  .catch(error => console.error('Hata:', error));