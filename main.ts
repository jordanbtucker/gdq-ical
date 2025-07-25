import { eventName, outFile, scheduleID } from "./config.ts";
import { dirname } from "./deps.ts";

const DEFAULT_LOCATION = "https://www.twitch.tv/gamesdonequick";

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
  video_links?: RunsResBodyResultVideoLink[];
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

interface RunsResBodyResultVideoLink {
  id: number;
  link_type: string;
  url: string;
}

let ical = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//jordanbtucker//gdq-ical//EN
CALSCALE:GREGORIAN
X-WR-CALNAME:${eventName}
X-PUBLISHED-TTL:PT15M
`;

const res = await fetch(
  `https://tracker.gamesdonequick.com/tracker/api/v2/events/${scheduleID}/runs/`
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
  console,
  setup_time,
  category,
  hosts,
  video_links,
} of body.results) {
  const start = new Date(starttime);
  const end = new Date(endtime);
  const runnerNames = runners.map(({ name }) => name).join(", ");
  const hostNames = hosts.map(({ name }) => name).join(", ");
  const location =
    video_links?.find(({ link_type }) => link_type === "youtube")?.url ??
    DEFAULT_LOCATION;

  ical += `BEGIN:VEVENT
DTSTART:${formatDate(start)}
DTEND:${formatDate(end)}
DTSTAMP:${formatDate(now)}
UID:${id}
SUMMARY:${display_name} - ${category}
DESCRIPTION:Runners: ${runnerNames}\\nRun Time: ${run_time}\\nCategory: ${category}\\nConsole: ${console}\\nHosts: ${hostNames}\\nSetup Time: ${setup_time}\\n${location}
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
