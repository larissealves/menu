# Fluxo de proteção das ações CRUD

Foi adicionado um fluxo de proteção para as ações de **CRUD** (criar, editar e remover) utilizando uma chave de administrador.

## Variável de ambiente

Adicionar a seguinte variável de ambiente no Node:

```env
ADMIN_KEY=
```

A `ADMIN_KEY` deve ser configurada no ambiente do backend e **não deve ser adicionada às variáveis do Vite (`VITE_*`)**.

## Fluxo de autorização

1. O usuário precisa informar a **chave de administrador** na tela de **Settings**;
2. O Frontend envia a chave informada junto à requisição para o Node;
3. O Node recebe a chave e compara com a chave cadastrada na variável de ambiente `ADMIN_KEY`;
4. Se as chaves forem iguais, a ação de CRUD é autorizada;
5. Caso contrário, o endpoint retorna um erro de autorização e a ação não é executada;

## Referência de implementação

Para mais detalhes sobre a implementação, seguir o fluxo existente de **adicionar, editar e remover Category**.

Componentes envolvidos:

* `cliente/src/componentes/BtnDeleteCategory`
* `cliente/src/componentes/AddCategory`
* `cliente/src/componentes/ListCategories`


#adicionado fluxo para proteger as ações de crud.

#adicionado nas variáveis de ambiente a key: 
#ADMIN_KEY=

#O endpoint usuário precisa informar a chave de admin natela de settings 

#o front envia para o node que verifica a chave recebida com a cadastrada na variável de ambiente(ADMIN_KEY).

#Para mais detalhes, siga o fluxo de => adicionar, editar e remover Category.

#cliente/src/componentes: 
#> BtnDeleteCategory
#> AddCategory
#> ListCategories