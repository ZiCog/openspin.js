"use strict";

function SpinParser() {
    var output = {},
        fileStack = [];

    this.getOutput = function () {
        return output;
    };

    this.parse = function (fileName, data) {
        var lineNumber,
            lines,
            line,
            section = 'none',
            fields,
            sourceRecord,
            sig,

            parseMethodSignature = function (line) {
                var params,
                    signature,
                    tmp,
                    methodName;
                signature = line.split('|')[0];
                tmp = signature.split('(');
                methodName = tmp[0].replace(/ /g, '');
                params = [];
                if (tmp[1]) {
                    tmp = tmp[1].split(')');
                    tmp = tmp[0].replace(/ /g, "");
                    params = tmp.split(',');
                }
                return {'methodName': methodName, 'lineNumber': lineNumber, 'params': params};
            };

        if (output[fileName] === undefined) {

            sourceRecord = {'fileName': fileName, 'publicMethods': [], 'privateMethods': []};

            output[fileName] = sourceRecord;

            // Split source file ino lines
            lines = data.match(/^.*((\r\n|\n|\r)|$)/gm);

            for (lineNumber = 0; lineNumber <  lines.length; lineNumber += 1) {
                line = lines[lineNumber];
                line = line.trim();
                line = line.split("'")[0];
                if (line.match(/^PUB /)) {
                    section = 'PUB';
                }
                if (line.match(/^PRI /)) {
                    section = 'PRI';
                }
                if (line.match(/^OBJ/)) {
                    section = 'OBJ';
                }
                if (line.match(/^DAT/)) {
                    section = 'DAT';
                }
                if (line.match(/^CON/)) {
                    section = 'CON';
                }
                if (line.match(/^VAR/)) {
                    section = 'VAR';
                }
                switch (section) {
                case 'PUB':
                    line = line.replace(/^PUB/, '');
                    sig = parseMethodSignature(line);
                    sourceRecord.publicMethods.push(sig);
                    section = 'none';
                    break;
                case 'PRI':
                    line = line.replace(/^PRI/, '');
                    sig = parseMethodSignature(line);
                    sourceRecord.privateMethods.push(sig);
                    section = 'none';
                    break;
                case 'OBJ':
                    line = line.replace(/OBJ/, '');
                    fields = line.split(':');
                    if (fields.length === 2) {
                        fileName = fields[1].replace(/"/g, '');
                        fileName = fileName.replace(/ /g, '');
                        fileName = fileName.replace(/[.]spin$/, '');
                        fileName += '.spin';
                        fileStack.push(fileName);
                    }
                    break;
                case 'DAT':
                    break;
                case 'CON':
                    break;
                case 'VAR':
                    break;
                }
            }
        }
        return fileStack;
    };

    this.prettyPrint = function () {
        var str = "",

            prettyPrintMethods = function (methods) {
                var params;

                methods.map(function (method) {
                    str += '        ' + method.methodName;
                    params = method.params;
                    str += ' (';
                    params.map(function (param) {
                        str += param + ', ';
                    });
                    str += ')\n';
                });
            },
            key;

        for (key in output) {
            if (output.hasOwnProperty(key)) {
                str += key + '\n';
                str +=  '    Public:\n';
                prettyPrintMethods(output[key].publicMethods);
                str += '    Private:\n';
                prettyPrintMethods(output[key].privateMethods);
            }
        }
        str = str.replace(/, \)/g, ')');
        return str;
    };
}


(function testTheParser() {
    var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function',
        fs,
        path = '../project/',
        topFile = 'WebServer_W5100_RTC.spin',
        parser,
        parseProject;

    if (ENVIRONMENT_IS_NODE) {
        fs = require('fs');
        parser = new SpinParser();

        parseProject = function parse(fileName) {
            var fileStack;

           fs.readFile(path + fileName, 'utf8', function (err, data) {
//           fs.readFile(path + fileName, 'ucs2', function (err, data) {

                if (err) {
                    throw err;
                }
                fileStack = parser.parse(fileName, data);
                fileName = fileStack.pop();
                if (fileName) {
                    parseProject(fileName);
                } else {
                    console.log(parser.prettyPrint());
                }
            });
        };
        parseProject(topFile);
    }
}());
