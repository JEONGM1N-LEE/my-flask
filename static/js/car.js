$(document).ready(function() {
    const MPG_MAX = 50;

    function hidePanels() {
        $('#car-result').prop('hidden', true);
        $('#car-error').prop('hidden', true);
    }

    function showError(message) {
        hidePanels();
        $('#car-error-message').text(message);
        $('#car-error').prop('hidden', false);
    }

    function setLoading(isLoading) {
        const $btn = $('#submit-btn');
        if (isLoading) {
            $btn.prop('disabled', true).addClass('is-loading').text('LOADING...');
        } else {
            $btn.prop('disabled', false).removeClass('is-loading').text('START ▶');
        }
    }

    function formatMpg(value) {
        const num = Number(value);
        if (Number.isNaN(num)) return '—';
        return num.toFixed(2);
    }

    function showResult(mpg) {
        hidePanels();

        const formatted = formatMpg(mpg);
        const gaugePercent = Math.min(100, (Number(mpg) / MPG_MAX) * 100);

        $('#result-mpg').text(formatted);
        $('#result-gauge-fill').css('width', '0%');
        $('#car-result').prop('hidden', false);

        requestAnimationFrame(function() {
            $('#result-gauge-fill').css('width', gaugePercent + '%');
        });

        $('html, body').animate({
            scrollTop: $('#car-result').offset().top - 24,
        }, 400);
    }

    $('#submit-btn').on('click', function() {
        const bagi = $('#bagi').val();
        const weight = $('#weight').val();
        const cylinder = $('#cylinder').val();

        if (!bagi || !weight || !cylinder) {
            showError('배기량, 무게, 기통수를 모두 입력해주세요.');
            return;
        }

        hidePanels();
        setLoading(true);

        $.ajax({
            url: '/api/car/predict-car',
            type: 'POST',
            data: JSON.stringify({
                bagi: Number(bagi),
                weight: Number(weight),
                cylinder: Number(cylinder),
            }),
            contentType: 'application/json',
            dataType: 'json',
            success: function(response) {
                setLoading(false);
                if (response.success === true && response.data) {
                    showResult(response.data['연비']);
                } else {
                    showError(response.message || '연비 예측에 실패했습니다.');
                }
            },
            error: function(xhr) {
                setLoading(false);
                const msg = xhr.responseJSON && xhr.responseJSON.message
                    ? xhr.responseJSON.message
                    : '서버와 통신 중 오류가 발생했습니다.';
                showError(msg);
            },
        });
    });

    $('#car-form').on('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            $('#submit-btn').trigger('click');
        }
    });
});
