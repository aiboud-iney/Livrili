export type AdminPage = 'verifications' | 'audit-logs' | 'subscription' | 'posts'

export interface VerificationRequest {
  id: string
  companyName: string
  wilaya: string
  tradeRegisterNumber: string
  nif: string
  submittedAt: string
  note?: string
  userImage?: string

  iconVariant: 'plus' | 'chat'
}

export type AuditDecision = 'VERIFIED' | 'DELETED' | 'BLOCKED POST'

export interface AuditLog {
  id: string
  auditNum: string
  adminName: string
  userAccount: string
  timestamp: string
  decision: AuditDecision
  details?: string
}

export type PlanType = 'PRO MONTHLY' | 'ANNUAL'

export interface PendingPayment {
  id: string
  userName: string
  userAvatar?: string
  amount: string
  method: string
  submittedOn: string
  requestedPlan: PlanType
  receiptImage?: string
}

export type PostStatus = 'Published' | 'Archived'

export type PostType = 'Shipment' | 'Route'

export interface Post {
  id: string
  title: string
  author: string
  date: string
  status: PostStatus
  type: PostType
}

export const MOCK_VERIFICATIONS: VerificationRequest[] = [
  { id: 'v1', companyName: 'ATLAS Logistics',       wilaya: 'ALGIERS',     tradeRegisterNumber: '12345678914578', nif: '0000000000000000', submittedAt: '2MIN AGO', iconVariant: 'plus' },
  { id: 'v2', companyName: 'Sahara Transport',       wilaya: 'ORAN',        tradeRegisterNumber: '247854622214', nif: '0000000000000000', submittedAt: '2MIN AGO', iconVariant: 'chat' },
  { id: 'v3', companyName: 'Nord Express',           wilaya: 'CONSTANTINE', tradeRegisterNumber: '0000000000000000', nif: '0000000000000000', submittedAt: '2MIN AGO', iconVariant: 'plus' },
  { id: 'v4', companyName: 'Rapid Fret SPA',         wilaya: 'ANNABA',      tradeRegisterNumber: '0000000000000000', nif: '0000000000000000', submittedAt: '2MIN AGO', iconVariant: 'chat' },
  { id: 'v5', companyName: 'Trans Maghreb',          wilaya: 'TIZI OUZOU',  tradeRegisterNumber: '0000000000000000', nif: '0000000000000000', submittedAt: '2MIN AGO', iconVariant: 'plus' },
  { id: 'v6', companyName: 'Hauts Plateaux Cargo',   wilaya: 'SÉTIF',       tradeRegisterNumber: '0000000000000000', nif: '0000000000000000', submittedAt: '2MIN AGO', iconVariant: 'chat' },
  { id: 'v7', companyName: 'assia',       wilaya: 'ALGIERS',     tradeRegisterNumber: '0000000000000000', nif: '0000000000000000', submittedAt: '2MIN AGO', iconVariant: 'plus' },
  { id: 'v8', companyName: 'Sahara Transport',       wilaya: 'ORAN',        tradeRegisterNumber: '0000000000000000', nif: '0000000000000000', submittedAt: '2MIN AGO', iconVariant: 'chat' },
  { id: 'v9', companyName: 'Nord Express',           wilaya: 'CONSTANTINE', tradeRegisterNumber: '0000000000000000', nif: '0000000000000000', submittedAt: '2MIN AGO', iconVariant: 'plus' },
  { id: 'v10', companyName: 'Rapid Fret SPA',         wilaya: 'ANNABA',      tradeRegisterNumber: '0000000000000000', nif: '0000000000000000', submittedAt: '2MIN AGO', iconVariant: 'chat' },
  { id: 'v11', companyName: 'Trans Maghreb',          wilaya: 'TIZI OUZOU',  tradeRegisterNumber: '0000000000000000', nif: '0000000000000000', submittedAt: '2MIN AGO', iconVariant: 'plus' },
  { id: 'v12', companyName: 'lisa',   wilaya: 'SÉTIF',       tradeRegisterNumber: '0000000000000000', nif: '0000000000000000', submittedAt: '2MIN AGO', iconVariant: 'chat' },
]

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'a1',  auditNum: '#0892', adminName: 'Fahd',          userAccount: 'Aiboud Ichrak',   timestamp: 'Apr 13, 2026, 10:38 PM', decision: 'VERIFIED'     },
  { id: 'a2',  auditNum: '#0893', adminName: 'Rayane',        userAccount: 'ATLAS Logistics', timestamp: 'Apr 14, 2026, 11:22 AM', decision: 'DELETED'      },
  { id: 'a3',  auditNum: '#0894', adminName: 'Lyna Boukhemia',userAccount: 'Aiboud Ichrak',   timestamp: 'Apr 13, 2026, 10:38 PM', decision: 'BLOCKED POST' },
  { id: 'a4',  auditNum: '#0895', adminName: 'Rima Tebani',   userAccount: 'ATLAS Logistics', timestamp: 'Apr 14, 2026, 11:22 AM', decision: 'DELETED'      },
  { id: 'a5',  auditNum: '#0896', adminName: 'Lyna Boukhemia',userAccount: 'Aiboud Ichrak',   timestamp: 'Apr 13, 2026, 10:38 PM', decision: 'VERIFIED'     },
  { id: 'a6',  auditNum: '#0897', adminName: 'Rima Tebani',   userAccount: 'ATLAS Logistics', timestamp: 'Apr 14, 2026, 11:22 AM', decision: 'DELETED'      },
  { id: 'a7',  auditNum: '#0898', adminName: 'Lyna Boukhemia',userAccount: 'Aiboud Ichrak',   timestamp: 'Apr 13, 2026, 10:38 PM', decision: 'VERIFIED'     },
  { id: 'a8',  auditNum: '#0899', adminName: 'Rima Tebani',   userAccount: 'ATLAS Logistics', timestamp: 'Apr 14, 2026, 11:22 AM', decision: 'DELETED'      },
  { id: 'a9',  auditNum: '#0900', adminName: 'Lyna Boukhemia',userAccount: 'Aiboud Ichrak',   timestamp: 'Apr 13, 2026, 10:38 PM', decision: 'BLOCKED POST' },
  { id: 'a10', auditNum: '#0901', adminName: 'Rima Tebani',   userAccount: 'ATLAS Logistics', timestamp: 'Apr 14, 2026, 11:22 AM', decision: 'DELETED'      },
  { id: 'a11', auditNum: '#0902', adminName: 'Lyna Boukhemia',userAccount: 'Aiboud Ichrak',   timestamp: 'Apr 13, 2026, 10:38 PM', decision: 'VERIFIED'     },
  { id: 'a12', auditNum: '#0903', adminName: 'Rima Tebani',   userAccount: 'ATLAS Logistics', timestamp: 'Apr 14, 2026, 11:22 AM', decision: 'DELETED'      },
]

