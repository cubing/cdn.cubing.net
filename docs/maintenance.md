# Maintenance

## Updating `cdn.cubing.net` to a new `cubing` version

Run:

```shell
make roll-cubing
```

This will automatically generate a commit [like this](https://github.com/cubing/cdn.cubing.net/commit/04ca0ff18a894bc2a6c3838d3cb19d4916d7ec99) and requires access to:

- the GitHub repo,
- the deploy server, and
- the Cloudflare account for `cdn.cubing.net` (if you want the changes to be available immediately).
  - TODO: Cloudflare configuration is [currently broken](https://github.com/cubing/cdn.cubing.net/issues/6).

For packages other than `cubing`, you'll have to run `npm install [package]@latest` manually.
