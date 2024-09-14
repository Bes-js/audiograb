'use strict';

var child_process = require('child_process');
var R = require('@ffmpeg-installer/ffmpeg');
var P = require('os');
var events = require('events');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var R__default = /*#__PURE__*/_interopDefault(R);
var P__default = /*#__PURE__*/_interopDefault(P);

/* Package */
var l=Object.defineProperty;var a=(f,e)=>l(f,"name",{value:e,configurable:!0});var p=(r=>(r.RecordStarted="recordStarted",r.RecordStopped="recordStopped",r.RecordPaused="recordPaused",r.RecordResumed="recordResumed",r.FFmpegInformation="ffmpegInformation",r.AudioData="audioData",r))(p||{}),o=class o extends events.EventEmitter{constructor(e={$debug:!1}){super(),this.ffmpeg=null,this.recorderOptions=e,this.recording=!1,this.paused=!1;}setFormat(e){return this.recorderOptions["-f"]=e,this}setAudioCodec(e){return this.recorderOptions["-c:a"]=e,this}setBitrate(e){return this.recorderOptions["-b:a"]=e,this}setInputDevice(e){return this.recorderOptions["-i"]=e,this}setOutputFormat(e){return this.recorderOptions["-of"]=e,this}setFfmpegPath(e){return this.recorderOptions.ffmpegPath=e,this}start(){var s,n,d;if(this.recording&&this.recorderOptions.$debug){console.log("Recording is already in progress.");return}this.emit("recordStarted");let e=P__default.default.platform(),c=this.recorderOptions["-f"]?this.recorderOptions["-f"]:e==="win32"?"dshow":e==="darwin"?"avfoundation":"alsa",g=this.recorderOptions["-of"]?this.recorderOptions["-of"]:"mp3",h=this.recorderOptions["-c:a"]?this.recorderOptions["-c:a"]:"libmp3lame",u=this.recorderOptions["-b:a"]?this.recorderOptions["-b:a"]:"128k",r=this.recorderOptions["-i"]?this.recorderOptions["-i"]:e==="win32"?"Microphone":e==="darwin"?":0":e==="linux"?"default":"Microphone",m=this.recorderOptions.ffmpegPath?this.recorderOptions.ffmpegPath:R__default.default.path;this.ffmpeg=child_process.spawn(m,["-f",c,"-i",`audio=${r}`,"-c:a",h,"-b:a",u,"-f",g,"pipe:1"]),(s=this.ffmpeg.stdout)==null||s.on("data",i=>{this.emit("audioData",i);}),this.recording=!0,(n=this.ffmpeg.stderr)==null||n.on("data",i=>{this.emit("ffmpegInformation",i.toString());}),(d=this.ffmpeg.stdin)==null||d.on("error",i=>{this.emit("ffmpegInformation",i.message);}),this.ffmpeg.on("error",i=>{this.emit("ffmpegInformation",i.message);}),this.ffmpeg.on("close",()=>{this.emit("recordStopped"),this.recording=!1,this.paused=!1;});}stop(){this.recording?this.ffmpeg&&(this.ffmpeg.kill("SIGINT"),this.recording=!1,this.paused=!1,this.recorderOptions.$debug&&console.log("Recording stopped.")):this.recorderOptions.$debug&&console.log("No recording is in progress.");}pause(){this.recording&&!this.paused?this.ffmpeg&&(this.ffmpeg.kill("SIGSTOP"),this.paused=!0,this.emit("recordPaused",this.paused),this.recorderOptions.$debug&&console.log("Recording paused.")):this.paused?this.recorderOptions.$debug&&console.log("Recording is already paused."):this.recorderOptions.$debug&&console.log("No recording is in progress.");}resume(){this.recording&&this.paused?this.ffmpeg&&(this.ffmpeg.kill("SIGCONT"),this.paused=!1,this.emit("recordResumed",this.paused),this.recorderOptions.$debug&&console.log("Recording resumed.")):this.paused?this.recorderOptions.$debug&&console.log("No recording is in progress."):this.recorderOptions.$debug&&console.log("Recording is not paused.");}};a(o,"Recorder");var t=o;/* Package */

exports.EventType = p;
exports.Recorder = t;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map