import { spawn, ChildProcess } from 'child_process';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
import os from 'os';
import { EventEmitter } from 'events';

export enum EventType {
    RecordStarted = 'recordStarted',
    RecordStopped = 'recordStopped',
    RecordPaused = 'recordPaused',
    RecordResumed = 'recordResumed',
    FFmpegInformation = 'ffmpegInformation',
    AudioData = 'audioData',
}

export interface RecorderEvents {
    recordStarted: [];
    audioData: [Buffer];
    ffmpegInformation: [string];
    recordStopped: [];
    recordPaused: [boolean];
    recordResumed: [boolean];
}

/** 
* Recorder class
* @class Recorder
* @constructor
* @public
* @type {Recorder}
* @description - Recorder class for recording audio from input devices
* @requires ffmpeg
* @extends EventEmitter
* @param {Object} recorderOptions - Recorder options
* @param {string} [recorderOptions.ffmpegPath] - Path to ffmpeg binary
* @param {boolean} [recorderOptions.$debug] - Enable debug mode
* @param {string} [recorderOptions.-i] - Input device
* @param {string} [recorderOptions.-b:a] - Audio bitrate
* @param {string} [recorderOptions.-c:a] - Audio codec
* @param {string} [recorderOptions.-f] - Input format
* @param {string} [recorderOptions.-of] - Output format
* @example 
* const recorder = new Recorder({
*    '-i': 'Microphone',
* }).setFormat('dshow');
*/
export default class Recorder extends EventEmitter <RecorderEvents> {
    private ffmpeg: ChildProcess | null;
    private recorderOptions: {
        ffmpegPath?: string;
        $debug?: boolean;
        '-i'?: string;
        '-b:a'?: string;
        '-c:a'?: string;
        '-f'?: 'dshow' | 'avfoundation' | 'alsa' | string;
        '-of'?: 'mp3' | string;
    };
    public recording: boolean;
    public paused: boolean;

    constructor(recorderOptions: {
        ffmpegPath?: string;
        $debug?: boolean;
        '-i'?: string;
        '-b:a'?: string;
        '-c:a'?: string;
        '-f'?: 'dshow' | 'avfoundation' | 'alsa' | string;
        '-of'?: 'mp3' | string;
    } = { 
        $debug: false
     }) {
        super();
        this.ffmpeg = null;
        this.recorderOptions = recorderOptions;
        this.recording = false;
        this.paused = false;

    }

    /**
     * Set the input format
     * @param {'dshow' | 'avfoundation' | 'alsa' | string} format - Input format
     * @returns {Recorder}
     * @type {Recorder}
     * @public
     * @description - Set the input format
     * @method setFormat
     * @example
     * const recorder = new Recorder().setFormat('dshow');
     * @example
     * const recorder = new Recorder().setFormat('avfoundation');
     */
    setFormat(format: 'dshow' | 'avfoundation' | 'alsa' | string) {
        this.recorderOptions['-f'] = format;
        return this;
    }

    /**
     * Set the audio codec
     * @param {string} codec - Audio codec
     * @returns {Recorder}
     * @type {Recorder}
     * @public
     * @description - Set the audio codec
     * @method setAudioCodec
     * @example
     * const recorder = new Recorder().setAudioCodec('libmp3lame');
     * @example
     * const recorder = new Recorder().setAudioCodec('aac');
     */
    setAudioCodec(codec: string) {
        this.recorderOptions['-c:a'] = codec;
        return this;
    }

    /**
     * Set the audio bitrate
     * @param {string} bitrate - Audio bitrate
     * @returns {Recorder}
     * @type {Recorder}
     * @public
     * @description - Set the audio bitrate
     * @method setBitrate
     * @example
     * const recorder = new Recorder().setBitrate('128k');
     * @example
     * const recorder = new Recorder().setBitrate('256k');
     */
    setBitrate(bitrate: string) {
        this.recorderOptions['-b:a'] = bitrate;
        return this;
    }

    /**
     * Set the input device
     * @param {string} device - Input device
     * @returns {Recorder}
     * @type {Recorder}
     * @public
     * @description - Set the input device
     * @method setInputDevice
     * @example
     * const recorder = new Recorder().setInputDevice('Microphone');
     * @example
     * const recorder = new Recorder().setInputDevice('Microphone (5- USB PnP Sound Device)');
     */
    setInputDevice(device: string) {
        this.recorderOptions['-i'] = device;
        return this;
    }

    /**
     * Set the output format
     * @param {string} format - Output format
     * @returns {Recorder}
     * @type {Recorder}
     * @public
     * @description - Set the output format
     * @method setOutputFormat
     * @example
     * const recorder = new Recorder().setOutputFormat('mp3');
     * @example
     * const recorder = new Recorder().setOutputFormat('wav');
     */
    setOutputFormat(format: 'mp3' | string) {
        this.recorderOptions['-of'] = format;
        return this;
    }

