/**
Provides a web worker process. 

@module worker
**/

var ModuleConf = {};

ModuleConf['preRun'] = function () {
    log ('preRun:');
};

ModuleConf['postRun'] = function () {
    log ('postRun:');
};

ModuleConf['print'] = function print(s) {
    log (s);
};

ModuleConf['printErr'] = function printErr(s) {
    log (s);
};
  
ModuleConf['arguments'] = ['-b', 'WebServer_W5100_RTC.spin']; 

// Let's not have main execute immeditaly on load.
ModuleConf['noInitialRun'] = true;

// TBD: What to do with this?
ModuleConf['noExitRuntime'] = true;

/**
 * UUID Generator.
 *
 * Compliant with RFC4122 version 4.
 *
 * @method uuid 
 * @return {String}  The generated UUID. 
 */
function uuid () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;
            return v.toString(16);
        });
}

/**
 * Test if give parameter is a buffer.
 * @method isBuffer
 * @param {Object} b The thing we want to test for being a buffer.
 * @return {Boolean} true if given parameter is a buffer.
 */
isBuffer = function(b) {
    return b instanceof ArrayBuffer;
}

/**
 * Convert an array buffer to a string.
 *
 * @method ab2str
 * @param  {ArrayBuffer} buf A raw buffer to convert to string, 2 bytes per char, (endian sensitive!).
 * @return {String}      The string representation of the buffer. 
 */
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

/**
 * Convert a string to an array buffer.
 *
 * @method str2ab
 * @param  {String} str A string to convert to an array buffer.
 * @return {String} The buffer representation of the string, 2 bytes per char, (endian sensitive!). 
 */
function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

/**
 * Send progress update to parent process.
 *
 * @method reportProgress
 * @param  {Number} value Percentage of progress so far.
 */
function reportProgress (value) {
    // Update the progress meter.
    self.postMessage ({
        'id': uuid(), 
        'method': 'UPDATE',
        'resource': '/progress/percent',
        'body': value 
    });
}

/**
 * Send a log message to the parent process.
 *
 * @method log
 * @param  {String} logMsg The log message text.
 */
function log (logMsg) {
    self.postMessage ({
        'id': uuid(), 
        'method': 'UPDATE',
        'resource': '/log',
        'body': logMsg 
    });
}


// Pull in the openspin compiler
importScripts('openspin.js');

openspin(ModuleConf);

self.addEventListener('message', function(e) {
    var data = e.data;
    switch (data.msgType) {
        case 'openspin':
                reportProgress (10);

                // Call openspin's main method. 
                var t0 = Date.now();
                ModuleConf['callMain'](ModuleConf['arguments']);
                var t1 = Date.now();
                log ("Compilation time = " + (t1 - t0) / 1000 + "s");
                reportProgress (100);
        break;
        default:
            switch (data.method) {
                case 'CREATE':
                    // Is this "/FS/..." ?
                    var re = /^\/FS\//;
                    var reArray = re.exec(data.resource);
                    if (reArray !== null) {
                        // emove the "/FS/"
                        var fileName = data.resource.replace(reArray[0], '');
                        log ("Worker got: " + fileName);
                        try {
                            ModuleConf['FS'].unlink(fileName);
                        } catch (e) {
                            //log("EXCEPTION", e);
                        }
                        ModuleConf.FS_createDataFile('', fileName, data.body, true, true, true);
                    }
                    break;
                case 'READ':
                    // TODO: Check resource: /FS/test.binary'
                    try {
                        // Get file from file system 
                        var u8b = ModuleConf['FS'].readFile('WebServer_W5100_RTC.binary' /* data.name */, { encoding: 'binary' });
                        // Respond with file content. 
                        self.postMessage ({
                            'id': data.id, 
                            'method': 'YES',
                            'resource': data.resource,
                            'body': u8b 
                        });
                    } catch (e) {
                        log ('No such file.');
                    }
                    break;
                case 'UPDATE':
                    break;
                case 'DELETE':
                    if (data.resource === '/self') {
                        log ('Worker terminating');
                        self.close();    // Terminates the worker.
                    }
                    break;
                case 'YES':
                    break;
                default:
                    log ('Worker got unknown method:' + data.method );
                    break;
            }
            break;
    }
}, false);

log ("Worker started.");
reportProgress (0);



