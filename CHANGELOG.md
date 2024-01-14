# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- The category is included in the event title.

## [2.0.0] - 2024-01-13

### BREAKING CHANGES

- Moved to Deno from Node.js. Deno v1.39.1 or later is now required.
- Added required `SCHEDULE_ID` environment variable and removed `SCHEDULE_PAGE`.
- Made `OUT_FILE` a required environment variable.

## [1.0.0] - 2020-08-16

### Added

- Initial code to output an iCal file

[unreleased]: https://github.com/jordanbtucker/gdq-ical/commits/main/
[1.0.0]: https://github.com/jordanbtucker/gdq-ical/releases/tag/v1.0.0
[2.0.0]: https://github.com/jordanbtucker/gdq-ical/releases/tag/v2.0.0
