var apiKey = 'edb750e27ca7364872a545bcff0eb493';
//let apiKey;
let requestToken: number;
let username: string;
let password: string;
let sessionId: string;
let listId = '7101979';

let loginButton = document.getElementById('login-button') as HTMLButtonElement;
let searchButton = document.getElementById('search-button') as HTMLElement;
let searchContainer = document.getElementById('search-container');


console.log('vai testar login');
loginButton.addEventListener('click', async () => {
    console.log('clicou!!!!!');
    await criarRequestToken();
    await logar();
    await criarSessao();
    })

//if (searchButton) {
    searchButton.addEventListener('click', async () => {
      console.log('entrou no search');
    let lista = document.getElementById("lista");
    if (lista) {
        lista.outerHTML = "";
    }
    let pesquisa:any;
    pesquisa = document.getElementById('search') as HTMLInputElement;
    let query:string = pesquisa.value;
    console.log('conteudo da query ',query);
    let listaDeFilmes:any = await procurarFilme(query);
    let ul = document.createElement('ul');
    ul.id = "lista"
    for (const item of listaDeFilmes.results) {
        let li = document.createElement('li');
        li.appendChild(document.createTextNode(item.original_title))
        ul.appendChild(li)
    }
    console.log(listaDeFilmes);
    if (searchContainer) {
       searchContainer.appendChild(ul);
    }
    })
//}

function preencherSenha() {
  let linhaSenha =  document.getElementById('senha') as HTMLInputElement;
  password = linhaSenha.value ;
  validateLoginButton();
}

function preencherLogin() {
    console.log('preencherLogin');
    let linhaLogin = document.getElementById('login') as HTMLInputElement;
  username =  linhaLogin.value;
  validateLoginButton();
}

function preencherApi() {
    console.log("preenchendo API ");
  let linhaApi =  document.getElementById('api-key') as HTMLInputElement; 
  apiKey = linhaApi.value;
  console.log('a API é ',apiKey);
  validateLoginButton();
}

function validateLoginButton() {
  if (password && username && apiKey) {
    loginButton.disabled = false;
  } else {
    loginButton.disabled = true;
  }
}



class HttpClient {
  static async get({url='', method='', body = null}): Promise<unknown> {
    console.log('estou na classe http');
     return new Promise((resolve, reject) => {
      console.log('e cheguei aquiiii!');
      let request = new XMLHttpRequest();
      request.open(method, url, true);

      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(JSON.parse(request.responseText));
        } else {
          reject({
            status: request.status,
            statusText: request.statusText
          })
        }
      }
      request.onerror = () => {
        reject({
          status: request.status,
          statusText: request.statusText
        })
      }

      if (body) {
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        var body2 = JSON.stringify(body);
        request.send(body2);
      }
      
    })
  }
}

async function procurarFilme(query:string) {
   console.log("procura filme"); 
  query = encodeURI(query)
  console.log(query);
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
    method: "GET"
  })
  console.log('resultado ',result);
  return result
}

async function adicionarFilme(filmeId:string) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`,
    method: "GET"
  })
  console.log(result);
}

async function criarRequestToken () {
    console.log("criarRequestToken");
    let url:string = `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`;
    let method: string = "GET";
    let body:any = null;
  let result: any = await HttpClient.get({url, method, body
//    url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
 //   method: "GET"
  })
  requestToken = result.request_token
  console.log("token ",requestToken);
}

async function logar() {
    console.log("logando");
    let  body:any = {
        username: `${username}`,
        password: `${password}`,
        request_token: `${requestToken}`
        }
  await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
    method: "POST",
    body
  })
}

async function criarSessao() {
    console.log("criarSessao");
  let result:any = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
    method: "GET"
  })
  sessionId = result.session_id;
  console.log("sessão ",sessionId);
}

async function criarLista(nomeDaLista:string, descricao:string) {
    let  body:any = {
        name: nomeDaLista,
        description: descricao,
        language: "pt-br"
      }
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body
  })
  console.log(result);
}

async function adicionarFilmeNaLista(filmeId:string, listaId:string) {
   let body:any = {
    media_id: filmeId
   } 
   let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body
  })
  console.log(result);
}

async function pegarLista() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
    method: "GET"
  })
  console.log(result);
}

