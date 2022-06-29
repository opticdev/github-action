# Development

To test this locally, install [act](https://github.com/nektos/act). After you have installed `act` you can run:

`act pull_request -j optic-ci -e ./examples/pull_request.json -s OPTIC_TOKEN=<TOKEN>`

## Releasing

release a new version by:
- updating the latest major tag (v1)
- create another tag that has the semantic version
