document.getElementById('calculateBtn').addEventListener('click', function() {
    const startTimeInput = document.getElementById('startTime').value;
    const cyclesInput = document.getElementById('cycles').value;
    const resultContainer = document.getElementById('result');
    const scheduleList = document.getElementById('scheduleList');

    if (!startTimeInput || !cyclesInput || cyclesInput < 1) {
        alert('Mohon masukkan jam mulai dan jumlah siklus (minimal 1).');
        return;
    }

    // Ekstrak jam dan menit dari input
    const [hours, minutes] = startTimeInput.split(':').map(Number);
    let currentTime = new Date();
    
    // Set waktu ke tanggal hari ini dengan jam input
    currentTime.setHours(hours, minutes, 0, 0);

    // Reset isi list jika sebelumnya sudah ada yang dihitung
    scheduleList.innerHTML = '';
    
    const n = parseInt(cyclesInput);

    for (let i = 1; i <= n; i++) {
        if (i === 1) {
            // Output pertama: waktu rebahan + 15 menit + 90 menit = 105 menit
            currentTime.setMinutes(currentTime.getMinutes() + 105);
        } else {
            // Output selanjutnya (2, 3, dst): + 90 menit saja
            currentTime.setMinutes(currentTime.getMinutes() + 90);
        }

        // Format angka jadi HH:MM (contoh: 07:30)
        const formattedTime = currentTime.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        // Buat elemen list HTML
        const li = document.createElement('li');
        li.innerHTML = `<span>Siklus ${i}</span> <span>${formattedTime}</span>`;
        
        // Staggered animation: delay ditambah setiap siklus biar munculnya satu-satu (motion)
        li.style.animationDelay = `${(i * 0.1)}s`;
        
        scheduleList.appendChild(li);
    }

    // Tampilkan container hasil
    resultContainer.classList.remove('hidden');
});
