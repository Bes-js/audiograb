<br/>
<img src="./audiograb.png">
<h4 align="center">A simple audio grabber for windows, linux, mac, and raspberry pi.</h6>
<p align="center">
<img src="https://img.shields.io/npm/v/audiograb?style=for-the-badge&logo=npm&logoColor=red">
<img src="https://img.shields.io/github/repo-size/Bes-js/audiograb?style=for-the-badge&logo=github&logoColor=white"> 
<img src="https://img.shields.io/npm/l/audiograb?style=for-the-badge">
<img src="https://img.shields.io/npm/unpacked-size/audiograb?style=for-the-badge"> 
<img src="https://img.shields.io/npm/dt/audiograb?style=for-the-badge&logoColor=blue"> 
<img src="https://img.shields.io/github/package-json/dependency-version/Bes-js/audiograb/sequelize?style=for-the-badge">
<a href="https://discord.gg/luppux" target="_blank"> 
<img alt="Discord" src="https://img.shields.io/badge/Support-Click%20here-7289d9?style=for-the-badge&logo=discord"> 
</a>
<a href="https://www.buymeacoffee.com/beykant" target="_blank">
<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" width="120px" height="30px" alt="Buy Me A Coffee">
</a>
</p>


## Installation

Using npm:
```shell
$ npm install audiograb
```

Other Installations:

```bash
$ yarn add audiograb
```

```bash
$ pnpm add audiograb
```

## Usage
```js
import { Recorder, EventType } from 'audiograb';
import fs from 'fs';

const recorder = new Recorder({
    '-i': 'Microphone (5- USB PnP Sound Device)',
}).setFormat('dshow');

// Create a `WriteStream` to save the audio data to a temporary file
const outputFilePath = './output.mp3';
const outputFile = fs.createWriteStream(outputFilePath);

// When recording starts
recorder.on('recordStarted', () => {
    console.log('Recording started...');
});

// Write audio data to the file as it arrives
recorder.on('audioData', (data) => {
    outputFile.write(data);
});

// When recording stops or an error occurs
recorder.on('recordStopped', () => {
    console.log('Recording stopped.');
    outputFile.end(); // Close the file stream
});

recorder.on('ffmpegInformation', (info) => {
    console.error('FFmpeg:', info);
});

// Start recording
recorder.start();

// Stop recording after a certain period
setTimeout(() => {
    recorder.stop();
}, 10000); // Stop recording after 10 seconds
```

## License

audiograb is licensed under the **GPL 3.0** License. See the [LICENSE](./LICENSE.md) file for details.

## Support

[![Discord Banner](https://api.weblutions.com/discord/invite/luppux/)](https://discord.gg/luppux)