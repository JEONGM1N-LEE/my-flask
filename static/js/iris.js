$(document).ready(function() {
    const CLASS_LABELS = {
        setosa: '세토사 (Setosa)',
        versicolor: '버시컬러 (Versicolor)',
        virginica: '버지니카 (Virginica)',
    };

    function hidePanels() {
        $('#iris-result').prop('hidden', true);
        $('#iris-error').prop('hidden', true);
    }

    function showError(message) {
        hidePanels();
        $('#iris-error-message').text(message);
        $('#iris-error').prop('hidden', false);
    }

    function renderProbList(probabilities, winnerClass) {
        const $list = $('#prob-list');
        $list.empty();

        const probs = probabilities && typeof probabilities === 'object'
            ? probabilities
            : {};

        const entries = Object.keys(probs).length > 0
            ? Object.entries(probs)
            : Object.keys(CLASS_LABELS).map(function(name) {
                return [name, name === winnerClass ? 100 : 0];
            });

        entries.forEach(function([className, percent]) {
            const label = CLASS_LABELS[className] || className;
            const isWinner = className === winnerClass;

            const $item = $(`
                <li class="iris-prob-item${isWinner ? ' is-winner' : ''}">
                    <div class="iris-prob-row">
                        <span class="iris-prob-name">${label}</span>
                        <span class="iris-prob-percent">${percent}%</span>
                    </div>
                    <div class="iris-progress-track">
                        <div class="iris-progress-fill" data-width="${percent}"></div>
                    </div>
                </li>
            `);

            $list.append($item);
        });

        requestAnimationFrame(function() {
            $list.find('.iris-progress-fill').each(function() {
                $(this).css('width', $(this).data('width') + '%');
            });
        });
    }

    function showResult(data) {
        hidePanels();

        const className = data.class_name;
        const probabilities = data.probabilities || null;
        const confidence = data.confidence != null
            ? data.confidence
            : (probabilities && probabilities[className] != null ? probabilities[className] : 100);
        const label = CLASS_LABELS[className] || className;

        $('#result-class-name').text(label);
        $('#result-confidence').text(confidence + '%');
        $('#result-confidence-bar').css('width', '0%');

        renderProbList(probabilities, className);

        $('#iris-result').prop('hidden', false);

        requestAnimationFrame(function() {
            $('#result-confidence-bar').css('width', confidence + '%');
        });

        $('html, body').animate({
            scrollTop: $('#iris-result').offset().top - 24,
        }, 400);
    }

    $('#submit-btn').on('click', function() {
        const sl = $('#sepal_length').val();
        const sw = $('#sepal_width').val();
        const pl = $('#petal_length').val();
        const pw = $('#petal_width').val();

        if (!sl || !sw || !pl || !pw) {
            showError('꽃잎 정보 4가지를 모두 입력해주세요.');
            return;
        }

        hidePanels();

        $.ajax({
            url: '/api/ai/predict-iris',
            type: 'POST',
            data: JSON.stringify({
                sepal_length: sl,
                sepal_width: sw,
                petal_length: pl,
                petal_width: pw,
            }),
            contentType: 'application/json',
            dataType: 'json',
            success: function(response) {
                if (response.success === true) {
                    showResult(response.data);
                } else {
                    showError(response.message || '분석에 실패했습니다.');
                }
            },
            error: function() {
                showError('서버와 통신 중 오류가 발생했습니다.');
            },
        });
    });
});
