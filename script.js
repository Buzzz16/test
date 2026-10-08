document.addEventListener('DOMContentLoaded', () => {
    const startTimeInput = document.getElementById('startTime');
    const cycleDurationSelect = document.getElementById('cycleDuration');
    const cyclesInput = document.getElementById('cycles');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultContainer = document.getElementById('result');
    const scheduleList = document.getElementById('scheduleList');
    const summaryBox = document.getElementById('summaryBox');
    const setNowBtn = document.getElementById('setNowBtn');
    const presetNowBtn = document.getElementById('presetNowBtn');
    const footerClock = document.getElementById('footerClock');
    const sidebarItems = document.querySelectorAll('.sidebar-list li[data-cycle-select]');

    // Set default time to current time or 22:00 if not set
    const setCurrentTimeInput = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        startTimeInput.value = `${hours}:${minutes}`;
    };

    // Initialize default start time if empty
    if (!startTimeInput.value) {
        setCurrentTimeInput();
    }

    // Now buttons click handlers
    if (setNowBtn) setNowBtn.addEventListener('click', setCurrentTimeInput);
    if (presetNowBtn) presetNowBtn.addEventListener('click', setCurrentTimeInput);

    // Live footer clock
    const updateFooterClock = () => {
        if (!footerClock) return;
        const now = new Date();
        footerClock.textContent = now.toLocaleTimeString('id-ID', { hour12: false });
    };
    setInterval(updateFooterClock, 1000);
    updateFooterClock();

    // Sync sidebar cycle items with select dropdown
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const val = item.getAttribute('data-cycle-select');
            if (val) {
                cycleDurationSelect.value = val;
                
                // Update active state in sidebar
                sidebarItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });

    // Sync select dropdown change with sidebar active item
    cycleDurationSelect.addEventListener('change', (e) => {
        const selectedVal = e.target.value;
        sidebarItems.forEach(item => {
            if (item.getAttribute('data-cycle-select') === selectedVal) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    });

    // Helper: format sleep duration minutes into "X jam Y menit"
    const formatSleepDuration = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        if (hours === 0) {
            return `${mins} menit`;
        } else if (mins === 0) {
            return `${hours} jam 00 menit`;
        } else {
            return `${hours} jam ${mins} menit`;
        }
    };

    // Calculate sleep schedule
    calculateBtn.addEventListener('click', () => {
        const startTimeVal = startTimeInput.value;
        const cycleDurationVal = parseInt(cycleDurationSelect.value, 10);
        const cyclesVal = parseInt(cyclesInput.value, 10);

        if (!startTimeVal || isNaN(cyclesVal) || cyclesVal < 1) {
            alert('Mohon masukkan jam mulai dan jumlah siklus (minimal 1).');
            return;
        }

        const [hours, minutes] = startTimeVal.split(':').map(Number);
        
        // Reset output list
        scheduleList.innerHTML = '';

        const PREP_MINUTES = 15; // Waktu persiapan mulai tidur (tetap 15 menit)
        
        // Display summary box details
        summaryBox.innerHTML = `
            <strong>⚙ CONFIG:</strong> Jam Mulai: <u>${startTimeVal}</u> | 
            Durasi Siklus: <u>${cycleDurationVal} Menit</u> | 
            Persiapan Awal: <u>+${PREP_MINUTES} Menit</u>
        `;

        for (let i = 1; i <= cyclesVal; i++) {
            // Total waktu tidur murni untuk siklus ke-i (tanpa persiapan 15 m)
            const pureSleepMinutes = i * cycleDurationVal;
            
            // Waktu bangun = startTime + 15m persiapan + (i * cycleDuration)
            const totalElapsedMinutes = PREP_MINUTES + pureSleepMinutes;

            const targetTime = new Date();
            targetTime.setHours(hours, minutes + totalElapsedMinutes, 0, 0);

            // Format jam bangun HH:MM
            const formattedWakeTime = targetTime.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            // Format total tidur murni
            const sleepDurationStr = formatSleepDuration(pureSleepMinutes);

            // Create retro card item
            const li = document.createElement('li');
            li.className = 'schedule-card';
            li.style.animationDelay = `${i * 0.08}s`;

            li.innerHTML = `
                <div class="cycle-meta">
                    <span class="cycle-title">
                        <span>⚡ Siklus ${i}</span>
                    </span>
                    <span class="cycle-sleep-time">
                        Total Tidur: <strong>${sleepDurationStr}</strong> (${pureSleepMinutes}m)
                    </span>
                </div>
                <div class="wake-time-box">
                    <span class="wake-label">Waktu Bangun</span>
                    <span class="wake-time">${formattedWakeTime}</span>
                </div>
            `;

            scheduleList.appendChild(li);
        }

        // Show result container
        resultContainer.classList.remove('hidden');
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});
