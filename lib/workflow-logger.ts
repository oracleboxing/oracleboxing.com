import { getSupabaseServerClient } from './supabase';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

type WorkflowType = 'webhook' | 'cron' | 'workflow' | 'action' | 'script' | 'checkout';
type Status = 'started' | 'step_completed' | 'completed' | 'failed' | 'skipped';

interface LogOptions {
  workflowName: string;
  workflowType: WorkflowType;
  source?: string;
  runId?: string;
  notifySlack?: boolean;
  slackOnlyOnFailure?: boolean;
}

export function createWorkflowLogger(opts: LogOptions) {
  const runId = opts.runId || generateUUID();
  const startedAt = new Date();
  const source = opts.source || 'oracleboxing-com';

  async function log(status: Status, message: string, extra?: { stepName?: string; metadata?: Record<string, any>; error?: string }) {
    try {
      const now = new Date();
      const durationMs = status === 'completed' || status === 'failed'
        ? now.getTime() - startedAt.getTime()
        : undefined;

      const supabase = getSupabaseServerClient();
      const { error: insertError } = await supabase.from('workflow_activity_log').insert({
        workflow_name: opts.workflowName,
        workflow_type: opts.workflowType,
        status,
        step_name: extra?.stepName,
        message,
        metadata: extra?.metadata || {},
        error: extra?.error,
        started_at: status === 'started' ? now.toISOString() : startedAt.toISOString(),
        completed_at: (status === 'completed' || status === 'failed') ? now.toISOString() : undefined,
        duration_ms: durationMs,
        run_id: runId,
        source,
      });

      if (insertError) {
        console.error(`[workflow-logger] Insert failed for ${opts.workflowName}:`, insertError.message);
      }

      // Slack notification for important events
      if (status === 'failed' && opts.notifySlack !== false) {
        await notifySlack(`❌ ${opts.workflowName} FAILED: ${extra?.error || message}`);
      }
      if (status === 'completed' && opts.notifySlack && !opts.slackOnlyOnFailure) {
        const duration = durationMs ? ` (${(durationMs / 1000).toFixed(1)}s)` : '';
        await notifySlack(`✅ ${opts.workflowName} completed${duration}: ${message}`);
      }
    } catch (e) {
      console.error(`[workflow-logger] Failed to log ${opts.workflowName}:`, e);
    }
  }

  return {
    runId,
    started: (message: string, metadata?: Record<string, any>) => log('started', message, { metadata }),
    step: (stepName: string, message: string, metadata?: Record<string, any>) => log('step_completed', message, { stepName, metadata }),
    completed: (message: string, metadata?: Record<string, any>) => log('completed', message, { metadata }),
    failed: (error: string, metadata?: Record<string, any>) => log('failed', error, { error, metadata }),
    skipped: (reason: string, metadata?: Record<string, any>) => log('skipped', reason, { metadata }),
  };
}

async function notifySlack(text: string) {
  const token = process.env.SLACK_BOT_TOKEN;
  const channel = process.env.SLACK_OPS_CHANNEL_ID || 'C092ALGA4MT';
  if (!token) return;
  try {
    await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, text }),
    });
  } catch {}
}
