let convertedFiles = []; // Array untuk menyimpan semua antrean foto

// Event Listener Input File
document.getElementById('file-upload').addEventListener('change', handleFiles);

// --- Dukungan Drag & Drop ---
const dropArea = document.getElementById('drop-area');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.add('bg-indigo-100', 'border-indigo-500'), false);
});
['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.remove('bg-indigo-100', 'border-indigo-500'), false);
});

dropArea.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    processFiles(files);
});
// ----------------------------

async function handleFiles(event) {
    await processFiles(event.target.files);
    event.target.value = ''; // Reset input value
}

async function processFiles(files) {
    const resultsContainer = document.getElementById('results');
    const actionBar = document.getElementById('action-bar');
    const countLabel = document.getElementById('count-label');
    const loading = document.getElementById('loading');

    if (files.length === 0) return;

    // Hanya merespon file gambar
    const filesToProcess = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (filesToProcess.length === 0) return;

    actionBar.classList.remove('hidden');
    actionBar.classList.add('flex');
    loading.classList.remove('hidden');

    // Gunakan Promises untuk tetap menjaga URUTAN file saat dikonversi
    const processPromises = filesToProcess.map((file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    // Buat ekstensi nama file baru (WEBP)
                    const nameParts = file.name.split('.');
                    nameParts.pop(); 
                    const newName = nameParts.join('.') + '.webp';

                    // Simpan versi JPEG kualitas tinggi khusus untuk library pembuat PDF 
                    // (Karena jsPDF lebih baik menggunakan JPEG ketimbang tipe file canvas mentah)
                    const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.95);

                    // Buat file Blob WEBP untuk didownload per-satuan atau via ZIP
                    canvas.toBlob(function(blob) {
                        const url = URL.createObjectURL(blob);
                        resolve({
                            originalFile: file,
                            fileName: newName,
                            blob: blob,
                            url: url,
                            jpegDataUrl: jpegDataUrl,
                            width: img.width,
                            height: img.height,
                            sizeKB: (blob.size / 1024).toFixed(1)
                        });
                    }, 'image/webp', 0.85); // Kualitas webp 85%
                };
                img.src = e.target.result;
            };
            
            reader.readAsDataURL(file);
        });
    });

    const newResults = await Promise.all(processPromises);
    loading.classList.add('hidden');

    // Menambahkan item baru ke global array dan antarmuka
    newResults.forEach(item => {
        convertedFiles.push(item);
        const currentIndex = convertedFiles.length; // Posisi urutan

        const card = document.createElement('div');
        card.className = 'bg-white border border-gray-100 rounded-xl p-3 flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative';
        
        card.innerHTML = `
            <div class="absolute -top-3 -left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold shadow-lg z-10 border-2 border-white">${currentIndex}</div>
            <div class="w-full h-32 mb-3 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center relative">
                <img src="${item.url}" alt="Preview" class="max-w-full max-h-full object-contain p-2">
            </div>
            <p class="text-xs font-semibold text-gray-800 truncate w-full text-center px-1 mb-1" title="${item.fileName}">${item.fileName}</p>
            <p class="text-xs text-gray-400 mb-3 font-medium">${item.sizeKB} KB</p>
            <a href="${item.url}" download="${item.fileName}" class="mt-auto py-2 px-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors w-full text-center text-xs font-bold border border-indigo-100 hover:border-indigo-600">
                Unduh WebP
            </a>
        `;
        
        resultsContainer.appendChild(card); // Append untuk menjaga urutan dari kiri ke kanan 
    });

    countLabel.textContent = convertedFiles.length;
}

// ----------------------------------------------------
// FITUR DOWNLOAD SEMUA PDF (BERURUTAN)
// ----------------------------------------------------
document.getElementById('download-pdf-btn').addEventListener('click', async function() {
    if (convertedFiles.length === 0) return;

    const originalText = this.innerHTML;
    this.innerHTML = '<span class="animate-spin inline-block mr-2">⏳</span> Memproses PDF...';
    this.disabled = true;

    // Tambahkan delay kecil agar button sempat ter-render loading state nya
    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            
            // Inisialisasi PDF dengan orientasi sesuai foto pertama dan format A4 (Standar Print)
            const firstImg = convertedFiles[0];
            const firstOrientation = firstImg.width > firstImg.height ? 'l' : 'p';
            
            const pdf = new jsPDF({
                orientation: firstOrientation,
                unit: 'mm',
                format: 'a4'
            });
            
            for (let i = 0; i < convertedFiles.length; i++) {
                const item = convertedFiles[i];
                
                // Atur orientasi proporsional per-halaman
                const orientation = item.width > item.height ? 'l' : 'p';
                
                if (i > 0) {
                    pdf.addPage('a4', orientation);
                }

                // Kalkulasi ukuran dan rasio untuk kertas A4 (210 x 297 mm)
                const pageWidth = orientation === 'l' ? 297 : 210;
                const pageHeight = orientation === 'l' ? 210 : 297;

                const imgRatio = item.width / item.height;
                const pageRatio = pageWidth / pageHeight;

                let finalWidth, finalHeight;

                // Algoritma agar gambar muat ke dalam halaman tanpa terpotong (contain)
                if (imgRatio > pageRatio) {
                    finalWidth = pageWidth;
                    finalHeight = pageWidth / imgRatio;
                } else {
                    finalHeight = pageHeight;
                    finalWidth = pageHeight * imgRatio;
                }

                // Center posisi gambar di tengah halaman
                const x = (pageWidth - finalWidth) / 2;
                const y = (pageHeight - finalHeight) / 2;

                pdf.addImage(item.jpegDataUrl, 'JPEG', x, y, finalWidth, finalHeight);
            }

            pdf.save("Kumpulan_Foto_Berurutan.pdf");

        } catch (e) {
            console.error("Gagal membuat PDF: ", e);
            alert("Terjadi kesalahan saat memproses PDF!");
        } finally {
            this.innerHTML = originalText;
            this.disabled = false;
        }
    }, 100);
});

// ----------------------------------------------------
// FITUR DOWNLOAD SEMUA ZIP
// ----------------------------------------------------
document.getElementById('download-zip-btn').addEventListener('click', function() {
    if (convertedFiles.length === 0) return;

    const originalText = this.innerHTML;
    this.innerHTML = '<span class="animate-spin inline-block mr-2">⏳</span> Menyusun ZIP...';
    this.disabled = true;

    const zip = new JSZip();
    const imgFolder = zip.folder("Gambar_WebP");

    convertedFiles.forEach(fileData => {
        imgFolder.file(fileData.fileName, fileData.blob);
    });

    zip.generateAsync({ type: "blob" })
    .then(function(content) {
        saveAs(content, "Kumpulan_Gambar_WebP.zip");
        
        const btn = document.getElementById('download-zip-btn');
        btn.innerHTML = originalText;
        btn.disabled = false;
    });
});

// ----------------------------------------------------
// EVENT LISTENER HAPUS/BERSIHKAN
// ----------------------------------------------------
document.getElementById('clear-btn').addEventListener('click', function() {
    document.getElementById('results').innerHTML = '';
    
    const actionBar = document.getElementById('action-bar');
    actionBar.classList.add('hidden');
    actionBar.classList.remove('flex');
    
    convertedFiles = [];
    document.getElementById('count-label').textContent = '0';
});