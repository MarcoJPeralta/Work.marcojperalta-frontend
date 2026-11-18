# Work.marcojperalta-frontend

Frontend de **[work.marcojperalta.com](https://work.marcojperalta.com)**, onde estão os case studies de Marco Peralta. É feito em Next.js (App Router) e vai buscar o conteúdo a um WordPress headless: [CMS-Marcojperalta](https://github.com/MarcoJPeralta/CMS-Marcojperalta).

## Stack

- Next.js 15 + React 19 + TypeScript
- WordPress REST API (`/wp-json/wp/v2`) como fonte de conteúdo
- ISR com `revalidate: 60` e revalidação imediata (`POST /api/revalidate`) quando se publica no WordPress
- CSS com tokens (tema claro/escuro, com toggle) e a fonte Newsreader via `next/font`

## Começar

```bash
npm install
cp .env.example .env.local   # preenche WORDPRESS_URL e REVALIDATE_SECRET
npm run dev
```

| Variável | Exemplo | Para quê |
|---|---|---|
| `WORDPRESS_URL` | `https://cms.marcojperalta.com` | Endereço do WordPress, sem barra no fim |
| `REVALIDATE_SECRET` | valor aleatório | Tem de ser igual a `HEADLESS_REVALIDATE_SECRET` no `wp-config.php` |

## Estrutura

```
src/
├── app/
│   ├── page.tsx                  /                       arquivo de case studies
│   ├── category/[slug]/          /category/client-work   arquivo filtrado
│   ├── case-studies/[slug]/      /case-studies/eco       case study
│   ├── [slug]/                   /about                  páginas do WordPress
│   └── api/revalidate/           chamado pelo WordPress ao publicar
├── components/                   componentes do design (SiteHeader, CaseCard, …)
├── content/site.ts               texto fixo do layout (hero, estatísticas…)
└── lib/wordpress.ts              única camada que fala com o WordPress
```

## Deploy

Na Vercel: importa o repositório, define as duas variáveis de ambiente e aponta `work.marcojperalta.com` por CNAME.
