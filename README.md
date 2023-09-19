# WORKMANAGER - Gerenciador de Tarefas Dinâmico

## Visão Geral

O Workmanager é um robusto sistema de gerenciamento de tarefas que oferece recursos abrangentes, incluindo atribuição de tarefas, controle de tempo, comentários, status, gerenciamento de usuários e permissões, e muito mais. Este repositório contém o código-fonte do Workmanager, composto por um backend em Laravel e um frontend em React TypeScript.

## Como Iniciar

Você pode iniciar o Workmanager de duas maneiras: usando o Laravel e o React TypeScript localmente ou executando-o em containers Docker.

### Iniciar com Docker

Se preferir, você pode usar Docker para iniciar o Workmanager com facilidade. Siga estas etapas:

1. Certifique-se de ter o Docker instalado em seu sistema.

2. Execute o seguinte comando na raiz do projeto para iniciar os containers Docker:

   ```
   docker-compose up -d
   ```
3. Execute os seguintes comando na raiz do backend dentro do container Docker recém criado:
   ```
   php artisan migrate:fresh
   ```
   ```
   php artisan db:seed
   ```
   
4. 
   Caso o erro "You must enable the openssl extension in your php.ini" ocorra, utilize o comando:
   ```
      Vá até seu php.ini e remova ";" do extension=curl e do extension=openssl.
   ```
   Isso iniciará os containers do Laravel, React TypeScript e um container de banco de dados MySQL.

4. O Workmanager estará acessível através das portas configuradas no Docker Compose (por padrão, 8000 para Laravel e 3000 para React TypeScript).

### (OPCIONAL) Iniciar Localmente (Laravel e React TypeScript) - SEM DOCKER

Para iniciar o Workmanager localmente sem Docker, siga estas etapas:

#### Configuração do Backend (Laravel)

1. Clone este projeto em seu ambiente de desenvolvimento.
2. Dentro da pasta do Laravel, encontre o arquivo ".env" e configure o banco de dados desejado.
3. No terminal, procure o diretório do Laravel e execute `composer install` para instalar as dependências.
4. No terminal, navegue até o diretório do Laravel e execute o comando `php artisan migrate` para criar as tabelas necessárias no banco de dados.
5. No terminal, também no diretório do Laravel execute o comando `php artisan db:seed` para criar o usuário padrão no banco.
6. Inicie o servidor REST com o comando `php artisan serve`.

#### Configuração do Frontend (React TypeScript)

1. No diretório do React, execute o comando `npm install` para instalar as dependências necessárias.
2. Inicie a aplicação com o comando `npm start`.

### Acesso ao Site

Após seguir essas etapas, você pode acessar o Workmanager através do seu navegador. Ao acessar o site de acordo com as portas aplicadas, logue usando o usuário ADMIN padrão:

```
username: teste
senha: 123
```

## Backend em Laravel

O backend é construído com Laravel e fornece uma API REST robusta para gerenciar todas as operações do site. Ele segue a arquitetura MVC (Model-View-Controller) e possui uma estrutura organizada:

- Rotas estão agrupadas sob "API" e têm seus respectivos Controllers, Services, Models e Requests para cada tipo de requisição.

## Frontend em React TypeScript

O frontend é desenvolvido em React com TypeScript e utiliza uma abordagem de componentização para melhorar a dinâmica e a estilização do ambiente. Cada tela possui seus próprios componentes e estilos exclusivos para oferecer uma experiência de usuário consistente e intuitiva.

## Créditos

Este projeto foi desenvolvido por Eduardo Oliveira. Para mais informações ou suporte, entre em contato através do número de WhatsApp: +55 (44) 998549700.
