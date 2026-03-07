import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  ApiError,
  getPropertyOwnerTenants,
  postPropertyOwnerTenant,
  type PropertyTenantListItem,
} from '../lib/api'
import { PropertyEmptyState } from './components/PropertyEmptyState'
import { PropertyStatusBadge } from './components/PropertyStatusBadge'

type TenantFormState = {
  property_name: string
  address: string
  unit_number: string
  full_name: string
  email: string
  phone: string
  password: string
  lease_start_date: string
  lease_end_date: string
  monthly_rent: string
  payment_due_day: number
}

const INITIAL_FORM: TenantFormState = {
  property_name: '',
  address: '',
  unit_number: '',
  full_name: '',
  email: '',
  phone: '',
  password: '',
  lease_start_date: '',
  lease_end_date: '',
  monthly_rent: '0',
  payment_due_day: 1,
}

export function PropertyOwnerTenantsPage() {
  const [tenants, setTenants] = useState<PropertyTenantListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formState, setFormState] = useState<TenantFormState>(INITIAL_FORM)
  const [lastCreatedCredentials, setLastCreatedCredentials] = useState<{
    tenant_access_id: string
    password: string
    generated: boolean
  } | null>(null)

  const loadTenants = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getPropertyOwnerTenants()
      setTenants(response.tenants)
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Failed to load tenants.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadTenants()
  }, [])

  const handleCreateTenant = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const response = await postPropertyOwnerTenant({
        property_name: formState.property_name,
        address: formState.address,
        unit_number: formState.unit_number || undefined,
        full_name: formState.full_name,
        email: formState.email,
        phone: formState.phone || undefined,
        password: formState.password || undefined,
        lease_start_date: formState.lease_start_date || undefined,
        lease_end_date: formState.lease_end_date || undefined,
        monthly_rent: formState.monthly_rent,
        payment_due_day: Number(formState.payment_due_day),
      })

      setLastCreatedCredentials(response.credentials)
      setFormState(INITIAL_FORM)
      await loadTenants()
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Failed to create tenant.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Tenants</h1>
        <p className="text-sm text-slate-400">Create tenant access IDs and manage lease records.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
      ) : null}

      {lastCreatedCredentials ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Tenant created. Access ID: <span className="font-semibold">{lastCreatedCredentials.tenant_access_id}</span> | Password:{' '}
          <span className="font-semibold">{lastCreatedCredentials.password}</span>
        </div>
      ) : null}

      <form className="grid gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 lg:grid-cols-2" onSubmit={handleCreateTenant}>
        <h2 className="font-semibold text-white lg:col-span-2">Create Tenant</h2>

        <input
          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
          placeholder="Property name"
          required
          value={formState.property_name}
          onChange={(event) => setFormState((current) => ({ ...current, property_name: event.target.value }))}
        />
        <input
          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
          placeholder="Address"
          required
          value={formState.address}
          onChange={(event) => setFormState((current) => ({ ...current, address: event.target.value }))}
        />
        <input
          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
          placeholder="Unit number (optional)"
          value={formState.unit_number}
          onChange={(event) => setFormState((current) => ({ ...current, unit_number: event.target.value }))}
        />
        <input
          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
          placeholder="Tenant full name"
          required
          value={formState.full_name}
          onChange={(event) => setFormState((current) => ({ ...current, full_name: event.target.value }))}
        />
        <input
          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
          placeholder="Tenant email"
          required
          type="email"
          value={formState.email}
          onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
        />
        <input
          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
          placeholder="Phone"
          value={formState.phone}
          onChange={(event) => setFormState((current) => ({ ...current, phone: event.target.value }))}
        />
        <input
          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
          placeholder="Temporary password (optional)"
          type="text"
          value={formState.password}
          onChange={(event) => setFormState((current) => ({ ...current, password: event.target.value }))}
        />
        <input
          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
          min="0"
          placeholder="Monthly rent"
          required
          step="0.01"
          type="number"
          value={formState.monthly_rent}
          onChange={(event) => setFormState((current) => ({ ...current, monthly_rent: event.target.value }))}
        />
        <input
          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
          max={31}
          min={1}
          required
          type="number"
          value={formState.payment_due_day}
          onChange={(event) => setFormState((current) => ({ ...current, payment_due_day: Number(event.target.value) }))}
        />
        <input
          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
          placeholder="Lease start"
          type="date"
          value={formState.lease_start_date}
          onChange={(event) => setFormState((current) => ({ ...current, lease_start_date: event.target.value }))}
        />
        <input
          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
          placeholder="Lease end"
          type="date"
          value={formState.lease_end_date}
          onChange={(event) => setFormState((current) => ({ ...current, lease_end_date: event.target.value }))}
        />

        <button
          className="rounded-lg border border-indigo-500/35 bg-indigo-500/20 px-3 py-2 text-sm font-semibold text-indigo-100 transition-colors hover:bg-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-70 lg:col-span-2"
          disabled={saving}
          type="submit"
        >
          {saving ? 'Creating...' : 'Create Tenant'}
        </button>
      </form>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-sm text-slate-400">Loading tenants...</div>
      ) : tenants.length === 0 ? (
        <PropertyEmptyState
          description="No tenants added yet. Use the form above to create your first tenant."
          title="No tenants yet"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-white/[0.03] text-left text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Tenant</th>
                <th className="px-4 py-3">Access ID</th>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {tenants.map((tenant) => (
                <tr key={tenant.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{tenant.full_name}</p>
                    <p className="text-xs text-slate-400">{tenant.email}</p>
                  </td>
                  <td className="px-4 py-3">{tenant.tenant_access_id}</td>
                  <td className="px-4 py-3">{tenant.property?.property_name || '-'}</td>
                  <td className="px-4 py-3">
                    <PropertyStatusBadge value={tenant.payment_status} />
                  </td>
                  <td className="px-4 py-3">
                    <PropertyStatusBadge value={tenant.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-200 transition-colors hover:bg-indigo-500/20"
                      to={`/property-management/owner/tenants/${tenant.id}`}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
