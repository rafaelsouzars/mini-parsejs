/*
	MINI PARSER JS
	
	Description: Mini analisador léxico em Javascript puro
	Versão: 1.1.0
	Author: Rafael Souza
	Github: https://github.com/rafaelsouzars/mini-parsejs.git
*/
const LEXERS = {
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
	"let",
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

/*for(const [key, value] of Object.entries(LEXERS)){
  console.log(key, value)
}*/

// Constantes globais
const numbers = Object.entries(
						LEXERS['numbers']
					).map(
						(v,i) => {
							return v[1]
						}
					);
const delimiters = Object.entries(
						LEXERS['delimiters']
					).map(
						(v,i) => {
							return v[1]
						}
					);

const operators = Object.entries(
						LEXERS['operators']
					).map(
						(v,i) => {
							return v[1]
						}
					);
					
const inputString = `let str == "ola"function test(){if(2.2==2.2){return true}}`; // Código de entrada
const lexers = []; // Array para armazenar lexemas

// Variáveis globais
let token = [];
let charBuffer = new String();
let readLiteralState = false; //console.log('Initial state: ', readLiteralState)

// Itera os caracteres do código de entrada
for (const [id,char] of Object.entries(inputString)) {//isNaN(Number(char))
  // Verifica se o caracter é alfabético
  if (/[a-zA-Z]/gm.test(char)) {	  
	// Se o buffer não contém nenhuma palavra reservada então continua-se adicionando caracteres
	if (!LEXERS['reserved_words'].includes(charBuffer)&&!readLiteralState) {
		// Verifica se o buffer contem um number para inserir no array de lexemas
		if (!isNaN(Number(charBuffer))&&charBuffer.length>0) {				
			lexers.push(charBuffer)
			charBuffer = ''
		}		
		charBuffer += char		
	}		
	else if (LEXERS['reserved_words'].includes(charBuffer)&&!readLiteralState) {
		// 
		lexers.push(charBuffer)			
		charBuffer = ''	
	}
	else if (readLiteralState) {
		lexers[lexers.length-1] += char
	} 	
  }
  else if (/^[\)\(\{\}\[\]\.\:\;\,\s\=\+\-\*\%\|\!\<\>\"\'\\]/gm.test(char)) {	
	//console.log(charBuffer)
	if (/\./.test(char)) {//
		lexers.push(charBuffer)
		charBuffer = ''
		if (!isNaN(Number(lexers[lexers.length-1]))) {			
			//console.log("dot: ", char, " lexer-1: ", lexers[lexers.length-1])
			lexers[lexers.length-1] += char
		}
		
	}
	else if (/\=/.test(char)&&/^[\=\>\<\!]/.test(lexers[lexers.length-1])) {
		lexers[lexers.length-1] += char
	}
	else if (/^[\"\']/.test(char)) {
		if (!readLiteralState) {			
			lexers.push(charBuffer)		
			lexers.push(char)
			charBuffer = ''
			readLiteralState = !readLiteralState
			//console.log('Read state: ', readLiteralState)
		}
		else {
			lexers[lexers.length-1] += char			
			readLiteralState = !readLiteralState
		}
		
	}
	else {
		lexers.push(charBuffer)		
		lexers.push(char)
		charBuffer = ''
	}
		 
  }  
  else if (/^[0-9]/gm.test(char)) { 		
		// Verifica se o caracter é numeral		
		if (numbers.includes(Number(char))){
			// Verifica se o buffer contem uma palavra reservada ou identificador para inserir no array de lexemas
						
			// Testa se o ultimo elemento do array de lexemas é um literal_number
			if (!isNaN(Number(lexers[lexers.length-1]))&&/\./gm.test(lexers[lexers.length-1])) {
				lexers[lexers.length-1] += char
				//console.log("float: ", lexers[lexers.length-1])				
			} else {
				charBuffer += char
				//lexers.push(char)
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
			  if(LEXERS['reserved_words'].includes(lexer)){
				//return {'reserved_word': v}
				//return JSON.parse(`{"rw_${lexer}" : "${lexer}"}`)
				return JSON.parse(`{"${lexer}" : "${lexer}"}`)
			  } 
			  else if(delimiters.includes(lexer)){
				return {"delimiter": lexer}
			  } 
			  else if (operators.includes(lexer)){
				let token
				Object.entries(LEXERS['operators']).forEach(([key,value])=>{
					if(lexer==value) token = key
				  })
				return JSON.parse(`{ "${lexer}" : "${lexer}"}`)
			  } 
			  else if(/^\d/.test(Number(lexer))){
				return {"number": lexer}
			  }
			  else if (/[\"{,2}]|[\'{,2}]/.test(lexer)) {
				return {"literal": lexer}  
			  }
			  else {
				return {"id": lexer}
			  }
			}
);

// Entrada
console.log("Input: ", inputString)
// Lexemas
console.log("Lexers: ", lexers)
// Saída
console.log("Output: ", tokens)