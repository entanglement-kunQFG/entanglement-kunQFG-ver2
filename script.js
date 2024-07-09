const serverUrl = 'http://localhost:3000/countdown';

function updateCurrentTime() {
    const now = new Date().toLocaleString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('current-time').textContent = '現在時刻: ' + now;
}

// 1秒ごとに現在時刻を更新
setInterval(updateCurrentTime, 1000);

// 初期表示のために現在時刻を更新
updateCurrentTime();

document.getElementById('start-countdown-btn').addEventListener('click', function() {
    const endTime = new Date(document.getElementById('end-time').value);
    if (isNaN(endTime)) {
        alert('有効な終了時刻を入力してください');
        return;
    }

    const name = document.getElementById('name-select').value;
    const startTime = new Date();

    const countdownData = {
        endTime: endTime.toISOString(),
        initiator: name,
        startTime: startTime.toISOString()
    };

    fetch(serverUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(countdownData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        loadCountdownData();
    })
    .catch(error => console.error('Error:', error));
});

function loadCountdownData() {
    fetch(serverUrl)
        .then(response => response.json())
        .then(data => {
            if (data.endTime) {
                document.getElementById('initiator').textContent = 'カウントダウンを開始した人: ' + data.initiator;
                document.getElementById('start-time').textContent = 'カウントダウン開始時刻: ' + new Date(data.startTime).toLocaleString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
                document.getElementById('end-time-display').textContent = '終了時刻: ' + new Date(data.endTime).toLocaleString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });

                function updateCountdown() {
                    const now = new Date();
                    const remainingTime = new Date(data.endTime) - now;
                    if (remainingTime <= 0) {
                        document.getElementById('countdown').textContent = '終了時刻に到達しました！';
                        clearInterval(intervalId);
                        return;
                    }

                    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

                    document.getElementById('countdown').textContent = `残り時間: ${hours}時間 ${minutes}分 ${seconds}秒`;
                }

                updateCountdown();
                const intervalId = setInterval(updateCountdown, 1000);
            }
        })
        .catch(error => console.error('Error:', error));
}

// 初期読み込み時にカウントダウンデータをロード
loadCountdownData();