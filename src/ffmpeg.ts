import { execSync } from 'child_process'

class VideoStream {

}

class AudioStream {
    bitrate: number;
    frequency: number;
    codec: string;
}

export class Codec {
    name: string;
    decoding: boolean;
    encoding: boolean;
    type: string;
    intraFrameOnly: boolean;
    losless: boolean;
    lossy: boolean;
    description: string;
}

export class Format {
    name: string;
    demuxing: boolean;
    muxing: boolean;
    description: string;
}

export async function getVersion(): Promise<string> {
    try {
        const stdout: string = execSync('ffmpeg -version', {encoding: 'utf8'});
        const regExp: RegExp = /[\n\r]*[ \t]*ffmpeg version[ \t]*([\d.-]*)/g;
        return regExp.exec(stdout)[1];
    } catch(err) {
        return Promise.reject(err);
    }
}

export async function getConfiguration(): Promise<string[]> {
    try {
        const config: string[] = [];
        const stdout: string = execSync('ffmpeg -version', {encoding: 'utf8'});
        const regExp: RegExp = /\B(\-\-)[\S]+/gm;

        let output: RegExpExecArray = null;
        while((output = regExp.exec(stdout)) != null) {
            config.push(output[0]);
        }
        
        return config;
    } catch(err) {
        return Promise.reject(err);
    }
}

export async function getCodecs(): Promise<Codec[]> {
    try {
        const codecs: Codec[] = [];
        const stdout: string = execSync('ffmpeg -hide_banner -codecs', {encoding: 'utf8'});
        const regExp: RegExp = /\s([D\.][E\.][VAS][I\.][L\.][S\.])\ (\S*)[\ ]*([^\n]*)\n/g

        let output: RegExpExecArray = null;
        while((output = regExp.exec(stdout)) != null) {
            const codec: Codec = new Codec();
            codec.name = output[2];
            codec.decoding = output[1].charAt(0) == 'D';
            codec.encoding = output[1].charAt(1) == 'E';
            codec.type = output[1].charAt(2);
            codec.intraFrameOnly = output[1].charAt(3) == 'I';
            codec.lossy = output[1].charAt(4) == 'L';
            codec.losless = output[1].charAt(5) == 'S';
            codecs.push(codec);
        }

        return codecs;
    } catch(err) {
        return Promise.reject(err);
    }
}

export async function getFormats(): Promise<Format[]> {
    try {
        const formats: Format[] = [];
        const stdout: string = execSync('ffmpeg -hide_banner -codecs', {encoding: 'utf8'});
        const regExp: RegExp = /\s([D\ ][E\ ])\ (\S*)[\ ]*([^\n]*)\n/g;

        let output: RegExpExecArray = null;
        while((output = regExp.exec(stdout)) != null) {
            const format: Format = new Format();
            format.name = output[2];
            format.demuxing = output[1].charAt(0) == 'D';
            format.muxing = output[1].charAt(1) == 'E';
            formats.push(format);
        }

        return formats;
    } catch(err) {
        return Promise.reject(err);
    }
}

export async function getVideoInformation(filename: string): Promise<VideoStream> {
    try {
        const videoStream = new VideoStream;
        const stdout: string = execSync(`ffmpeg -hide_banner -i ${filename}`, {encoding: 'utf8'});

        return videoStream;
    } catch(err) {
        return Promise.reject(err);
    }
}

export async function getAudioInformation(filename: string): Promise<AudioStream> {
    try {
        const audioStream: AudioStream = new AudioStream;
        const stdout: string = execSync(`ffmpeg -hide_banner -i ${filename}`, {encoding: 'utf8'});

        return audioStream;
    } catch(err) {
        return Promise.reject(err);
    }
}