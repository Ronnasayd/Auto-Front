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