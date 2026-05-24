# Professor Wang Jiangyu and Research

Static bilingual personal research website for Professor Wang Jiangyu.

## Local Preview

Use the bundled Python runtime or any static server from this folder:

```powershell
python -m http.server 55888 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:55888/index.html
```

## Update Content

Edit `src/data/site-data.mjs`, then regenerate pages:

```powershell
C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\build-site.mjs
```

Validate the generated site:

```powershell
C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\validate-site.mjs
```

## GitHub Pages

Publish the repository `wangjiangyu-creator/wjy-personal-site` from the `main` branch and repository root. The site uses relative internal links and includes `.nojekyll`, so it is ready for a GitHub Pages project-site deployment once the repository exists.
