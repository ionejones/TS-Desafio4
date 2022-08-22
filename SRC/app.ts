
let apiKey: string;
let requestToken: string;
let username: string;
let password: string;
let sessionId: string;
let listId = '7101979';

let loginButton = document.getElementById('login-button') as HTMLButtonElement;
let searchButton = document.getElementById('search-button') as HTMLButtonElement;
let searchContainer = document.getElementById('search-container');

loginButton.addEventListener('click', async () => {
  await criarRequestToken();
  await logar();
  await criarSessao();
})

searchButton.addEventListener('click', async () => {
  let lista = document.getElementById("lista");
  if (lista) {
    lista.outerHTML = "";
  }
  let linhaQuery = document.getElementById('search') as HTMLInputElement;
  let query = linhaQuery.value;
  let listaDeFilmes = await procurarFilme(query);
  let ul = document.createElement('ul');
  ul.id = "lista";
  for (const item of listaDeFilmes.results) {
    let li = document.createElement('li');
    console.log(item.original_title);
    li.appendChild(document.createTextNode(item.original_title));
    ul.appendChild(li);
  }
  console.log('adicionando '+listaDeFilmes);
 // let searchContainer = document.createElement('div');
  let searchContainer = document.getElementById('listaDosFilmes');
  searchContainer?.appendChild(ul);
})

function preencherSenha() {
  let linhaPassword = document.getElementById('senha') as HTMLInputElement;
  password = linhaPassword.value;
  validateLoginButton();
}

function preencherLogin() {
  let linhaUsername =  document.getElementById('login') as HTMLInputElement;
  username =  linhaUsername.value;
  validateLoginButton();
}

function preencherApi() {
  let linhaApiKey = document.getElementById('api-key') as HTMLInputElement;
  apiKey = linhaApiKey.value;
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
  static async get({url, method, body}:any) : Promise<any> {
    return new Promise((resolve, reject) => {
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
        body = JSON.stringify(body);
      }
      request.send(body);
    })
  }
}

async function procurarFilme(query:string) {
  query = encodeURI(query)
  console.log(query)
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
    method: "GET"
  })
  return result
}

// async function adicionarFilme(filmeId) {
//   let result = await HttpClient.get({
//     url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`,
//     method: "GET"
//   })
//   console.log(result);
// }

async function criarRequestToken () {
  console.log('criar request token');
  let url:string = `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`;
  let method: string =  "GET";
  let body: string = '';
  let result = await HttpClient.get({
    url ,
    method,
    body
  })
  requestToken = result.request_token
  console.log('T O K E N  :  '+requestToken);
}

async function logar() {
  console.log('logando usuario '+username+' password '+password+' token '+requestToken);
  await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
    method: "POST",
    body: {
      username: `${username}`,
      password: `${password}`,
      request_token: `${requestToken}`
    }
  })
}

async function criarSessao() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
    method: "GET",
    body: null
  })
  sessionId = result.session_id;
  console.log('criarSessao '+sessionId);
}

// async function criarLista(nomeDaLista, descricao) {
//   let result = await HttpClient.get({
//     url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
//     method: "POST",
//     body: {
//       name: nomeDaLista,
//       description: descricao,
//       language: "pt-br"
//     }
//   })
//   console.log(result);
// }

// async function adicionarFilmeNaLista(filmeId, listaId) {
//   let result = await HttpClient.get({
//     url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
//     method: "POST",
//     body: {
//       media_id: filmeId
//     }
//   })
//   console.log(result);
// }

// async function pegarLista() {
//   let result = await HttpClient.get({
//     url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
//     method: "GET"
//   })
//   console.log(result);
// }

// { <div style="display: flex;">
//   <div style="display: flex; width: 300px; height: 100px; justify-content: space-between; flex-direction: column;">
//       <input id="login" placeholder="Login" onchange="preencherLogin(event)">
//       <input id="senha" placeholder="Senha" type="password" onchange="preencherSenha(event)">
//       <input id="api-key" placeholder="Api Key" onchange="preencherApi()">
//       <button id="login-button" disabled>Login</button>
//   </div>
//   <div id="search-container" style="margin-left: 20px">
//       <input id="search" placeholder="Escreva...">
//       <button id="search-button">Pesquisar Filme</button>
//   </div>
// </div>}
// Footer