export const PLAN = {
  STANDARD: { uzs:49990, stars:0, revisions:1, label:'Express' },
  PRO_AI: { uzs:69990, stars:0, revisions:3, label:'Smart AI' },
  SIGNATURE: { uzs:199990, stars:0, revisions:5, label:'Studio', activationUzs:199990, activationStars:0, finalUzs:0, finalStars:0 }
};

export function paymentRequirement(project, stage='activation') {
  const p = PLAN[project.plan];
  if (!p) throw new Error('Unknown plan');
  if (project.plan === 'SIGNATURE') {
    return stage === 'final'
      ? { stage:'final', uzs:p.finalUzs, stars:p.finalStars, title:'EMORA Signature Final' }
      : { stage:'activation', uzs:p.activationUzs, stars:p.activationStars, title:'EMORA Signature Activation' };
  }
  return { stage:'full', uzs:p.uzs, stars:p.stars, title:`EMORA ${p.label}` };
}

export function isPaid(project, stage) {
  return (project.payments||[]).some(p=>p.stage===stage && p.status==='PAID');
}

export function canBuild(project) {
  if (project.plan === 'SIGNATURE') return isPaid(project,'activation');
  return isPaid(project,'full');
}

export function canFinalize(project) {
  if (project.plan === 'SIGNATURE') return PLAN.SIGNATURE.finalUzs > 0 ? isPaid(project,'final') : isPaid(project,'activation');
  return isPaid(project,'full');
}
