'use client';

import React from 'react';
import {
  Clock, Flag, CheckCircle2, XCircle, Search, Ban, ShieldOff,
  Hourglass, Loader2, Banknote, UserCheck, UserX, UserCog,
} from 'lucide-react';
import { Pill } from './AdminUI';
import {
  ModerationStatus, VerificationStatus, ClaimStatus, PayoutStatus, AdminUserStatus, SubscriptionRole,
} from '@/lib/types';
import { GraduationCap, Sparkles, Microscope } from 'lucide-react';

/** Compact membership tier badge for dense admin tables */
export function MembershipBadge({ role }: { role: SubscriptionRole }) {
  switch (role) {
    case 'FREE_STUDENT': return <Pill tone="slate" icon={GraduationCap}>Ücretsiz</Pill>;
    case 'PRO_STUDENT': return <Pill tone="indigo" icon={Sparkles}>Pro & YKS</Pill>;
    case 'RESEARCHER_DOCENT': return <Pill tone="purple" icon={Microscope}>Araştırmacı / Doçent</Pill>;
  }
}

export function ModerationBadge({ status }: { status: ModerationStatus }) {
  switch (status) {
    case 'pending_ai': return <Pill tone="amber" icon={Clock}>AI İncelemesinde</Pill>;
    case 'flagged': return <Pill tone="rose" icon={Flag}>İşaretlendi</Pill>;
    case 'approved': return <Pill tone="emerald" icon={CheckCircle2}>Onaylandı</Pill>;
    case 'rejected': return <Pill tone="slate" icon={XCircle}>Reddedildi</Pill>;
  }
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  switch (status) {
    case 'pending': return <Pill tone="amber" icon={Hourglass}>Beklemede</Pill>;
    case 'under_review': return <Pill tone="indigo" icon={Search}>İncelemede</Pill>;
    case 'approved': return <Pill tone="emerald" icon={CheckCircle2}>Onaylandı</Pill>;
    case 'rejected': return <Pill tone="rose" icon={XCircle}>Reddedildi</Pill>;
  }
}

export function ClaimBadge({ status }: { status: ClaimStatus }) {
  switch (status) {
    case 'open': return <Pill tone="rose" icon={Flag}>Açık</Pill>;
    case 'investigating': return <Pill tone="amber" icon={Search}>İnceleniyor</Pill>;
    case 'taken_down': return <Pill tone="slate" icon={ShieldOff}>Kaldırıldı</Pill>;
    case 'dismissed': return <Pill tone="emerald" icon={CheckCircle2}>Reddedildi (Geçersiz)</Pill>;
  }
}

export function PayoutBadge({ status }: { status: PayoutStatus }) {
  switch (status) {
    case 'pending': return <Pill tone="amber" icon={Hourglass}>Onay Bekliyor</Pill>;
    case 'approved': return <Pill tone="cyan" icon={CheckCircle2}>Onaylandı</Pill>;
    case 'processing': return <Pill tone="indigo" icon={Loader2}>İşleniyor</Pill>;
    case 'paid': return <Pill tone="emerald" icon={Banknote}>Ödendi</Pill>;
    case 'rejected': return <Pill tone="rose" icon={XCircle}>Reddedildi</Pill>;
  }
}

export function UserStatusBadge({ status }: { status: AdminUserStatus }) {
  switch (status) {
    case 'active': return <Pill tone="emerald" icon={UserCheck}>Aktif</Pill>;
    case 'suspended': return <Pill tone="rose" icon={UserX}>Askıya Alındı</Pill>;
    case 'pending': return <Pill tone="amber" icon={UserCog}>Onay Bekliyor</Pill>;
  }
}

/** Severity chip for DMCA claims */
export function SeverityBadge({ severity }: { severity: 'low' | 'medium' | 'high' }) {
  const map = { high: 'rose', medium: 'amber', low: 'slate' } as const;
  const label = { high: 'Yüksek', medium: 'Orta', low: 'Düşük' }[severity];
  return <Pill tone={map[severity]}>{label} Öncelik</Pill>;
}

export { Ban };
