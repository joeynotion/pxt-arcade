declare const pxtc: any;
declare const require: any;
declare const process: any;

(function () {
    const UF2_MAGIC_START0 = 0x0A324655 >>> 0;
    const UF2_MAGIC_START1 = 0x9E5D5157 >>> 0;
    const UF2_MAGIC_END = 0x0AB16F30 >>> 0;
    const UF2_FLAG_NOFLASH = 0x00000001 >>> 0;
    const UF2_FAMILY_ID = 0x4D4B4152 >>> 0; // "MKAR"
    const UF2_PAYLOAD_SIZE = 256;
    const UF2_BLOCK_SIZE = 512;
    const MKAR_VERSION = 1;
    const BASE64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    function toUtf8Bytes(text: string) {
        if (typeof TextEncoder !== "undefined")
            return new TextEncoder().encode(text);
        const encoded = encodeURIComponent(text);
        const bytes: number[] = [];
        for (let i = 0; i < encoded.length; ++i) {
            if (encoded.charCodeAt(i) === 37 /* % */ && i + 2 < encoded.length) {
                bytes.push(parseInt(encoded.substr(i + 1, 2), 16));
                i += 2;
            }
            else {
                bytes.push(encoded.charCodeAt(i) & 0xff);
            }
        }
        const out = new Uint8Array(bytes.length);
        for (let i = 0; i < bytes.length; ++i)
            out[i] = bytes[i];
        return out;
    }

    function fromBase64(text: string) {
        const cleaned = (text || "").replace(/[\r\n\s]/g, "");
        if (!cleaned.length)
            return new Uint8Array(0);
        const padding = cleaned.endsWith("==") ? 2 : cleaned.endsWith("=") ? 1 : 0;
        const out = new Uint8Array(((cleaned.length * 3) >> 2) - padding);
        let outOffset = 0;

        for (let i = 0; i < cleaned.length; i += 4) {
            const c0 = BASE64_ALPHABET.indexOf(cleaned.charAt(i));
            const c1 = BASE64_ALPHABET.indexOf(cleaned.charAt(i + 1));
            const c2Char = cleaned.charAt(i + 2);
            const c3Char = cleaned.charAt(i + 3);
            const c2 = c2Char === "=" ? 0 : BASE64_ALPHABET.indexOf(c2Char);
            const c3 = c3Char === "=" ? 0 : BASE64_ALPHABET.indexOf(c3Char);
            const chunk = (c0 << 18) | (c1 << 12) | (c2 << 6) | c3;

            out[outOffset++] = (chunk >>> 16) & 0xff;
            if (c2Char !== "=" && outOffset < out.length)
                out[outOffset++] = (chunk >>> 8) & 0xff;
            if (c3Char !== "=" && outOffset < out.length)
                out[outOffset++] = chunk & 0xff;
        }

        return out;
    }

    function fromBinaryString(text: string) {
        const out = new Uint8Array((text || "").length);
        for (let i = 0; i < out.length; ++i)
            out[i] = text.charCodeAt(i) & 0xff;
        return out;
    }

    function toBase64(bytes: Uint8Array) {
        let out = "";
        for (let i = 0; i < bytes.length; i += 3) {
            const b0 = bytes[i];
            const b1 = i + 1 < bytes.length ? bytes[i + 1] : 0;
            const b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
            const chunk = (b0 << 16) | (b1 << 8) | b2;

            out += BASE64_ALPHABET.charAt((chunk >>> 18) & 0x3f);
            out += BASE64_ALPHABET.charAt((chunk >>> 12) & 0x3f);
            out += i + 1 < bytes.length ? BASE64_ALPHABET.charAt((chunk >>> 6) & 0x3f) : "=";
            out += i + 2 < bytes.length ? BASE64_ALPHABET.charAt(chunk & 0x3f) : "=";
        }
        return out;
    }

    function concatBytes(parts: Uint8Array[]) {
        let total = 0;
        for (const part of parts)
            total += part.length;
        const out = new Uint8Array(total);
        let offset = 0;
        for (const part of parts) {
            out.set(part, offset);
            offset += part.length;
        }
        return out;
    }

    function write32LE(buf: Uint8Array, offset: number, value: number) {
        buf[offset + 0] = value & 0xff;
        buf[offset + 1] = (value >>> 8) & 0xff;
        buf[offset + 2] = (value >>> 16) & 0xff;
        buf[offset + 3] = (value >>> 24) & 0xff;
    }

    function read32LE(buf: Uint8Array, offset: number) {
        return (buf[offset + 0] |
            (buf[offset + 1] << 8) |
            (buf[offset + 2] << 16) |
            (buf[offset + 3] << 24)) >>> 0;
    }

    function crc32(bytes: Uint8Array) {
        let crc = 0xffffffff;
        for (let i = 0; i < bytes.length; ++i) {
            crc ^= bytes[i];
            for (let bit = 0; bit < 8; ++bit)
                crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
        }
        return (crc ^ 0xffffffff) >>> 0;
    }

    function sanitizeFileBaseName(name: string) {
        return (name || "makecode")
            .replace(/[^a-z0-9._ -]+/gi, "")
            .trim()
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "")
            .toLowerCase() || "makecode";
    }

    function humanizeName(name: string) {
        const words = (name || "MakeCode Export")
            .replace(/[_-]+/g, " ")
            .trim()
            .split(/\s+/g)
            .filter(Boolean);
        if (!words.length)
            return "MakeCode Export";
        return words.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    }

    function tryReadJson(text: string) {
        try {
            return JSON.parse(text);
        }
        catch (e) {
            return undefined;
        }
    }

    function tryReadProjectConfigFromHost() {
        try {
            if (typeof require === "undefined" || typeof process === "undefined")
                return undefined;
            const fs = require("fs");
            const path = require("path");
            const projectPath = path.join(process.cwd(), "pxt.json");
            if (!fs.existsSync(projectPath))
                return undefined;
            return tryReadJson(fs.readFileSync(projectPath, "utf8"));
        }
        catch (e) {
            return undefined;
        }
    }

    function readProjectConfig(opts: any) {
        return tryReadJson((opts.fileSystem || {})["pxt.json"])
            || tryReadProjectConfigFromHost()
            || {};
    }

    function isRetroGoBuild(opts: any) {
        const files = opts.fileSystem || {};
        if (Object.keys(files).some((name: string) => /^pxt_modules\/hw---retro-go\//.test(name)))
            return true;
        const cfg = readProjectConfig(opts);
        const deps = cfg.dependencies || {};
        return Object.prototype.hasOwnProperty.call(deps, "hw---retro-go");
    }

    function getVmImage(res: any) {
        const outfiles = (res && res.outfiles) || {};
        if (outfiles["binary.pxt64"])
            return { format: "PXT64", bytes: decodePxt64(outfiles["binary.pxt64"]) };
        if (outfiles["binary.js"])
            return { format: "JS", bytes: toUtf8Bytes(outfiles["binary.js"]) };
        return undefined;
    }

    function pxt64HeaderOffset(bytes: Uint8Array) {
        if (!bytes)
            return -1;

        for (const offset of [0, 8]) {
            if (bytes.length < offset + 68)
                continue;
            if (bytes[offset + 0] !== 0x0a || bytes[offset + 1] !== 0x50 || bytes[offset + 2] !== 0x58 || bytes[offset + 3] !== 0x54 ||
                bytes[offset + 4] !== 0x36 || bytes[offset + 5] !== 0x34 || bytes[offset + 6] !== 0x0a)
                continue;

            const imageSize = read32LE(bytes, offset + 64);
            if (imageSize && offset + imageSize <= bytes.length)
                return offset;
        }

        return -1;
    }

    function looksLikePxt64(bytes: Uint8Array) {
        return pxt64HeaderOffset(bytes) >= 0;
    }

    function decodePxt64(text: string) {
        const decoded = fromBase64(text);
        if (looksLikePxt64(decoded))
            return trimPxt64Image(decoded);
        const raw = fromBinaryString(text);
        if (looksLikePxt64(raw))
            return trimPxt64Image(raw);
        return raw;
    }

    function trimPxt64Image(bytes: Uint8Array) {
        const offset = pxt64HeaderOffset(bytes);
        if (offset < 0)
            return bytes;
        const imageSize = read32LE(bytes, offset + 64);
        return bytes.slice(0, imageSize);
    }

    function buildMetadata(opts: any, vmImage: { format: string, bytes: Uint8Array }) {
        const cfg = readProjectConfig(opts);
        const retroGo = cfg.retroGo || {};
        const title = retroGo.title || humanizeName(cfg.name);
        const metadata: any = {
            diagnosticVersion: retroGo.diagnosticVersion || "",
            fileBaseName: sanitizeFileBaseName(title),
            format: "MKAR",
            namespace: "makecode",
            projectId: cfg.name || "",
            target: "retro-go",
            title,
            vmImageFormat: vmImage.format,
        };
        const ordered: any = {};
        Object.keys(metadata).sort().forEach(key => {
            const value = metadata[key];
            if (value)
                ordered[key] = value;
        });
        return ordered;
    }

    function buildMkarPayload(vmBytes: Uint8Array, metadataJson: string) {
        const metadataBytes = toUtf8Bytes(metadataJson);
        const header = new Uint8Array(20);
        header[0] = "M".charCodeAt(0);
        header[1] = "K".charCodeAt(0);
        header[2] = "A".charCodeAt(0);
        header[3] = "R".charCodeAt(0);
        write32LE(header, 4, MKAR_VERSION);
        write32LE(header, 8, vmBytes.length >>> 0);
        write32LE(header, 12, metadataBytes.length >>> 0);
        write32LE(header, 16, crc32(vmBytes));

        const packageCrc = new Uint8Array(4);
        write32LE(packageCrc, 0, crc32(concatBytes([vmBytes, metadataBytes])));

        return concatBytes([header, vmBytes, metadataBytes, packageCrc]);
    }

    function buildUf2(payload: Uint8Array) {
        const totalBlocks = Math.max(1, Math.ceil(payload.length / UF2_PAYLOAD_SIZE));
        const out = new Uint8Array(totalBlocks * UF2_BLOCK_SIZE);

        for (let blockNo = 0; blockNo < totalBlocks; ++blockNo) {
            const blockOffset = blockNo * UF2_BLOCK_SIZE;
            const payloadOffset = blockNo * UF2_PAYLOAD_SIZE;
            const chunk = payload.slice(payloadOffset, payloadOffset + UF2_PAYLOAD_SIZE);

            write32LE(out, blockOffset + 0, UF2_MAGIC_START0);
            write32LE(out, blockOffset + 4, UF2_MAGIC_START1);
            write32LE(out, blockOffset + 8, UF2_FLAG_NOFLASH);
            write32LE(out, blockOffset + 12, payloadOffset >>> 0);
            write32LE(out, blockOffset + 16, chunk.length >>> 0);
            write32LE(out, blockOffset + 20, blockNo >>> 0);
            write32LE(out, blockOffset + 24, totalBlocks >>> 0);
            write32LE(out, blockOffset + 28, UF2_FAMILY_ID);
            out.set(chunk, blockOffset + 32);
            write32LE(out, blockOffset + UF2_BLOCK_SIZE - 4, UF2_MAGIC_END);
        }

        return out;
    }

    pxtc.compilerHooks = pxtc.compilerHooks || {};
    pxtc.compilerHooks.postBinary = function (_program: any, opts: any, res: any) {
        if (!res || !isRetroGoBuild(opts))
            return;

        const vmImage = getVmImage(res);
        if (!vmImage)
            return;

        const metadata = buildMetadata(opts, vmImage);
        const metadataJson = JSON.stringify(metadata);
        const payload = buildMkarPayload(vmImage.bytes, metadataJson);
        const uf2 = buildUf2(payload);

        res.outfiles["binary.uf2"] = toBase64(uf2);
        res.outfiles["retro-go.mkar.json"] = JSON.stringify(metadata, null, 2) + "\n";
        res.outfiles["retro-go.basename.txt"] = metadata.fileBaseName + "\n";
    };
})();
