 =================== BACK END =========================

- instalar: dotenv-cli

- criar arquivos no .env  no root da aplicação 

.env.development
.env.production
.env.test (n usado) 
.env.exemple 

Incluir todos excerto .env.exemplo no .gitignore

- para cada arquivo incluir suas variaveis de ambiente. Neste caso:

.env.development e .env.exemple:
    DATABASE_URL = 'postgresql://..'
    
    API_SECRET = valor-da_sua_apikey

.env.production e .env.test (n usado)

    DATABASE_URL = ''

No package.json do root é necessário informar qual .env deve ser acessado quando o DB ou a aplicão for executada.

 "scripts": {
    "dev": "dotenv -e .env.development -- node server/index.js",
    "start": "dotenv -e .env.production -- node server/index.js",

    "postinstall": "prisma generate",
    "prisma:generate": "prisma generate",
    "prisma:migrate:dev": "dotenv -e .env.development -- prisma migrate deploy",
    "prisma:migrate:test": "dotenv -e .env.development -- prisma migrate deploy",
    "prisma:migrate:production": "dotenv -e .env.production -- prisma migrate deploy",
    "prisma:studio:dev": "dotenv -e .env.development -- prisma studio"
  },

ao rodar `npm run dev` o script  "dev" ira acessar  o .env.development e disponibilizar as  variaveis de ambiente deste arquivo via process.env.NOME_DA_VARIAVEL.


o mesmo para os outros comandos de DB e executar aplicação.

Para acessar as variaveis criadas use: process.env.NOME_DA_VARIAVEL
exemplo: process.env.API_SECRET


=================== FRONT END /client =========================

Nenhum fluxo adicionado

Criar file .env dentro da raiz da pasta /client

para acessar via vite: import.meta.env.VITE_API_URL

Variaveis do arquivo:
    VITE_API_URL=http://localhost:5000

    VITE_API_SECRET=