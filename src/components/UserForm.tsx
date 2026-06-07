import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { NewUser, User } from "../types/user";
import { useAppDispatch } from "../store/hooks";
import { addUser, updateUser } from "../store/userSlice";
import { useToast } from "./Toast";
import { getAvatarColor, getInitials } from "../utils/avatar";
import { MailIcon, MapPinIcon, BuildingIcon, PhoneIcon, GlobeIcon } from "./Icons";

interface Props {
  initialUser?: User;
}

interface FormState {
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  company: string;
}

function toFormState(user?: User): FormState {
  return {
    name: user?.name ?? "",
    username: user?.username ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    website: user?.website ?? "",
    street: user?.address.street ?? "",
    suite: user?.address.suite ?? "",
    city: user?.address.city ?? "",
    zipcode: user?.address.zipcode ?? "",
    company: user?.company.name ?? "",
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function UserForm({ initialUser }: Props) {
  const isEdit = Boolean(initialUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const [form, setForm] = useState<FormState>(toFormState(initialUser));
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next: { name?: string; email?: string } = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!EMAIL_RE.test(form.email.trim()))
      next.email = "Enter a valid email address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || submitting) return;
    setSubmitting(true);

    const payload: NewUser = {
      name: form.name.trim(),
      username:
        form.username.trim() ||
        form.name.trim().toLowerCase().replace(/\s+/g, ""),
      email: form.email.trim(),
      phone: form.phone.trim(),
      website: form.website.trim(),
      address: {
        street: form.street.trim(),
        suite: form.suite.trim(),
        city: form.city.trim(),
        zipcode: form.zipcode.trim(),
        geo: initialUser?.address.geo,
      },
      company: {
        name: form.company.trim(),
        catchPhrase: initialUser?.company.catchPhrase,
        bs: initialUser?.company.bs,
      },
    };

    try {
      if (isEdit && initialUser) {
        const updated = await dispatch(
          updateUser({ ...payload, id: initialUser.id })
        ).unwrap();
        showToast("Changes saved");
        navigate(`/users/${updated.id}`);
      } else {
        await dispatch(addUser(payload)).unwrap();
        showToast("User added");
        navigate("/users");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const avatarBg = form.name ? getAvatarColor(form.name) : "#8e8e93";
  const initials = form.name ? getInitials(form.name) : "?";

  return (
    <div className="user-form-layout">
      {/* Left — live avatar preview */}
      <aside className="form-sidebar">
        <div className="form-avatar-preview" style={{ background: avatarBg }}>
          {initials}
        </div>
        <div className="form-preview-name">{form.name || "Full name"}</div>
        <div className="form-preview-username">
          @{form.username || (form.name ? form.name.toLowerCase().replace(/\s+/g, "") : "username")}
        </div>
        {form.email && (
          <div className="form-preview-chip">
            <MailIcon size={13} /> {form.email}
          </div>
        )}
        {form.city && (
          <div className="form-preview-chip">
            <MapPinIcon size={13} /> {form.city}
          </div>
        )}
        {form.company && (
          <div className="form-preview-chip">
            <BuildingIcon size={13} /> {form.company}
          </div>
        )}
      </aside>

      {/* Right — fields */}
      <div className="form-body">
        {/* Profile section */}
        <div className="form-section">
          <div className="form-section-label">Profile</div>
          <div className="form-card">
            <div className={`form-field ${errors.name ? "invalid" : ""}`}>
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                value={form.name}
                onChange={set("name")}
                placeholder="Jane Smith"
                autoComplete="off"
              />
              {errors.name && <span className="form-field-error">{errors.name}</span>}
            </div>
            <div className="form-field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                value={form.username}
                onChange={set("username")}
                placeholder="optional"
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        {/* Contact section */}
        <div className="form-section">
          <div className="form-section-label">
            <MailIcon size={13} /> Contact
          </div>
          <div className="form-card">
            <div className={`form-field ${errors.email ? "invalid" : ""}`}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="name@example.com"
                autoComplete="off"
              />
              {errors.email && <span className="form-field-error">{errors.email}</span>}
            </div>
            <div className="form-field">
              <label htmlFor="phone">
                <PhoneIcon size={13} /> Phone
              </label>
              <input
                id="phone"
                value={form.phone}
                onChange={set("phone")}
                placeholder="Optional"
              />
            </div>
            <div className="form-field">
              <label htmlFor="website">
                <GlobeIcon size={13} /> Website
              </label>
              <input
                id="website"
                value={form.website}
                onChange={set("website")}
                placeholder="Optional"
              />
            </div>
          </div>
        </div>

        {/* Address section */}
        <div className="form-section">
          <div className="form-section-label">
            <MapPinIcon size={13} /> Address
          </div>
          <div className="form-card form-card-grid">
            <div className="form-field span-2">
              <label htmlFor="street">Street</label>
              <input id="street" value={form.street} onChange={set("street")} placeholder="123 Main St" />
            </div>
            <div className="form-field">
              <label htmlFor="suite">Suite / Apt</label>
              <input id="suite" value={form.suite} onChange={set("suite")} placeholder="Apt 4B" />
            </div>
            <div className="form-field">
              <label htmlFor="city">City</label>
              <input id="city" value={form.city} onChange={set("city")} placeholder="New York" />
            </div>
            <div className="form-field">
              <label htmlFor="zipcode">Zip Code</label>
              <input id="zipcode" value={form.zipcode} onChange={set("zipcode")} placeholder="10001" />
            </div>
          </div>
        </div>

        {/* Company section */}
        <div className="form-section">
          <div className="form-section-label">
            <BuildingIcon size={13} /> Company
          </div>
          <div className="form-card">
            <div className="form-field">
              <label htmlFor="company">Company Name</label>
              <input
                id="company"
                value={form.company}
                onChange={set("company")}
                placeholder="Optional"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="form-footer-actions">
          <button
            className="btn btn-secondary btn-lg"
            onClick={() => navigate(-1)}
            type="button"
          >
            Cancel
          </button>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            disabled={submitting}
            type="button"
          >
            {submitting ? "Saving…" : isEdit ? "Save Changes" : "Add User"}
          </button>
        </div>
      </div>
    </div>
  );
}
