import type { ReasoningEvent } from "@/types/reasoning";

const MOCK_REASONING_MESSAGES: ReasoningEvent[] = [
  {
    asset_id: "TRAIN_2-VEH_014-W3",
    selected_actions: ["Deploy Field Agent"],
    justification:
      "Vibration sensor returned to baseline but rolling z-score remains elevated. SOP-MAINT-014 requires field verification before clearing the alert.",
    step_by_step_instructions: [
      "Dispatch field agent to TRAIN_2-VEH_014-W3 wheel assembly",
      "Inspect bearing housing and collect vibration spectrum",
      "Compare readings against 24h rolling average thresholds",
      "Submit inspection report and update asset maintenance log",
    ],
    sop_references: [
      "SOP-MAINT-014 §4.2 — Vibration Escalation",
      "Manual W3-Bearing — Section 7: Field Inspection",
    ],
    severity_escalation_required: false,
    estimated_resolution_time: "2-4 hours",
  },
  {
    asset_id: "TRAIN_1-VEH_008-W2",
    selected_actions: ["Schedule Inspection"],
    justification:
      "Pressure delta exceeds SOP threshold. Historical context shows similar pattern preceded seal degradation on this asset class.",
    step_by_step_instructions: [
      "Schedule inspection within next maintenance window",
      "Isolate pressure line segment W2-P3",
      "Run diagnostic pressure test per SOP-PRES-008",
      "Document findings and recommend seal replacement if leakage detected",
    ],
    sop_references: [
      "SOP-PRES-008 §2.1 — Pressure Threshold Response",
      "Asset Manual TRAIN_1-VEH_008 — Seal Maintenance",
    ],
    severity_escalation_required: true,
    estimated_resolution_time: "4-6 hours",
  },
];

let messageIndex = 0;

export function getNextMockReasoningMessage(): ReasoningEvent {
  const message = MOCK_REASONING_MESSAGES[messageIndex % MOCK_REASONING_MESSAGES.length];
  messageIndex += 1;
  return message;
}
