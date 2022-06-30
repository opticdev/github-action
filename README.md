# github-action
Optic's GitHub action. Generate a token at [app.useoptic.com](https://app.useoptic.com)

Add this to your `.github/workflows` folder and add your generated token in the [github secret manager](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository).

```yml
name: optic-ci
on:
  pull_request:

jobs:
  optic-ci:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Run optic compare
        uses: opticdev/github-action@v1
        with:
          token: ${{ secrets.OPTIC_TOKEN }} # Add the secret to your secret manager
          base: ${{ github.event.pull_request.base.ref }} # the base git to compare against
```
