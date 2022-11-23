## Bridgetown Spectaql Test Repo

#### Quickstart
```bash
bundle && yarn

# below kicks off the html creation into /src/spectaql
 yarn schema:doc

 # start bridgetown
 bin/bridgetown start
```

#### The Problem

Rendering the `html` that's located at `scr/spectaql` into the `default` bridgetown layout, or custom layout, so I can customize the `<head>` / use other `bridgetown` plugins ( seo / search / etc )

#### Things I've tried:

1.
```yml
defaults:
  - scope:
      path: "spectaql/index.html"
    values:
      layout: "default"
```

2. putting below into `/spectalq/`
   `_default.yml`
```yml
layout: "default"
```
