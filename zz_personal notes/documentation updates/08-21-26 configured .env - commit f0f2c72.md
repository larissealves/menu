# ==== BACK END ====
* Instalar: `dotenv-cli`

* Criar os seguintes arquivos `.env` na raiz da aplicação:

```text
.env.development
.env.production
.env.test (não usado)
.env.example
```

Incluir todos, **exceto `.env.example`**, no `.gitignore`.

* Para cada arquivo, incluir suas respectivas variáveis de ambiente. Neste caso:

`.env.development` e `.env.example`:

```env
DATABASE_URL='postgresql://..'

API_SECRET=valor-da-sua-apikey
```

`.env.production` e `.env.test` (não usado):

```env
DATABASE_URL=''
```

No `package.json` da raiz é necessário informar qual arquivo `.env` deve ser acessado quando o banco de dados ou a aplicação for executada.

```json
"scripts": {
  "dev": "dotenv -e .env.development -- node server/index.js",
  "start": "dotenv -e .env.production -- node server/index.js",

  "postinstall": "prisma generate",
  "prisma:generate": "prisma generate",
  "prisma:migrate:dev": "dotenv -e .env.development -- prisma migrate deploy",
  "prisma:migrate:test": "dotenv -e .env.development -- prisma migrate deploy",
  "prisma:migrate:production": "dotenv -e .env.production -- prisma migrate deploy",
  "prisma:studio:dev": "dotenv -e .env.development -- prisma studio"
}
```

Ao rodar `npm run dev`, o script `"dev"` irá acessar o `.env.development` e disponibilizar as variáveis de ambiente desse arquivo via `process.env.NOME_DA_VARIAVEL`.

O mesmo se aplica aos outros comandos relacionados ao banco de dados e à execução da aplicação.

Para acessar as variáveis criadas, use:

```js
process.env.NOME_DA_VARIAVEL
```

Exemplo:

```js
process.env.API_SECRET
```

---

# === FRONT END /client ===

Nenhum fluxo de autenticação foi adicionado.

Criar o arquivo `.env` dentro da raiz da pasta `/client`.

Para acessar as variáveis via Vite:

```js
import.meta.env.VITE_API_URL
```

Variáveis do arquivo:

```env
VITE_API_URL=http://localhost:5000

VITE_API_SECRET=
```
