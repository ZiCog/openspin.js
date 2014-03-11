CodeMirror.defineMode("spin", function() {
			
function qwRegExp() {
	var args = Array.prototype.slice.call(arguments);
	var qw = args.join(' ').replace(/([\^\$\.\+\-\?\=\!\:\\\/\(\)\[\]\{\}\*\|])/g, '\\$1');
	return new RegExp("^((" + qw.split(/\s+/).join(")|(") + "))\\b", "i");
}
		
function qmRegExp() {
	var args = Array.prototype.slice.call(arguments);
	var qm = args.join(' ').replace(/([\^\$\.\+\-\?\=\!\:\\\/\(\)\[\]\{\}\*\|])/g, '\\$1');
	return new RegExp("^((" + qm.split(/\s+/).join(")|(") + "))", "i");
}
		
function qsRegExp() {
	var args = Array.prototype.slice.call(arguments);
	var qs = args.join(' ').replace(/([\^\$\.\+\-\?\=\!\:\\\/\(\)\[\]\{\}\*\|])/g, '\\$1');
	return new RegExp("^[" + qs.replace(/\s/g, '') + "]", "i");
}
	
var lex = {
    singleOperators: '= + - * / ~ ? & | ^ ! < > @ # :',
    doubleOperators: ':= -- ++ ** // #> <# ^^ || ~~ ~> |< >| << >> <- -> >< == <> =< => += -= *= /= &= |= ^= <= >=',
    tripleOperators: '//= >>= <<= **=',
    wordOperators: 'and or not',
    sectionHeaders: 'con dat obj pri pub var',
    dataTypes: 'byte word long',
    spinKeywords: 'abort bytefill bytemove case chipver cognew constant else elseif'
		    + ' from if longfill longmove lookdown lookdownz lookup lookupz next other quit repeat result'
		    + ' return spr strcomp string strsize until wordfill wordmove _clkfreq _clkmode _free _stack'
		    + ' _xinfreq',
    commonKeywords: 'cnt cogid coginit cogstop ctra ctrb dira dirb false float frqa'
		    + ' frqb ina inb lockclr locknew lockret lockset outa outb par phsa phsb pi round true trunc'
		    + ' vcfg vscl waitcnt waitpeq waitpne waitvid while xinput xtal1 xtal2 xtal3 pll1x pll2x pll4x'
		    + ' pll8x pll16x posx negx pi rcfast rcslow',
    pasmKeywords: 'abs absneg add addabs adds addsx addx andn call clkset cmp'
		    + ' cmps cmpsub cmpsx cmpx cnt cogid coginit cogstop djnz enc fit hubop if_a if_ae'
		    + ' if_always if_b if_be if_c if_c_and_nz if_c_and_z if_c_eq_z if_c_ne_z if_c_or_nz'
		    + ' if_c_or_z if_e if_nc if_nc_and_nz if_nc_and_z if_nc_or_nz if_nc_or_z if_ne if_never'
		    + ' if_nz if_nz_and_c if_nz_and_nc if_nz_or_c if_nz_or_nc if_z if_z_and_c if_z_and_nc'
		    + ' if_z_eq_c if_z_ne_c if_z_or_c if_z_or_nc ina inb jmp jmpret max maxs min mins mov'
		    + ' movd movi movs mul muls muxc muxnc muxnz muxz neg negc negnc negnz negz nop nr'
		    + ' org  rcl rcr rdbyte rdlong rdword res ret rev rol ror sar shl shr sub subabs subs'
		    + ' subsx subx sumc sumnc sumnz sumz test tjnz tjz true vcfg vscl wc wr wrbyte wrlong'
		    + ' wrword wz	xor'
	    //allWords: [this.operators, this.sectionHeaders, this.dataTypes, this.spinKeywords, this.commonKeywords, this.pasmKeywords].join(' ')
}
var identifiers = new RegExp("^[_:A-Za-z][_A-Za-z0-9]*");
var singleOperators = qsRegExp(lex.singleOperators);
var doubleOperators = qmRegExp(lex.doubleOperators);
var tripleOperators = qmRegExp(lex.tripleOperators);
var wordOperators = qwRegExp(lex.wordOperators);
var sectionHeaders = qwRegExp(lex.sectionHeaders);
var spinKeywords = qwRegExp(lex.spinKeywords, lex.commonKeywords, lex.dataTypes);
var spinErrors = qwRegExp(lex.pasmKeywords);
var pasmKeywords = qwRegExp(lex.pasmKeywords, lex.commonKeywords, lex.dataTypes, 'and or');
var pasmErrors = qwRegExp(lex.spinKeywords);
var keywords = spinKeywords;
var errors = spinErrors;

// tokenizers
function tokenLexer(stream, state) {
	var matched;
	if (stream.match(/^\{\{/)) {
		state.superComment++;
		return 'doccomment';
	}
	if (stream.match(/^\}\}/)) {
		if (state.superComment) {
			state.superComment--;
			return 'doccomment';
		} else {
			return 'error';
		}
	}
	if (state.superComment) {
		if (state.bold) {
			if (stream.match(/^\W/)) {
				state.bold = false;
				return 'doccomment'
			} else {
				stream.next();
				return 'boldcomment'
			}
		}
		if (stream.match(/^`/)) {
			state.bold = true;
		} else {
			stream.next();
		}
		return 'doccomment';
	}
	if (stream.match(/^\{/)) {
		state.nestedComment++;
		return 'codecomment';
	}
	if (stream.match(/^\}/)) {
		if (state.nestedComment) {
			state.nestedComment--;
			return 'codecomment';
		} else {
			return 'error';
		}
	}
	if (state.nestedComment) {
		stream.next();
		return 'codecomment';
	}
	if (stream.match(/^"/)) {
		if (!(stream.skipTo('"') && stream.next())) {
			stream.skipToEnd();
		}
		return 'string';
	}
	if (stream.match(/^''/)) {
		stream.skipToEnd();
			return 'doccomment';
	}
	if (stream.match(/^'/)) {
		stream.skipToEnd();
			return 'codecomment';
	}
	if (stream.match(sectionHeaders, false)) {
		var sol = stream.sol();
		matched = stream.match(sectionHeaders);
		if (!sol) {
			state.section = 'none';
			return 'error';
		}
		state.section = matched[0].toLowerCase();
		return 'keyword';
	}
	if (state.section === 'dat') {
		if (stream.match(/^\$(?=(\W|$))/i))	return 'keyword';
		keywords = pasmKeywords; errors = pasmErrors;
	} else {
		keywords = spinKeywords; errors = spinErrors;
	}
	if (stream.match(keywords)) {
		return 'keyword';
	}
	if (stream.match(errors)) {
		return 'error';
        }
	if (stream.match(wordOperators)) {
		return 'operator';
	}
        if (stream.match(/^[+-\.]*[$%\d]/, false)) {
	    stream.match(/^[+-]?\d[\d_]*(\.\d[\d_]*(e[\+\-]?\d[\d_]*)?)?/i) 
	    	    || stream.match(/^[+-]?\$[\da-f][\da-f_]*/i)
	    	    || stream.match(/^[+-]?%[01][01_]*/)
	    	    || stream.match(/^[+-]?%%[0-3][0-3_]*/)
		if (stream.match(/^,+/)) {
                   // this ensures that , is not returned as a number or error.
                } else if (stream.match(/^[\da-f$%\._]+/)) {
                    return 'error';
                } else {
                    return 'number';
                }
			}
			if (stream.match(tripleOperators) || stream.match(doubleOperators) || stream.match(singleOperators)) {
				return 'operator';
			}
			stream.match(identifiers) || stream.next(); 
			return 'normal';
		}
		
	return {
		startState: function(base) {
		return {
		  nestedComment: 0,
		  superComment: 0,
		  bold: false,
		  section: 'none'
	  };
	},
			
	token: function(stream, state) {
		if (stream.eatSpace()) state.bold = false;
		var type = tokenLexer(stream, state);
		if (state.section != 'none') {
			return type;
		} else if (type.match(/comment/)) {
			return 'none' + type;
		} else {
			return 'error';
		}
	},
		
	fold: "indent"	
};
});

CodeMirror.defineMIME("text/x-spin", "spin");
