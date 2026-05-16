# AUTCHRONOS — Redesign Visual — Design Spec

**Data:** 2026-05-15
**Status:** Aprovado

---

## Contexto

O dashboard de agendamentos existente usa a estética padrão do shadcn/ui com visual genérico. O objetivo é um redesign completo com design system proprietário — dark panel denso estilo Linear/Vercel, accent âmbar/laranja, tipografia mista e logo animada. O resultado deve parecer um sistema técnico de grande empresa, sem rastro de template IA.

---

## Design System Tokens

### Paleta de Cores

| Token | Hex | Uso |
|---|---|---|
| `--bg-base` | `#08080A` | Fundo da aplicação inteira |
| `--bg-surface` | `#0F0F12` | Cards, sidebar, painéis |
| `--bg-elevated` | `#161619` | Hover states, inputs, modais |
| `--border` | `#1E1E24` | Todas as bordas — 1px, sem sombra |
| `--accent` | `#F97316` | Laranja âmbar — botões, badges ativos, logo |
| `--accent-dim` | `#7C3412` | Accent com opacidade para backgrounds ativos |
| `--text-primary` | `#F0F0F3` | Títulos e texto principal |
| `--text-secondary` | `#6B6B78` | Labels, metadados |
| `--text-muted` | `#2E2E36` | Separadores de texto, placeholders |
| `--green` | `#16A34A` | Status "compareceu" |
| `--red` | `#DC2626` | Status "faltou" |
| `--yellow` | `#F59E0B` | Badge "NOVO" |

### Tipografia

| Papel | Fonte | Peso | Uso |
|---|---|---|---|
| Interface | Inter | 400 / 600 | Todo o texto UI |
| Logo | Orbitron | 700 | Somente "AUTCHRONOS" |
| Dados | JetBrains Mono | 500 | Números das stats, IDs, telefones, datas |

### Bordas e Raio

- Border radius: `6px`
- Todas as bordas: `1px solid var(--border)` — sem `box-shadow`

---

## Layout

### Estrutura Geral

```
┌─────────────────────────────────────────────────────┐
│  SIDEBAR (240px fixo)  │  CONTENT AREA (flex-1)     │
│                        │                            │
│  [AUTCHRONOS logo]     │  [StatsBar]                │
│                        │                            │
│  ── NAVEGAÇÃO ──       │  [Conteúdo da aba ativa]   │
│  ◆ Hoje                │                            │
│  ◆ Semana              │                            │
│  ◆ Clientes            │                            │
│  ◆ Faltas              │                            │
│                        │                            │
│  ── rodapé ──          │                            │
│  ● sistema ativo       │                            │
│  atualizado HH:MM:SS   │                            │
│                        │                            │
│  "Tudo posso naquele   │                            │
│   que me fortalece"    │                            │
└─────────────────────────────────────────────────────┘
```

### Sidebar — Detalhes

**Topo:**
- Logo AUTCHRONOS com o `O` final substituído por engrenagem SVG, cor `--accent`
- Linha `--border` de separação abaixo do logo

**Navegação:**
- Cada item: ícone à esquerda + label em Inter 500
- Item ativo: background `--accent-dim`, borda esquerda `2px solid --accent`, texto `--text-primary`
- Item inativo: texto `--text-secondary`, hover `--bg-elevated`, transition `100ms`

**Rodapé (fixo no bottom):**
- Dot verde pulsante + `"sistema ativo"` em JetBrains Mono `11px`
- `"atualizado HH:MM:SS"` — timestamp que atualiza a cada segundo, JetBrains Mono `11px`, cor `--text-muted`
- Frase em itálico: `"Tudo posso naquele que me fortalece"` — Inter 400 itálico, `--text-secondary`, `11px`

### Content Area

- Padding: `24px`
- Topo: barra horizontal com título da seção ativa em Inter 600 maiúsculo (ex: `"HOJE — 15 MAI 2026"`) à esquerda + botão `+ Novo Agendamento` à direita

---

## Logo AUTCHRONOS

### Conceito

`AUTCHRON` em Orbitron 700 cor `--accent`, seguido de SVG de engrenagem no lugar do último `O`, seguido de `S` em Orbitron — resultando em `AUTCHRON[⚙]S`.

