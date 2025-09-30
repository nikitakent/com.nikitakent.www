# com.nikitakent.www

Uses [Three.js](https://threejs.org/) refractor library and vite for building.

Use `npm run dev` to deploy in terminal.

The `vite.config.js` file in the root directory is to help the production server serve raw files other than `index.html` (i.e., via `window.open('/ {routeName}')`. To add new routes that serve new raw files, `vite.config.js` file needs to be configured accordingly.
