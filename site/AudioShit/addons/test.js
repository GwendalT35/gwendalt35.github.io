// load two soundfile and crossfade beetween them
let sound1, sound2;
let sound1Gain, sound2Gain, masterGain;

function preload() {
    soundFormats('ogg', 'mp3');
    sound1 = loadSound('./KDA - THE BADDESTNGHT.mp3');
    sound2 = loadSound('./Coconnightocre.mp3');
}

function setup() {
    let cnv = createCanvas(100, 100);
    cnv.mousePressed(startSound);
    // create a 'master' gain to which we will connect both soundfiles
    masterGain = new p5.Gain();
    masterGain.connect();
    sound1.disconnect(); // diconnect from p5 output
    sound1Gain = new p5.Gain(); // setup a gain node
    sound1Gain.setInput(sound1); // connect the first sound to its input
    sound1Gain.connect(masterGain); // connect its output to the 'master'
    sound2.disconnect();
    sound2Gain = new p5.Gain();
    sound2Gain.setInput(sound2);
    sound2Gain.connect(masterGain);
}

function startSound() {
    sound1.loop();
    sound2.loop();
    loop();
}

function mouseReleased() {
    sound1.stop();
    sound2.stop();
}

function draw() {
    background(220);
    textAlign(CENTER);
    textSize(11);
    fill(0);
    if (!sound1.isPlaying()) {
        text('tap and drag to play', width / 2, height / 2);
        return;
    }
    // map the horizontal position of the mouse to values useable for volume    *  control of sound1
    var sound1Volume = constrain(map(mouseX, width, 0, 0, 1), 0, 1);
    var sound2Volume = 1 - sound1Volume;
    sound1Gain.amp(sound1Volume);
    sound2Gain.amp(sound2Volume);
    // map the vertical position of the mouse to values useable for 'master    *  volume control'
    var masterVolume = constrain(map(mouseY, height, 0, 0, 1), 0, 1);
    masterGain.amp(masterVolume);
    text('master', width / 2, height - masterVolume * height * 0.9)
    fill(255, 0, 255);
    textAlign(LEFT);
    text('sound1', 5, height - sound1Volume * height * 0.9);
    textAlign(RIGHT);
    text('sound2', width - 5, height - sound2Volume * height * 0.9);
}