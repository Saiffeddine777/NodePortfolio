import JiraClient from "jira-client";
import { isProduction } from "./Environement";

const { JIRA_DOMAIN, ADMIN_ACCOUNT, JIRA_TOKEN } = process.env;
if (!JIRA_DOMAIN || !ADMIN_ACCOUNT || !JIRA_TOKEN) {
  throw new Error("Missing Jira environment variables");
}

const Jira = new JiraClient({
  protocol: "https",
  host: JIRA_DOMAIN,
  username: ADMIN_ACCOUNT,
  password: JIRA_TOKEN,
  apiVersion: "3",
  strictSSL: isProduction,
});


export default Jira;
