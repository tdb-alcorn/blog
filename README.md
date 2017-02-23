# blog

wilkommen zum das blog

## Deploy

```
ssh
APP_DIR=$(pwd) ./init.sh
```

It starts an `init.d` service called blog that runs the node server which
returns the actual posts. Nginx statically serves the index.html and assets.
