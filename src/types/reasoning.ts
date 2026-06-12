export type ReasoningEvent = {
  asset_id?: string | null;
  session_id?: string | null;
  selected_actions?: string[] | null;
  justification?: string | null;
  step_by_step_instructions?: string[] | null;
  sop_references?: string[] | null;
  severity_escalation_required?: boolean | null;
  estimated_resolution_time?: string | null;
};
