import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAdminFormFields,
  createFormField,
  deleteFormField,
  updateFormField,
  getRaffleSettings,
  updateRaffleSettings,
  getAdminParticipants,
  getAdminUsers,
  createAdminUser,
  deleteAdminUser,
  drawWinners,
  getWinners,
} from "../services/api";
import type {
  FormField,
  Participant,
  RaffleSettings,
  AdminUser,
} from "../types";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import "./AdminDashboard.css";
import BSCHorizontal from "../assets/BSCHorizontal.png";

type TabType = "fields" | "raffle" | "participants" | "users";

interface NewField {
  name: string;
  label: string;
  type: "text" | "email" | "number" | "select" | "textarea";
  required: boolean;
  options: string;
  order: number;
  active: boolean;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("fields");
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [raffleSettings, setRaffleSettings] = useState<RaffleSettings>({
    prize: "",
    description: "",
    numberOfWinners: 1,
  });
  const [newField, setNewField] = useState<NewField>({
    name: "",
    label: "",
    type: "text",
    required: false,
    options: "",
    order: 0,
    active: true,
  });
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [currentAdminRole, setCurrentAdminRole] = useState<
    "superadmin" | "admin" | null
  >(null);
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);
  const [drawConfirmOpen, setDrawConfirmOpen] = useState(false);
  const sortedFormFields = [...formFields].sort((a, b) => a.order - b.order);

  const navigate = useNavigate();
  const { admin, isLoading: authLoading, logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!admin) {
      showMessage("Authentication error. Please log in again.", "error");
      navigate("/admin/login");
      return;
    }

    setCurrentAdminRole(admin.role);
    if (activeTab === "users" && admin.role !== "superadmin") {
      setActiveTab("fields");
    }
  }, [activeTab, admin, authLoading, navigate]);

  useEffect(() => {
    if (currentAdminRole !== null) {
      loadData();
    }
  }, [activeTab, currentAdminRole]);

  const loadData = async () => {
    try {
      if (activeTab === "fields") {
        const response = await getAdminFormFields();
        setFormFields(response.data);
      } else if (activeTab === "raffle") {
        const settingsRes = await getRaffleSettings();
        const participantsRes = await getAdminParticipants();
        setRaffleSettings(settingsRes.data);
        setParticipants(participantsRes.data);
        const winnersRes = await getWinners();
        setWinners(winnersRes.data);
      } else if (activeTab === "participants") {
        const response = await getAdminParticipants();
        setParticipants(response.data);
      } else if (activeTab === "users") {
        if (currentAdminRole !== "superadmin") {
          setAdminUsers([]);
          return;
        }
        const usersRes = await getAdminUsers();
        setAdminUsers(usersRes.data);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      showMessage("Failed to load data", "error");
    }
  };

  const showMessage = (text: string, type: "success" | "error" = "success") => {
    console.log(`${type.toUpperCase()}: ${text}`);
    toast({
      title: type === "success" ? "Success" : "Error",
      description: text,
      variant: type === "error" ? "destructive" : "default",
    });
  };

  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const maxOrder = sortedFormFields.reduce(
        (max, field) => Math.max(max, field.order || 0),
        0,
      );
      const fieldData = {
        ...newField,
        order: maxOrder + 1,
        options: newField.options
          ? newField.options.split(",").map((o) => o.trim())
          : [],
      };
      await createFormField(fieldData);
      showMessage("Field added successfully");
      setNewField({
        name: "",
        label: "",
        type: "text",
        required: false,
        options: "",
        order: 0,
        active: true,
      });
      loadData();
    } catch (error) {
      console.error("Error adding field:", error);
      showMessage("Failed to add field", "error");
    }
  };

  const handleDeleteField = async (id: string) => {
    try {
      await deleteFormField(id);
      showMessage("Field deleted successfully");
      loadData();
    } catch (error) {
      console.error("Error deleting field:", error);
      showMessage("Failed to delete field", "error");
    } finally {
      setFieldToDelete(null);
    }
  };

  const handleMoveField = async (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= sortedFormFields.length) {
      return;
    }

    const reordered = [...sortedFormFields];
    [reordered[index], reordered[swapIndex]] = [
      reordered[swapIndex],
      reordered[index],
    ];

    const updates = reordered.map((field, newIndex) => ({
      id: field._id,
      order: newIndex + 1,
    }));

    const changedUpdates = updates.filter((update) => {
      const original = sortedFormFields.find(
        (field) => field._id === update.id,
      );
      return original && original.order !== update.order;
    });

    try {
      await Promise.all(
        changedUpdates.map((update) =>
          updateFormField(update.id, { order: update.order }),
        ),
      );
      showMessage("Field order updated");
      loadData();
    } catch (error) {
      console.error("Error updating field order:", error);
      showMessage("Failed to update field order", "error");
    }
  };

  const handleUpdateRaffle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateRaffleSettings(raffleSettings);
      console.log("Raffle settings updated:", raffleSettings);
      showMessage("Raffle settings updated successfully");
    } catch (error) {
      console.error("Error updating raffle settings:", error);
      showMessage("Failed to update raffle settings", "error");
    }
  };

  const handleDrawWinners = async () => {
    try {
      const response = await drawWinners();
      showMessage(response.data.message);
      loadData();
    } catch (error: any) {
      console.error("Error drawing winners:", error);
      showMessage(
        error.response?.data?.error || "Failed to draw winners",
        "error",
      );
    } finally {
      setDrawConfirmOpen(false);
    }
  };

  const handleCreateAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAdminUser(newAdminUsername, newAdminPassword);
      setNewAdminUsername("");
      setNewAdminPassword("");
      showMessage("Admin user created successfully");
      loadData();
    } catch (error: any) {
      console.error("Error creating admin user:", error);
      showMessage(
        error.response?.data?.error || "Failed to create admin user",
        "error",
      );
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showMessage("Logged out successfully");
      navigate("/admin/login");
    } catch (error) {
      console.error("Error during logout:", error);
      showMessage("Failed to log out", "error");
    }
  };

  const handleDeleteAdminUser = async (id: string) => {
    try {
      await deleteAdminUser(id);
      showMessage("Admin user deleted successfully");
      loadData();
    } catch (error: any) {
      console.error("Error deleting admin user:", error);
      showMessage(
        error.response?.data?.error || "Failed to delete admin user",
        "error",
      );
    } finally {
      setAdminToDelete(null);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <img src={BSCHorizontal} alt="BSC Logo" />
        <h1>Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="tabs">
        <Button
          className={activeTab === "fields" ? "tab active" : "tab"}
          onClick={() => setActiveTab("fields")}
        >
          Form Fields
        </Button>
        <Button
          className={activeTab === "raffle" ? "tab active" : "tab"}
          onClick={() => setActiveTab("raffle")}
        >
          Raffle Settings
        </Button>
        <Button
          className={activeTab === "participants" ? "tab active" : "tab"}
          onClick={() => setActiveTab("participants")}
        >
          Participants
        </Button>
        {currentAdminRole === "superadmin" && (
          <Button
            className={activeTab === "users" ? "tab active" : "tab"}
            onClick={() => setActiveTab("users")}
          >
            Admin Users
          </Button>
        )}
      </div>

      <div className="tab-content">
        {activeTab === "fields" && (
          <div>
            <h2>Manage Form Fields</h2>
            <form onSubmit={handleAddField} className="add-field-form">
              <div className="form-row">
                <Input
                  type="text"
                  placeholder="Field Name (e.g., email)"
                  value={newField.name}
                  onChange={(e) =>
                    setNewField({ ...newField, name: e.target.value })
                  }
                  required
                />
                <Input
                  type="text"
                  placeholder="Field Label (e.g., Email Address)"
                  value={newField.label}
                  onChange={(e) =>
                    setNewField({ ...newField, label: e.target.value })
                  }
                  required
                />
                <select
                  value={newField.type}
                  onChange={(e) =>
                    setNewField({
                      ...newField,
                      type: e.target.value as NewField["type"],
                    })
                  }
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="number">Number</option>
                  <option value="select">Select</option>
                  <option value="textarea">Textarea</option>
                </select>
              </div>
              {newField.type === "select" && (
                <Input
                  type="text"
                  placeholder="Options (comma-separated)"
                  value={newField.options}
                  onChange={(e) =>
                    setNewField({ ...newField, options: e.target.value })
                  }
                />
              )}
              <div className="form-row">
                <label>
                  <input
                    type="checkbox"
                    checked={newField.required}
                    onChange={(e) =>
                      setNewField({ ...newField, required: e.target.checked })
                    }
                  />
                  Required
                </label>
                <br />
                <Button type="submit" variant="outline">
                  Add Field
                </Button>
              </div>
            </form>

            <div className="fields-list">
              <h3>Current Fields</h3>
              {formFields.length === 0 ? (
                <p>No fields configured yet.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Label</th>
                      <th>Type</th>
                      <th>Required</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedFormFields.map((field, index) => (
                      <tr key={field._id}>
                        <td>{field.name}</td>
                        <td>{field.label}</td>
                        <td>{field.type}</td>
                        <td>{field.required ? "Yes" : "No"}</td>
                        <td>
                          <div className="field-actions">
                            <Button
                              onClick={() => handleMoveField(index, "up")}
                              className="order-btn"
                              disabled={index === 0}
                            >
                              ↑
                            </Button>
                            <Button
                              onClick={() => handleMoveField(index, "down")}
                              className="order-btn"
                              disabled={index === sortedFormFields.length - 1}
                            >
                              ↓
                            </Button>
                            <Button
                              onClick={() => setFieldToDelete(field._id)}
                              className="delete-btn"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === "raffle" && (
          <div>
            <h2>Raffle Settings</h2>
            <form onSubmit={handleUpdateRaffle} className="raffle-form">
              <div className="form-group">
                <label>Prize Name</label>
                <Input
                  type="text"
                  value={raffleSettings.prize}
                  onChange={(e) =>
                    setRaffleSettings({
                      ...raffleSettings,
                      prize: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Prize Description</label>
                <Textarea
                  value={raffleSettings.description}
                  onChange={(e) =>
                    setRaffleSettings({
                      ...raffleSettings,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Number of Winners</label>
                <Input
                  type="number"
                  min="1"
                  value={raffleSettings.numberOfWinners}
                  onChange={(e) =>
                    setRaffleSettings({
                      ...raffleSettings,
                      numberOfWinners: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <Button type="submit">Update Settings</Button>
            </form>

            <div className="raffle-actions">
              <h3>Draw Winners</h3>
              <p>Total Participants: {participants.length}</p>
              <Button
                onClick={() => setDrawConfirmOpen(true)}
                className="draw-btn"
              >
                Draw {raffleSettings.numberOfWinners} Winner(s)
              </Button>
            </div>

            {winners.length > 0 && (
              <div className="winners-list">
                <h3>Winners</h3>
                {winners.map((winner) => (
                  <div key={winner._id} className="winner-card">
                    <img src={winner.avatar} alt="Winner Avatar" />
                    <div className="winner-info">
                      {Object.entries(winner.formData || {})
                        .slice(0, 3)
                        .map(([key, value]) => (
                          <p key={key}>
                            <strong>{key}:</strong> {value}
                          </p>
                        ))}
                      <p>
                        <strong>Submitted:</strong>{" "}
                        {new Date(winner.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "participants" && (
          <div className="participants-section">
            <h2>Participants ({participants.length})</h2>
            <div className="participants-grid">
              {participants.map((participant) => (
                <div key={participant._id} className="participant-card">
                  <img src={participant.avatar} alt="Participant Avatar" />
                  <div className="participant-info">
                    {Object.entries(participant.formData).map(
                      ([key, value]) => (
                        <p key={key}>
                          <strong>{key}:</strong> {value}
                        </p>
                      ),
                    )}
                    <p>
                      <small>
                        Submitted:{" "}
                        {new Date(participant.submittedAt).toLocaleString()}
                      </small>
                    </p>
                    {participant.hasWon && (
                      <span className="winner-badge">🎉 Winner!</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "users" && currentAdminRole === "superadmin" && (
          <div>
            <h2>Admin Users</h2>
            <form onSubmit={handleCreateAdminUser} className="add-user-form">
              <div className="form-group">
                <label>Username</label>
                <Input
                  type="text"
                  value={newAdminUsername}
                  onChange={(e) => setNewAdminUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <Input
                  type="password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
              <Button type="submit">Create Admin User</Button>
            </form>

            <div className="admin-users-list">
              <h3>Existing Admin Users</h3>
              {adminUsers.length === 0 ? (
                <p>No admin users found.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Role</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminUsers.map((user) => (
                      <tr key={user._id}>
                        <td>{user.username}</td>
                        <td>{user.role}</td>
                        <td>{new Date(user.createdAt).toLocaleString()}</td>
                        <td>
                          {user.role !== "superadmin" && (
                            <Button
                              onClick={() => setAdminToDelete(user._id)}
                              className="delete-btn"
                            >
                              Delete
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>

      <AlertDialog
        open={Boolean(fieldToDelete)}
        onOpenChange={(open) => !open && setFieldToDelete(null)}
      >
        <AlertDialogContent className="alertContent">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete field?</AlertDialogTitle>
            <AlertDialogDescription className="alertDescription">
              This will permanently remove this form field.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="alertFooter">
            <AlertDialogCancel className="actionBtn">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="actionBtn"
              onClick={() => fieldToDelete && handleDeleteField(fieldToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={drawConfirmOpen} onOpenChange={setDrawConfirmOpen}>
        <AlertDialogContent className="alertContent">
          <AlertDialogHeader>
            <AlertDialogTitle>Draw winners now?</AlertDialogTitle>
            <AlertDialogDescription className="alertDescription">
              Winners will be selected randomly and this cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="alertFooter">
            <AlertDialogCancel className="actionBtn">Cancel</AlertDialogCancel>
            <AlertDialogAction className="actionBtn" onClick={handleDrawWinners}>
              Draw Winners
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(adminToDelete)}
        onOpenChange={(open) => !open && setAdminToDelete(null)}
      >
        <AlertDialogContent className="alertContent">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete admin account?</AlertDialogTitle>
            <AlertDialogDescription className="alertDescription">
              This admin account will lose dashboard access immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="alertFooter">
            <AlertDialogCancel className="actionBtn">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="actionBtn"
              onClick={() =>
                adminToDelete && handleDeleteAdminUser(adminToDelete)
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
