import { eventName, outFile, scheduleID } from "./config.ts";
import { dirname } from "./deps.ts";

interface RunsResBody {
  count: number;
  results: RunsResBodyResult[];
}

interface RunsResBodyResult {
  anchor_time: null;
  category: string;
  commentators: unknown;
  console: string;
  description: string;
  display_name: string;
  endtime: string;
  hosts: RunsResBodyResultHost[];
  id: number;
  name: string;
  order: number;
  run_time: string;
  runners: RunsResBodyResultRunner[];
  setup_time: string;
  starttime: string;
  type: string;
  video_links: unknown;
}

interface RunsResBodyResultHost {
  id: number;
  name: string;
  pronouns: string;
  type: string;
}

interface RunsResBodyResultRunner {
  id: number;
  name: string;
  platform: string;
  pronouns: string;
  stream: string;
  twitter: string;
  type: string;
  youtube: string;
}

let ical = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//jordanbtucker//gdq-ical//EN
CALSCALE:GREGORIAN
X-WR-CALNAME:${eventName}
X-PUBLISHED-TTL:PT15M
`;

const res = await fetch(
  `https://gamesdonequick.com/tracker/api/v2/events/${scheduleID}/runs/`
);
if (!res.ok) {
  throw new Error(`${res.status} ${res.statusText}`);
}
const body = (await res.json()) as RunsResBody;
const now = new Date();
for (const {
  starttime,
  endtime,
  id,
  display_name,
  runners,
  run_time,
  setup_time,
  category,
  hosts,
} of body.results) {
  const start = new Date(starttime);
  const end = new Date(endtime);
  const runnerNames = runners.map(({ name }) => name).join(", ");
  const hostNames = hosts.map(({ name }) => name).join(", ");

  ical += `BEGIN:VEVENT
DTSTART:${formatDate(start)}
DTEND:${formatDate(end)}
DTSTAMP:${formatDate(now)}
UID:${id}
SUMMARY:${display_name}
DESCRIPTION:Runners: ${runnerNames}\\nRun Time: ${run_time}\\nCategory: ${category}\\nHosts: ${hostNames}\\nSetup Time: ${setup_time}
CLASS:PUBLIC
END:VEVENT
`;
}

ical += "END:VCALENDAR";

ical = ical.replace(/\r\n|\r|\n/, "\r\n");

await Deno.mkdir(dirname(outFile), { recursive: true });
await Deno.writeTextFile(outFile, ical);

function formatDate(date: Date): string {
  const dateParts = [
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
  ];
  const timeParts = [
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  ];
  const parts = [
    dateParts.map(padDatePart).join(""),
    "T",
    timeParts.map(padDatePart).join(""),
    "Z",
  ];

  return parts.join("");
}

function padDatePart(part: number): string {
  return part.toString().padStart(2, "0");
}