### Engrenagem SVG

- Mesma altura da fonte Orbitron no tamanho usado
- 8 dentes externos simétricos
- Círculo central vazado (como o interior do `O`)
- Stroke `--accent`, fill transparente no centro

### Comportamento Animado

| Momento | Animação |
|---|---|
| Carregamento da página | Gira `360deg` em `1.2s` com `ease-in-out` |
| Após salvar agendamento | Gira `360deg` novamente — feedback de processamento |
| Após mudar status de agendamento | Gira `360deg` novamente |

### Tamanhos

| Contexto | Altura |
|---|---|
| Sidebar topo | `22px` |
| Tela de loading futura | `48px` |

---

## Componentes

### StatsBar

4 cards lado a lado:

| Card | Cor do número | Fonte |
|---|---|---|
| Total hoje | `--text-primary` | JetBrains Mono 700 `2rem` |
| Compareceram | `--green` | JetBrains Mono 700 `2rem` |
| Faltaram | `--red` | JetBrains Mono 700 `2rem` |
| Novos clientes | `--yellow` | JetBrains Mono 700 `2rem` |

- Label: Inter 400, `--text-secondary`, `11px`, maiúsculas, letter-spacing `0.08em`
- Animação: número conta de `0` até o valor real em `600ms` ao carregar
- Background: `--bg-surface`, borda `1px --border`, radius `6px`

### AppointmentRow

Lista contínua dentro de um painel — sem card individual por linha. Cada linha tem borda bottom `1px --border`.

Colunas da linha:
```
[● dot]  [Nome]          [telefone mono]  [NOVO?]  [✓][✗]
```

- Dot: `8px` círculo — cinza (scheduled), verde (attended), vermelho (no-show)
- Nome: Inter 500, `--text-primary`
- Telefone: JetBrains Mono, `--text-secondary`
- Badge NOVO: texto `--yellow`, borda `1px --yellow`, `10px` uppercase letter-spacing
- Botão ✓ ativo: `32x32px`, background `--green`, ícone branco
- Botão ✗ ativo: `32x32px`, background `--red`, ícone branco
- Botões inativos: background `--bg-elevated`, ícone `--text-secondary`
- Hover na linha: background `--bg-elevated`, transition `100ms`

### Modal "Novo Agendamento"

- Overlay: `rgba(0,0,0,0.7)` com `backdrop-filter: blur(4px)`
- Container: `--bg-surface`, borda `1px --border`, radius `6px`, largura `480px`
- Header: `"NOVO AGENDAMENTO"` Inter 600 maiúsculo + linha `--border` abaixo
- Labels: Inter 400, `--text-secondary`, `12px`, maiúsculas
- Inputs: background `--bg-elevated`, borda `1px --border`, focus: borda `1px --accent`
- Botão Salvar: background `--accent`, texto escuro bold, full width

---

## Animações

### Sequência de Inicialização

| Tempo | Elemento | Animação |
|---|---|---|
| `0ms` | Sidebar | fade-in `200ms` |
| `150ms` | Logo engrenagem | gira `360deg` em `1.2s` |
| `300ms` | StatsBar | slide-down `250ms` + contagem dos números `600ms` |
| `500ms` | Linhas da lista | fade-in sequencial, `40ms` entre cada linha |

### Interações

| Ação | Animação |
|---|---|
| Trocar aba | Conteúdo fade `150ms` |
| Clicar ✓ ou ✗ | Botão scale `0.92` em `80ms` + dot muda cor transition `200ms` |
| Stats atualizam | Número re-conta de valor anterior para novo em `300ms` |
| Salvar agendamento | Modal fecha + engrenagem gira + nova linha aparece com highlight âmbar que fades em `1s` |
| Hover em linha | Background `--bg-elevated`, transition `100ms` |

### Princípio

Cada animação tem função — indica que o sistema processou algo. Sem parallax, sem spinners desnecessários, sem bounce, sem transições de página com slide.

---

## Fora do Escopo

- Modo claro (light mode) — sistema é dark-only
- Responsividade mobile — dashboard de uso em desktop/tablet
- Mudança na lógica de negócio ou API — apenas visual
- Novos componentes além dos existentes
