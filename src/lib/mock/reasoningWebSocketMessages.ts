import type { ReasoningEvent } from "@/types/reasoning";

/** Reasoning for live-detected assets added via anomaly WebSocket. */
const MOCK_REASONING_MESSAGES: ReasoningEvent[] = [
  {
    asset_id: "AST1234",
    selected_actions: ["Deploy Field Agent"],
    justification:
      "Temperature spike on AST1234 exceeds SOP threshold. Field verification required before remediation.",
    step_by_step_instructions: [
      "Dispatch field agent to AST1234 sensor location",
      "Collect temperature readings and compare to rolling 24h average",
      "Document findings and update maintenance log",
    ],
    sop_references: [
      "SOP-TEMP-014 §3.1 — Critical Temperature Response",
      "Manual AST1234 — Section 5: Field Inspection",
    ],
    severity_escalation_required: true,
    estimated_resolution_time: "2-4 hours",
  },
  {
    asset_id: "AST5678",
    selected_actions: ["Schedule Inspection"],
    justification:
      "Trend escalation detected on AST5678. Schedule inspection per SOP before clearing alert.",
    step_by_step_instructions: [
      "Schedule inspection within next maintenance window",
      "Isolate affected subsystem and run diagnostics",
      "Submit inspection report",
    ],
    sop_references: ["SOP-MAINT-022 §4.2 — Trend Escalation"],
    severity_escalation_required: false,
    estimated_resolution_time: "4-6 hours",
  },
];

let messageIndex = 0;

export function getNextMockReasoningMessage(): ReasoningEvent {
  const message = MOCK_REASONING_MESSAGES[messageIndex % MOCK_REASONING_MESSAGES.length];
  messageIndex += 1;
  return message;
}
