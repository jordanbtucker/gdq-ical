# gdq-ical

Scrapes the [GDQ schedule](https://gamesdonequick.com/schedule) page and outputs
an iCal file.

## Requirements

- Deno v1.39.1 or later

## Usage

1.  Clone this repository.

    ```
    git clone https://github.com/jordanbtucker/gdq-ical.git
    cd gdq-ical
    ```

2.  Copy `.env.example` to `.env` and set the required environment variables in
    `.env`.

    ```
    cp .env.example .env
    ```

    Alternatively, set the environment variables via the shell or platform.

3.  Run `deno task start`.

    ```
    deno task start
    ```

If desired, use cron to run the script on a regular schedule. Fifteen minutes is
the recommended interval.

This script does not serve the iCal file. Use any HTTP server, like Apache or
Nginx, to serve the file.