    /**
     * Set the path to the ffmpeg binary
     * @param {string} path - Path to ffmpeg binary
     * @returns {Recorder}
     * @type {Recorder}
     * @public
     * @description - Set the path to the ffmpeg binary
     * @method setFfmpegPath
     * @example
     * const recorder = new Recorder().setFfmpegPath('/path/to/ffmpeg');
     */
    setFfmpegPath(path: string) {
        this.recorderOptions.ffmpegPath = path;
        return this;
    }


    /*
    public emit<K extends keyof RecorderEvents>(eventName: K, ...args: RecorderEvents[K]): boolean {
        return super.emit(eventName, ...args);
    }

    public on<K extends keyof RecorderEvents>(eventName: K, listener: (...args: RecorderEvents[K]) => void): this {
        return super.on(eventName, listener);
    }
    */


    /**
     * Start recording
     * @returns {void}
     * @type {void}
     * @public
     * @description - Start recording
     * @method start
     * @example
     * const recorder = new Recorder().start();
     */
    public start() {
        if (this.recording && this.recorderOptions.$debug) {
            console.log('Recording is already in progress.');
            return;
        }

        this.emit('recordStarted');

        const platform = os.platform();
        const format = this.recorderOptions['-f'] ? this.recorderOptions['-f'] : platform === 'win32' ? 'dshow' : platform === 'darwin' ? 'avfoundation' : platform === 'linux' ? 'alsa' : 'alsa';
        const outputFormat = this.recorderOptions['-of'] ? this.recorderOptions['-of'] : 'mp3';
        const encoder = this.recorderOptions['-c:a'] ? this.recorderOptions['-c:a'] : 'libmp3lame';
        const bitrate = this.recorderOptions['-b:a'] ? this.recorderOptions['-b:a'] : '128k';
        const inputDevice = this.recorderOptions['-i'] ? this.recorderOptions['-i'] : platform === 'win32' ? 'Microphone' : platform === 'darwin' ? ':0' : platform === 'linux' ? 'default' : 'Microphone' ;
        const ffmpegPath = this.recorderOptions.ffmpegPath ? this.recorderOptions.ffmpegPath : ffmpeg.path;
        
        this.ffmpeg = spawn(ffmpegPath, [
            '-f', format,
            '-i', `audio=${inputDevice}`,
            '-c:a', encoder,
            '-b:a', bitrate,
            '-f', outputFormat,
            'pipe:1',
        ]);

        this.ffmpeg.stdout?.on('data', (data: Buffer) => {this.emit('audioData', data);});
        this.recording = true;
        this.ffmpeg.stderr?.on('data', (data: Buffer) => {this.emit('ffmpegInformation', data.toString());});
        this.ffmpeg.stdin?.on('error', (error) => {this.emit('ffmpegInformation', error.message);});
        this.ffmpeg.on('error', (error) => {this.emit('ffmpegInformation', error.message);});
        this.ffmpeg.on('close', () => {this.emit('recordStopped');this.recording = false; this.paused = false;});
    }

    /**
     * Stop recording
     * @returns {void}
     * @type {void}
     * @public
     * @description - Stop recording
     * @method stop
     * @example
     * const recorder = new Recorder().stop();
     */
    public stop() {
        if (this.recording) {
            if (this.ffmpeg) {
                this.ffmpeg.kill('SIGINT');
                this.recording = false;
                this.paused = false;
                if(this.recorderOptions.$debug) {
                console.log('Recording stopped.');
                }
            }
        } else {
            if(this.recorderOptions.$debug) {
            console.log('No recording is in progress.');
            }
        }
    }


    /**
     * Pause recording
     * @returns {void}
     * @type {void}
     * @public
     * @description - Pause recording
     * @method pause
     * @example
     * const recorder = new Recorder().pause();
     */
    public pause() {
        if (this.recording && !this.paused) {
            if (this.ffmpeg) {
                this.ffmpeg.kill('SIGSTOP');
                this.paused = true;
                this.emit('recordPaused',this.paused);
                if(this.recorderOptions.$debug) {
                console.log('Recording paused.');
                }
            }
        } else if (this.paused) {
            if(this.recorderOptions.$debug) {
            console.log('Recording is already paused.');
            }
        } else {
            if(this.recorderOptions.$debug) {
            console.log('No recording is in progress.');
            }
        }
    }

    /**
     * Resume recording
     * @returns {void}
     * @type {void}
     * @public
     * @description - Resume recording
     * @method resume
     * @example
     * const recorder = new Recorder().resume();
     */
    public resume() {
        if (this.recording && this.paused) {
            if (this.ffmpeg) {
                this.ffmpeg.kill('SIGCONT');
                this.paused = false;
                this.emit('recordResumed',this.paused);
                if(this.recorderOptions.$debug) {
                console.log('Recording resumed.');
                }
            }
        } else if (!this.paused) {
            if(this.recorderOptions.$debug) {
            console.log('Recording is not paused.');
            }
        } else {
            if(this.recorderOptions.$debug) {
            console.log('No recording is in progress.');
            }
        }
    }


}
