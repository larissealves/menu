# Checklist — Preparando uma aplicação para Deploy

## 1. Defina a estrutura da aplicação

Antes de começar o deploy, tenha clareza sobre quais partes a aplicação possui:

* Frontend
* Backend / API
* Banco de dados
* Testes
* Configurações
* Outros serviços, se houver

Exemplo:

```text
project/
├── application/   # Backend / API
├── client/        # Frontend
├── database/      # Schema e queries
├── config/        # Configurações e conexão
├── tests/
└── package.json
```

A organização inicial faz diferença principalmente quando a aplicação será colocada em containers Docker.

---

## 2. Saiba como executar cada parte

Para cada pacote/aplicação, saiba exatamente qual comando inicia o projeto.

Exemplo:

```bash
# Backend
npm run dev

# Frontend
npm run dev

# Testes
npm test
```

Também é importante saber qual comando será utilizado no ambiente de produção.

Exemplo:

```bash
npm start
```

---

## 3. Organize as dependências

Tenha clareza sobre **quais dependências pertencem a cada parte da aplicação**.

### Raiz

Dependências utilizadas pelo projeto como um todo:

```text
concurrently
jest
```

### Backend

Dependências necessárias para executar a API:

```text
express
cors
pg
pg-connection-string
```

### Frontend

Dependências necessárias para executar o React:

```text
react
react-dom
vite
...
```

A ideia é evitar ter dependências espalhadas sem saber a qual parte da aplicação pertencem.

---

## 4. Decida onde cada responsabilidade ficará

Existem diferentes formas de organizar o backend.

### Tudo dentro do backend

```text
application/
├── routes/
├── controllers/
├── database/
│   ├── config/
│   ├── queries/
│   └── schema/
└── ...
```

### Backend e banco separados

```text
application/
├── routes/
├── controllers/
└── ...

database/
├── queries/
└── schema/

config/
└── pgConnection.js
```

As duas abordagens podem funcionar.

**O importante é entender as dependências entre elas.**

---

## 5. Atenção aos paths

Esse é um dos pontos mais importantes para Docker e deploy.

Se o backend depende de arquivos que estão fora da própria pasta:

```text
project/
├── application/
├── database/
└── config/
```

o backend depende de:

```text
application → database
application → config
```

Portanto, o Docker precisa conseguir acessar essas pastas durante o `build`.

Por exemplo:

```dockerfile
COPY application/ ./application/
COPY config/ ./config/
COPY database/ ./database/
```

Nesse caso, o **build context precisa ser a raiz do projeto**, e não somente `application/`.

Exemplo:

```bash
docker build -f application/Dockerfile -t minha-api .
```

O `.` representa a raiz do projeto.

---

## 6. Docker depende da organização do projeto

Antes de criar uma imagem Docker, verifique:

* Onde está o `package.json`?
* Onde está o código que será executado?
* Quais pastas o código importa?
* Quais dependências precisam estar instaladas?
* Qual é o `WORKDIR`?
* Qual arquivo inicia a aplicação?
* Qual porta a aplicação utiliza?
* Quais variáveis de ambiente são necessárias?

O Docker precisa reproduzir os paths necessários para que os imports continuem funcionando.

---

## 7. Tenha scripts na raiz

Quando existem várias partes na aplicação, é útil ter um `package.json` na raiz para centralizar os comandos.

Exemplo:

```json
{
  "scripts": {
    "app": "npm run dev --prefix application",
    "client": "npm run dev --prefix client",
    "dev": "concurrently \"npm run app\" \"npm run client\""
  }
}
```

Assim, em vez de entrar manualmente em cada pasta, você pode executar a aplicação a partir da raiz:

```bash
npm run dev
```

Isso também ajuda a deixar o projeto mais fácil de entender para outra pessoa.

---

## 8. Variáveis de ambiente

Nunca dependa de valores sensíveis diretamente no código.

Exemplo:

```env
DATABASE_URL=...
```

Use arquivos separados para cada ambiente:

```text
.env.example
.env.development
.env.production
```

O `.env.example` pode ser versionado, enquanto os arquivos com credenciais reais devem ficar fora do Git.

---

## 9. Antes do deploy, faça um checklist

### Estrutura

* [ ] Sei quais são as partes da aplicação.
* [ ] Sei onde está o frontend.
* [ ] Sei onde está o backend.
* [ ] Sei onde estão as queries/configurações do banco.
* [ ] Sei quais pastas dependem umas das outras.

### Dependências

* [ ] Sei quais dependências pertencem ao frontend.
* [ ] Sei quais pertencem ao backend.
* [ ] Sei quais são utilizadas globalmente.
* [ ] Os `package.json` estão configurados corretamente.

### Execução

* [ ] Sei como executar o frontend.
* [ ] Sei como executar o backend.
* [ ] Tenho um comando para produção.
* [ ] Consigo executar a aplicação a partir da raiz.

### Docker

* [ ] Sei qual é o `Dockerfile`.
* [ ] Sei qual é o build context.
* [ ] Os `COPY` possuem os paths corretos.
* [ ] O container consegue encontrar todas as dependências.
* [ ] A porta está corretamente exposta.
* [ ] A aplicação escuta em `0.0.0.0` quando necessário.
* [ ] As variáveis de ambiente são fornecidas ao container.

### Deploy

* [ ] A aplicação funciona fora do meu ambiente local.
* [ ] As variáveis de ambiente de produção estão configuradas.
* [ ] O comando de start funciona.
* [ ] O caminho utilizado pelo deploy está correto.
* [ ] Testei a aplicação depois da implantação.

---

# Regra principal

**Antes de fazer o deploy, consiga responder estas perguntas:**

> O que compõe minha aplicação?

> Como cada parte é executada?

> Quais dependências cada parte possui?

> Quais arquivos cada parte precisa acessar?

> Quais são os paths desses arquivos?

> Qual comando inicia a aplicação?

> Quais variáveis de ambiente ela precisa?

Se essas respostas estiverem claras, Docker e deploy ficam muito mais previsíveis.

---

# 📝 Minha nota original

<!--
dicas para deixar a aplicação pronta para deploy:

definir quais pacotes a aplicação terá: front, back etc.

para cada pacote, conhecer o comando para executá-lo

ter noção das dependências usadas na aplicação e deixá-las rastreadas

ex.: backend: as dependências com banco estão todas no mesmo pacote ou o database está em outro local.

ex.: ./backend/database: configs, conexão e queries
ou soltos:
./backend
./database infos

para criação de imagens Docker, a organização faz diferença.

para deploy, é necessário saber o path para executar os pacotes. Indico no root deixar um package.json com os scripts para start.

A separação pode ficar assim:

Raiz

Ferramentas que trabalham com o projeto inteiro:

concurrently
jest
application

Dependências necessárias para executar a API:

express
cors
pg
pg-connection-string
client

Dependências necessárias para executar o React:

react
react-dom
vite
...

O backend fica responsável por:

application/
├── API
├── banco
├── controllers
├── routes
└── ...

------------------------

O ponto importante

Seu backend depende de coisas fora de application:
-->
