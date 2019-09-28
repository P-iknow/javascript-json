# JSON Parser 프로젝트 개요
### 어떤 프로젝트 인가? 

- JSON 문자열을 분석하고, 이를 객체 형태로 구조화 한다.

### 어떤 기술을 사용했는가?

- Javascript

### 프로젝트를 통해 무엇을 배웠는가? 

- Stack, Queue 자료구조 
- 재귀 함수의 활용
- 파싱과정에 대한 이해
- 복잡한 문제를 여러개의 객체와 함수로 나누고, 이를 연결지어 프로그래밍 하기

### 요구사항

- 배열안에 object 내부에 object 또 그 내부에 배열 등 여러 자료형이 자유롭게 포함될 수 있다.

```js
const object = {
  key: [
    '1a3',
    [null, false, ['11', [112233], 112], 55, '99'],
    33,
    true,
    {
      key: {
        key: 'value'
      }
    }
  ]
};

```

- 무한중첩 구조도 동작하게 한다. [[[[[{},[{}]]]]]]
- hint : 중첩문제를 풀기 위해 stack구조를 활용해서 구현할 수도 있다.
- 올바른 문자열이 아닌 경우 오류를 발생한다. (아래 실행결과 참고)

```js
var s = "['1a3',[null,false,['11',[112233],112],55, '99'],33, true]";
var result = ArrayParser(str);
console.log(JSON.stringify(result, null, 2)); 

var s = "['1a'3',[22,23,[11,[112233],112],55],33]";  //'1a'3'은 올바른 문자열이 아닙니다.
 var result = ArrayParser(str);
 ==>  //'1a'3'은 올바른 문자열이 아닙니다.

 var s = "['1a3',[22,23,[11,[112233],112],55],3d3]";  // 3d3은 알수 없는 타입입니다
var result = ArrayParser(str);
 ==> // 3d3은 알수 없는 타입입니다
   
var s = "['1a3',[null,false,['11',112,'99'], {a:'str', b:[912,[5656,33]]}, true]";
var result = ArrayParser(str);
//정상출력

var s = "['1a3',[null,false,['11',112,'99' , {a:'str', b:[912,[5656,33]]}, true]";
var result = ArrayParser(str);
// 정상적으로 종료되지 않은 배열이 있습니다.

var s = "['1a3',[null,false,['11',112,'99'], {a:'str', b: [912,[5656,33]], true]";
var result = ArrayParser(str);
// 정상적으로 종료되지 않은 객체가 있습니다.

var s = "['1a3',[null,false,['11',112,'99'], {a:'str', b  [912,[5656,33]]}, true]";
var result = ArrayParser(str);
// ':'이 누락된 객체표현이 있습니다.

이외 오류상황을 최대한 탐지해서 오류내용과 함께 발생시킨다.
```



# 프로젝트 진행중 기록

## 1차 기획

