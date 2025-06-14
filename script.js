document.addEventListener('DOMContentLoaded', () => {
    const titleElement = document.getElementById('title');
    const timerElement = document.getElementById('timer');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const centisecondsElement = document.getElementById('centiseconds');
    const messageElement = document.getElementById('message');

    // --- ↓↓↓ ここを変更しました！ (日本標準時を基準にする) ↓↓↓ ---
    const deadlines = {
        // ISO 8601形式でタイムゾーン(+09:00)を指定
        6: new Date('2025-06-15T23:59:59+09:00'),
        7: new Date('2025-07-15T23:59:59+09:00'),
        8: new Date('2025-08-15T23:59:59+09:00'),
        9: new Date('2025-09-15T23:59:59+09:00'),
        10: new Date('2025-10-15T23:59:59+09:00'),
        11: new Date('2025-11-15T23:59:59+09:00'),
        12: new Date('2025-12-15T23:59:59+09:00'),
    };
    // ----------------------------------------------------

    let currentDeadlineMonth = null;
    let timerInterval = null;

    function findCurrentDeadline() {
        const now = new Date();
        for (const month in deadlines) {
            if (now < deadlines[month]) {
                return parseInt(month);
            }
        }
        return null;
    }

    function updateTimer() {
        const now = new Date();
        const targetDeadline = deadlines[currentDeadlineMonth];
        let diff = targetDeadline - now;

        if (diff <= 0) {
            diff = 0;
            currentDeadlineMonth = findCurrentDeadline();
            if (currentDeadlineMonth === null) {
                clearInterval(timerInterval);
                showEndMessage();
            }
            return;
        }

        const totalHours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        const centiseconds = Math.floor((diff % 1000) / 10);

        titleElement.textContent = `${currentDeadlineMonth}月分レポート締切まで`;
        hoursElement.textContent = String(totalHours).padStart(2, '0');
        minutesElement.textContent = String(minutes).padStart(2, '0');
        secondsElement.textContent = String(seconds).padStart(2, '0');
        centisecondsElement.textContent = String(centiseconds).padStart(2, '0');
    }

    function showEndMessage() {
        titleElement.classList.add('hidden');
        timerElement.classList.add('hidden');
        messageElement.textContent = '年間レポート終了！';
        messageElement.classList.remove('hidden');
    }

    function init() {
        currentDeadlineMonth = findCurrentDeadline();
        if (currentDeadlineMonth === null) {
            showEndMessage();
        } else {
            timerInterval = setInterval(updateTimer, 50);
            updateTimer();
        }
    }

    init();
});