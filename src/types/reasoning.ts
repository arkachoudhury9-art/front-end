export type ReasoningEvent = {
  asset_id: string;
  selected_actions: string[];
  justification: string;
  step_by_step_instructions: string[];
  sop_references: string[];
  severity_escalation_required: boolean;
  estimated_resolution_time: string;
};
