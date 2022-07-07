"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var apiKey = 'edb750e27ca7364872a545bcff0eb493';
//let apiKey;
let requestToken;
let username;
let password;
let sessionId;
let listId = '7101979';
let loginButton = document.getElementById('login-button');
let searchButton = document.getElementById('search-button');
let searchContainer = document.getElementById('search-container');
console.log('vai testar login');
loginButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('clicou!!!!!');
    yield criarRequestToken();
    yield logar();
    yield criarSessao();
}));
//if (searchButton) {
searchButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('entrou no search');
    let lista = document.getElementById("lista");
    if (lista) {
        lista.outerHTML = "";
    }
    let pesquisa;
    pesquisa = document.getElementById('search');
    let query = pesquisa.value;
    console.log('conteudo da query ', query);
    let listaDeFilmes = yield procurarFilme(query);
    let ul = document.createElement('ul');
    ul.id = "lista";
    for (const item of listaDeFilmes.results) {
        let li = document.createElement('li');
        li.appendChild(document.createTextNode(item.original_title));
        ul.appendChild(li);
    }
    console.log(listaDeFilmes);
    if (searchContainer) {
        searchContainer.appendChild(ul);
    }
}));
//}
function preencherSenha() {
    let linhaSenha = document.getElementById('senha');
    password = linhaSenha.value;
    validateLoginButton();
}
function preencherLogin() {
    console.log('preencherLogin');
    let linhaLogin = document.getElementById('login');
    username = linhaLogin.value;
    validateLoginButton();
}
function preencherApi() {
    console.log("preenchendo API ");
    let linhaApi = document.getElementById('api-key');
    apiKey = linhaApi.value;
    console.log('a API é ', apiKey);
    validateLoginButton();
}
function validateLoginButton() {
    if (password && username && apiKey) {
        loginButton.disabled = false;
    }
    else {
        loginButton.disabled = true;
    }
}
class HttpClient {
    static get({ url = '', method = '', body = null }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('estou na classe http');
            return new Promise((resolve, reject) => {
                console.log('e cheguei aquiiii!');
                let request = new XMLHttpRequest();
                request.open(method, url, true);
                request.onload = () => {
                    if (request.status >= 200 && request.status < 300) {
                        resolve(JSON.parse(request.responseText));
                    }
                    else {
                        reject({
                            status: request.status,
                            statusText: request.statusText
                        });
                    }
                };
                request.onerror = () => {
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });
                };
                if (body) {
                    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    var body2 = JSON.stringify(body);
                    request.send(body2);
                }
            });
        });
    }
}
function procurarFilme(query) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("procura filme");
        query = encodeURI(query);
        console.log(query);
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
            method: "GET"
        });
        console.log('resultado ', result);
        return result;
    });
}
function adicionarFilme(filmeId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`,
            method: "GET"
        });
        console.log(result);
    });
}
function criarRequestToken() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("criarRequestToken");
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
            method: "GET"
        });
        requestToken = result.request_token;
        console.log("token ", requestToken);
    });
}
function logar() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("logando");
        let body = {
            username: `${username}`,
            password: `${password}`,
            request_token: `${requestToken}`
        };
        yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
            method: "POST",
            body
        });
    });
}
function criarSessao() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("criarSessao");
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
            method: "GET"
        });
        sessionId = result.session_id;
        console.log("sessão ", sessionId);
    });
}
function criarLista(nomeDaLista, descricao) {
    return __awaiter(this, void 0, void 0, function* () {
        let body = {
            name: nomeDaLista,
            description: descricao,
            language: "pt-br"
        };
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
            method: "POST",
            body
        });
        console.log(result);
    });
}
function adicionarFilmeNaLista(filmeId, listaId) {
    return __awaiter(this, void 0, void 0, function* () {
        let body = {
            media_id: filmeId
        };
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
            method: "POST",
            body
        });
        console.log(result);
    });
}
function pegarLista() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
            method: "GET"
        });
        console.log(result);
    });
}
