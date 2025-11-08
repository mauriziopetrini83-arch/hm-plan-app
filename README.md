# HM Plan App (Next.js + Tailwind)

App web semplice per mostrare un piano mezza maratona a velocità precise (km/h e min/km) con spunte di completamento salvate sul dispositivo.

## Deploy facile (Vercel)
1. Crea un account su https://vercel.com (gratuito).
2. Carica questo progetto su un repository GitHub (nuovo repo → aggiungi file → carica cartella).
3. In Vercel: **New Project** → **Import Git Repository** → seleziona il repo → **Deploy**.
4. Otterrai un URL pubblico del tipo `https://hm-plan-app.vercel.app`.

## Incorpora in WordPress (pagina/Articolo)
- Aggiungi un blocco **HTML personalizzato** e incolla:

```html
<div style="position:relative; padding-top:56.25%; width:100%;">
  <iframe src="https://TUO-DOMINIO.vercel.app" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen loading="lazy"></iframe>
</div>
```

Sostituisci `https://TUO-DOMINIO.vercel.app` con l'URL ottenuto da Vercel.

## Avvio locale (opzionale, se vuoi provarla sul PC)
```bash
npm install
npm run dev
```

## Struttura
- `app/page.tsx`: interfaccia e logica (React).
- `app/layout.tsx`: layout di base.
- `app/globals.css`: Tailwind.
- Nessuna dipendenza UI esterna. Solo Next, React e Tailwind.

## Note
- Le spunte sono salvate nel `localStorage` del browser (niente backend).
- Per sincronizzare più dispositivi/atleti, aggiungi un backend (es: Supabase/Firebase) e un login.
