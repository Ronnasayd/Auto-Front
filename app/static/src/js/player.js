let shvideocontrols;
const videoplayer = $('#videoplayer')[0];
let playpauselist = ['play', 'pause'].reverse();

$('#play-button').attr('data-display', 'false');
$('#pause-button').attr('data-display', 'true');

$('#videoplayer,.video-controls').mousemove((event) => {
    clearTimeout(shvideocontrols);
    $('.video-controls').attr('data-display', 'true');
    shvideocontrols = setTimeout(() => {
        $('.video-controls').attr('data-display', 'false');
    }, 3000);
});

$('.play-pause-button').on('click', () => {
    if (playpauselist[0] === 'play') {
        $('#play-button').attr('data-display', 'false');
        $('#pause-button').attr('data-display', 'true');
        videoplayer.play();
        playpauselist.reverse();
    }
    else {
        $('#play-button').attr('data-display', 'true');
        $('#pause-button').attr('data-display', 'false');
        videoplayer.pause();
        playpauselist.reverse();
    }
});

$('.step-backward').on('click', () => {
    videoplayer.currentTime = videoplayer.currentTime - 5;
});

$('.step-forward').on('click', () => {
    videoplayer.currentTime = videoplayer.currentTime + 5;
});

$('#sound-input').on('input', (e) => {
    si = e.target;
    $(si).css(
        'background',
        'linear-gradient(to right,red 0%, red ' + si.value + '%, white ' + si.value + '%, white 100%)'
    );
    videoplayer.volume = parseFloat(si.value) / 100;
});

$('#slider-input').mouseenter((e) => {
    $(e.target).attr('data-display', 'thumb-hover');
});
$('#slider-input').mouseout((e) => {
    $(e.target).removeAttr('data-display');
});

$('#slider-input').on('input', (e) => {
    si = e.target;
    $(si).css(
        'background',
        'linear-gradient(to right,red 0%, red ' + si.value + '%, white ' + si.value + '%, white 100%)'
    );
});

$('#slider-input').mousemove((e) => {
    $('#slider-output').attr('data-display', 'true');
    let slidertime = moment().startOf('day').seconds((e.offsetX / e.target.offsetWidth) * videoplayer.duration).format('HH:mm:ss');
    $('#slider-output').val(slidertime);
    $('#slider-output').css('left', e.offsetX - $('#slider-output')[0].offsetWidth / 2);
});

$('#slider-input').mouseout((e) => {
    $('#slider-output').attr('data-display', 'false');
});


$('#slider-input').on('change', (e) => {
    si = e.target;
    $(si).css(
        'background',
        'linear-gradient(to right,red 0%, red ' + si.value + '%, white ' + si.value + '%, white 100%)'
    );
    let position = parseFloat(si.value) / 100;
    videoplayer.currentTime = videoplayer.duration * position;
});
changeSlider = () => {
    let position = 100 * videoplayer.currentTime / videoplayer.duration;
    $('#slider-input').val(position);
    $('#slider-input').change();
};
setInterval(() => {
    changeSlider();
}, 1000);

