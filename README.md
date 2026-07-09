# Dicionário da Língua Brasileira de Sinais (Libras) - Engenharia de Requisitos

Este documento consolida a análise, modelagem e arquitetura do sistema para a plataforma do Dicionário de Libras. O projeto foi desenvolvido como parte da disciplina de Análise e Modelagem de Sistemas da Universidade do Estado de Santa Catarina (UDESC), elaborado por Matheus Bertin e Theo Katzer.

## 1. Perfis e Histórias de Usuário - THEO

Este tópico mapeia os quatro principais atores do sistema: o Visitante (que realiza consultas), o Colaborador (que submete novos sinais), o Curador (que avalia as submissões) e o Administrador (que gerencia acessos e dados). As histórias de usuário detalham as necessidades e objetivos específicos de cada um desses perfis na plataforma.

## 2. Requisitos Funcionais (RF) - THEO

Esta seção lista as funcionalidades essenciais que o software deve executar. Ela abrange desde a consulta e tradução pública (RF01) até as regras de negócio complexas, como a exigência de dupla mídia (foto e vídeo) (RF04), a estruturação gramatical da Libras (RF03) e o fluxo de curadoria para aprovação de conteúdo (RF05).

## 3. Requisitos Não-Funcionais (RNF) - THEO

Aqui estão definidas as restrições técnicas e métricas de qualidade do projeto. Os requisitos incluem limites de desempenho, como o tamanho máximo de upload para vídeos de 50MB (RNF01) e o tempo máximo de resposta para buscas de 800 milissegundos (RNF02), além de garantir a responsividade da interface (RNF04).

## 4. Conformidade Normativa (WCAG e LGPD) - THEO

Este tópico descreve como o sistema garante o cumprimento de leis e diretrizes globais. Detalha a implementação da acessibilidade conforme a WCAG 2.1 Nível AA (navegação por teclado e contraste) e as políticas rígidas de privacidade estipuladas pela LGPD, como o Termo de Consentimento Livre e Esclarecido (TCLE) e a proteção de dados de menores.

## 5. Caso de Uso: Avaliar e Aprovar Submissão de Sinal - THEO/MATHEUS

Apresenta a documentação textual do fluxo mais crítico do sistema: a moderação. O caso de uso descreve passo a passo como o Curador acessa as submissões pendentes, analisa a precisão gramatical do vídeo e toma a decisão de aprovar ou rejeitar o conteúdo para a exibição pública.

## 6. Modelagem de Software - THEO/MATHEUS

Esta etapa traduz as regras de negócio em modelos visuais através da linguagem UML. Ela é dividida em três diagramas fundamentais: o Diagrama de Classes, que estrutura as entidades (como `Sinal`, `GramaticaLibras` e usuários); o Diagrama de Atividades, que mapeia o fluxo sequencial e as raias de decisão da submissão; e o Diagrama de Sequência, que ilustra a troca temporal de mensagens entre a interface e o banco de dados.

## 7. Projeto de Software e Implementação do CRUD - MATHEUS

O último tópico define a fundação técnica do sistema, propondo a adoção da Arquitetura em Camadas (Layered Architecture) em conjunto com o padrão MVC (Model-View-Controller). Esta seção justifica como a separação clara entre a Apresentação, o Domínio e a Infraestrutura é vital para garantir a responsividade, isolar regras da LGPD e suportar o upload de arquivos pesados de forma assíncrona.

# Base44 Project

Use this repository to run and edit the app locally, then publish changes back through Base44.

Any change pushed to the repo will also be reflected in the Base44 Builder.

## Prerequisites

1. Clone the repository using the project's Git URL.
2. Navigate to the project directory.
3. Install dependencies: `npm install`.
4. Install the Base44 CLI: `npm install -g base44@latest`.

See the [Base44 CLI docs](https://docs.base44.com/developers/references/cli/get-started/overview) if you want to run Base44 commands directly.

## Run Locally

Run the full local development environment from the project root:

```bash
base44 dev
```

`base44 dev` starts the local Base44 development backend and, when this app is configured for it, also starts the frontend dev server for you. Use the frontend URL printed by the command.

For example, when the Base44 project config includes a `serveCommand`, `base44 dev` can launch the frontend too:

```json5
{
  "site": {
    "serveCommand": "npm run dev"
  }
}
```

In a Base44 project this lives in `base44/config.jsonc`.

## Run Only The Frontend

If you only want to work on the frontend against the hosted Base44 backend, run:

```bash
npm run dev
```

Open the local URL printed by Vite.

## Use The Hosted Backend

For frontend-only development, create or update `.env.local` in the project root:

```bash
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=https://your-app.base44.app
```

`VITE_BASE44_APP_ID` identifies the Base44 app.

`VITE_BASE44_APP_BASE_URL` tells the Base44 Vite plugin where to send local `/api` requests. Point it at your deployed Base44 app URL when you want the local frontend to use the hosted backend.

When you use `base44 dev`, the command injects the local Base44 values for you, so `.env.local` is mainly needed for frontend-only workflows.

## Publish Your Changes

After pushing your changes to git, open the Base44 dashboard and publish the app:

```bash
base44 dashboard open
```

## Docs & Support

Documentation: [https://docs.base44.com/Integrations/Using-GitHub](https://docs.base44.com/Integrations/Using-GitHub)

Base44 CLI command reference: [https://docs.base44.com/developers/references/cli/commands/introduction](https://docs.base44.com/developers/references/cli/commands/introduction)

Support: [https://app.base44.com/support](https://app.base44.com/support)
