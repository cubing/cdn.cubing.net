# Maintenance

## Updating `cdn.cubing.net` to a new `cubing` version

Run:

```shell
make roll-cubing
```

This will automatically generate a commit [like this](https://github.com/cubing/cdn.cubing.net/commit/04ca0ff18a894bc2a6c3838d3cb19d4916d7ec99) and requires access to:

- the GitHub repo,
- the deploy server, and
- a Fastly token with cache revocation access for `cdn.cubing.net` (if you want the changes to be available immediately).
  - This must be stored at: `~/.ssh/secrets/FASTLY_CUBING_NET_API_TOKEN.txt`

For packages other than `cubing`, you'll have to run `bun add [package]@latest` manually.
