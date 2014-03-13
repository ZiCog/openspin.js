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
            },

            removeCurlyComments = function (s, i) {
                var start;
                var end;
                var front;
                var back;
                var depth = 0;

                i = i || 0;

                for (i = 0; i < s.length; i += 1) {
                    if (s[i] === "{") {
                        depth += 1;
                        if (start === undefined) {
                            start = i;
                        }
                    } else if (s[i] === "}") {
                        depth -= 1;
                        if (depth === 0) {
                            end = i;
                            front = s.slice(0, start);
                            back = s.slice(end + 1);
                            s = front + back;
                            s = removeCurlyComments(s, start + 1);
                            return (s);
                        }
                    }
                }
                if (depth !== 0) {
                    s = s.slice(0, start - 1);
                }
                return (s);
            },

            string2lines = function (data) {
                // Split source file ino lines
                lines = data.match(/^.*((\r\n|\n|\r)|$)/gm);
                return lines;
            },

            detectSectionChange = function (line, section) {
                var sections = [{ re: /^PUB /, section: 'PUB' },
                                { re: /^PRI /, section: 'PRI' },
                                { re: /^OBJ/,  section: 'OBJ' },
                                { re: /^DAT/,  section: 'DAT' },
                                { re: /^CON/,  section: 'CON' },
                                { re: /^VAR/,  section: 'VAR' }],
                    sec;
                for (sec = 0; sec < sections.length; sec += 1) {
                    if (line.match(sections[sec].re)) {
                        section = sections[sec].section;
                        break;
                    }
                }
                return section;
            };


        if (output[fileName] === undefined) {

            sourceRecord = {'fileName': fileName, 'publicMethods': [], 'privateMethods': [], 'subObjects': []};

            output[fileName] = sourceRecord;

            data = removeCurlyComments(data);

            lines = string2lines(data);

            for (lineNumber = 0; lineNumber <  lines.length; lineNumber += 1) {
                line = lines[lineNumber];
                line = line.trim();
                line = line.split("'")[0];

                section = detectSectionChange(line, section);

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
                    fields = line.split(':');
                    if (fields.length === 2) {
                        fileName = fields[1].replace(/"/g, '');
                        fileName = fileName.replace(/ /g, '');
                        fileName = fileName.replace(/[.]spin$/, '');
                        fileName += '.spin';
                        sourceRecord.subObjects.push(fileName);
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
                str +=  '    PUB:\n';
                prettyPrintMethods(output[key].publicMethods);
                str += '    PRI:\n';
                prettyPrintMethods(output[key].privateMethods);
                str += '    OBJ:\n';
                console.log(output[key].subObjcts);                
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
        parseProject,
        encoding = 'utf8';
//        encoding = 'ucs2';

    if (ENVIRONMENT_IS_NODE) {
        fs = require('fs');
        parser = new SpinParser();

/*
        var getSubFiles = function () {
            fs.readFile(path + topFile, encoding, function (err, data) {
                var fileStack;

                if (err) {
                        throw err;
                }

                fileStack = parser.parse(topFile, data);
                console.log(fileStack);
            });
        };

        getSubFiles();
*/

        parseProject = function parseProject (fileName) {
            var fileStack;

            fs.readFile(path + fileName, encoding, function (err, data) {
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















