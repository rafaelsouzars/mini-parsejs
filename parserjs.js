/*
	MINI PARSER JS
	
	Description: Mini analisador léxico em Javascript puro
	Versão: 1.1.0
	Author: Rafael Souza
	Github: https://github.com/rafaelsouzars/mini-parsejs.git
*/
const GRAMMAR = {
  // Palavras reservadas
  "reserved_words": [
    "const",
    "function",
    "if",
    "else",
    "while",
    "do",
    "switch",
    "case",
    "var",
    "class",
    "extends",
    "abstract",
    "static",
	"return",
	"try",
	"catch",
	"finally"
  ],
  // Numeros
  "numbers": [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9
  ],
  "operators": {
	"op_atr": "=",
    "op_adc": "+",
    "op_sub": "-",
    "op_mul": "*",
    "op_div": "/",
	"op_equ": "==",
    "op_maj": ">",
    "op_min": "<",	
	"op_mje": ">=",
	"op_mne": "<=",
	"op_nte": "!=",
	"op_not": "!",
  },
  // Delimitadores
  "delimiters": {
    "left_parent": "\(",
    "right_parent": "\)",
    "left_square": "\[",
    "right_square": "\]",
    "left_curly": "\{",
    "right_curly": "\}",
    "comma": ",",
    "dot": ".",
    "colon": ":",
    "semicolon": ";",
    "quotation": "\"",
	"white_space": " "
	/*"empty": ""*/
  }
}

/*for(const [key, value] of Object.entries(GRAMMAR)){
  console.log(key, value)
}*/

const inputString = "function test() { if (a==b!=c<=d) {return a+2.88} }"; // Código de entrada
const lexers = []; // Array para armazenar lexemas
const numbers = Object.entries(
						GRAMMAR['numbers']
					).map(
						(v,i) => {
							return v[1]
						}
					);
const delimiters = Object.entries(
						GRAMMAR['delimiters']
					).map(
						(v,i) => {
							return v[1]
						}
					);

const operators = Object.entries(
						GRAMMAR['operators']
					).map(
						(v,i) => {
							return v[1]
						}
					);

let token = [];
let charBuffer = new String();

// Itera os caracteres do código de entrada
for (const [id,char] of Object.entries(inputString)) {//isNaN(Number(char))
  // Verifica se o caracter é alfabético
  if (/[a-zA-Z]/gm.test(char)) {	  
	// Se o buffer não contém nenhuma palavra reservada então continua-se adicionando caracteres
	if (!GRAMMAR['reserved_words'].includes(charBuffer)&&!operators.includes(char)&&!delimiters.includes(char)&&!/\s/.test(char)) {
		// Verifica se o buffer contem um literal_number para inserir no array de lexemas
		if (!isNaN(Number(charBuffer))&&charBuffer.length>0) {				
			lexers.push(charBuffer)
			charBuffer = ''
		}		
		charBuffer += char		
	} 
	else if (GRAMMAR['reserved_words'].includes(charBuffer)) {
		// 
		lexers.push(charBuffer)			
		charBuffer = ''	
	} 	
  }
  else if (/^[\)\(\{\}\[\]\.\:\;\,\s\=\+\-\*\%\|\!\<\>\\]/gm.test(char)) {	
	
	if (operators.includes(char)||delimiters.includes(char)||/\s/.test(char)&&!'') {				
		if (/\./.test(char)&&isNaN(Number(lexers[lexers.length-1]))) {
			lexers.push(charBuffer)
			//lexers.push(char)
			charBuffer = ''	
			lexers[lexers.length-1] += char
			//console.log("dot: ", char, " lexer-1: ", lexers[lexers.length-1])
		}
		else if (/\=/.test(char)&&/^[\=\>\<\!]/.test(lexers[lexers.length-1])) {
			lexers[lexers.length-1] += char
		}
		else {
			lexers.push(charBuffer)		
			lexers.push(char)
			charBuffer = ''	
		}		
	} 
  }  
  else if (/^[0-9]/gm.test(char)) { 		
		// Verifica se o caracter é numeral		
		if (numbers.includes(Number(char))&&!operators.includes(char)&&!delimiters.includes(char)&&!/\s/.test(char)&&!''){
			// Verifica se o buffer contem uma palavra reservada ou identificador para inserir no array de lexemas
			if (isNaN(Number(charBuffer))&&charBuffer.length>0) {				
				lexers.push(charBuffer)
				charBuffer = ''
			}			
			// Testa se o ultimo elemento do array de lexemas é um literal_number
			if (!isNaN(Number(lexers[lexers.length-1]))&&/\./gm.test(lexers[lexers.length-1])) {
				lexers[lexers.length-1] += char
				//console.log("float: ", lexers[lexers.length-1])				
			} 
			else {
				charBuffer += char
			}
			//lexers.push(char)
		} 		
		else if(/\s/.test(char)) {			
			if (charBuffer.length>0) {				
				lexers.push(charBuffer)
				charBuffer = ''				
			}		
		}		
  }  
}

tokens = lexers.filter(
			whiteSpace => {
				return (whiteSpace!=" "&&whiteSpace!="")
			}
		).map(
			(lexer,index) => {
			  if(GRAMMAR['reserved_words'].includes(lexer)){
				//return {'reserved_word': v}
				return JSON.parse(`{"rw_${lexer}" : "${lexer}"}`)
			  } else if(delimiters.includes(lexer)){
						return {"delimiter": lexer}
			  } else if (operators.includes(lexer)){
						let token
						Object.entries(GRAMMAR['operators']).forEach(([key,value])=>{
							if(lexer==value) token = key
						  })
						return JSON.parse(`{"${token}" : "${lexer}"}`)
			  } else if(/^\d/.test(Number(lexer))){
						return {"literal_number": lexer}
			  } else {
				return {"identifier": lexer}
			  }
			}
);

// Entrada
console.log("Input: ", inputString)
// Lexemas
console.log("Lexers: ", lexers)
// Saída
console.log("Output: ", tokens)