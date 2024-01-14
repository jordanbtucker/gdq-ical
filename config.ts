import "npm:dotenv@^16.3.1/config";

const scheduleID = requireEnv("SCHEDULE_ID");
const eventName = requireEnv("EVENT_NAME");
const outFile = requireEnv("OUT_FILE");

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (value == null || value === "") {
    throw new Error(`${name} is required`);
  }

  return value;
}

export { eventName, outFile, scheduleID };
