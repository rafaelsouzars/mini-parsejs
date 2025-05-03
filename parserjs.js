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
  "keywords": [
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
	"++",
	"--",
	"=>",
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
				
const inputCode = `let func = (s)=>{return "hello world"}` // Código de entrada
const lexers = [] // Array para armazenar lexemas

// Variáveis globais
let token = []
let charBuffer = new String() // Buffer de caracteres
let readLiteralState = false // Flag para indicar leitura de literal
let readCommentState = false

// Itera os caracteres do código de entrada
for (const [key, character] of Object.entries(inputCode)) {
    
	charBuffer += character	
	// Testa os caracteres alfabéticos
	if (/^[a-zA-Z]/.test(charBuffer)) {
	  if (LEXERS['keywords'].includes(charBuffer)&&!readLiteralState) {
			lexers.push(charBuffer)			
			charBuffer = ''	
	  }
	}

	if (/^[\)\(\{\}\[\]\:\;\,\@\#\$\?\s\n\t\=\+\-\*\%\|\!\<\>\`\"\'\/\\]/gm.test(charBuffer[charBuffer.length-1])) {
	  // Testa os operadores e delimitadores
	  if (/^[\s]/gm.test(charBuffer[charBuffer.length-1])) {
		if (!readLiteralState) {
			lexers.push(charBuffer.substring(0,charBuffer.length-1))
			charBuffer = ''
		}		
	  }
	  // Testa o caractere 'igual' para analisar se é uma igualdade ou atribuição
	  else if (/\=/.test(charBuffer[charBuffer.length-1])&&/^[\=\>\<\!\+\-]/.test(lexers[lexers.length-1])) {			
			  lexers[lexers.length-1] += charBuffer[charBuffer.length-1]
			  charBuffer = ''
		  }
		  // Testa os sinais de indremento e decremento
	  else if ((/\+/.test(charBuffer[charBuffer.length-1])&&/\+/.test(lexers[lexers.length-1]))||(/\-/.test(charBuffer[charBuffer.length-1])&&/\-/.test(lexers[lexers.length-1]))) {			
			  lexers[lexers.length-1] += charBuffer[charBuffer.length-1]
			  charBuffer = ''
		  }
		  // Testa o sinal arrow
	  else if (/\>/.test(charBuffer[charBuffer.length-1])&&/\=/.test(lexers[lexers.length-1])) {			
			  lexers[lexers.length-1] += charBuffer[charBuffer.length-1]
			  charBuffer = ''
		  }
		  // Testa os caracteres de aspas para identificar e armazenar uma constante literal
		  else if (/^[\"\'\``]/.test(charBuffer[charBuffer.length-1])) {
			if (!readLiteralState) {
				if (charBuffer.length > 1) {
					lexers.push(charBuffer.substring(0,charBuffer.length-1).trim())
					lexers.push(charBuffer[charBuffer.length-1])
					charBuffer = ''
				}
				else {
				  lexers.push(charBuffer[charBuffer.length-1])
					charBuffer = ''
				}
				readLiteralState = !readLiteralState // Muda estado da flag para true			
			}
			else {
				if (charBuffer.length > 0) {
					lexers[lexers.length-1] += charBuffer
					charBuffer = ''
				}
				else {
				  lexers[lexers.length-1] += charBuffer
					charBuffer = ''
				}
				readLiteralState = !readLiteralState
			}
			
		  }
		  // Testa o delimitador de comentario
		else if (/\/\//gm.test(charBuffer)) {	
			charBuffer = ''
			readCommentState = !readCommentState
			console.log(readCommentState)
		}
		// Testa se o caracter de nova linha para encerra o comentario de uma linha
		else if (/\n/.test(charBuffer[charBuffer.length-1])) {
		  if (readCommentState) {
			readCommentState = !readCommentState
			console.log(readCommentState)
		  }
		}
		
	  else if (/[\(\)\{\}\[\]\:\;\,\@\#\$\?\s\t\%\|\\\+\-\<\>\*\!\=]/.test(charBuffer[charBuffer.length-1])) {
		lexers.push(charBuffer.substring(0,charBuffer.length-1))
		lexers.push(charBuffer[charBuffer.length-1])
		charBuffer = ''
	  }
	  
	}
	// Testa os caracteres numéricos (obs: futuramente haverá uma nova implementação)
	if (/^[0-9]/gm.test(charBuffer)) {
	  /*if (/^[-+]?\d+(\.\d+)?$/.test(charBuffer)) {
		
	  }*/
	}
	//Testa o final do inputCode
	if ((Object.entries(inputCode).length-1==key)) {
	  if (charBuffer.length>0) {
		lexers.push(charBuffer)
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
        						if(LEXERS['keywords'].includes(lexer)){				
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
        						else if (/^[\"{,2}]|^[\'{,2}]|^[\`{,2}]/.test(lexer)) {
        							return {"literal": lexer}  
        						}
        						// Gera o token para identificadores
        						else {
        							return {"id": lexer}
        						}
        					}
        				);
console.log('saida')
// Entrada
console.log("Input: ", inputCode)
// Lexemas
console.log("Lexers: ", lexers)
// Saída
console.log("Output: ", tokens)