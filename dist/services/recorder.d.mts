import { EventEmitter } from 'events';

declare enum EventType {
    RecordStarted = "recordStarted",
    RecordStopped = "recordStopped",
    RecordPaused = "recordPaused",
    RecordResumed = "recordResumed",
    FFmpegInformation = "ffmpegInformation",
    AudioData = "audioData"
}
interface RecorderEvents {
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
declare class Recorder extends EventEmitter<RecorderEvents> {
    private ffmpeg;
    private recorderOptions;
    recording: boolean;
    paused: boolean;
    constructor(recorderOptions?: {
        ffmpegPath?: string;
        $debug?: boolean;
        '-i'?: string;
        '-b:a'?: string;
        '-c:a'?: string;
        '-f'?: 'dshow' | 'avfoundation' | 'alsa' | string;
        '-of'?: 'mp3' | string;
    });
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
    setFormat(format: 'dshow' | 'avfoundation' | 'alsa' | string): this;
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
    setAudioCodec(codec: string): this;
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
    setBitrate(bitrate: string): this;
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
    setInputDevice(device: string): this;
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
    setOutputFormat(format: 'mp3' | string): this;
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
    setFfmpegPath(path: string): this;
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
    start(): void;
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
    stop(): void;
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
    pause(): void;
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
    resume(): void;
}

export { EventType, type RecorderEvents, Recorder as default };
