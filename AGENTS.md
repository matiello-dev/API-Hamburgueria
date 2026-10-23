# Instruções para revisão e correção de Pull Requests

Este arquivo orienta a revisão dos Pull Requests deste projeto. A revisão deve
ser educativa, objetiva e baseada no código realmente alterado.

## Idioma obrigatório

Todas as avaliações, comentários de Pull Request, solicitações de mudança e
issues de correção devem ser escritos em português claro e objetivo.

## Objetivo da revisão

Verifique se o Pull Request:

- atende à User Story ou issue relacionada;
- mantém o fluxo `server.js -> controller -> logic -> repository`;
- funciona com o comportamento esperado;
- possui código legível e coerente com o projeto;
- trata erros e entradas inválidas quando necessário;
- mantém ou adiciona testes adequados;
- atualiza a documentação quando o comportamento da API muda;
- não expõe senhas, tokens, chaves ou outros dados secretos.

## Ordem recomendada

1. Leia a descrição do Pull Request e a issue ou User Story vinculada.
2. Inspecione o diff completo, incluindo arquivos adicionados, removidos e renomeados.
3. Execute os testes e verificações disponíveis no projeto.
4. Teste manualmente o fluxo alterado quando isso ajudar a confirmar o comportamento.
5. Compare a implementação com os critérios de aceite.
6. Registre a avaliação, os pontos positivos e os problemas encontrados.

Não aprove um Pull Request apenas porque ele executa. Confirme também se a
solução atende ao objetivo da issue e se não quebrou partes existentes.

## Avaliação por estrelas

Atribua de 1 a 5 estrelas no comentário final da revisão:

| Estrelas | Significado | Decisão sugerida |
| --- | --- | --- |
| 5 | Excelente: atende ao objetivo, está claro, testado e sem problemas relevantes. | Aprovar |
| 4 | Muito bom: funciona e precisa apenas de ajustes pequenos ou melhorias não bloqueantes. | Aprovar ou comentar |
| 3 | Funciona parcialmente: há melhorias importantes, mas o fluxo principal está encaminhado. | Solicitar ajustes |
| 2 | Problemas relevantes de funcionamento, arquitetura, testes ou segurança. | Solicitar correções |
| 1 | Não atende à User Story ou não pode ser validado com segurança. | Solicitar correções |

As estrelas representam a qualidade da entrega atual, não a capacidade do
aluno. Explique sempre o motivo da nota.

## Comentários da revisão

Todo comentário deve ser específico e acionável. Sempre que possível, informe:

- arquivo e trecho relacionado;
- comportamento atual;
- comportamento esperado;
- impacto do problema;
- sugestão de correção ou pergunta objetiva.

### Pontos fortes

Comente os acertos relevantes, por exemplo:

- separação correta entre controller, logic e repository;
- solução simples e fácil de entender;
- tratamento de erro adequado;
- bons testes ou boa documentação;
- uso correto do repository para persistência.

### Pontos fracos

Comente os pontos fracos somente quando houver algo concreto para melhorar.
Priorize problemas que afetam funcionamento, manutenção, segurança, testes ou
entendimento do código. Evite comentários genéricos como “melhorar código” sem
explicar o que deve mudar.

## Quando solicitar mudanças

Solicite mudanças quando existir pelo menos um destes casos:

- a User Story não foi atendida;
- o endpoint não funciona ou retorna dados incorretos;
- existe risco de perda ou corrupção dos dados do arquivo;
- há erro não tratado em um fluxo importante;
- a implementação mistura responsabilidades das camadas;
- faltam testes para um comportamento essencial;
- existe segredo ou informação sensível no código;
- a alteração quebra um comportamento que já funcionava.

Não bloqueie o Pull Request por preferência de estilo sem impacto real. Para
melhorias opcionais, use um comentário não bloqueante.

## Abertura de issue de correção

Abra uma issue quando a correção for maior que um ajuste pontual, precisar de
acompanhamento separado ou puder ser implementada depois do merge.

Antes de abrir:

1. Procure uma issue existente para evitar duplicidade.
2. Comente o problema no Pull Request.
3. Informe no comentário o número da nova issue.
4. Se o problema bloquear o merge, marque-o claramente como bloqueante.

Use este formato:

```text
Título: [Correção] Descrição curta do problema

Contexto:
O que foi observado no Pull Request e em qual arquivo ou fluxo.

Problema:
Qual comportamento está incorreto ou incompleto.

Comportamento esperado:
O que deve acontecer depois da correção.

Critérios de aceite:
- [ ] Critério verificável 1
- [ ] Critério verificável 2
- [ ] Teste ou evidência adicionada

Referência:
Pull Request, arquivo e linha relacionados.
```

No comentário do Pull Request, use uma mensagem semelhante a:

```text
Ponto bloqueante: a validação do título ainda permite uma tarefa sem título.
Abri a issue #N para acompanhar a correção. O merge deve aguardar esse ajuste.
```

## Modelo de comentário final

```text
## Revisão

Nota: ⭐⭐⭐⭐☆ (4/5)

### Pontos fortes
- O fluxo passa corretamente pelo controller, logic e repository.
- A resposta do endpoint está documentada e foi testada.

### Pontos a corrigir
- [Não bloqueante] Adicionar teste para o cenário de arquivo inexistente.

### Decisão
Aprovar com a melhoria sugerida.
```

Se houver problema bloqueante, substitua a decisão por `Solicitar mudanças` e
liste claramente tudo que precisa ser corrigido antes da aprovação.