![image](https://user-images.githubusercontent.com/35516239/57186723-8e163480-6f1f-11e9-9b3f-c94a25637ffa.png)

- 솔직하게 설계라기 보다 [이미 만들어져 있는 코드(Super tiny Compiler)](https://the-super-tiny-compiler.glitch.me/parser)를 돌아가도록 변경했다. 
- 해당 코드는 컴파일러를 이해시키기 위해 설계된 코드 였으며 array parser도 비슷하겠지 하며 따라만들었다.
- 위에 있는 설계는 해당 코드를 직접 활용해본뒤 파악한 사후약방문이다.
- 솔직하게 고백하면 어떻게 해야될지 몰라서 일단은 코드를 가져와 돌아가게 만든 것이었다.
- 깃헙에 스타가 많이 박혔으니 일단 비슷하게 따라하면 중간이라도 갈 것이라는 어리석은 생각을 했다.
- tokenizer, lexer, parser, stack, queue, 재귀, dfs 등의 배경지식이 있었으나 이해할 수 없어 몸소 경험해보고자 설계 없이 코드 작성을 시작했다.

## 크롱 피드백 

- 함수사이즈가 커서 하나의 함수가 하는일이 너무 많다
- 함수 이름 이를태면 walk 라는 이름이 너무 추상적이다. 
- 반복이 많다. 반복을 줄이고 함수를 만들어 코드의 크기를 줄일 수 없는가 고민하자.
- 전반적으로 타인이 해당 코드를 파악하기 어려운 구조이며, 나뉘지 않아 디버깅이 어려운 코드이다.
- typechek 를 별도로 분리한 것은 좋았다 -> 분리하자!!

## 크롱 피드백에 대한 나의 피드백 

- 설계 없이 대충 붙여 만든 코드이니 코드의 의도가 분명하지 않고, 추상적인게 당연했다
- 꼼수 부리지말고 제대로 해보자

## 리펙토링 

### tokenizer

```javascript
const tokenizer = (input) => {
    input = _deleteFirstLastBraket(input);
    let index = 0;
    const tokens = [];
    while (index < input.length) {
      let char = input[index];

      if (tc.isWhiteSpace(char) || tc.isComma(char)) {
        index++;
        continue;
      }
      
      //TODO STPE 6-2  
      if (tc.isQuote(char)) {
        let value = '';
        char = input[++index];
        while (!tc.isQuote(char)) {
          value += char;
          char = input[++index];
        }
        char = input[++index];
        tokens.push({ type: 'string', value });
        continue;
      }
  
    return tokens;
  }
```

#### while 과 input[index++]  함수나누기

- `while` 문 하위에 인덱스를 추가하면서`index++ ` , `input[index++]`, `input[++index]` 를 함수로 분리하기가 너무 어려웠다. 

- while 문을 대체하기 위한 방법으로는 for, map, filter, reduce 등이 있으나 이는 연속된 string을 체크를 위해 중간에 조건 체크와 인덱스를 조절하는 `index++` 같은 로직을 잘 활용하기 어려워 패스했다. 

- 남은 경우의 수는 while 문과 재귀함수를 사용하는 것이었다. 여기서 핵심은 어떤 함수든 input 변수와, index 변수에 접근 가능해야 한다는 것이었다. 그래서 해당 변수를 상단으로 끌어올려 모두가 참조가능하도록 했다. (스코프는 최대한 줄이는게 좋은데 다른 운영에 방해가 되지 않도록, 이런 상황에서는 어쩔 수 없었다.)

- 모듈로 감싸져서 전역으로 선언한 변수들이 자유변수화 되기 때문에 위에 우려한 부분은 큰 문제가 될거라고 생각하지 않는데 이 부분은 질문이 필요하다. 

- 위의 while 문으로 전개되는 tokenize 작업은 하위의 에러체크가 불가능하다. 

- ```js
  var s = "['1a'3',[22,23,[11,[112233],112],55],33]";  //'1a'3'은 올바른 문자열이 아닙니다.
   var result = ArrayParser(str);
   ==>  //'1a'3'은 올바른 문자열이 아닙니다. 
   ===> // 'la'3' la를 쪼갠뒤에  3을 넘버로 취급하고, 그 다음 문자열의 끝을 찾아서 함수가 무한반복된다
  
  ```

### lex 추가

- parser 와 tokenizer 가 lex의 기능을 분담하여 가지고 있었기에 새로운 lex 함수를 만들어서 token을 의미있게 나누는 작업을 했다.
- lex 함수가 있다면 tokenize 에서 굳이 type 을 판단하지 않아도 되지만 tokenize 함수 로직상 일부 구분할 수 있는 type이 있어 lex 함수에서는 이미 있는 type을 점검하고 이외에 나머지 type(null, undefined, boolean)에 관한 처리를 추가했다.

### parser 리펙토링

```js
 const parse = (parentNode, lexedQueue) => {
    const node = lexedQueue.shift();
    if(node.type === "End") {
        return parentNode;
    }
    if(node.type === "Array"){
        let childeNode = node;
        parentNode.child.push(parse(childeNode, lexedQueue));
        return parse(parentNode, lexedQueue)
    }
    parentNode.child.push(node);
    return parse(parentNode, lexedQueue)
}
```

- 파서함수의 기본설계는 allen의 코드를 참고해서 기존 walk 함수가 들었이는 parser 대비 코드를 경량화 할 수 있었다.
- 재귀함수를 사용하여 while 문 사용을 줄일 수 있었는데, 좋은 방법인지는 확신이 안선다. 판단을 위해서는 알고리즘과 자료구조에 대한 공부가 더 이루어져야 할 거 같다. 

## 설계 안한 것의 후폭풍

- 설계를 하지 않고 마구 코드를 작성해서 하루 10시간동안 해당 코드 함수화하는데 시간을 썻다. 
- 의도를 분명히하자. 막 짜지말고 해당 코드에 명확한 의도가 드러나야 한다. 코드를 짯다면 그렇게 설계한 의도가 있어야 한다. 그리펙토링할 때도 분명하게 타인의 도움을 받을 수 있다.
- 설계하자. 설계하고 하나씩만 수정하자. 한번에 다량의 수정은 독이된다. 문제파악에 시간을 쓰게되고 악순환의 연속이 시작된다. 어제 참으로 고통스러웠다. 

## 2차 기획

### Tokenizer 

- 현재 while 문으로 전개되는 tokenize 작업은 하위의 에러체크가 불가능하다. 

- split "," 함수를 써서 구별하는 법이 있으나, [ ], {}, 등은 ",'' 로 구분하기 힘들다.

- 정규표현식과 JS 의 정규식 객체 내장 메소드를 활용하여 tokenizer를 다시 만들어보자 

  - 정규식 공부가 필요하다 
  - 정규식 공부와 더불어 js regex 객체의 메소드에 대한 공부도 필요하다

- ```js
  var s = "['1a'3',[22,23,[11,[112233],112],55],33]";  //'1a'3'은 올바른 문자열이 아닙니다.
   var result = ArrayParser(str);
   ==>  //'1a'3'은 올바른 문자열이 아닙니다. 
   ===> // 'la'3' la를 쪼갠뒤에  3을 넘버로 취급하고, 그 다음 문자열의 끝을 찾아서 함수가 무한반복된다
  
  ```

- 정규식으로 구현하면 기존의 token type을 붙여줄 수 없다. 때문에 type 에 대한 처리는 온전히 lex 함수가 맡게 된다.

### lexer 함수

- tokenizer는 타입에 관여하지 않고 오로지 토큰화를 진행하므로 타입에 대한 처리는 lex 함수가 맡게 된다.
- 각 토큰을 인식하여 해당 토근의 type을 뱉어줄 수 있는 형태로 lex 함수의 수정이 필요하다.
- 기존의 typeChecker를 수정하여 재활용하자. lex함수가 이용하던 tokenTypeCheck 함수는 필요없게 될 수 있다.

### parse 함수

- 왜 `lexedtokens.shift()`가 `parse` 로직 밖으로 나왔는가? 코드의 의도가 분명치 않다
- 해당 부분을 고치기 위해 rootnode를 뽑아내는 로직을 parse 함수 안으로 집어넣을 필요가 있겠다
  - 그러기 위해 애초에 Array라는 루트노드를 만들어두고
  - 가장 처음과 마지막의 open, close braket 을 제외하고 tokenize 함수를 구현하는 거다.

```js
const arrayParser = (input) => {
    const lexedtokens = tokenize(input).map(v => lex(v))
    const rootNode = lexedtokens.shift(); // 왜 lexedtokens.shift가 parse 로직 밖으로 나왔는가?
    parse(rootNode, lexedtokens); 
    return rootNode;
}
```

## 3차 기획 

###  Tokenizer 

#### 문자열 하나씩 검사하는 방법으로 변경

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

#### Token 정의

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

### Lexer

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

#### Lexer Type

- Array -> `[`
- EndArray -> `]`
- Object -> `{`
- EndObject  -> `}`
- String → `"` + `Characters` + `"`
- Number → `consequtive digits`   | `NaN` | `Infinity`
- Boolean → `true|false`
- Null → `null`

### Parser 

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



