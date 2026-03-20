
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  Building2, 
  Key, 
  BarChart3, 
  Settings, 
  Users, 
  Bell, 
  Search, 
  Plus, 
  Download, 
  CheckCircle2, 
  XCircle, 
  X,
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  MoreVertical,
  LogOut,
  Menu,
  ShieldCheck,
  Cpu,
  Globe,
  Monitor,
  Database,
  Lock,
  Save,
  AlertCircle,
  Trash2,
  Mail,
  Pencil,
  Ban,
  ShieldAlert,
  Phone,
  UserCircle,
  ExternalLink,
  Upload,
  FileKey,
  FileCheck,
  HardDriveUpload
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  MOCK_PLANS, 
  MOCK_COMPANIES, 
  MOCK_SUBSCRIPTIONS, 
  MOCK_LICENSES, 
  MOCK_USERS, 
  MOCK_ACTIVITY, 
  DEFAULT_CONFIG,
  MOCK_DEVICE_TYPES,
  MOCK_OFFLINE_LICENSES,
  MOCK_OFFLINE_REQUESTS
} from './constants';
import { 
  SubscriptionPlan, 
  Subscription, 
  Company, 
  License, 
  User, 
  UserRole,
  ActivityLog, 
  ConfigSettings,
  SubscriptionStatus,
  LicenseStatus,
  DeviceType,
  DeviceTypeStatus,
  DeviceAllocation,
  ProductType,
  PlanStatus,
  OfflineLicenseRecord,
  OfflineActivationRequest,
  OfflineFingerprint
} from './types';
import {
  approveOfflineLicense,
  issueGenericOfflineLicense,
  uploadOfflineFingerprintRequest,
  bindAndActivateOfflineLicense,
  buildOfflineArtifactPreview
} from './services/offlineLicenseService';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const NavItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick, 
  collapsed = false,
  horizontal = false
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void,
  collapsed?: boolean,
  horizontal?: boolean
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
      active 
        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
      collapsed && "justify-center px-2",
      horizontal && "py-2"
    )}
  >
    <Icon size={20} className={cn("shrink-0", !active && "group-hover:scale-110 transition-transform")} />
    {(!collapsed || horizontal) && <span className="font-medium whitespace-nowrap">{label}</span>}
    {active && !horizontal && (
      <motion.div 
        layoutId="active-nav"
        className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
      />
    )}
    {collapsed && !horizontal && (
      <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
        {label}
      </div>
    )}
  </button>
);

const StatusBadge = ({ status }: { status: SubscriptionStatus | LicenseStatus | DeviceTypeStatus | PlanStatus }) => {
  const styles = {
    Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Expired: "bg-rose-100 text-rose-700 border-rose-200",
    Rejected: "bg-slate-100 text-slate-700 border-slate-200",
    Revoked: "bg-slate-100 text-slate-700 border-slate-200",
    Inactive: "bg-slate-100 text-slate-700 border-slate-200",
    Deleted: "bg-rose-100 text-rose-700 border-rose-200",
  };
  
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", styles[status as keyof typeof styles])}>
      {status}
    </span>
  );
};

const OfflineStatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'Pending Approval': "bg-amber-100 text-amber-700 border-amber-200",
    Approved: "bg-sky-100 text-sky-700 border-sky-200",
    Issued: "bg-indigo-100 text-indigo-700 border-indigo-200",
    'Awaiting Fingerprint': "bg-violet-100 text-violet-700 border-violet-200",
    'Fingerprint Uploaded': "bg-blue-100 text-blue-700 border-blue-200",
    Activated: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Revoked: "bg-rose-100 text-rose-700 border-rose-200",
    Uploaded: "bg-blue-100 text-blue-700 border-blue-200",
    Processed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    'Pending Upload': "bg-amber-100 text-amber-700 border-amber-200",
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", styles[status] || "bg-slate-100 text-slate-700 border-slate-200")}>
      {status}
    </span>
  );
};

