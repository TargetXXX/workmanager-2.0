# WORKMANAGER - Gerenciador de Tarefas Dinâmico

## Visão Geral

O Workmanager é um robusto sistema de gerenciamento de tarefas que oferece recursos abrangentes, incluindo atribuição de tarefas, controle de tempo, comentários, status, gerenciamento de usuários e permissões, e muito mais. Este repositório contém o código-fonte do Workmanager, composto por um backend em Laravel e um frontend em React TypeScript.

## Como Iniciar

Você pode iniciar o Workmanager de duas maneiras: usando o Laravel e o React TypeScript localmente ou executando-o em containers Docker.

### Iniciar Localmente (Laravel e React TypeScript)

Para iniciar o Workmanager localmente sem Docker, siga estas etapas:

#### Configuração do Backend (Laravel)

1. Clone este projeto em seu ambiente de desenvolvimento.
2. Dentro da pasta do Laravel, encontre o arquivo ".env" e configure o banco de dados desejado.
3. No terminal, navegue até o diretório do Laravel e execute o comando `php artisan migrate` para criar as tabelas necessárias no banco de dados.
4. Inicie o servidor REST com o comando `php artisan serve`.

#### Configuração do Frontend (React TypeScript)

1. No diretório do React, execute o comando `npm install` para instalar as dependências necessárias.
2. Inicie a aplicação com o comando `npm start`.

### Iniciar com Docker

Se preferir, você pode usar Docker para iniciar o Workmanager com facilidade. Siga estas etapas:

1. Certifique-se de ter o Docker instalado em seu sistema.

2. Copie os seguintes arquivos de configuração Docker para a raiz do seu projeto:

   - `laravel.Dockerfile` (para o backend Laravel)
   - `react-front.Dockerfile` (para o frontend React TypeScript)
   - `docker-compose.yml` (para orquestração)

3. Execute o seguinte comando na raiz do projeto para iniciar os containers Docker:

   ```
   docker-compose up -d
   ```

   Isso iniciará os containers do Laravel, React TypeScript e um container de banco de dados MySQL.

4. O Workmanager estará acessível através das portas configuradas no Docker Compose (por padrão, 8000 para Laravel e 3000 para React TypeScript).

### Acesso ao Site

Após seguir essas etapas, você pode acessar o Workmanager através do seu navegador. Para criar um usuário com permissões de administrador, você pode usar uma ferramenta como o Insomnia para adicionar manualmente um usuário através da rota "http://localhost:PORTA/api/register" com os seguintes parâmetros padrões:

```json
{
    "username": "teste",
    "email": "teste@teste.com",
    "password": "a123@",
    "name": "Teste Tester",
    "group": "10",
    "password_confirmation": "a123@"
}
```

## Backend em Laravel

O backend é construído com Laravel e fornece uma API REST robusta para gerenciar todas as operações do site. Ele segue a arquitetura MVC (Model-View-Controller) e possui uma estrutura organizada:

- Rotas estão agrupadas sob "API" e têm seus respectivos Controllers, Services, Models e Requests para cada tipo de requisição.

## Frontend em React TypeScript

O frontend é desenvolvido em React com TypeScript e utiliza uma abordagem de componentização para melhorar a dinâmica e a estilização do ambiente. Cada tela possui seus próprios componentes e estilos exclusivos para oferecer uma experiência de usuário consistente e intuitiva.

## Créditos

Este projeto foi desenvolvido por Eduardo Oliveira. Para mais informações ou suporte, entre em contato através do número de WhatsApp: +55 (44) 998549700.
