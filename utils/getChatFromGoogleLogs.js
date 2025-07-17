import { Logging } from "@google-cloud/logging";
import path from "path";

export const getChatFromGoogleLogs = async (sessionId, projectId) => {
  const logging = new Logging({
    projectId,
    keyFilename: path.join(process.cwd(), "log-fetch-key.json"),
  });

  const logFilter = `
    resource.type="global"
    resource.labels.project_id="${projectId}"
    severity="INFO"
    jsonPayload.responseType = "FINAL"
    jsonPayload.queryResult.diagnosticInfo."Session Id"="${sessionId}"
  `;

  try {
    const [entries] = await logging.getEntries({
      filter: logFilter,
      orderBy: "timestamp asc",
      pageSize: 50,
    });

    const formattedLogs = entries.map((entry) => ({
      timestamp: entry.metadata.timestamp,
      severity: entry.metadata.severity,
      logName: entry.metadata.logName,
      resource: entry.metadata.resource,
      payload: entry.data,
    }));

    return formattedLogs;
  } catch (err) {
    console.error("Error fetching logs:", err);
    throw err;
  }
};
