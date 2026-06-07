import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  deleteUser,
  fetchUsers,
  selectUserById,
  selectUserStatus,
} from "../store/userSlice";
import { useToast } from "../components/Toast";
import { getAvatarColor, getInitials } from "../utils/avatar";
import {
  BuildingIcon,
  ChevronLeftIcon,
  GlobeIcon,
  MailIcon,
  PencilIcon,
  PhoneIcon,
  TrashIcon,
  MapPinIcon,
} from "../components/Icons";

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const status = useAppSelector(selectUserStatus);
  const user = useAppSelector(selectUserById(userId));

  useEffect(() => {
    if (status === "idle") dispatch(fetchUsers());
  }, [status, dispatch]);

  if (status === "loading") {
    return (
      <div className="page">
        <div className="center-state">
          <div className="spinner" />
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page">
        <div className="center-state">
          <h3>User not found</h3>
          <p>This user may have been deleted.</p>
          <button className="btn btn-primary" onClick={() => navigate("/users")}>
            Back to Manage Users
          </button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    dispatch(deleteUser(user.id));
    showToast(`${user.name} deleted`);
    navigate("/users");
  };

  const avatarBg = getAvatarColor(user.name);

  return (
    <div className="page detail-page">
      <button className="back-link" onClick={() => navigate("/users")}>
        <ChevronLeftIcon size={20} />
        Manage Users
      </button>

      {/* Hero Banner */}
      <div className="detail-hero-banner" style={{ background: `linear-gradient(135deg, ${avatarBg}22 0%, ${avatarBg}08 100%)` }}>
        <div
          className="detail-hero-avatar"
          style={{ background: avatarBg }}
          aria-hidden="true"
        >
          {getInitials(user.name)}
        </div>
        <div className="detail-hero-info">
          <h1 className="detail-hero-name">{user.name}</h1>
          <div className="detail-hero-username">@{user.username}</div>
          <div className="detail-hero-chips">
            {user.email && (
              <a href={`mailto:${user.email}`} className="detail-chip">
                <MailIcon size={13} />
                {user.email}
              </a>
            )}
            {user.address.city && (
              <span className="detail-chip">
                <MapPinIcon size={13} />
                {user.address.city}
              </span>
            )}
            {user.company.name && (
              <span className="detail-chip">
                <BuildingIcon size={13} />
                {user.company.name}
              </span>
            )}
          </div>
        </div>
        <div className="detail-hero-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate(`/edit-user/${user.id}`)}
          >
            <PencilIcon size={16} />
            Edit Profile
          </button>
          <button
            className="btn btn-ghost-destructive btn-lg"
            onClick={() => setShowDeleteModal(true)}
          >
            <TrashIcon size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="detail-grid">
        {/* Contact */}
        <div className="detail-section-card">
          <div className="detail-section-header">
            <MailIcon size={15} />
            Contact
          </div>
          <div className="detail-rows">
            <div className="detail-row">
              <span className="detail-row-label">Email</span>
              <a href={`mailto:${user.email}`} className="detail-row-value link">{user.email || "—"}</a>
            </div>
            <div className="detail-row">
              <span className="detail-row-label">Phone</span>
              <span className="detail-row-value">{user.phone || "—"}</span>
            </div>
            <div className="detail-row">
              <span className="detail-row-label">Website</span>
              <span className="detail-row-value">{user.website || "—"}</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="detail-section-card">
          <div className="detail-section-header">
            <MapPinIcon size={15} />
            Address
          </div>
          <div className="detail-rows">
            <div className="detail-row">
              <span className="detail-row-label">Street</span>
              <span className="detail-row-value">{user.address.suite}, {user.address.street}</span>
            </div>
            <div className="detail-row">
              <span className="detail-row-label">City</span>
              <span className="detail-row-value">{user.address.city || "—"}</span>
            </div>
            <div className="detail-row">
              <span className="detail-row-label">Zip Code</span>
              <span className="detail-row-value">{user.address.zipcode || "—"}</span>
            </div>
          </div>
        </div>

        {/* Company */}
        <div className="detail-section-card">
          <div className="detail-section-header">
            <BuildingIcon size={15} />
            Company
          </div>
          <div className="detail-rows">
            <div className="detail-row">
              <span className="detail-row-label">Name</span>
              <span className="detail-row-value">{user.company.name || "—"}</span>
            </div>
            {user.company.catchPhrase && (
              <div className="detail-row">
                <span className="detail-row-label">Tagline</span>
                <span className="detail-row-value">{user.company.catchPhrase}</span>
              </div>
            )}
            {user.company.bs && (
              <div className="detail-row">
                <span className="detail-row-label">Focus</span>
                <span className="detail-row-value">{user.company.bs}</span>
              </div>
            )}
          </div>
        </div>

        {/* Globe */}
        {user.website && (
          <div className="detail-section-card">
            <div className="detail-section-header">
              <GlobeIcon size={15} />
              Web
            </div>
            <div className="detail-rows">
              <div className="detail-row">
                <span className="detail-row-label">Website</span>
                <span className="detail-row-value">{user.website}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-backdrop" onClick={() => setShowDeleteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-wrap danger">
              <TrashIcon size={24} />
            </div>
            <h2 className="modal-title">Delete {user.name}?</h2>
            <p className="modal-body">
              This will permanently remove <strong>{user.name}</strong> from the directory. This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary btn-lg" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger btn-lg" onClick={handleDelete}>
                <TrashIcon size={16} />
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
