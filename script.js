document.addEventListener('DOMContentLoaded', () => {
    const titleElement = document.getElementById('title');
    const timerElement = document.getElementById('timer');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    // 1/100秒表示用の要素を取得
    const centisecondsElement = document.getElementById('centiseconds');
    const messageElement = document.getElementById('message');

    // --- 締切日の設定 (ここをカスタマイズできます) ---
    // JavaScriptでは月は0から始まるため、6月は「5」になります。
    const deadlines = {
        // 月: new Date(年, 月-1, 日, 時, 分, 秒)
        6: new Date(2025, 5, 15, 23, 59, 59),
        7: new Date(2025, 6, 15, 23, 59, 59),
        8: new Date(2025, 7, 15, 23, 59, 59),
        9: new Date(2025, 8, 15, 23, 59, 59),
        10: new Date(2025, 9, 15, 23, 59, 59),
        11: new Date(2025, 10, 15, 23, 59, 59),
        12: new Date(2025, 11, 15, 23, 59, 59),
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
        // ミリ秒を1/100秒 (0-99) に変換
        const centiseconds = Math.floor((diff % 1000) / 10);

        // 画面の表示を更新
        titleElement.textContent = `${currentDeadlineMonth}月分レポート締切まで`;
        hoursElement.textContent = String(totalHours).padStart(2, '0');
        minutesElement.textContent = String(minutes).padStart(2, '0');
        secondsElement.textContent = String(seconds).padStart(2, '0');
        // 1/100秒の表示を更新 (2桁表示)
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
            // タイマーの更新間隔は50ミリ秒ごとを維持
            timerInterval = setInterval(updateTimer, 50);
            updateTimer();
        }
    }

    init();
});