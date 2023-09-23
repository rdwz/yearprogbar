# yearsprogress

[![npm version](https://img.shields.io/npm/v/yearsprogress)](https://www.npmjs.com/package/yearsprogress)
[![install size](https://packagephobia.com/badge?p=yearsprogress)](https://packagephobia.com/result?p=yearsprogress)
[![license](https://img.shields.io/github/license/s1mpson/yearsprogress)](https://github.com/s1mpson/yearsprogress)
[![style: prettier](https://badgen.net/badge/style/prettier/ff69b4)](https://github.com/prettier/prettier)

> Meta's Threads bot that posts current year progress bar updates.

***See it in action on [@yearsprogress](https://www.threads.net/@yearsprogress) 🙌***

## Highlights

- Written in TypeScript
- Uses [Reverse-Engineered Threads API](https://github.com/junhoyeo/threads-api) underneath

## Install

```sh
npm install -g yearsprogress
```

## Usage

```sh
$ yearsprogress [options]
```

### Options

- `-u, --username <username>`: (required) Specifies the Threads username.
- `-p, --password <password>`: (required) Specifies the Threads password.
- `-f, --force`: (optional) Forces the app to post the current progress.
- `-d, --debug`: (optional) Runs the app in local, console.log only mode.

## Examples

1. Run the program:

```bash
$ yearsprogress -u your_username -p your_password
```

2. Post the current year progress when starting the program:

```bash
$ yearsprogress -u your_username -p your_password -f
```

3. Post the current year progress on start while running in debug mode:

```bash
$ yearsprogress -u your_username -p your_password -f -d
```