export const MOCK_PAYMENTS: PendingPayment[] = [
  { id: 'p1', userName: 'Ahmed',   amount: '50,000 DZD',  method: 'CCP Transfer', submittedOn: 'Oct 24, 2023', requestedPlan: 'PRO MONTHLY' },
  { id: 'p2', userName: 'Sarah', amount: '600,000 DZD', method: 'Baridi mob',   submittedOn: 'Oct 23, 2023', requestedPlan: 'ANNUAL'      },
  { id: 'p3', userName: 'Sarah', amount: '600,000 DZD', method: 'Baridi mob',   submittedOn: 'Oct 23, 2023', requestedPlan: 'ANNUAL'      },
  { id: 'p4', userName: 'Sarah', amount: '600,000 DZD', method: 'Baridi mob',   submittedOn: 'Oct 23, 2023', requestedPlan: 'ANNUAL'      },
  { id: 'p5', userName: 'fouad', amount: '600,000 DZD', method: 'Baridi mob',   submittedOn: 'Oct 23, 2023', requestedPlan: 'ANNUAL'      },
  { id: 'p6', userName: 'Sarah', amount: '600,000 DZD', method: 'Baridi mob',   submittedOn: 'Oct 23, 2023', requestedPlan: 'ANNUAL'      },
  { id: 'p7', userName: 'lyna', amount: '600,000 DZD', method: 'Baridi mob',   submittedOn: 'Oct 23, 2023', requestedPlan: 'ANNUAL'      },
  { id: 'p8', userName: 'Sarah', amount: '600,000 DZD', method: 'Baridi mob',   submittedOn: 'Oct 23, 2023', requestedPlan: 'ANNUAL'      },
  { id: 'p9', userName: 'rima', amount: '600,000 DZD', method: 'Baridi mob',   submittedOn: 'Oct 23, 2023', requestedPlan: 'ANNUAL'      },
  { id: 'p10', userName: 'Sarah', amount: '600,000 DZD', method: 'Baridi mob',   submittedOn: 'Oct 23, 2023', requestedPlan: 'ANNUAL'      },
  { id: 'p11', userName: 'Sarah', amount: '600,000 DZD', method: 'Baridi mob',   submittedOn: 'Oct 23, 2023', requestedPlan: 'ANNUAL'      },
]

export const MOCK_POSTS: Post[] = [
  { id: 'post1', title: 'Fast Logistics from Algiers to Oran', author: 'ATLAS Logistics', date: 'Apr 13, 2026', status: 'Published', type: 'Shipment' },
  { id: 'post2', title: 'Cargo Transport Service', author: 'Sahara Transport', date: 'Apr 12, 2026', status: 'Published', type: 'Route' },
  { id: 'post3', title: 'Express Delivery Nationwide', author: 'Nord Express', date: 'Apr 11, 2026', status: 'Published', type: 'Shipment' },
  { id: 'post4', title: 'Professional Freight Solutions', author: 'Rapid Fret SPA', date: 'Apr 10, 2026', status: 'Published', type: 'Route' },
  { id: 'post5', title: 'Maghreb Wide Transportation', author: 'Trans Maghreb', date: 'Apr 9, 2026', status: 'Published', type: 'Shipment' },
  { id: 'post6', title: 'Mountain Route Specialization', author: 'Hauts Plateaux Cargo', date: 'Apr 8, 2026', status: 'Archived', type: 'Route' },
  { id: 'post7', title: 'Reliable Shipping Partner', author: 'assia', date: 'Apr 7, 2026', status: 'Published', type: 'Shipment' },
  { id: 'post8', title: 'Coastal Transport Routes', author: 'Sahara Transport', date: 'Apr 6, 2026', status: 'Published', type: 'Route' },
  { id: 'post9', title: 'Express Parcels Service', author: 'Nord Express', date: 'Apr 5, 2026', status: 'Published', type: 'Shipment' },
  { id: 'post10', title: 'Freight Management System', author: 'Rapid Fret SPA', date: 'Apr 4, 2026', status: 'Published', type: 'Route' },
  { id: 'post11', title: 'Cross-Border Logistics', author: 'Trans Maghreb', date: 'Apr 3, 2026', status: 'Archived', type: 'Shipment' },
  { id: 'post12', title: 'Premium Cargo Services', author: 'lisa', date: 'Apr 2, 2026', status: 'Published', type: 'Route' },
]