const Card = ({ children, className, title, subtitle, action }: { children: React.ReactNode, className?: string, title?: string, subtitle?: string, action?: React.ReactNode, key?: string | number }) => (
  <div className={cn("bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden", className)}>
    {(title || action) && (
      <div className="px-6 py-4 border-bottom border-slate-100 flex items-center justify-between">
        <div>
          {title && <h3 className="font-bold text-slate-900">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

type DataTableColumn<T> = {
  key: string;
  label: string;
  sortable?: boolean;
  accessor: (row: T) => string | number;
  render: (row: T) => React.ReactNode;
};

type DataTableExportOptions = {
  csv?: boolean;
  excel?: boolean;
  pdf?: boolean;
};

function DataTable<T>({
  rows,
  columns,
  searchPlaceholder = 'Search...',
  exportOptions = { csv: true, excel: true, pdf: true },
  exportFileName = 'datatable-export',
}: {
  rows: T[];
  columns: DataTableColumn<T>[];
  searchPlaceholder?: string;
  exportOptions?: DataTableExportOptions;
  exportFileName?: string;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) =>
      columns.some((column) => String(column.accessor(row)).toLowerCase().includes(term))
    );
  }, [rows, columns, searchTerm]);

  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows;
    const column = columns.find((item) => item.key === sortKey);
    if (!column) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      const aValue = String(column.accessor(a)).toLowerCase();
      const bValue = String(column.accessor(b)).toLowerCase();
      const compare = aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? compare : -compare;
    });
  }, [filteredRows, columns, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const pagedRows = sortedRows.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, sortKey, sortDirection, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const toggleSort = (columnKey: string) => {
    if (sortKey === columnKey) {
      setSortDirection((current) => current === 'asc' ? 'desc' : 'asc');
      return;
    }
    setSortKey(columnKey);
    setSortDirection('asc');
  };

  const exportRows = sortedRows.map((row) =>
    columns.map((column) => String(column.accessor(row)))
  );

  const downloadBlob = (content: BlobPart, fileName: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    const header = columns.map((column) => `"${column.label.replace(/"/g, '""')}"`).join(',');
    const body = exportRows
      .map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(','))
      .join('\n');
    downloadBlob(`${header}\n${body}`, `${exportFileName}.csv`, 'text/csv;charset=utf-8;');
  };

  const exportExcel = () => {
    const header = columns.map((column) => column.label).join('\t');
    const body = exportRows.map((row) => row.join('\t')).join('\n');
    downloadBlob(`${header}\n${body}`, `${exportFileName}.xls`, 'application/vnd.ms-excel');
  };

  const exportPdf = () => {
    const printWindow = window.open('', '_blank', 'width=1024,height=768');
    if (!printWindow) return;
    const tableHead = columns.map((column) => `<th style="padding:8px;border:1px solid #dbe3ef;text-align:left;">${column.label}</th>`).join('');
    const tableBody = exportRows.map((row) =>
      `<tr>${row.map((value) => `<td style="padding:8px;border:1px solid #dbe3ef;">${value}</td>`).join('')}</tr>`
    ).join('');
    printWindow.document.write(`
      <html>
        <head><title>${exportFileName}</title></head>
        <body style="font-family:Arial, sans-serif; padding:24px;">
          <table style="border-collapse:collapse; width:100%;">
            <thead><tr>${tableHead}</tr></thead>
            <tbody>${tableBody}</tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {exportOptions.csv !== false && (
            <button onClick={exportCsv} className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">CSV</button>
          )}
          {exportOptions.excel !== false && (
            <button onClick={exportExcel} className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">Excel</button>
          )}
          {exportOptions.pdf !== false && (
            <button onClick={exportPdf} className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">PDF</button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100">
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => column.sortable && toggleSort(column.key)}
                    className={cn("inline-flex items-center gap-1", column.sortable ? "hover:text-slate-600" : "cursor-default")}
                  >
                    {column.label}
                    {column.sortable && sortKey === column.key && (
                      <ChevronRight size={12} className={cn(sortDirection === 'asc' ? "-rotate-90" : "rotate-90")} />
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {pagedRows.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-4 align-top">
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
            {pagedRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-slate-400">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-xs text-slate-500">
          Showing {pagedRows.length === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, sortedRows.length)} of {sortedRows.length}
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
          </select>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-slate-500">Page {page} of {totalPages}</span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ label, value, icon: Icon, trend, color }: { label: string, value: string | number, icon: any, trend?: string, color: string }) => (
  <Card className="relative overflow-hidden group">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        {trend && (
          <p className={cn("text-xs mt-2 flex items-center gap-1", trend.startsWith('+') ? "text-emerald-600" : "text-rose-600")}>
            {trend.startsWith('+') ? <ChevronRight size={12} className="-rotate-90" /> : <ChevronRight size={12} className="rotate-90" />}
            {trend} from last month
          </p>
        )}
      </div>
      <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", color)}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </Card>
);

// --- Main App ---

export default function App() {
  const CUSTOM_PLAN_ID = 'custom-plan';
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<User>(MOCK_USERS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data states
  const [plans, setPlans] = useState<SubscriptionPlan[]>(MOCK_PLANS);
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS);
  const [licenses, setLicenses] = useState<License[]>(MOCK_LICENSES);
  const [offlineLicenses, setOfflineLicenses] = useState<OfflineLicenseRecord[]>(MOCK_OFFLINE_LICENSES);
  const [offlineRequests, setOfflineRequests] = useState<OfflineActivationRequest[]>(MOCK_OFFLINE_REQUESTS);
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>(MOCK_DEVICE_TYPES);
  const [activity, setActivity] = useState<ActivityLog[]>(MOCK_ACTIVITY);
  const [config, setConfig] = useState<ConfigSettings>(DEFAULT_CONFIG);

  // Mockup states
  const [showCreateSub, setShowCreateSub] = useState(false);
  const [newSubAllocations, setNewSubAllocations] = useState<DeviceAllocation[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [subscriptionFormError, setSubscriptionFormError] = useState('');
  const [subscriptionTab, setSubscriptionTab] = useState<'plans' | 'manage'>('manage');
  const [licenseTab, setLicenseTab] = useState<'inventory' | 'offline'>('inventory');
  const [offlineManagementTab, setOfflineManagementTab] = useState<'requests' | 'activated'>('requests');

  useEffect(() => {
    if (showCreateSub) {
      // Initialize allocations with 0 for all active device types
      setNewSubAllocations(deviceTypes.filter(dt => dt.status === 'Active').map(dt => ({
        deviceTypeId: dt.id,
        count: 0
      })));
      setSelectedPlanId('');
      setSubscriptionFormError('');
    }
  }, [showCreateSub, deviceTypes]);
  const [showActivateSub, setShowActivateSub] = useState<{ id: string, company: string } | null>(null);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // User & Company Management states
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [showDeleteCompany, setShowDeleteCompany] = useState<Company | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeviceTypeModal, setShowDeviceTypeModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showOfflineLicenseModal, setShowOfflineLicenseModal] = useState(false);
  const [showOfflineRequestModal, setShowOfflineRequestModal] = useState(false);
  const [selectedOfflineLicenseId, setSelectedOfflineLicenseId] = useState<string | null>(null);
  const [selectedOfflineSubscriptionId, setSelectedOfflineSubscriptionId] = useState<string>('');
  const [selectedOfflineArtifact, setSelectedOfflineArtifact] = useState<{ title: string; content: string } | null>(null);
  const [editingDeviceType, setEditingDeviceType] = useState<DeviceType | null>(null);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteUser, setShowDeleteUser] = useState<User | null>(null);
  const [showActivePlan, setShowActivePlan] = useState<Company | null>(null);
  const [showSuspendModal, setShowSuspendModal] = useState<Company | null>(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const customPlanOption: SubscriptionPlan = {
    id: CUSTOM_PLAN_ID,
    code: 'CUSTOM',
    name: 'Custom',
    productType: 'Digital Signage',
    status: 'Active',
    duration: 0,
    mode: 'Periodic',
    totalDeviceLimit: 0,
    deviceLimitLabel: 'Custom Limit',
    description: 'Custom subscription configured as per request.',
    highlights: ['Manual duration and start date can be defined during subscription creation.'],
    features: ['Configurable allocation'],
    price: 0,
    billingLabel: 'Custom',
  };

  const getPlanById = (planId?: string) => {
    if (!planId) return undefined;
    return plans.find((plan) => plan.id === planId) ?? (planId === CUSTOM_PLAN_ID ? customPlanOption : undefined);
  };

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);
  const isCustomSubscriptionPlan = selectedPlanId === CUSTOM_PLAN_ID;
  const selectedPlanLimit = selectedPlan?.totalDeviceLimit ?? 0;
  const totalAllocatedDevices = newSubAllocations.reduce((sum, allocation) => sum + allocation.count, 0);
  const isAllocationLimitExceeded = Boolean(
    selectedPlan &&
    selectedPlanLimit > 0 &&
    totalAllocatedDevices > selectedPlanLimit
  );
  const subscriptionAllocationError = isAllocationLimitExceeded
    ? `Total allocation (${totalAllocatedDevices}) exceeds the selected plan limit (${selectedPlan?.deviceLimitLabel ?? selectedPlanLimit}).`
    : '';

  const handleCreateSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const companyId = (formData.get('companyId') as string)?.trim();
    const planId = formData.get('planId') as string;
    const isCustomPlan = planId === CUSTOM_PLAN_ID;
    const plan = isCustomPlan ? customPlanOption : plans.find(p => p.id === planId);

    if (!companyId) {
      setSubscriptionFormError('Please select a company before submitting the subscription request.');
      return;
    }

    if (!planId || !plan) {
      setSubscriptionFormError('Please select a plan before submitting the subscription request.');
      return;
    }

    if (isCustomPlan) {
      const requestedStartDate = (formData.get('startDate') as string)?.trim();
      const requestedDurationValue = Number(formData.get('duration') || 0);

      if (!requestedStartDate) {
        setSubscriptionFormError('Start date is required for a custom subscription.');
        return;
      }

      if (!Number.isFinite(requestedDurationValue) || requestedDurationValue <= 0) {
        setSubscriptionFormError('Duration must be greater than 0 for a custom subscription.');
        return;
      }
    }

    setSubscriptionFormError('');
    const planLimit = plan.totalDeviceLimit === 0 ? Number.MAX_SAFE_INTEGER : plan.totalDeviceLimit;

    // Validate total allocation
    const totalAllocated = newSubAllocations.reduce((sum, a) => sum + a.count, 0);
    if (totalAllocated > planLimit) {
      setSubscriptionFormError(`Total allocation (${totalAllocated}) exceeds the selected plan limit (${plan.deviceLimitLabel ?? plan.totalDeviceLimit}).`);
      return;
    }

    // If no allocation specified, default to first available or Windows
    let finalAllocations = [...newSubAllocations];
    if (totalAllocated === 0) {
      const defaultDT = deviceTypes.find(dt => dt.name.toLowerCase().includes('windows') && dt.status === 'Active') || deviceTypes.find(dt => dt.status === 'Active');
      if (defaultDT) {
        finalAllocations = [{ deviceTypeId: defaultDT.id, count: plan.totalDeviceLimit === 0 ? 999999 : plan.totalDeviceLimit }];
      }
    }

    const requestedStartDate = (formData.get('startDate') as string) || new Date().toISOString().split('T')[0];
    const requestedDuration = Number(formData.get('duration') || plan.duration || 0);
    const computedEndDate = requestedDuration > 0
      ? new Date(new Date(requestedStartDate).getTime() + (requestedDuration * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
      : 'No Expiry';

    const subData = {
      id: `sub-${Date.now()}`,
      companyId,
      planId: planId,
      status: 'Pending' as SubscriptionStatus,
      startDate: requestedStartDate,
      endDate: computedEndDate,
      requestedAt: new Date().toISOString().split('T')[0],
      allocations: finalAllocations,
    };

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSubscriptions(prev => [subData, ...prev]);
      setShowCreateSub(false);
    }, 1000);
  };

  const handleApproveSubscription = (id: string) => {
    const sub = subscriptions.find(s => s.id === id);
    if (!sub) return;
    const company = companies.find(c => c.id === sub.companyId)?.name || 'Unknown';
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, status: 'Active', approvedAt: new Date().toISOString().split('T')[0] } : s));
      setShowActivateSub({ id, company });
    }, 1000);
  };

  const [selectedSubId, setSelectedSubId] = useState<string>('');

  const handleGenerateKey = () => {
    if (!selectedSubId) {
      alert('Please select a subscription');
      return;
    }

    const sub = subscriptions.find(s => s.id === selectedSubId);
    if (!sub) return;

    const nextAvailableAllocation = sub.allocations
      ?.map(allocation => {
        const usedCount = licenses.filter(l =>
          l.subscriptionId === selectedSubId &&
          l.deviceTypeId === allocation.deviceTypeId &&
          l.status === 'Active'
        ).length;

        return {
          allocation,
          usedCount,
        };
      })
      .find(item => item.usedCount < item.allocation.count);

    const allocation = nextAvailableAllocation?.allocation;
    if (!allocation) {
      alert('No device allocation is available for this subscription');
      return;
    }

    const selectedDeviceTypeId = allocation.deviceTypeId;

    // Count existing active licenses for this sub and device type
    const existingLicensesCount = licenses.filter(l => 
      l.subscriptionId === selectedSubId && 
      l.deviceTypeId === selectedDeviceTypeId && 
      l.status === 'Active'
    ).length;

    if (existingLicensesCount >= allocation.count) {
      alert(`Allocation limit reached for this device type (${allocation.count}). Cannot generate more licenses.`);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const newKey = `LIC-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const newLicense: License = {
        id: `lic-${Date.now()}`,
        key: newKey,
        companyId: sub.companyId,
        subscriptionId: sub.id,
        deviceTypeId: selectedDeviceTypeId,
        status: 'Active',
        activationsCount: 0,
        maxActivations: 1, // One license = one device
        expiryDate: sub.endDate,
      };

      setLicenses(prev => [newLicense, ...prev]);
      setIsProcessing(false);
      setGeneratedKey(newKey);
      setSelectedSubId('');
    }, 1200);
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowCompanyModal(false);
      setEditingCompany(null);
    }, 1000);
  };

  const handleDeleteCompany = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (showDeleteCompany) {
        setCompanies(prev => prev.filter(c => c.id !== showDeleteCompany.id));
      }
      setShowDeleteCompany(null);
    }, 800);
  };

  const handleSuspendCompany = () => {
    if (!showSuspendModal) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const companyId = showSuspendModal.id;
      
      // Update Company
      setCompanies(prev => prev.map(c => 
        c.id === companyId 
          ? { ...c, status: 'Suspended', statusDescription: suspensionReason } 
          : c
      ));

      // Update Subscriptions
      setSubscriptions(prev => prev.map(s => 
        s.companyId === companyId 
          ? { ...s, status: 'Rejected' as SubscriptionStatus, statusDescription: suspensionReason } 
          : s
      ));

      // Update Licenses
      setLicenses(prev => prev.map(l => 
        l.companyId === companyId 
          ? { ...l, status: 'Revoked' as LicenseStatus, statusDescription: suspensionReason } 
          : l
      ));

      setShowSuspendModal(null);
      setSuspensionReason('');
    }, 1000);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const userData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as UserRole,
      designation: formData.get('designation') as string,
      mobile: formData.get('mobile') as string,
      alternateMobile: formData.get('alternateMobile') as string,
      isDisabled: formData.get('status') === 'Disabled',
    };

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (editingUser) {
        setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...userData } : u));
        if (currentUser.id === editingUser.id) {
          setCurrentUser(prev => ({ ...prev, ...userData }));
        }
      } else {
        const newUser: User = {
          id: `user-${Date.now()}`,
          ...userData,
          lastLogin: 'Never',
          theme: 'light',
          menuPosition: 'sidebar',
          profilePhoto: `https://picsum.photos/seed/${userData.name}/200`,
        };
        setUsers(prev => [...prev, newUser]);
      }
      setShowUserModal(false);
      setEditingUser(null);
    }, 1000);
  };

  const handleSaveDeviceType = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const dtData = {
      name: formData.get('name') as string,
      status: formData.get('status') as DeviceTypeStatus,
    };

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (editingDeviceType) {
        setDeviceTypes(prev => prev.map(dt => dt.id === editingDeviceType.id ? { ...dt, ...dtData } : dt));
      } else {
        const newDT: DeviceType = {
          id: `dt-${Date.now()}`,
          ...dtData,
        };
        setDeviceTypes(prev => [...prev, newDT]);
      }
      setShowDeviceTypeModal(false);
      setEditingDeviceType(null);
    }, 1000);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const parseList = (value: FormDataEntryValue | null) =>
      (value?.toString() ?? '')
        .split(/\r?\n/)
        .map(item => item.trim())
        .filter(Boolean);

    const totalDeviceLimit = Number(formData.get('totalDeviceLimit') || 0);
    const duration = Number(formData.get('duration') || 0);
    const nextPlanCode = () => {
      const maxCode = plans.reduce((max, plan) => {
        const numeric = Number(plan.code.replace(/\D/g, ''));
        return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
      }, 0);
      return `M-${String(maxCode + 1).padStart(4, '0')}`;
    };

    const planData: SubscriptionPlan = {
      id: editingPlan?.id ?? `plan-${Date.now()}`,
      code: editingPlan?.code ?? nextPlanCode(),
      name: (formData.get('name') as string).trim(),
      productType: (editingPlan?.productType ?? formData.get('productType')) as ProductType,
      status: formData.get('status') as PlanStatus,
      duration,
      mode: formData.get('mode') as SubscriptionPlan['mode'],
      totalDeviceLimit,
      deviceLimitLabel: (formData.get('deviceLimitLabel') as string).trim() || undefined,
      description: (formData.get('description') as string).trim(),
      highlights: parseList(formData.get('highlights')),
      features: parseList(formData.get('features')),
      price: Number(formData.get('price') || 0),
      billingLabel: (formData.get('billingLabel') as string).trim() || undefined,
    };

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (editingPlan) {
        setPlans(prev => prev.map(plan => plan.id === editingPlan.id ? planData : plan));
      } else {
        setPlans(prev => [...prev, planData]);
      }
      setShowPlanModal(false);
      setEditingPlan(null);
    }, 1000);
  };

  const handleCreateOfflineLicense = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const subscriptionId = formData.get('subscriptionId') as string;
    const subscription = subscriptions.find(item => item.id === subscriptionId);
    const plan = getPlanById(subscription?.planId);
    if (!subscription || !plan) return;
    const activeAllocations = subscription.allocations.filter(item => item.count > 0);
    const primaryAllocation = activeAllocations[0];
    const derivedSeats = activeAllocations.reduce((sum, item) => sum + item.count, 0);
    if (!primaryAllocation) return;

    const newRecord: OfflineLicenseRecord = {
      id: `off-${Date.now()}`,
      companyId: subscription.companyId,
      subscriptionId,
      planId: subscription.planId,
      productType: plan.productType,
      deviceTypeId: primaryAllocation.deviceTypeId,
      seats: derivedSeats,
      status: 'Pending Approval',
      notes: (formData.get('notes') as string)?.trim() || 'Awaiting subscription approval.',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setIsProcessing(true);
    setTimeout(() => {
      setOfflineLicenses(prev => [newRecord, ...prev]);
      setIsProcessing(false);
      setShowOfflineLicenseModal(false);
      setSelectedOfflineSubscriptionId('');
    }, 700);
  };

  const handleApproveOffline = async (licenseId: string) => {
    const record = offlineLicenses.find(item => item.id === licenseId);
    if (!record) return;
    setIsProcessing(true);
    const updated = await approveOfflineLicense(record);
    setOfflineLicenses(prev => prev.map(item => item.id === licenseId ? updated : item));
    setIsProcessing(false);
  };

  const handleIssueOffline = async (licenseId: string) => {
    const record = offlineLicenses.find(item => item.id === licenseId);
    if (!record) return;
    setIsProcessing(true);
    const updated = await issueGenericOfflineLicense(record);
    setOfflineLicenses(prev => prev.map(item => item.id === licenseId ? updated : item));
    setIsProcessing(false);
  };

  const handleUploadOfflineRequest = (licenseId: string) => {
    setSelectedOfflineLicenseId(licenseId);
    setShowOfflineRequestModal(true);
  };

  const handleSaveOfflineRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfflineLicenseId) return;
    const record = offlineLicenses.find(item => item.id === selectedOfflineLicenseId);
    if (!record) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const fingerprint: OfflineFingerprint = {
      machineName: formData.get('machineName') as string,
      macAddress: formData.get('macAddress') as string,
      ipAddress: formData.get('ipAddress') as string,
      hostName: formData.get('hostName') as string,
      osHash: formData.get('osHash') as string,
    };

    setIsProcessing(true);
    const result = await uploadOfflineFingerprintRequest(record, fingerprint);
    setOfflineLicenses(prev => prev.map(item => item.id === record.id ? result.license : item));
    setOfflineRequests(prev => [result.request, ...prev.filter(item => item.offlineLicenseId !== record.id)]);
    setIsProcessing(false);
    setShowOfflineRequestModal(false);
    setSelectedOfflineLicenseId(null);
  };

  const handleActivateOffline = async (licenseId: string) => {
    const record = offlineLicenses.find(item => item.id === licenseId);
    const request = offlineRequests.find(item => item.offlineLicenseId === licenseId && item.status === 'Uploaded');
    if (!record || !request) return;
    setIsProcessing(true);
    const result = await bindAndActivateOfflineLicense(record, request);
    setOfflineLicenses(prev => prev.map(item => item.id === licenseId ? result.license : item));
    setOfflineRequests(prev => prev.map(item => item.id === request.id ? result.request : item));
    setIsProcessing(false);
  };

  const openOfflineArtifact = (kind: 'generic-license' | 'request' | 'final-license', license: OfflineLicenseRecord) => {
    const request = offlineRequests.find(item => item.offlineLicenseId === license.id);
    setSelectedOfflineArtifact({
      title:
        kind === 'generic-license'
          ? 'Generic Offline License Preview'
          : kind === 'request'
            ? 'Fingerprint Request Preview'
            : 'Final Activated License Preview',
      content: buildOfflineArtifactPreview(kind, license, request),
    });
  };

  const handleDeleteUser = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (showDeleteUser) {
        setUsers(prev => prev.filter(u => u.id !== showDeleteUser.id));
      }
      setShowDeleteUser(null);
    }, 800);
  };

  // --- Views ---

  const DashboardView = () => {
    const chartData = [
      { name: 'Jan', value: 400 },
      { name: 'Feb', value: 300 },
      { name: 'Mar', value: 600 },
      { name: 'Apr', value: 800 },
      { name: 'May', value: 500 },
      { name: 'Jun', value: 900 },
    ];

    const pieData = [
      { name: 'Active', value: 45, color: '#10b981' },
      { name: 'Expired', value: 15, color: '#f43f5e' },
      { name: 'Pending', value: 10, color: '#f59e0b' },
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Companies" value={companies.length} icon={Building2} trend="+12%" color="bg-blue-500" />
          <StatCard label="Active Subscriptions" value={subscriptions.filter(s => s.status === 'Active').length} icon={CreditCard} trend="+5%" color="bg-emerald-500" />
          <StatCard label="Total Licenses" value={licenses.length} icon={Key} trend="+8%" color="bg-indigo-500" />
          <StatCard label="System Alerts" value={3} icon={AlertTriangle} color="bg-rose-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2" title="License Issuance Trend" subtitle="Monthly license generation overview">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="License Distribution" subtitle="Status breakdown">
            <div className="h-[300px] w-full flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-4">
                {pieData.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-slate-500">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Recent Activity" subtitle="System-wide audit trail" action={<button className="text-emerald-600 text-xs font-bold hover:underline">View All</button>}>
            <div className="space-y-4">
              {activity.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className={cn(
                    "p-2 rounded-lg",
                    log.status === 'Success' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  )}>
                    <Clock size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-900">{log.action}</p>
                      <span className="text-[10px] text-slate-400 font-medium">{log.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Resource: <span className="text-slate-700 font-medium">{log.resource}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Expiring Licenses" subtitle="Action required soon" action={<button className="text-emerald-600 text-xs font-bold hover:underline">Manage</button>}>
            <div className="space-y-4">
              {licenses.filter(l => l.status === 'Active').map((lic) => (
                <div key={lic.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <Building2 size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{companies.find(c => c.id === lic.companyId)?.name}</p>
                      <p className="text-xs text-slate-500">Expires: {lic.expiryDate}</p>
                    </div>
                  </div>
                  <StatusBadge status="Active" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const SubscriptionsView = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-200">
          <button 
            onClick={() => setSubscriptionTab('manage')}
            className={cn("px-4 py-2 text-sm font-bold border-b-2 transition-colors", subscriptionTab === 'manage' ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700")}
          >
            Manage Subscriptions
          </button>
          <button 
            onClick={() => setSubscriptionTab('plans')}
            className={cn("px-4 py-2 text-sm font-bold border-b-2 transition-colors", subscriptionTab === 'plans' ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700")}
          >
            Subscription Plans
          </button>
        </div>

        {subscriptionTab === 'manage' ? (
          <Card title="All Subscriptions" subtitle="Review and manage customer requests" action={<button onClick={() => setShowCreateSub(true)} className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-600 transition-colors"><Plus size={16} /> New Subscription</button>}>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Company</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Plan</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Duration</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <p className="text-sm font-bold text-slate-900">{companies.find(c => c.id === sub.companyId)?.name}</p>
                        <p className="text-xs text-slate-500">Requested: {sub.requestedAt}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-slate-700 font-medium">{getPlanById(sub.planId)?.name}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <StatusBadge status={sub.status} />
                          {sub.statusDescription && (
                            <p className="text-[10px] text-slate-400 italic max-w-[120px] truncate" title={sub.statusDescription}>
                              {sub.statusDescription}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-slate-700">{sub.startDate} to {sub.endDate}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {sub.status === 'Pending' && (
                            <>
                              <button 
                                onClick={() => handleApproveSubscription(sub.id)}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
                                title="Approve"
                              >
                                <CheckCircle2 size={18} />
                              </button>
                              <button className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Reject"><XCircle size={18} /></button>
                            </>
                          )}
                          <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"><MoreVertical size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className="flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{plan.name}({plan.mode})</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">{plan.code}</p>
                    <p className="text-xs text-slate-500 mt-1">{plan.productType}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                      <Monitor size={20} />
                    </div>
                    <StatusBadge status={plan.status} />
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-3xl font-bold text-slate-900">${plan.price}<span className="text-sm text-slate-400 font-normal"> / {plan.billingLabel ?? `${plan.duration} days`}</span></p>
                  <p className="text-sm text-slate-500 mt-2">{plan.description}</p>
                </div>
                <div className="space-y-3 flex-1">
                  <p className="text-xs font-bold text-slate-400 uppercase">Device Limit</p>
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Monitor size={16} />
                      <span className="text-sm font-bold">Total Devices</span>
                    </div>
                    <span className="text-lg font-bold text-emerald-700">{plan.deviceLimitLabel ?? plan.totalDeviceLimit}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase mt-4">Highlights</p>
                  <ul className="space-y-2">
                    {plan.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs font-bold text-slate-400 uppercase mt-4">Features</p>
                  <ul className="space-y-2">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPlan(plan);
                    setShowPlanModal(true);
                  }}
                  className="w-full mt-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
                >
                  Edit Plan
                </button>
              </Card>
            ))}
            <button
              type="button"
              onClick={() => {
                setEditingPlan(null);
                setShowPlanModal(true);
              }}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-emerald-300 hover:text-emerald-500 transition-all group"
            >
              <div className="p-4 bg-slate-50 rounded-full group-hover:bg-emerald-50 transition-colors">
                <Plus size={32} />
              </div>
              <span className="font-bold">Create New Plan</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  const CompaniesView = () => {
    const companyColumns: DataTableColumn<Company>[] = [
      {
        key: 'company',
        label: 'Company Name',
        sortable: true,
        accessor: (company) => `${company.name} ${company.id}`,
        render: (company) => (
          <div className="flex items-center gap-2">
            <div>
              <p className="text-sm font-bold text-slate-900">{company.name}</p>
              <p className="text-[10px] text-slate-400 font-mono">ID: {company.id}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'industry',
        label: 'Industry',
        sortable: true,
        accessor: (company) => company.industry,
        render: (company) => <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">{company.industry}</span>,
      },
      {
        key: 'contact',
        label: 'Contact Person',
        sortable: true,
        accessor: (company) => `${company.contactPerson} ${company.email} ${company.primaryMobile}`,
        render: (company) => (
          <div className="flex flex-col">
            <p className="text-sm font-medium text-slate-900">{company.contactPerson}</p>
            <p className="text-xs text-slate-500">{company.email}</p>
            <p className="text-[10px] text-slate-400">{company.primaryMobile}</p>
          </div>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        accessor: (company) => `${company.status} ${company.statusDescription ?? ''}`,
        render: (company) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                company.status === 'Active' ? "bg-emerald-500" :
                company.status === 'Disabled' ? "bg-slate-400" :
                company.status === 'Suspended' ? "bg-rose-500" : "bg-amber-500"
              )} />
              <span className="text-xs font-medium text-slate-700">{company.status}</span>
            </div>
            {company.statusDescription && (
              <p className="text-[10px] text-slate-400 italic max-w-[150px] truncate" title={company.statusDescription}>
                {company.statusDescription}
              </p>
            )}
          </div>
        ),
      },
      {
        key: 'assets',
        label: 'Assets',
        sortable: true,
        accessor: (company) => `${company.linkedSubscriptions.length} ${company.linkedLicenses.length}`,
        render: (company) => (
          <div className="flex items-center gap-3">
            <button onClick={() => setShowActivePlan(company)} className="flex items-center gap-1 text-xs text-emerald-600 font-bold hover:bg-emerald-50 px-2 py-1 rounded-lg transition-colors" title="View Subscriptions">
              <CreditCard size={14} /> {company.linkedSubscriptions.length}
            </button>
            <button onClick={() => setShowActivePlan(company)} className="flex items-center gap-1 text-xs text-indigo-600 font-bold hover:bg-indigo-50 px-2 py-1 rounded-lg transition-colors" title="View Licenses">
              <Key size={14} /> {company.linkedLicenses.length}
            </button>
          </div>
        ),
      },
      {
        key: 'actions',
        label: 'Actions',
        accessor: () => 'actions',
        render: (company) => (
          <div className="flex items-center gap-1">
            <button onClick={() => { setEditingCompany(company); setShowCompanyModal(true); }} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit Company">
              <Pencil size={16} />
            </button>
            <button onClick={() => setShowDeleteCompany(company)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete Company">
              <Trash2 size={16} />
            </button>
            <button onClick={() => setShowSuspendModal(company)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Ban/Suspend Company">
              <Ban size={16} />
            </button>
          </div>
        ),
      },
    ];

    return (
      <Card
        title="Company Directory"
        subtitle="Manage client profiles and linked assets"
        action={
          <button onClick={() => { setEditingCompany(null); setShowCompanyModal(true); }} className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-600 transition-colors">
            <Plus size={16} /> Add Company
          </button>
        }
      >
        <DataTable
          rows={companies}
          columns={companyColumns}
          searchPlaceholder="Search companies..."
          exportOptions={{ csv: true, excel: true, pdf: true }}
          exportFileName="company-directory"
        />
      </Card>
    );
  };

  const LicensesView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-200">
        <button
          onClick={() => setLicenseTab('inventory')}
          className={cn("px-4 py-2 text-sm font-bold border-b-2 transition-colors", licenseTab === 'inventory' ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700")}
        >
          License Inventory
        </button>
        <button
          onClick={() => setLicenseTab('offline')}
          className={cn("px-4 py-2 text-sm font-bold border-b-2 transition-colors", licenseTab === 'offline' ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700")}
        >
          Offline License Management
        </button>
      </div>

      {licenseTab === 'inventory' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2" title="License Inventory" subtitle="Active and historical license keys" action={<button className="text-slate-500 hover:text-slate-900"><Download size={18} /></button>}>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">License Key</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Company</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Device Type</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Activations</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Expiry</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {licenses.map((lic) => (
                    <tr key={lic.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-700">{lic.key}</code>
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-slate-900">
                        {companies.find(c => c.id === lic.companyId)?.name}
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          {deviceTypes.find(dt => dt.id === lic.deviceTypeId)?.name || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <StatusBadge status={lic.status} />
                          {lic.statusDescription && (
                            <p className="text-[10px] text-slate-400 italic max-w-[100px] truncate" title={lic.statusDescription}>
                              {lic.statusDescription}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="w-full max-w-[100px] bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full"
                            style={{ width: `${(lic.activationsCount / lic.maxActivations) * 100}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{lic.activationsCount} / {lic.maxActivations}</p>
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-600">{lic.expiryDate}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Download License"><Download size={16} /></button>
                          <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Revoke License"><XCircle size={16} /></button>
                          <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors" title="Settings"><Settings size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Generate License" subtitle="Issue new license for approved subs">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Select Subscription</label>
                <select
                  value={selectedSubId}
                  onChange={(e) => setSelectedSubId(e.target.value)}
                  className="w-full mt-1.5 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="">Choose an approved subscription...</option>
                  {subscriptions.filter(s => s.status === 'Active').map(s => (
                    <option key={s.id} value={s.id}>
                      {companies.find(c => c.id === s.companyId)?.name} - {getPlanById(s.planId)?.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedSubId && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase">Selected Plan & Device Allocation</p>
                  <div className="flex items-center justify-between text-sm text-slate-700">
                    <span>Plan</span>
                    <span className="font-bold text-slate-900">{getPlanById(subscriptions.find(s => s.id === selectedSubId)?.planId)?.name}</span>
                  </div>
                  {subscriptions.find(s => s.id === selectedSubId)?.allocations?.map(alloc => {
                    const dt = deviceTypes.find(d => d.id === alloc.deviceTypeId);
                    if (!dt || dt.status === 'Inactive') return null;

                    return (
                      <div key={dt.id} className="flex items-center justify-between text-sm text-slate-700">
                        <span>{dt.name}</span>
                        <span className="font-bold text-slate-900">{alloc.count}</span>
                      </div>
                    );
                  })}
                  <p className="text-[10px] text-slate-500">
                    The next license will be generated against the first available allocation automatically.
                  </p>
                </div>
              )}

              <div className="pt-4">
                <button
                  onClick={handleGenerateKey}
                  disabled={isProcessing || !selectedSubId}
                  className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Key size={18} />}
                  {isProcessing ? 'Generating...' : 'Generate License Key'}
                </button>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <div className="flex gap-2">
                  <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                  <p className="text-[10px] text-amber-700 leading-relaxed">
                    Generating a license will automatically bind it to the selected subscription and device type. Each license corresponds to one device allocation.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Pending Approval</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{offlineLicenses.filter(item => item.status === 'Pending Approval').length}</p>
                </div>
                <Mail className="text-amber-500" size={22} />
              </div>
            </Card>
            <Card className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Awaiting Fingerprint</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{offlineLicenses.filter(item => item.status === 'Awaiting Fingerprint').length}</p>
                </div>
                <FileKey className="text-indigo-500" size={22} />
              </div>
            </Card>
            <Card className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Uploaded Requests</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{offlineRequests.filter(item => item.status === 'Uploaded').length}</p>
                </div>
                <HardDriveUpload className="text-blue-500" size={22} />
              </div>
            </Card>
            <Card className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Activated</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{offlineLicenses.filter(item => item.status === 'Activated').length}</p>
                </div>
                <FileCheck className="text-emerald-500" size={22} />
              </div>
            </Card>
          </div>

          <Card
            title="Offline Lifecycle Overview"
            subtitle="Issue generic files, collect .req uploads, and generate final activated licenses"
            action={
              <button
                onClick={() => setShowOfflineLicenseModal(true)}
                className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-600 transition-colors"
              >
                <Plus size={16} /> New Offline License
              </button>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">1. Approval</p>
                <p className="text-sm text-slate-600">Admin creates an offline entitlement and approves it before any file is issued.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">2. Generic .lic</p>
                <p className="text-sm text-slate-600">Server generates a generic license file for transfer to the offline machine.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">3. Fingerprint .req</p>
                <p className="text-sm text-slate-600">Customer uploads the machine request file generated from the offline endpoint.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">4. Final .lic</p>
                <p className="text-sm text-slate-600">Server binds the entitlement to the fingerprint and produces the final activated license.</p>
              </div>
            </div>
          </Card>

          <Card title="Issued / Pending Offline Licenses" subtitle="Manage approval and generic .lic generation">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Company</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Plan</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Seats</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Artifacts</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {offlineLicenses.map((record) => {
                    const company = companies.find(item => item.id === record.companyId);
                    const plan = getPlanById(record.planId);
                    return (
                      <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-4">
                          <p className="text-sm font-bold text-slate-900">{company?.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{record.id}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-slate-700 font-medium">{plan?.name}</p>
                          <p className="text-[10px] text-slate-400">{record.createdAt}</p>
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-600">{record.productType}</td>
                        <td className="px-4 py-4 text-xs font-bold text-slate-700">{record.seats}</td>
                        <td className="px-4 py-4"><OfflineStatusBadge status={record.status} /></td>
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            {record.genericLicenseFileName && <p className="text-[10px] text-slate-500">{record.genericLicenseFileName}</p>}
                            {record.requestFileName && <p className="text-[10px] text-slate-500">{record.requestFileName}</p>}
                            {record.finalLicenseFileName && <p className="text-[10px] text-slate-500">{record.finalLicenseFileName}</p>}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {record.status === 'Pending Approval' && (
                              <button onClick={() => handleApproveOffline(record.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve Offline License"><CheckCircle2 size={18} /></button>
                            )}
                            {(record.status === 'Approved' || record.status === 'Issued') && (
                              <button onClick={() => handleIssueOffline(record.id)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Generate Generic .lic"><FileKey size={18} /></button>
                            )}
                            {record.genericLicenseFileName && (
                              <button onClick={() => openOfflineArtifact('generic-license', record)} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Preview Generic License"><ExternalLink size={18} /></button>
                            )}
                            {record.status === 'Awaiting Fingerprint' && (
                              <button onClick={() => handleUploadOfflineRequest(record.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Upload Fingerprint .req"><Upload size={18} /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card
            title="Offline Processing Queue"
            subtitle="Review activation requests and completed offline activations in table format"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4 border-b border-slate-200">
                <button
                  onClick={() => setOfflineManagementTab('requests')}
                  className={cn("px-4 py-2 text-sm font-bold border-b-2 transition-colors", offlineManagementTab === 'requests' ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700")}
                >
                  Activation Requests
                </button>
                <button
                  onClick={() => setOfflineManagementTab('activated')}
                  className={cn("px-4 py-2 text-sm font-bold border-b-2 transition-colors", offlineManagementTab === 'activated' ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700")}
                >
                  Activated Offline Licenses
                </button>
              </div>

              {offlineManagementTab === 'requests' ? (
                offlineRequests.length === 0 ? (
                  <p className="text-sm text-slate-400 italic py-6 text-center border border-dashed border-slate-200 rounded-2xl">No offline fingerprint requests uploaded yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Company</th>
                          <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Request File</th>
                          <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Machine</th>
                          <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Fingerprint</th>
                          <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {offlineRequests.map((request) => {
                          const record = offlineLicenses.find(item => item.id === request.offlineLicenseId);
                          const company = companies.find(item => item.id === record?.companyId);
                          return (
                            <tr key={request.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-4">
                                <p className="text-sm font-bold text-slate-900">{company?.name}</p>
                                <p className="text-[10px] text-slate-400">{request.uploadedAt}</p>
                              </td>
                              <td className="px-4 py-4 text-xs text-slate-600">{request.requestFileName}</td>
                              <td className="px-4 py-4">
                                <p className="text-xs font-bold text-slate-900">{request.fingerprint.machineName}</p>
                                <p className="text-[10px] text-slate-400">{request.fingerprint.hostName}</p>
                              </td>
                              <td className="px-4 py-4">
                                <p className="text-xs font-mono text-slate-700">{request.fingerprintHash}</p>
                                <p className="text-[10px] text-slate-400">{request.fingerprint.osHash}</p>
                              </td>
                              <td className="px-4 py-4">
                                <OfflineStatusBadge status={request.status} />
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => record && openOfflineArtifact('request', record)} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Preview .req"><ExternalLink size={16} /></button>
                                  {request.status === 'Uploaded' && record && (
                                    <button onClick={() => handleActivateOffline(record.id)} className="px-3 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors">
                                      Bind & Activate
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                offlineLicenses.filter(item => item.status === 'Activated').length === 0 ? (
                  <p className="text-sm text-slate-400 italic py-6 text-center border border-dashed border-slate-200 rounded-2xl">No activated offline licenses available yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Company</th>
                          <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Final License</th>
                          <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Activated At</th>
                          <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Fingerprint</th>
                          <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {offlineLicenses.filter(item => item.status === 'Activated').map((record) => {
                          const company = companies.find(item => item.id === record.companyId);
                          return (
                            <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-4">
                                <p className="text-sm font-bold text-slate-900">{company?.name}</p>
                                <p className="text-[10px] text-slate-400">{record.id}</p>
                              </td>
                              <td className="px-4 py-4 text-xs text-slate-600">{record.finalLicenseFileName}</td>
                              <td className="px-4 py-4 text-xs text-slate-600">{record.activatedAt}</td>
                              <td className="px-4 py-4">
                                <p className="text-xs font-mono text-slate-700">{record.fingerprintHash}</p>
                                <p className="text-[10px] text-slate-400">{record.requestFileName}</p>
                              </td>
                              <td className="px-4 py-4">
                                <OfflineStatusBadge status={record.status} />
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => openOfflineArtifact('final-license', record)} className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">
                                    Preview Final .lic
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );

  const ReportsView = () => {
    const data = [
      { name: 'Jan', sub: 400, lic: 240 },
      { name: 'Feb', sub: 300, lic: 139 },
      { name: 'Mar', sub: 200, lic: 980 },
      { name: 'Apr', sub: 278, lic: 390 },
      { name: 'May', sub: 189, lic: 480 },
      { name: 'Jun', sub: 239, lic: 380 },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Analytics & Reports</h2>
            <p className="text-sm text-slate-500">Insights into system performance and usage</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Download size={16} /> Export PDF
            </button>
            <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20">
              <Download size={16} /> CSV Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Subscription vs License Growth" subtitle="Comparative analysis over 6 months">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="sub" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="lic" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Consumption Tracking" subtitle="Real-time activation usage">
            <div className="space-y-6">
              {licenses.map(lic => (
                <div key={lic.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900">{companies.find(c => c.id === lic.companyId)?.name}</p>
                    <span className="text-xs font-bold text-slate-500">{Math.round((lic.activationsCount / lic.maxActivations) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-500",
                        (lic.activationsCount / lic.maxActivations) > 0.8 ? "bg-rose-500" : "bg-emerald-500"
                      )}
                      style={{ width: `${(lic.activationsCount / lic.maxActivations) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const AdministrationView = ({
    initialTab = 'users',
    visibleTabs = ['users', 'device-types', 'settings'],
  }: {
    initialTab?: 'users' | 'device-types' | 'settings',
    visibleTabs?: Array<'users' | 'device-types' | 'settings'>,
  }) => {
    const [adminTab, setAdminTab] = useState<'users' | 'device-types' | 'settings'>(initialTab);

    useEffect(() => {
      setAdminTab(initialTab);
    }, [initialTab]);

    return (
      <div className="space-y-6">
        {visibleTabs.length > 1 && (
          <div className="flex items-center gap-4 border-b border-slate-200">
            {visibleTabs.includes('users') && (
              <button 
                onClick={() => setAdminTab('users')}
                className={cn("px-4 py-2 text-sm font-bold border-b-2 transition-colors", adminTab === 'users' ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700")}
              >
                User Management
              </button>
            )}
            {visibleTabs.includes('device-types') && (
              <button 
                onClick={() => setAdminTab('device-types')}
                className={cn("px-4 py-2 text-sm font-bold border-b-2 transition-colors", adminTab === 'device-types' ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700")}
              >
                Device Types
              </button>
            )}
            {visibleTabs.includes('settings') && (
              <button 
                onClick={() => setAdminTab('settings')}
                className={cn("px-4 py-2 text-sm font-bold border-b-2 transition-colors", adminTab === 'settings' ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700")}
              >
                System Configuration
              </button>
            )}
          </div>
        )}

        {adminTab === 'users' ? (
          <Card 
            title="System Users" 
            subtitle="Manage administrative access and roles" 
            action={
              <button 
                onClick={() => { setEditingUser(null); setShowUserModal(true); }}
                className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-600 transition-colors"
              >
                <Plus size={16} /> Add User
              </button>
            }
          >
            <DataTable
              rows={users}
              searchPlaceholder="Search users..."
              exportOptions={{ csv: true, excel: true, pdf: false }}
              exportFileName="system-users"
              columns={[
                {
                  key: 'user',
                  label: 'User',
                  sortable: true,
                  accessor: (u) => `${u.name} ${u.email}`,
                  render: (u) => (
                    <div className="flex items-center gap-3">
                      {u.profilePhoto ? (
                        <img src={u.profilePhoto} alt={u.name} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs uppercase">
                          {u.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900">{u.name}</p>
                          {u.isDisabled && <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-bold uppercase">Disabled</span>}
                        </div>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'designation',
                  label: 'Designation',
                  sortable: true,
                  accessor: (u) => u.designation,
                  render: (u) => <p className="text-xs font-medium text-slate-700">{u.designation}</p>,
                },
                {
                  key: 'mobile',
                  label: 'Mobile',
                  sortable: true,
                  accessor: (u) => u.mobile,
                  render: (u) => <p className="text-xs text-slate-500">{u.mobile}</p>,
                },
                {
                  key: 'role',
                  label: 'Role',
                  sortable: true,
                  accessor: (u) => u.role,
                  render: (u) => <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">{u.role}</span>,
                },
                {
                  key: 'actions',
                  label: 'Actions',
                  accessor: () => 'actions',
                  render: (u) => (
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditingUser(u); setShowUserModal(true); }} className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors" title="Edit User Profile">
                        <UserCircle size={18} />
                      </button>
                      <button onClick={() => setShowDeleteUser(u)} className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors" title="Delete User">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        ) : adminTab === 'device-types' ? (
          <Card 
            title="Device Types" 
            subtitle="Manage supported platforms and hardware" 
            action={
              <button 
                onClick={() => { setEditingDeviceType(null); setShowDeviceTypeModal(true); }}
                className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-600 transition-colors"
              >
                <Plus size={16} /> Add Device Type
              </button>
            }
          >
            <DataTable
              rows={deviceTypes}
              searchPlaceholder="Search device types..."
              exportOptions={{ csv: false, excel: true, pdf: true }}
              exportFileName="device-types"
              columns={[
                {
                  key: 'id',
                  label: 'ID',
                  sortable: true,
                  accessor: (dt) => dt.id,
                  render: (dt) => <code className="text-xs font-mono text-slate-500">{dt.id}</code>,
                },
                {
                  key: 'name',
                  label: 'Name',
                  sortable: true,
                  accessor: (dt) => dt.name,
                  render: (dt) => <p className="text-sm font-bold text-slate-900">{dt.name}</p>,
                },
                {
                  key: 'status',
                  label: 'Status',
                  sortable: true,
                  accessor: (dt) => dt.status,
                  render: (dt) => <StatusBadge status={dt.status} />,
                },
                {
                  key: 'actions',
                  label: 'Actions',
                  accessor: () => 'actions',
                  render: (dt) => (
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditingDeviceType(dt); setShowDeviceTypeModal(true); }} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit Device Type">
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setDeviceTypes(prev => prev.map(item => item.id === dt.id ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item));
                        }}
                        className={cn("p-1.5 rounded-lg transition-colors", dt.status === 'Active' ? "text-rose-600 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50")}
                        title={dt.status === 'Active' ? "Deactivate" : "Activate"}
                      >
                        {dt.status === 'Active' ? <Ban size={18} /> : <CheckCircle2 size={18} />}
                      </button>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="License Policy" subtitle="Global issuance and usage rules">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Grace Period</p>
                    <p className="text-xs text-slate-500">Days allowed after expiry</p>
                  </div>
                  <input type="number" defaultValue={config.licensePolicy.gracePeriod} className="w-20 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Allow Overuse</p>
                    <p className="text-xs text-slate-500">Allow activations beyond limit</p>
                  </div>
                  <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Overuse Threshold</p>
                    <p className="text-xs text-slate-500">Percentage above limit</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="number" defaultValue={config.licensePolicy.overuseThreshold} className="w-20 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    <span className="text-xs font-bold text-slate-400">%</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="JWT & Security" subtitle="Authentication and encryption settings">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">JWT Issuer</label>
                  <div className="flex items-center gap-2">
                    <input type="text" defaultValue={config.jwtConfig.issuer} className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono" />
                    <button className="p-1.5 text-slate-400 hover:text-slate-900"><Lock size={16} /></button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Algorithm</label>
                    <select className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                      <option>RS256</option>
                      <option>HS256</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Encryption</label>
                    <select className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                      <option>AES-256-GCM</option>
                      <option>AES-128-CBC</option>
                    </select>
                  </div>
                </div>
                <div className="pt-2">
                  <button className="w-full py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
                    Save Security Config
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'subscriptions': return <SubscriptionsView />;
      case 'companies': return <CompaniesView />;
      case 'licenses': return <LicensesView />;
      case 'reports': return <ReportsView />;
      case 'administration': return <AdministrationView initialTab="users" visibleTabs={['users']} />;
      case 'administration-users': return <AdministrationView initialTab="users" visibleTabs={['users']} />;
      case 'configuration': return <AdministrationView initialTab="settings" visibleTabs={['settings', 'device-types']} />;
      case 'configuration-system': return <AdministrationView initialTab="settings" visibleTabs={['settings', 'device-types']} />;
      case 'configuration-device-types': return <AdministrationView initialTab="device-types" visibleTabs={['settings', 'device-types']} />;
      default: return <DashboardView />;
    }
  };

  const isAdministrationTab = activeTab.startsWith('administration');
  const isConfigurationTab = activeTab.startsWith('configuration');

  return (
    <div className={cn(
      "min-h-screen flex font-sans transition-colors duration-300",
      currentUser.theme === 'dark' ? "bg-slate-950 text-slate-100 dark" : "bg-slate-50 text-slate-900"
    )}>
      {/* Sidebar - Only if menuPosition is 'sidebar' */}
      {currentUser.menuPosition === 'sidebar' && (
        <motion.aside 
          initial={false}
          animate={{ width: collapsed ? 80 : 260 }}
          className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col sticky top-0 h-screen z-40"
        >
          <div className="p-6 flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  <ShieldCheck size={20} />
                </div>
                <span className="font-bold text-lg tracking-tight">LIC Manager</span>
              </div>
            )}
            {collapsed && (
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white mx-auto">
                <ShieldCheck size={20} />
              </div>
            )}
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            <NavItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} collapsed={collapsed} />
            <NavItem icon={Building2} label="Companies" active={activeTab === 'companies'} onClick={() => setActiveTab('companies')} collapsed={collapsed} />
            <NavItem icon={CreditCard} label="Subscriptions" active={activeTab === 'subscriptions'} onClick={() => setActiveTab('subscriptions')} collapsed={collapsed} />
            <NavItem icon={Key} label="Licenses" active={activeTab === 'licenses'} onClick={() => setActiveTab('licenses')} collapsed={collapsed} />
            <NavItem icon={BarChart3} label="Reports" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} collapsed={collapsed} />
            <div className="pt-4 pb-2">
              <div className={cn("h-px bg-slate-100 dark:bg-slate-800 mx-2", collapsed && "mx-4")} />
            </div>
            <NavItem icon={Settings} label="Administration" active={isAdministrationTab} onClick={() => setActiveTab('administration-users')} collapsed={collapsed} />
            <NavItem icon={Database} label="Configuration" active={isConfigurationTab} onClick={() => setActiveTab('configuration')} collapsed={collapsed} />
          </nav>

          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group"
            >
              <Menu size={20} className="shrink-0 group-hover:text-slate-900 dark:group-hover:text-slate-100" />
              {!collapsed && <span className="font-medium">Collapse Menu</span>}
            </button>
          </div>
        </motion.aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-8 flex-1">
            {/* Logo for Topbar mode */}
            {currentUser.menuPosition === 'topbar' && (
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  <ShieldCheck size={20} />
                </div>
                <span className="font-bold text-lg tracking-tight hidden md:block">LIC Manager</span>
              </div>
            )}

            {/* Topbar Navigation */}
            {currentUser.menuPosition === 'topbar' && (
              <nav className="hidden lg:flex items-center gap-1">
                <NavItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} horizontal />
                <NavItem icon={Building2} label="Companies" active={activeTab === 'companies'} onClick={() => setActiveTab('companies')} horizontal />
                <NavItem icon={CreditCard} label="Subscriptions" active={activeTab === 'subscriptions'} onClick={() => setActiveTab('subscriptions')} horizontal />
                <NavItem icon={Key} label="Licenses" active={activeTab === 'licenses'} onClick={() => setActiveTab('licenses')} horizontal />
                <NavItem icon={BarChart3} label="Reports" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} horizontal />
                <NavItem icon={Settings} label="Admin" active={isAdministrationTab} onClick={() => setActiveTab('administration-users')} horizontal />
                <NavItem icon={Database} label="Configuration" active={isConfigurationTab} onClick={() => setActiveTab('configuration')} horizontal />
              </nav>
            )}

            <div className="flex-1 max-w-xl">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none text-slate-900 dark:text-slate-100"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
            
            {/* User Profile Button */}
            <button 
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-3 p-1.5 pr-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 overflow-hidden border-2 border-transparent group-hover:border-emerald-500 transition-all">
                {currentUser.profilePhoto ? (
                  <img src={currentUser.profilePhoto} alt={currentUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <Users size={20} />
                )}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none mb-1">{currentUser.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">{currentUser.designation || currentUser.role}</p>
              </div>
            </button>

            <button className="p-2.5 text-slate-400 hover:text-rose-500 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* View Container */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 capitalize">{activeTab}</h1>
                  <p className="text-slate-500 mt-1">Manage your license server ecosystem efficiently.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>Home</span>
                  <ChevronRight size={12} />
                  <span className="text-emerald-500">{activeTab}</span>
                </div>
              </div>

              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Modals */}
        <AnimatePresence>
          {showCreateSub && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isProcessing && setShowCreateSub(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Create New Subscription</h2>
                    <button onClick={() => setShowCreateSub(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button>
                  </div>
                  <form onSubmit={handleCreateSubscription} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Company</label>
                        <select
                          name="companyId"
                          required
                          onChange={() => setSubscriptionFormError('')}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                        >
                          <option value="">Select Company</option>
                          {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Plan</label>
                        <select 
                          name="planId" 
                          required 
                          value={selectedPlanId}
                          onChange={(e) => {
                            setSelectedPlanId(e.target.value);
                            setSubscriptionFormError('');
                          }}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                        >
                          <option value="">Select Plan</option>
                          {plans.map((p) => <option key={p.id} value={p.id}>{p.name}{p.status !== 'Active' ? ` (${p.status})` : ''}</option>)}
                          <option value={CUSTOM_PLAN_ID}>Custom</option>
                        </select>
                      </div>
                    </div>

                    {selectedPlanId && (
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-500 uppercase">Device Allocation</p>
                          {!isCustomSubscriptionPlan && (
                            <p className="text-xs font-bold text-emerald-600">
                              Limit: {selectedPlan?.totalDeviceLimit}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {deviceTypes.filter(dt => dt.status === 'Active').map(dt => (
                            <div key={dt.id} className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">{dt.name}</label>
                              <input 
                                type="number" 
                                min="0"
                                value={newSubAllocations.find(a => a.deviceTypeId === dt.id)?.count || 0}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  setSubscriptionFormError('');
                                  setNewSubAllocations(prev => prev.map(a => a.deviceTypeId === dt.id ? { ...a, count: val } : a));
                                }}
                                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 outline-none"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-500">Total Allocated</p>
                          <p className={cn(
                            "text-sm font-bold",
                            isAllocationLimitExceeded
                              ? "text-rose-500" 
                              : !isCustomSubscriptionPlan
                                ? "text-emerald-600"
                                : "text-slate-700"
                          )}>
                            {isCustomSubscriptionPlan
                              ? totalAllocatedDevices
                              : `${totalAllocatedDevices} / ${selectedPlan?.totalDeviceLimit}`}
                          </p>
                        </div>
                        {subscriptionAllocationError && (
                          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2">
                            <p className="text-xs font-medium text-rose-600">{subscriptionAllocationError}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {isCustomSubscriptionPlan && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase">Start Date</label>
                          <input name="startDate" type="date" required onChange={() => setSubscriptionFormError('')} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase">Duration (Days)</label>
                          <input name="duration" type="number" min="1" required defaultValue={30} onChange={() => setSubscriptionFormError('')} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                        </div>
                      </div>
                    )}
                    {subscriptionFormError && (
                      <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2">
                        <p className="text-xs font-medium text-rose-600">{subscriptionFormError}</p>
                      </div>
                    )}
                    <div className="pt-4">
                      <button 
                        type="submit"
                        disabled={isProcessing || isAllocationLimitExceeded}
                        className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={18} />}
                        {isProcessing ? 'Creating Request...' : 'Submit Subscription Request'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}

          {showActivateSub && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowActivateSub(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden text-center p-8"
              >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Subscription Activated!</h2>
                <p className="text-slate-500 mb-8">
                  The subscription for <span className="font-bold text-slate-900">{showActivateSub.company}</span> has been successfully approved and activated.
                </p>
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      setShowActivateSub(null);
                      setActiveTab('licenses');
                    }}
                    className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors"
                  >
                    Go to Licenses
                  </button>
                  <button 
                    onClick={() => setShowActivateSub(null)}
                    className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {generatedKey && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setGeneratedKey(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">License Key Generated</h2>
                    <button onClick={() => setGeneratedKey(null)} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button>
                  </div>
                  <div className="bg-slate-900 rounded-2xl p-6 mb-6 relative group">
                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">New License Key</p>
                    <code className="text-xl font-mono text-white break-all block">{generatedKey}</code>
                    <button 
                      onClick={() => navigator.clipboard.writeText(generatedKey)}
                      className="absolute top-4 right-4 p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                      title="Copy to Clipboard"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                      <ShieldCheck size={24} className="text-blue-600 shrink-0" />
                      <p className="text-xs text-blue-700 leading-relaxed">
                        This key is now active and ready for distribution. You can download the license file or send it directly to the customer.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                        <Download size={18} /> Download File
                      </button>
                      <button 
                        onClick={() => setGeneratedKey(null)}
                        className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Company Modal (Add/Edit) */}
          {showCompanyModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isProcessing && setShowCompanyModal(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">{editingCompany ? 'Edit Company' : 'Add New Company'}</h2>
                    <button onClick={() => setShowCompanyModal(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button>
                  </div>
                  <form onSubmit={handleSaveCompany} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Company Name</label>
                        <input 
                          type="text" 
                          required 
                          defaultValue={editingCompany?.name}
                          placeholder="e.g. Acme Corp"
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Industry</label>
                        <select 
                          required 
                          defaultValue={editingCompany?.industry}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                        >
                          <option value="Technology">Technology</option>
                          <option value="Finance">Finance</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Retail">Retail</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Contact Person Name</label>
                      <input 
                        type="text" 
                        required 
                        defaultValue={editingCompany?.contactPerson}
                        placeholder="Full Name"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Primary Mobile</label>
                        <input 
                          type="tel" 
                          required 
                          defaultValue={editingCompany?.primaryMobile}
                          placeholder="+1 555-0000"
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Alternate Mobile</label>
                        <input 
                          type="tel" 
                          defaultValue={editingCompany?.alternateMobile}
                          placeholder="+1 555-0001"
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" 
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Contact Email</label>
                      <input 
                        type="email" 
                        required 
                        defaultValue={editingCompany?.email}
                        placeholder="admin@company.com"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Company Status</label>
                      <select 
                        required 
                        defaultValue={editingCompany?.status || 'Active'}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      >
                        <option value="Active">Active - Full access to all features</option>
                        <option value="Disabled">Disabled - Temporary access restriction</option>
                        <option value="Suspended">Suspended - Banned from the system</option>
                        <option value="Deleted">Deleted - Marked for removal</option>
                      </select>
                      <p className="text-[10px] text-slate-400 mt-1 italic">
                        Changing status will affect all linked licenses and subscriptions.
                      </p>
                    </div>

                    <div className="pt-4">
                      <button 
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                      >
                        {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                        {isProcessing ? 'Saving...' : editingCompany ? 'Update Company' : 'Create Company'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}

          {/* Delete Company Confirmation */}
          {showDeleteCompany && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isProcessing && setShowDeleteCompany(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8 text-center"
              >
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Delete Company?</h2>
                <p className="text-slate-500 mb-8">
                  Are you sure you want to delete <span className="font-bold text-slate-900">{showDeleteCompany.name}</span>? This action cannot be undone and will affect all linked subscriptions.
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowDeleteCompany(null)}
                    disabled={isProcessing}
                    className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDeleteCompany}
                    disabled={isProcessing}
                    className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
                  >
                    {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Trash2 size={18} />}
                    {isProcessing ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Profile Modal */}
          {showProfileModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isProcessing && setShowProfileModal(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">User Profile</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account settings and preferences</p>
                  </div>
                  <button 
                    onClick={() => setShowProfileModal(false)}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-8 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left: Photo & Basic Info */}
                    <div className="space-y-6 text-center md:text-left">
                      <div className="relative inline-block group">
                        <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 relative group">
                          {currentUser.profilePhoto ? (
                            <img 
                              src={currentUser.profilePhoto} 
                              alt={currentUser.name} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <Users size={48} />
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Plus size={24} className="text-white" />
                          </div>
                          <input 
                            type="file" 
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setCurrentUser(prev => ({ ...prev, profilePhoto: reader.result as string }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{currentUser.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{currentUser.designation}</p>
                        <span className="inline-block mt-2 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          {currentUser.role}
                        </span>
                      </div>
                    </div>

                    {/* Right: Settings */}
                    <div className="md:col-span-2 space-y-8">
                      {/* Appearance */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
                            <Monitor size={18} />
                          </div>
                          <h4 className="font-bold text-slate-900 dark:text-slate-100">Appearance</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <button 
                            onClick={() => setCurrentUser(prev => ({ ...prev, theme: 'light' }))}
                            className={cn(
                              "p-4 border-2 rounded-2xl transition-all text-left",
                              currentUser.theme === 'light' ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10" : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                            )}
                          >
                            <div className="w-full h-12 bg-white border border-slate-200 rounded-lg mb-3" />
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Light Mode</p>
                          </button>
                          <button 
                            onClick={() => setCurrentUser(prev => ({ ...prev, theme: 'dark' }))}
                            className={cn(
                              "p-4 border-2 rounded-2xl transition-all text-left",
                              currentUser.theme === 'dark' ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10" : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                            )}
                          >
                            <div className="w-full h-12 bg-slate-900 border border-slate-800 rounded-lg mb-3" />
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Dark Mode</p>
                          </button>
                        </div>
                      </section>

                      {/* Navigation Layout */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center">
                            <Menu size={18} />
                          </div>
                          <h4 className="font-bold text-slate-900 dark:text-slate-100">Navigation Layout</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <button 
                            onClick={() => setCurrentUser(prev => ({ ...prev, menuPosition: 'sidebar' }))}
                            className={cn(
                              "p-4 border-2 rounded-2xl transition-all text-left",
                              currentUser.menuPosition === 'sidebar' ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10" : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                            )}
                          >
                            <div className="flex gap-1 h-12 mb-3">
                              <div className="w-1/4 bg-slate-200 dark:bg-slate-700 rounded" />
                              <div className="w-3/4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded" />
                            </div>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Sidebar Menu</p>
                          </button>
                          <button 
                            onClick={() => setCurrentUser(prev => ({ ...prev, menuPosition: 'topbar' }))}
                            className={cn(
                              "p-4 border-2 rounded-2xl transition-all text-left",
                              currentUser.menuPosition === 'topbar' ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10" : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                            )}
                          >
                            <div className="flex flex-col gap-1 h-12 mb-3">
                              <div className="h-1/4 bg-slate-200 dark:bg-slate-700 rounded" />
                              <div className="h-3/4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded" />
                            </div>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Top Navigation</p>
                          </button>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                  <button 
                    onClick={() => setShowProfileModal(false)}
                    className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      setIsProcessing(true);
                      setTimeout(() => {
                        setIsProcessing(false);
                        setShowProfileModal(false);
                        setUsers(prev => prev.map(u => u.id === currentUser.id ? currentUser : u));
                      }, 1000);
                    }}
                    className="px-8 py-2 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                  >
                    {isProcessing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                    {isProcessing ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Offline License Modal */}
          {showOfflineLicenseModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isProcessing && setShowOfflineLicenseModal(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-8">
                  {(() => {
                    const selectedSubscription = subscriptions.find(item => item.id === selectedOfflineSubscriptionId);
                    const selectedPlan = getPlanById(selectedSubscription?.planId);
                    const selectedCompany = companies.find(item => item.id === selectedSubscription?.companyId);
                    const selectedAllocationSummary = selectedSubscription?.allocations
                      ?.filter(item => item.count > 0)
                      .map(item => `${deviceTypes.find(dt => dt.id === item.deviceTypeId)?.name || 'Unknown'}: ${item.count}`)
                      .join(', ');
                    const selectedSeatCount = selectedSubscription?.allocations?.reduce((sum, item) => sum + item.count, 0) || 0;
                    return (
                      <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Create Offline License</h2>
                    <button onClick={() => setShowOfflineLicenseModal(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button>
                  </div>
                  <form onSubmit={handleCreateOfflineLicense} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Active Subscription</label>
                      <select
                        name="subscriptionId"
                        required
                        value={selectedOfflineSubscriptionId}
                        onChange={(e) => setSelectedOfflineSubscriptionId(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      >
                        <option value="">Select subscription</option>
                        {subscriptions.filter(item => item.status === 'Active').map(item => (
                          <option key={item.id} value={item.id}>
                            {companies.find(company => company.id === item.companyId)?.name} - {getPlanById(item.planId)?.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {selectedSubscription && (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase">Derived From Subscription</p>
                        <p className="text-sm text-slate-700">Company: <span className="font-bold text-slate-900">{selectedCompany?.name}</span></p>
                        <p className="text-sm text-slate-700">Plan: <span className="font-bold text-slate-900">{selectedPlan?.name}</span></p>
                        <p className="text-sm text-slate-700">Device Allocation: <span className="font-bold text-slate-900">{selectedAllocationSummary || 'No device allocation found'}</span></p>
                        <p className="text-sm text-slate-700">Total Seats: <span className="font-bold text-slate-900">{selectedSeatCount}</span></p>
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Notes</label>
                      <textarea
                        name="notes"
                        defaultValue="Offline entitlement created for manual transfer workflow."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none min-h-[100px] resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                      {isProcessing ? 'Creating...' : 'Create Offline License'}
                    </button>
                  </form>
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            </div>
          )}

          {/* Offline Request Modal */}
          {showOfflineRequestModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isProcessing && setShowOfflineRequestModal(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Upload Fingerprint Request</h2>
                    <button onClick={() => setShowOfflineRequestModal(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button>
                  </div>
                  <form onSubmit={handleSaveOfflineRequest} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Machine Name</label>
                        <input name="machineName" type="text" required placeholder="BRANCH-KIOSK-01" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Host Name</label>
                        <input name="hostName" type="text" required placeholder="signage-host-01" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">MAC Address</label>
                        <input name="macAddress" type="text" required placeholder="00:1A:2B:3C:4D:5E" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">IP Address</label>
                        <input name="ipAddress" type="text" required placeholder="10.0.0.21" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">OS Hash</label>
                        <input name="osHash" type="text" required placeholder="OS-89A7220F" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload size={18} />}
                      {isProcessing ? 'Uploading...' : 'Upload .req Data'}
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          )}

          {/* Offline Artifact Preview */}
          {selectedOfflineArtifact && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedOfflineArtifact(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">{selectedOfflineArtifact.title}</h2>
                    <button onClick={() => setSelectedOfflineArtifact(null)} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button>
                  </div>
                  <div className="bg-slate-950 rounded-2xl p-6 overflow-x-auto">
                    <pre className="text-xs text-emerald-200 whitespace-pre-wrap">{selectedOfflineArtifact.content}</pre>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Plan Modal */}
          {showPlanModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isProcessing && setShowPlanModal(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-8 max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">{editingPlan ? 'Edit Subscription Plan' : 'Create Subscription Plan'}</h2>
                    <button onClick={() => setShowPlanModal(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button>
                  </div>
                  <form onSubmit={handleSavePlan} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Plan Code</label>
                        <input
                          type="text"
                          value={editingPlan?.code ?? 'Auto Generated From Backend'}
                          disabled
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Plan Name</label>
                        <input
                          name="name"
                          type="text"
                          required
                          defaultValue={editingPlan?.name}
                          placeholder="Business Plus"
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Product Type</label>
                        <select
                          name="productType"
                          required
                          defaultValue={editingPlan?.productType || 'Digital Signage'}
                          disabled={Boolean(editingPlan)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none disabled:text-slate-500 disabled:bg-slate-100"
                        >
                          <option value="Digital Signage">Digital Signage</option>
                          <option value="Endpoint Management System">Endpoint Management System</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Mode</label>
                        <select
                          name="mode"
                          required
                          defaultValue={editingPlan?.mode || 'Periodic'}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                        >
                          <option value="Periodic">Periodic</option>
                          <option value="Perpetual">Perpetual</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Price</label>
                        <input
                          name="price"
                          type="number"
                          min="0"
                          required
                          defaultValue={editingPlan?.price ?? 0}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                        <select
                          name="status"
                          required
                          defaultValue={editingPlan?.status || 'Active'}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Deleted">Deleted</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Duration (Days)</label>
                        <input
                          name="duration"
                          type="number"
                          min="0"
                          required
                          defaultValue={editingPlan?.duration ?? 0}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Billing Label</label>
                        <input
                          name="billingLabel"
                          type="text"
                          defaultValue={editingPlan?.billingLabel}
                          placeholder="365 Days (1 Year)"
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Device Limit</label>
                        <input
                          name="totalDeviceLimit"
                          type="number"
                          min="0"
                          required
                          defaultValue={editingPlan?.totalDeviceLimit ?? 0}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Device Limit Label</label>
                      <input
                        name="deviceLimitLabel"
                        type="text"
                        defaultValue={editingPlan?.deviceLimitLabel}
                        placeholder="Unlimited Devices"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                      <textarea
                        name="description"
                        required
                        defaultValue={editingPlan?.description}
                        placeholder="Designed for large-scale enterprise deployments"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none min-h-[90px] resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Highlights</label>
                        <textarea
                          name="highlights"
                          required
                          defaultValue={editingPlan?.highlights.join('\n')}
                          placeholder={'One line per highlight'}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none min-h-[140px] resize-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Features</label>
                        <textarea
                          name="features"
                          required
                          defaultValue={editingPlan?.features.join('\n')}
                          placeholder={'One line per feature'}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none min-h-[140px] resize-none"
                        />
                      </div>
                    </div>
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                      >
                        {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                        {isProcessing ? 'Saving...' : editingPlan ? 'Update Plan' : 'Create Plan'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}

          {/* Device Type Modal */}
          {showDeviceTypeModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isProcessing && setShowDeviceTypeModal(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{editingDeviceType ? 'Edit Device Type' : 'Add Device Type'}</h2>
                    <button onClick={() => setShowDeviceTypeModal(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button>
                  </div>
                  <form onSubmit={handleSaveDeviceType} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Device Type Name</label>
                      <input 
                        name="name"
                        type="text" 
                        required 
                        defaultValue={editingDeviceType?.name}
                        placeholder="e.g. Android, iOS, RFID"
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                      <select 
                        name="status"
                        required 
                        defaultValue={editingDeviceType?.status || 'Active'}
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="pt-4">
                      <button 
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                      >
                        {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                        {isProcessing ? 'Saving...' : editingDeviceType ? 'Update Device Type' : 'Create Device Type'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}

          {/* User Modal (Add/Edit) */}
          {showUserModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isProcessing && setShowUserModal(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">{editingUser ? 'Edit User' : 'Add New User'}</h2>
                    <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button>
                  </div>
                  <form onSubmit={handleSaveUser} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        required 
                        defaultValue={editingUser?.name}
                        placeholder="John Doe"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        required 
                        defaultValue={editingUser?.email}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Designation</label>
                      <input 
                        type="text" 
                        name="designation"
                        required 
                        defaultValue={editingUser?.designation}
                        placeholder="System Architect"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Primary Mobile</label>
                        <input 
                          type="tel" 
                          name="mobile"
                          required 
                          defaultValue={editingUser?.mobile}
                          placeholder="+1 555-0000"
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Alternate Mobile</label>
                        <input 
                          type="tel" 
                          name="alternateMobile"
                          defaultValue={editingUser?.alternateMobile}
                          placeholder="+1 555-0001"
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Role</label>
                        <select 
                          name="role"
                          required 
                          defaultValue={editingUser?.role || 'Viewer'}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                        >
                          <option value="Super Admin">Super Admin</option>
                          <option value="License Admin">License Admin</option>
                          <option value="Company Admin">Company Admin</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                        <select 
                          name="status"
                          required 
                          defaultValue={editingUser?.isDisabled ? 'Disabled' : 'Active'}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                        >
                          <option value="Active">Active</option>
                          <option value="Disabled">Disabled</option>
                        </select>
                      </div>
                    </div>
                    <div className="pt-4">
                      <button 
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                      >
                        {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                        {isProcessing ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}

          {/* Active Plan / Assets Popup */}
          {showActivePlan && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowActivePlan(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{showActivePlan.name}</h2>
                    <p className="text-sm text-slate-500">Company Assets & Active Plans</p>
                  </div>
                  <button 
                    onClick={() => setShowActivePlan(null)}
                    className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
                  {/* Subscriptions Section */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                        <CreditCard size={18} />
                      </div>
                      <h3 className="font-bold text-slate-900">Active Subscriptions</h3>
                    </div>
                    
                    <div className="grid gap-4">
                      {subscriptions.filter(s => s.companyId === showActivePlan.id).map(sub => {
                        const plan = getPlanById(sub.planId);
                        return (
                          <div key={sub.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-emerald-500">
                                <ShieldCheck size={20} />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{plan?.name}</p>
                                <p className="text-xs text-slate-500">Expires: {sub.expiryDate}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <StatusBadge status={sub.status} />
                              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">{sub.billingCycle}</p>
                            </div>
                          </div>
                        );
                      })}
                      {subscriptions.filter(s => s.companyId === showActivePlan.id).length === 0 && (
                        <p className="text-sm text-slate-400 italic py-4 text-center border border-dashed border-slate-200 rounded-2xl">No active subscriptions found.</p>
                      )}
                    </div>
                  </section>

                  {/* Licenses Section */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                        <Key size={18} />
                      </div>
                      <h3 className="font-bold text-slate-900">Assigned Licenses</h3>
                    </div>
                    
                    <div className="grid gap-4">
                      {licenses.filter(l => l.companyId === showActivePlan.id).map(lic => (
                        <div key={lic.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-3">
                          <div className="flex items-center justify-between">
                            <code className="text-xs font-mono bg-white border border-slate-200 px-2 py-1 rounded text-slate-700">{lic.key}</code>
                            <StatusBadge status={lic.status} />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-4">
                              <span className="text-slate-500">Activations: <span className="font-bold text-slate-900">{lic.activationsCount}/{lic.maxActivations}</span></span>
                              <span className="text-slate-500">Expiry: <span className="font-bold text-slate-900">{lic.expiryDate}</span></span>
                            </div>
                            <button className="text-indigo-600 hover:underline font-bold">Manage</button>
                          </div>
                        </div>
                      ))}
                      {licenses.filter(l => l.companyId === showActivePlan.id).length === 0 && (
                        <p className="text-sm text-slate-400 italic py-4 text-center border border-dashed border-slate-200 rounded-2xl">No licenses assigned to this company.</p>
                      )}
                    </div>
                  </section>
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => setShowActivePlan(null)}
                    className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Suspend Company Modal */}
          {showSuspendModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isProcessing && setShowSuspendModal(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8"
              >
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Ban size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Suspend Company?</h2>
                <p className="text-slate-500 mb-6 text-center">
                  You are about to suspend <span className="font-bold text-slate-900">{showSuspendModal.name}</span>. This will also revoke all active licenses and reject pending subscriptions.
                </p>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Reason for Suspension</label>
                    <textarea 
                      required
                      value={suspensionReason}
                      onChange={(e) => setSuspensionReason(e.target.value)}
                      placeholder="e.g. Policy violation, Unpaid invoices..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 outline-none min-h-[100px] resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button 
                    onClick={() => setShowSuspendModal(null)}
                    disabled={isProcessing}
                    className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSuspendCompany}
                    disabled={isProcessing || !suspensionReason.trim()}
                    className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ShieldAlert size={18} />}
                    {isProcessing ? 'Suspending...' : 'Confirm Suspension'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Delete User Confirmation */}
          {showDeleteUser && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isProcessing && setShowDeleteUser(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8 text-center"
              >
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Delete User?</h2>
                <p className="text-slate-500 mb-8">
                  Are you sure you want to delete <span className="font-bold text-slate-900">{showDeleteUser.name}</span>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowDeleteUser(null)}
                    disabled={isProcessing}
                    className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDeleteUser}
                    disabled={isProcessing}
                    className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
                  >
                    {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Trash2 size={18} />}
                    {isProcessing ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-auto p-8 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-400">
            &copy; 2026 License Manager Server v2.0.0. All rights reserved. 
            <span className="mx-2">|</span>
            <a href="#" className="hover:text-emerald-500 transition-colors">Documentation</a>
            <span className="mx-2">|</span>
            <a href="#" className="hover:text-emerald-500 transition-colors">Support</a>
          </p>
        </footer>
      </main>
    </div>
  );
}
