import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, PageHeader, RoleBadge } from '../../components/shared'
import { ROLE_LABELS, USER_ROLES } from '../../constants'

const ROLE_CONTENT = {
  [USER_ROLES.ADMIN]: {
    title: 'Admin Control Center',
    subtitle: 'Monitor security posture, enforce policy, and oversee compliance tasks.',
    streams: [
      { label: 'Identity & access', description: 'Review entitlements and approval workflows.' },
      { label: 'Configuration drift', description: 'Inspect infrastructure deviations across regions.' },
      { label: 'Platform notices', description: 'Dispatch release notes and planned maintenance.' },
    ],
  },
  [USER_ROLES.OPERATIONS]: {
    title: 'Operations Workspace',
    subtitle: 'Align daily execution, handle escalation pipelines, and track automation health.',
    streams: [
      { label: 'Workflow health', description: 'SLO adherence across critical processes.' },
      { label: 'Escalation desk', description: 'Visibility into cross-functional blockages.' },
      { label: 'Capacity ledger', description: 'Forecast bandwidth with AI-driven insights.' },
    ],
  },
  [USER_ROLES.MANAGER]: {
    title: 'Manager Overview',
    subtitle: 'Analyse team throughput, retention signals, and customer-facing outcomes.',
    streams: [
      { label: 'Performance tiles', description: 'Scorecards and calibrations for direct reports.' },
      { label: 'Engagement pulse', description: 'Sentiment indicators and attrition watchlists.' },
      { label: 'Client outcomes', description: 'Customer journey metrics and escalations summary.' },
    ],
  },
  [USER_ROLES.ANALYST]: {
    title: 'Analyst Insights',
    subtitle: 'Run exploratory queries, share storyboards, and operationalise models.',
    streams: [
      { label: 'Data workbench', description: 'Secure notebook environment with governed datasets.' },
      { label: 'Signal registry', description: 'Catalogued anomalies and ML explainability artifacts.' },
      { label: 'Experiment ops', description: 'Controlled experiments with automated guardrails.' },
    ],
  },
  [USER_ROLES.SUPPORT]: {
    title: 'Support Hub',
    subtitle: 'Resolve tickets quickly, scale knowledge management, and automate handoffs.',
    streams: [
      { label: 'Live queue', description: 'Real-time ticket load, sentiment, and backlog trends.' },
      { label: 'Playbook editor', description: 'Update macros, scripts, and guided flows.' },
      { label: 'Quality audit', description: 'Sampling workflows and QA score distribution.' },
    ],
  },
  [USER_ROLES.AUDITOR]: {
    title: 'Audit Records',
    subtitle: 'Trace regulatory controls, track evidence maturity, and certify compliance.',
    streams: [
      { label: 'Control matrix', description: 'Framework alignment and ownership heatmaps.' },
      { label: 'Evidence locker', description: 'Signed artefacts with tamper-evident hashes.' },
      { label: 'Exception board', description: 'Mitigation status and remediation SLAs.' },
    ],
  },
}

const RoleWorkspace = ({ role }) => {
  const navigate = useNavigate()

  const content = useMemo(() => ROLE_CONTENT[role] ?? ROLE_CONTENT[USER_ROLES.SUPPORT], [role])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
        <PageHeader
          title={content.title}
          subtitle={content.subtitle}
          actions={<RoleBadge role={role} />}
        />
        <section className="grid gap-6 md:grid-cols-2">
          {content.streams.map((stream) => (
            <Card key={stream.label} className="flex flex-col gap-4 border-slate-200 bg-white">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{stream.label}</h3>
                <p className="text-sm text-slate-500">{stream.description}</p>
              </div>
              <div>
                <Button
                  variant="ghost"
                  className="justify-start px-0 text-sm font-semibold"
                  onClick={() => navigate('coming-soon')}
                >
                  View stream →
                </Button>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </div>
  )
}

export default RoleWorkspace

