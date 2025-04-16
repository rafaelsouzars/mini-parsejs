const GRAMMAR = {
  // Palavras reservadas
  "reserved_words": [
    "const",
    "func",
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
    "static"
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
    "op_adc": "+",
    "op_sub": "-",
    "op_mul": "*",
    "op_div": "/",
    "op_equ": "=",
    "op_max": ">",
    "op_min": "<",
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
    "quotation": "\""
  }
}

/*for(const [key, value] of Object.entries(GRAMMAR)){
  console.log(key, value)
}*/

const str = "if(a=b){return 69}";
const lexers = [];
const delimiters = Object.entries(GRAMMAR['delimiters']).map((v,i)=>{
    return v[1]
  });

const operators = Object.entries(GRAMMAR['operators']).map((v,i)=>{
    return v[1]
  });

var token = [];
var wordBuffer = new String();

// Itera cada um dos caracteres da string
for(const [id,char] of Object.entries(str)){
  // Verifica se não é numero, delimitador ou operador
  if(isNaN(char)&&!delimiters.includes(char)&&!operators.includes(char)){
    if(!GRAMMAR['reserved_words'].includes(wordBuffer)){
      // Se o buffer não contém nenhuma palavra reservada continua adicionando caracteres
      wordBuffer += char
    }
  }
  else if(isNaN(char)&&!delimiters.includes(char)&&!operators.includes(char)){
    
  }
  else{
    lexers.push(wordBuffer)
    wordBuffer = ''
    lexers.push(char)
  }
}

tokens = lexers.filter(l=>{return (l!=" "&&l!="")}).map((v,i) => {
  if(GRAMMAR['reserved_words'].includes(v)){
    //return {'reserved_word': v}
    return JSON.parse(`{"rw_${v}" : "${v}"}`)
  } else if(delimiters.includes(v)){
    return {"delimiter": v}
  } else if (operators.includes(v)){
    let tk
    Object.entries(GRAMMAR['operators']).forEach(([key,value])=>{
        if(v==value) tk = key
      })
    return JSON.parse(`{"${tk}" : "${v}"}`)
  } else if(GRAMMAR['numbers'].includes(parseInt(v))){
    return {"number": v}
  } else {
    return {"identifier": v}
  }
});

// Entrada
console.log("Input: ", str)
// Lexemas
console.log('Lexers', lexers)
// Saída
console.log("Output: ", tokens)