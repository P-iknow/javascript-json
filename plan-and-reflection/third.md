# 세번째 기획

## Tokenizer 

### 문자열 하나씩 검사하는 방법으로 변경

- 문자열을 하나씩 검사한다 
  - 문자열을 split("")로 쪼개 배열로 변환하여 고차함수를 사용하는 로직을 시도해볼 수 있다.
  - for of 의 경우 문자열도 실행할 수 있으므로 배열로 만들지 않아도 되는 상황이면 for of 를 활용해도 된다. 
  - 기존 정규식을 활용한 로직을 변경한다.

```js
let tempStr = "";
let inQuote = false;
const makeToken = (tokens, char, index, arrOfChar) {
  // quote 를 만나면 inQuote 의 값을 뒤바꿈
  if(isQuote(char)){
    toggle(inQuote);
  }
  
  // quote가 열려있으면 sperator 와 무관하게 char를 임시 문자열에 더함 
  if(isInQuote) {
    tempStr += char;
    return tokens
  }
  if(isSeperator(char)) {
    tempStr = "";
    return [...tokens, char];
  }
  // 다음 문자열이 sperator 면 char를 더함
  if(isSpearator(nextChar)) {
    tempStr += char;
    return [...tokens, tempStr.trim()]
    
  }
}

const tokenize = (str) => {
  return str.split("").reduce(makeToken, [])
}
```



### Token 정의

- `[` : startOfArray
- `]` : endOfArray 
- `,` : comma
- `:` : colon
- `{` : startOfObject
- `}`: endOfObject
- `'` : singleQuote
- `"` : doubleQuote
- "`string`": str

- `0-9` : num
- 그 외: char

## Lexer

- 기존에 없었던 객체 관련 타입에 대해서 정의 내려야 함
- "{ " , "}" , " : "

```js
makeLexedToken(lexedTokens, token, index, tokens ) {
  
	if(tokens[i+1=== :]) return new Node({key: "key"})
	if(isOpenBraket()) return new Node({type: "Array"})
	... 나머지 로직 동일
  
}
tokensQue.reduce(makeLexedToken, [])
```



### Lexer Type

- Array -> `[`
- EndArray -> `]`
- Object -> `{`
- EndObject  -> `}`
- String → `"` + `Characters` + `"`
- Number → `consequtive digits`   | `NaN` | `Infinity`
- Boolean → `true|false`
- Null → `null`

## Parser 

0bject value를 어떻게 표현할 것인가?

```js
{
  type: object,
  child: [
    {
			key: "",
    	type: "",
      value: 
    }
  ]

}
```

