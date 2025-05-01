/*
	MINI PARSER JS
	
	Description: Mini analisador léxico em Javascript puro
	Versão: 1.1.0
	Author: Rafael Souza
	Github: https://github.com/rafaelsouzars/mini-parsejs.git
*/

// Lexemas
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
	"finally",
	"true",
	"false",
	"array"
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
	"white_space": " ",
	"new_line": "\n"
	/*"empty": ""*/
  }
}

// Array constantes globais para manipulação dos lexemas
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
					
const inputString = `let array arr = []
arr = {0,1,2,3,4}` // Código de entrada
const lexers = [] // Array para armazenar lexemas

// Variáveis globais
let token = []
let charBuffer = new String() // Buffer de caracteres
let readLiteralState = false // Flag para indicar leitura de literal

// Itera os caracteres do código de entrada
for (const [id,char] of Object.entries(inputString)) {
	
	// Testa os caracteres alfabéticos
	if (/[a-zA-Z]/gm.test(char)) {		  
		// Se o buffer não contém nenhuma palavra reservada então continua-se adicionando caracteres
		if (!LEXERS['reserved_words'].includes(charBuffer)&&!readLiteralState) {
			//	
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
	  
	// Testa os operadores e delimitadores
	else if (/^[\)\(\{\}\[\]\.\:\;\,\s\n\t\=\+\-\*\%\|\!\<\>\"\'\\]/gm.test(char)) {	
		// Testa o caractere '.' para analisar se faz parte de um numero real	
		if (/\./.test(char)) {//
			lexers.push(charBuffer)
			charBuffer = ''
			if (!isNaN(Number(lexers[lexers.length-1]))) {			
				lexers[lexers.length-1] += char
			}			
		}
		// Testa o caractere 'igual' para analisar se é uma igualdade ou atribuição
		else if (/\=/.test(char)&&/^[\=\>\<\!]/.test(lexers[lexers.length-1])) {
			lexers[lexers.length-1] += char
		}
		// Testa os caracteres de aspas para identificar e armazenar uma constante literal
		else if (/^[\"\']/.test(char)) {
			if (!readLiteralState) {
				if (charBuffer.length > 0) {
					lexers.push(charBuffer)
					charBuffer = ''
				}					
				lexers.push(char)			
				readLiteralState = !readLiteralState			
			}
			else {
				lexers[lexers.length-1] += char			
				readLiteralState = !readLiteralState
			}
			
		}
		// Testa um espaço em branco e adiciona regras para armazenamento e limpeza do buffer de leitura
		else if(/\s/.test(char)) {		
			if (readLiteralState) {
				lexers[lexers.length-1] += char
			}
			else {
				if (charBuffer.length > 0) {
					lexers.push(charBuffer)
					charBuffer = ''
				}			
			}				
		}
		// Testa se não é uma nova linha ou tabulação
		else if (!/^[\n\t]/.test(char)&&char!==''){		
			if (charBuffer.length > 0) {
				lexers.push(charBuffer)
				charBuffer = ''
			}		
			lexers.push(char)
		}		 
	}
	  
	// Testa os caracteres numericos
	else if (/^[0-9]/gm.test(char)) { 		
		// Verifica se o caracter é numeral		
		if (numbers.includes(Number(char))){						
			// Testa se o ultimo elemento do array de lexemas é um number
			if (!isNaN(Number(lexers[lexers.length-1]))&&/\./gm.test(lexers[lexers.length-1])) {
				lexers[lexers.length-1] += char							
			} else {
				charBuffer += char
				//lexers.push(char)
			}		
		}				
	}	

}

// Filtra e mapea o array de lexemas e gera o array de tokens
tokens = lexers.filter(
				ignoreChars => {
					return (ignoreChars!=" "&&ignoreChars!=""&&ignoreChars!="\n"&&ignoreChars!="\t")
				}
			).map(
					(lexer,index) => {
						// Gera o token para palavras reservadas
						if(LEXERS['reserved_words'].includes(lexer)){				
							return JSON.parse(`{"${lexer}": "${lexer}"}`)
						}
						// Gera o token para delimitadores
						else if(delimiters.includes(lexer)||operators.includes(lexer)){
							return JSON.parse(`{"${lexer}": "${lexer}"}`)
						}
						// Gera o token para numeros
						else if(/^\d/.test(Number(lexer))){
							return {"number": lexer}
						}
						// Gera o token para tipo literal
						else if (/^[\"{,2}]|^[\'{,2}]/.test(lexer)) {
							return {"literal": lexer}  
						}
						// Gera o token para identificadores
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