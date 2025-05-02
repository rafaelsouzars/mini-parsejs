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
  "operators": [
	"=",
	"+",
	"-",
	"*",
	"/",
	"==",
	">",
	"<",	
	">=",
	"<=",
	"!=",
	"!",
	"===",
	"+=",
	"-=",
	"@",
	"?",
	"#",
	"$",
  ],
  // Delimitadores
  "delimiters": [
	"\(",
	"\)",
	"\[",
	"\]",
	"\{",
	"\}",
	",",
	".",
	":",
	";",
	"\"",
	"\'",
	"/",
	"/*",
	"*/",
	"\/\/",
	"`",
	" ",
	"\n"
	/*"empty": ""*/
  ]
}
					
const inputCode = `function teste () {return \$\`{teste}\`}` // Código de entrada
const lexers = [] // Array para armazenar lexemas

// Variáveis globais
let token = []
let charBuffer = new String() // Buffer de caracteres
let readLiteralState = false // Flag para indicar leitura de literal
let readCommentState = false

// Funções
function lexSearchList(obj, searchBuffer) {
	return obj.map(
				(ele, idx) => {
						if (ele.indexOf(searchBuffer, 0)==0) {
							//console.log('ele: ', ele , ' substring: ' ,ele.substring(0, charBuffer.length) , ' index: ', ele.substring(0, charBuffer.length).indexOf(charBuffer, 0))
							return ele
						}
					}).filter(
						(arr) => {
							//console.log('arr: ',arr)
							return (arr!=undefined)
						}) 
}

// Itera os caracteres do código de entrada
for (const [index,character] of Object.entries(inputCode)) {
	
	// Testa os caracteres alfabéticos
	if (/[a-zA-Z]/gm.test(character)) {		  
		// Se o buffer não contém nenhuma palavra reservada então continua-se adicionando caracteres
		if (!LEXERS['reserved_words'].includes(charBuffer)) {
			//	
			charBuffer += character
			//console.log(lexSearchList(LEXERS['reserve_words'], charBuffer))		
		}		
		else if (LEXERS['reserved_words'].includes(charBuffer)&&!readLiteralState) {
			//		
			lexers.push(charBuffer)			
			charBuffer = ''	
		}			
	}
	  
	// Testa os operadores e delimitadores
	if (/^[\)\(\{\}\[\]\.\:\;\,\@\#\$\?\s\n\t\=\+\-\*\%\|\!\<\>\`\"\'\/\\]/gm.test(character)) {	
		// Testa o caractere '.' para analisar se faz parte de um numero real		
		if (/\./.test(character)) {//
			lexers.push(charBuffer)
			charBuffer = ''
			if (!isNaN(Number(lexers[lexers.length-1]))) {			
				lexers[lexers.length-1] += character
			}			
		}
		// Testa o caractere 'igual' para analisar se é uma igualdade ou atribuição
		else if (/\=/.test(character)&&/^[\=\>\<\!\+\-]/.test(lexers[lexers.length-1])) {			
			lexers[lexers.length-1] += character			
		}
		// Testa o caractere 'igual' para analisar se é uma igualdade ou atribuição
		else if (((/\//.test(character)||/\*/.test(character))&&/\//.test(lexers[lexers.length-1]))||(/\//.test(character)&&/\*/.test(lexers[lexers.length-1]))) {			
			lexers[lexers.length-1] += character
			if (lexers[lexers.length-1]=="\/\/") {
				readCommentState = !readCommentState
				console.log(readCommentState)
			}			
		}		
		// Testa os caracteres de aspas para identificar e armazenar uma constante literal
		else if (/^[\"\']/.test(character)) {
			if (!readLiteralState) {
				if (charBuffer.length > 0) {
					lexers.push(charBuffer)
					charBuffer = ''
				}					
				lexers.push(character)			
				readLiteralState = !readLiteralState			
			}
			else {
				//lexers[lexers.length-1] += character
				charBuffer += character
				lexers[lexers.length-1] += charBuffer
				charBuffer = ''
				readLiteralState = !readLiteralState
			}
			
		}
		// Testa um espaço em branco e adiciona regras para armazenamento e limpeza do buffer de leitura
		else if(/\s/.test(character)) {		
			if (readLiteralState) {
				//lexers[lexers.length-1] += character
				charBuffer += character
			}
			else {
				if (charBuffer.length > 0) {
					lexers.push(charBuffer)
					charBuffer = ''
				}			
			}				
		}
		// Testa se não é uma nova linha ou tabulação
		else if (!/^[\n\t]/.test(character)&&character!=='') {		
			if (charBuffer.length > 0) {
				lexers.push(charBuffer)
				charBuffer = ''				
			}		
			lexers.push(character)
			//readCommentState = !readCommentState
			//console.log(readCommentState)
		}
		
	}
	  
	// Testa os caracteres numericos
	if (/^[0-9]/gm.test(character)) { 		
		// Verifica se o caracter é numeral		
		if (LEXERS['numbers'].includes(Number(character))) {						
			// Testa se o ultimo elemento do array de lexemas é um number
			if (!isNaN(Number(lexers[lexers.length-1]))&&/\./gm.test(lexers[lexers.length-1])) {
				lexers[lexers.length-1] += character							
			} else {
				charBuffer += character	
				//console.log('number session 1: ', charBuffer)
			}		
		}
		else {
			//console.log('number session 2: ', charBuffer)
		} 				
	}
	// Testa o final do inputCode
	if (Object.entries(inputCode).length-1==index)  {
		if (charBuffer!=''&&charBuffer!=' ') {
			lexers.push(charBuffer)
			charBuffer = ''
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
						else if(LEXERS['delimiters'].includes(lexer)||LEXERS['operators'].includes(lexer)){
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
console.log("Input: ", inputCode)
// Lexemas
console.log("Lexers: ", lexers)
// Saída
console.log("Output: ", tokens)