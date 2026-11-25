import React, { useEffect, useState } from 'react';
import { apiRequest } from './api';

function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('tenant');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register';
      const body = mode === 'login' ? { email, password } : { name, email, password, role };
      const data = await apiRequest(path, {
        method: 'POST',
        body: JSON.stringify(body)
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onAuthSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card auth-box">
      <div className="tabs">
        <button
          type="button"
          className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
          onClick={() => {
            setMode('login');
            setError('');
          }}
        >
          Login
        </button>
        <button
          type="button"
          className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
          onClick={() => {
            setMode('register');
            setError('');
          }}
        >
          Register
        </button>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            required
          />
        </div>

        {mode === 'register' && (
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="tenant">Tenant</option>
              <option value="owner">Owner</option>
            </select>
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
    </div>
  );
}

function OwnerDashboard({ user }) {
  const [properties, setProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [rent, setRent] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [propsData, appsData] = await Promise.all([
        apiRequest(`/properties?ownerId=${user.id}`),
        apiRequest('/applications')
      ]);
      setProperties(propsData);
      setApplications(appsData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setLocation('');
    setRent('');
    setBedrooms('');
    setDescription('');
  };

  const handleSaveProperty = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const payload = {
        title,
        location,
        rent: Number(rent),
        bedrooms: Number(bedrooms),
        description
      };
      if (editingId) {
        await apiRequest(`/properties/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        setMessage('Property updated successfully.');
      } else {
        await apiRequest('/properties', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        setMessage('Property added successfully.');
      }
      resetForm();
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (prop) => {
    setEditingId(prop._id);
    setTitle(prop.title);
    setLocation(prop.location);
    setRent(String(prop.rent));
    setBedrooms(String(prop.bedrooms));
    setDescription(prop.description || '');
    setMessage('');
    setError('');
  };

  const handleDelete = async (id) => {
    setError('');
    setMessage('');
    try {
      await apiRequest(`/properties/${id}`, { method: 'DELETE' });
      setMessage('Property deleted successfully.');
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleApplicationDecision = async (appId, status) => {
    setError('');
    setMessage('');
    try {
      await apiRequest(`/applications/${appId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      setMessage(`Application ${status}.`);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}
      {message && (
        <div className="alert alert-success" role="status">
          {message}
        </div>
      )}

      <div className="card">
        <h2>{editingId ? 'Edit Property' : 'Add New Property'}</h2>
        <form onSubmit={handleSaveProperty}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prop-title">Property Title</label>
              <input
                id="prop-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sunny 2BHK Apartment"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="prop-location">Location</label>
              <input
                id="prop-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Downtown"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prop-rent">Monthly Rent ($)</label>
              <input
                id="prop-rent"
                type="number"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                placeholder="e.g. 1200"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="prop-bedrooms">Bedrooms</label>
              <input
                id="prop-bedrooms"
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                placeholder="e.g. 2"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="prop-desc">Description</label>
            <textarea
              id="prop-desc"
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details about the property"
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Property' : 'Add Property'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h2>My Properties ({properties.length})</h2>
        {properties.length === 0 ? (
          <p>No properties added yet.</p>
        ) : (
          <div className="property-list">
            {properties.map((prop) => (
              <div key={prop._id} className="item-card" data-testid={`owner-property-${prop._id}`}>
                <div className="item-info">
                  <h3>
                    {prop.title}{' '}
                    <span className={`badge badge-${prop.status}`}>{prop.status}</span>
                  </h3>
                  <div className="item-meta">
                    Location: {prop.location} | Rent: ${prop.rent}/mo | Bedrooms: {prop.bedrooms}
                  </div>
                  {prop.description && <p>{prop.description}</p>}
                </div>
                <div className="item-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleEdit(prop)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(prop._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2>Rental Applications ({applications.length})</h2>
        {applications.length === 0 ? (
          <p>No rental applications received yet.</p>
        ) : (
          <div className="application-list">
            {applications.map((app) => (
              <div key={app._id} className="item-card" data-testid={`owner-app-${app._id}`}>
                <div className="item-info">
                  <h3>
                    {app.propertyId?.title || 'Property'}{' '}
                    <span className={`badge badge-${app.status}`}>{app.status}</span>
                  </h3>
                  <div className="item-meta">
                    Tenant: {app.tenantId?.name} ({app.tenantId?.email})
                  </div>
                  {app.message && <p>Message: {app.message}</p>}
                </div>
                <div className="item-actions">
                  {app.status === 'pending' && (
                    <>
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => handleApplicationDecision(app._id, 'approved')}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleApplicationDecision(app._id, 'rejected')}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TenantDashboard() {
  const [properties, setProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [applyTarget, setApplyTarget] = useState(null);
  const [applyMessage, setApplyMessage] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadData = async (searchVal = search, rentVal = maxRent) => {
    try {
      const params = new URLSearchParams();
      if (searchVal.trim()) params.set('search', searchVal.trim());
      if (rentVal !== '') params.set('maxRent', rentVal);
      const query = params.toString() ? `?${params.toString()}` : '';

      const [propsData, appsData] = await Promise.all([
        apiRequest(`/properties${query}`),
        apiRequest('/applications')
      ]);
      setProperties(propsData);
      setApplications(appsData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadData(search, maxRent);
  };

  const handleClearSearch = () => {
    setSearch('');
    setMaxRent('');
    loadData('', '');
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await apiRequest('/applications', {
        method: 'POST',
        body: JSON.stringify({
          propertyId: applyTarget._id,
          message: applyMessage
        })
      });
      setMessage(`Application submitted for ${applyTarget.title}.`);
      setApplyTarget(null);
      setApplyMessage('');
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}
      {message && (
        <div className="alert alert-success" role="status">
          {message}
        </div>
      )}

      <div className="card">
        <h2>Browse & Search Properties</h2>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search properties"
          />
          <input
            type="number"
            placeholder="Max monthly rent ($)"
            value={maxRent}
            onChange={(e) => setMaxRent(e.target.value)}
            aria-label="Max rent"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleClearSearch}>
            Reset
          </button>
        </form>

        {applyTarget && (
          <div className="card" style={{ background: '#f0f4f8' }}>
            <h3>Apply for: {applyTarget.title}</h3>
            <form onSubmit={handleApplySubmit}>
              <div className="form-group">
                <label htmlFor="apply-msg">Message to Owner (Optional)</label>
                <textarea
                  id="apply-msg"
                  rows="2"
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                  placeholder="Introduce yourself or mention move-in date"
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn btn-success btn-sm">
                  Submit Application
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setApplyTarget(null);
                    setApplyMessage('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {properties.length === 0 ? (
          <p>No properties found.</p>
        ) : (
          <div className="property-list">
            {properties.map((prop) => (
              <div key={prop._id} className="item-card" data-testid={`tenant-property-${prop._id}`}>
                <div className="item-info">
                  <h3>
                    {prop.title}{' '}
                    <span className={`badge badge-${prop.status}`}>{prop.status}</span>
                  </h3>
                  <div className="item-meta">
                    Location: {prop.location} | Rent: ${prop.rent}/mo | Bedrooms: {prop.bedrooms} | Owner:{' '}
                    {prop.ownerId?.name || 'Owner'}
                  </div>
                  {prop.description && <p>{prop.description}</p>}
                </div>
                <div className="item-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={prop.status === 'rented'}
                    onClick={() => {
                      setApplyTarget(prop);
                      setError('');
                      setMessage('');
                    }}
                  >
                    {prop.status === 'rented' ? 'Rented' : 'Apply'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2>My Rental Applications ({applications.length})</h2>
        {applications.length === 0 ? (
          <p>You have not applied for any properties yet.</p>
        ) : (
          <div className="application-list">
            {applications.map((app) => (
              <div key={app._id} className="item-card" data-testid={`tenant-app-${app._id}`}>
                <div className="item-info">
                  <h3>
                    {app.propertyId?.title || 'Property'}{' '}
                    <span className={`badge badge-${app.status}`}>{app.status}</span>
                  </h3>
                  <div className="item-meta">
                    Location: {app.propertyId?.location} | Rent: ${app.propertyId?.rent}/mo
                  </div>
                  {app.message && <p>Your message: {app.message}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div>
      <header className="navbar">
        <h1>Real Estate Rental System</h1>
        {user && (
          <div className="nav-user">
            <span>
              {user.name} ({user.role})
            </span>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </header>

      <main className="container">
        {!user ? (
          <AuthPage onAuthSuccess={setUser} />
        ) : user.role === 'owner' ? (
          <OwnerDashboard user={user} />
        ) : (
          <TenantDashboard />
        )}
      </main>
    </div>
  );
}
