## Fuma Lofi

Some nice lofi music and a music player.

**Demo:** https://fuma-lofi.vercel.app

![Preview](./public/preview.png)

### Run on local

Clone the repository.

```bash
git clone https://github.com/fuma-nama/fuma-lofi.git
```

Install with [pnpm](https://pnpm.io).

```bash
pnpm i
```

Run in development mode.

```bash
pnpm dev
```

#### Add Songs

Put your songs in the `./public` folder, and run `pnpm run generate:music` to sync songs data with web player.

#### Build

This project uses Vite and React.js.

```bash
pnpm build && pnpm preview
```

### Custom Songs

With an URL of the song (must be available to client, e.g. served from `http://localhost`), you can add a custom song in the menu.

### Demo Songs

Music from [Uppbeat](https://uppbeat.io).
It is encouraged to bring your own songs.

- https://uppbeat.io/t/ra/cold-brew
License code: `OZKJV3M2MXHS6NBX`

- https://uppbeat.io/t/avbe/night-in-kyoto
License code: `NNDPYSZCN8HVGASH`

- https://uppbeat.io/t/prigida/moonshine
License code: `OM8JENTZZEBMACX1`