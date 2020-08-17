# gdq-ical

Scrapes the [GDQ schedule](https://gamesdonequick.com/schedule) page and outputs
an iCal file.

## Requirements

- Node.js v10.17, v12, or v14

## Usage

1.  Clone this repository, and run `npm install`.

    ```bash
    git clone https://github.com/jordanbtucker/gdq-ical.git
    cd gdq-ical
    npm install
    ```

2.  Copy `.env.example` to `.env` and set the desired environment variables in
    `.env`.

    ```bash
    cp .env.example .env
    ```

    Alternatively, set the environment variables via the shell or platform.

3.  Run `npm start`.

    ```bash
    npm start
    ```

If desired, use cron to run the script on a regular schedule. Fifteen minutes is
the recommended interval.

This script does not serve the iCal file. Use any HTTP server, like Apache or
Nginx, to serve the file.
